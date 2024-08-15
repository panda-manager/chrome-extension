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
import { ValidatePasswordContentComponent } from '../components/validate-password-content/validate-password-content.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    AutoFillPopupComponent,
    ValidatePasswordContentComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isFromAutoSave = false
  autoSaveData

  constructor(
    private http: HttpClient,
    private credentialsBackendService: CredentialsBackendService
  ) {
    chrome.storage.local.get('pm-auto-save').then((local) => {
      this.autoSaveData = local['pm-auto-save']
      if (!this.autoSaveData) return

      chrome.storage.local.remove('pm-auto-save')
      this.isFromAutoSave = true
    })
  }

  isIframe() {
    return window.location !== window.parent.location
  }

  autoSaveValidatedApproved(masterPassword: string) {
    this.credentialsBackendService
      .createCredentials(
        this.autoSaveData.displayName,
        this.autoSaveData.host,
        this.autoSaveData.username,
        createPill(this.autoSaveData.password, masterPassword)
      )
      .subscribe(() => {
        chrome.runtime.sendMessage('close-auto-save-pm')
      })
  }

  getConfig() {
    return this.http.get('.../')
  }
}
