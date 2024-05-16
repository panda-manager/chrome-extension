import { Component, OnInit } from '@angular/core'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { getPathUrl } from '../../utils/path-utill'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ValidatePasswordDialogComponent } from '../validate-password-dialog/validate-password-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { filter, switchMap } from 'rxjs'

@Component({
  selector: 'pm-auto-fill-popup',
  templateUrl: './auto-fill-popup.component.html',
  styleUrls: ['./auto-fill-popup.component.css'],
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class AutoFillPopupComponent implements OnInit {
  options = []
  isLoading = true

  constructor(
    private credentialsBackendService: CredentialsBackendService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.credentialsBackendService
      .getDisplayedCredentials()
      .subscribe((creds) => {
        let queryOptions = { active: true, currentWindow: true }
        chrome.tabs.query(queryOptions).then((urls) => {
          const url = urls[0].url
          this.options = creds
            .filter((cred) => cred.host === getPathUrl(url))
            .map((cred) => cred.login)
          this.isLoading = false
        })
      })
  }

  onOptionClicked(option: string) {
    let queryOptions = { active: true, currentWindow: true }
    chrome.tabs
      .query(queryOptions)
      .then((urls) => {
        return getPathUrl(urls[0].url)
      })
      .then((url) => {
        this.dialog
          .open(ValidatePasswordDialogComponent, { minWidth: '200px' })
          .afterClosed()
          .pipe(
            filter((result) => result),
            switchMap((masterPassword) =>
              this.credentialsBackendService.getPassword(option, url)
            )
          )
          .subscribe((password) => {
            if (!password) {
              return
            }
            window.parent.postMessage(
              { password: password, login: option },
              '*'
            )
          })
      })
  }
}
