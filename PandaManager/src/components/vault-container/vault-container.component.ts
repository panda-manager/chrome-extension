import { Component, OnInit, ViewChild } from '@angular/core'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { DisplayedCredential } from '../../models/contracts/displayed-credentials-response'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatInputModule } from '@angular/material/input'
import { debounceTime, filter, mergeMap, switchMap } from 'rxjs'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { Router, RouterModule } from '@angular/router'
import { ValidatePasswordDialogComponent } from '../validate-password-dialog/validate-password-dialog.component'

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
    MatButtonModule,
    RouterModule,
  ],
})
export class VaultContainerComponent implements OnInit {
  displayedCredentialsFromServer: DisplayedCredential[]
  displayedCredentials: DisplayedCredential[]
  isLoading = true
  shownPasswordDict: Record<string, string> = {}
  searchControl = new FormControl()
  password: string = undefined

  @ViewChild(MatAccordion)
  matAccordionView: MatAccordion

  constructor(
    private credentialsBackendService: CredentialsBackendService,
    public router: Router,
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

  onSave() {}

  deleteCredentialClicked(displayedCredential: DisplayedCredential) {
    this.credentialsBackendService
      .deleteCredential(displayedCredential.host, displayedCredential.login)
      .subscribe((res) => {
        this.matAccordionView.closeAll()
        if (res) {
          this.displayedCredentialsFromServer = [
            ...this.displayedCredentialsFromServer.filter(
              (cred) => cred.id !== displayedCredential.id
            ),
          ]

          this.displayedCredentials = [
            ...this.displayedCredentials.filter(
              (cred) => cred.id !== displayedCredential.id
            ),
          ]
        }
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

      return
    }

    this.dialog
      .open(ValidatePasswordDialogComponent)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap((masterPassword) =>
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

        this.password = password
        this.shownPasswordDict = {
          ...this.shownPasswordDict,
          [displayedCredential.id]: password,
        }
      })
  }
}
