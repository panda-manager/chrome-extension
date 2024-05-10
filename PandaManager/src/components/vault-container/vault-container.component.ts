import { Component, OnInit } from '@angular/core'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { DisplayedCredential } from '../../models/contracts/displayed-credentials-response'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatExpansionModule } from '@angular/material/expansion'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { VaultCredentialDialogComponent } from '../vault-credentials-dialog/vault-credentials-dialog.component'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, filter, mergeMap, switchMap } from 'rxjs'
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
  shownPasswordDict: Record<string, string> = {}
  searchControl = new FormControl()
  password: string = undefined

  constructor(
    private credentialsBackendService: CredentialsBackendService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true
    this.credentialsBackendService
      .getDisplayedCredentials()
      .pipe()
      .subscribe((displayedCredentials) => {
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
    if (this.shownPasswordDict[displayedCredential.id]) {
      this.shownPasswordDict = {
        ...this.shownPasswordDict,
        [displayedCredential.id]: undefined,
      }
      return
    }

    if (this.password) {
      this.credentialsBackendService
        .getPassword(displayedCredential.login, displayedCredential.host)
        .subscribe((password) => {
          if (!password) {
            return
          }

          this.shownPasswordDict = {
            ...this.shownPasswordDict,
            [displayedCredential.id]: password,
          }
        })
    }

    this.dialog
      .open(VaultCredentialDialogComponent, {
        data: {
          login: displayedCredential.login,
          host: displayedCredential.host,
        },
      })
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap((result) =>
          this.credentialsBackendService.getPassword(
            displayedCredential.login,
            displayedCredential.host
          )
        )
      )
      .subscribe((password) => {
        if (!password) {
          return
        }

        this.shownPasswordDict = {
          ...this.shownPasswordDict,
          [displayedCredential.id]: password,
        }
      })
  }
}
