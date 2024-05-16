import { Component, OnInit } from '@angular/core'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { getPathUrl } from '../../utils/path-utill'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

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

  constructor(private credentialsBackendService: CredentialsBackendService) {}

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
    chrome.tabs.query(queryOptions).then((urls) => {
      const url = getPathUrl(urls[0].url)
      this.credentialsBackendService
        .getPassword(option, url)
        .subscribe((password) => {
          window.parent.postMessage({ password: password, login: option }, '*')
        })
    })
  }
}
