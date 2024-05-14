import { Component, OnInit } from '@angular/core'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { getPathUrl } from '../../utils/path-utill'

@Component({
  selector: 'pm-auto-fill-popup',
  templateUrl: './auto-fill-popup.component.html',
  styleUrls: ['./auto-fill-popup.component.css'],
  standalone: true,
})
export class AutoFillPopupComponent implements OnInit {
  options = []
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
        })
      })
  }
}
