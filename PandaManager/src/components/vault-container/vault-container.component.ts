import { ChangeDetectorRef, Component, Host, OnInit } from '@angular/core'
import { HttpService } from '../../services/http.service'
import { DisplayedCredential } from '../../models/contracts/displayed-credentials-response'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatExpansionModule } from '@angular/material/expansion'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { VaultCredentialDialogComponent } from '../vault-credentials-dialog/vault-credentials-dialog.component'
import { MatInputModule } from '@angular/material/input'
import { debounceTime } from 'rxjs'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-vault-container',
  templateUrl: './vault-container.component.html',
  styleUrls: ['./vault-container.component.css'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
})
export class VaultContainerComponent implements OnInit {
  displayedCredentialsFromServer: DisplayedCredential[]
  displayedCredentials: DisplayedCredential[]
  isLoading = false
  name = 'Angular'
  shownPasswordDict: Record<string, string> = {}
  searchControl = new FormControl()

  constructor(
    private http: HttpService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true
    this.http.getDisplayedCredentials().subscribe((displayedCredentials) => {
      this.displayedCredentialsFromServer = displayedCredentials
      this.displayedCredentials = displayedCredentials
      this.isLoading = false
    })

    this.searchControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.displayedCredentials = this.displayedCredentialsFromServer.filter(
          (displayedCredentials) =>
            displayedCredentials.host.includes(value) ||
            displayedCredentials.login.includes(value)
        )
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
