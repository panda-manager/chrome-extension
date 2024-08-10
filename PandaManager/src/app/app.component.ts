import { CredentialsBackendService } from './../services/credentials-backend.service'
import { Component } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { NavbarComponent } from '../components/navbar/navbar.component'
import { AutoFillPopupComponent } from '../components/autofill-popup/auto-fill-popup.component'
import { MatDialog } from '@angular/material/dialog'
import { ValidatePasswordDialogComponent } from '../components/validate-password-dialog/validate-password-dialog.component'
import { filter, switchMap } from 'rxjs'
import { createPill } from '../utils/crypto-utils'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AutoFillPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isFromAutoSave = false

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private credentialsBackendService: CredentialsBackendService
  ) {
    chrome.storage.local.get('pm-auto-save').then((local) => {
      const data = local['pm-auto-save']
      if (!data) return

      chrome.storage.local.remove('pm-auto-save')
      this.isFromAutoSave = true
      this.dialog
        .open(ValidatePasswordDialogComponent, { disableClose: true })
        .afterClosed()
        .pipe(
          filter((result) => {
            if (!result) {
              chrome.runtime.sendMessage('close-auto-save-pm')
            }
            return result
          }),
          switchMap((masterPassword) =>
            this.credentialsBackendService.createCredentials(
              data.displayName,
              data.host,
              data.username,
              createPill(data.password, masterPassword)
            )
          )
        )
        .subscribe(() => {
          chrome.runtime.sendMessage('close-auto-save-pm')
        })
    })
  }

  isIframe() {
    return window.location !== window.parent.location
  }

  getConfig() {
    return this.http.get('.../')
  }
}
