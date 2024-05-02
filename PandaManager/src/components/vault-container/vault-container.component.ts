import { Component, Host, OnInit } from '@angular/core'
import { HttpService } from '../../services/http.service'
import { DisplayedCredential } from '../../models/contracts/displayed-credentials-response'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatExpansionModule } from '@angular/material/expansion'
import { FormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { VaultCredentialDialogComponent } from '../vault-credentials-dialog/vault-credentials-dialog.component'

@Component({
  selector: 'app-vault-container',
  templateUrl: './vault-container.component.html',
  styleUrls: ['./vault-container.component.css'],
  standalone: true,
  imports: [MatProgressSpinnerModule, MatExpansionModule, FormsModule],
})
export class VaultContainerComponent implements OnInit {
  displayedCredentials: DisplayedCredential[]
  isLoading = false
  name = 'Angular'
  shownPasswordDict: Record<string, string> = {}

  constructor(
    private http: HttpService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true
    this.http.getDisplayedCredentials().subscribe((displayedCredentials) => {
      this.displayedCredentials = displayedCredentials
      this.isLoading = false
    })
  }

  showPasswordClicked(displayedCredential: DisplayedCredential) {
    if (
      this.shownPasswordDict[
        this.createDisplayedCredentialId(displayedCredential)
      ]
    ) {
      this.shownPasswordDict = {
        ...this.shownPasswordDict,
        [this.createDisplayedCredentialId(displayedCredential)]: undefined,
      }
      return
    }

    this.dialog
      .open(VaultCredentialDialogComponent, {
        data: {
          login: displayedCredential.login,
          host: displayedCredential.host,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        this.shownPasswordDict = {
          ...this.shownPasswordDict,
          [this.createDisplayedCredentialId(displayedCredential)]:
            'todo: Add Password :)',
        }
      })
  }

  createDisplayedCredentialId(displayedCredential: DisplayedCredential) {
    return displayedCredential.host + displayedCredential.login
  }
}
