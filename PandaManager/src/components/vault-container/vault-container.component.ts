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
import { debounceTime, filter, map, mergeMap, switchMap } from 'rxjs'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { Router, RouterModule } from '@angular/router'
import { ValidatePasswordDialogComponent } from '../validate-password-dialog/validate-password-dialog.component'
import { decryptPill, createPill } from '../../utils/crypto-utils'
import { NgxLoadingModule } from 'ngx-loading'

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
    NgxLoadingModule,
  ],
})
export class VaultContainerComponent implements OnInit {
  displayedCredentialsFromServer: DisplayedCredential[]
  displayedCredentials: DisplayedCredential[]
  isCredentialLoading = true
  isDecrtptionLoading = false
  shownPasswordDict: Record<string, string> = {}
  changedPasswordDict: Record<string, string> = {}
  searchControl = new FormControl()
  masterPassword: string = undefined
  @ViewChild(MatAccordion)
  matAccordionView: MatAccordion

  constructor(
    private credentialsBackendService: CredentialsBackendService,
    public router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isCredentialLoading = true
    this.credentialsBackendService
      .getDisplayedCredentials()
      .pipe()
      .subscribe((displayedCredentials) => {
        this.displayedCredentialsFromServer = displayedCredentials
        this.displayedCredentials = displayedCredentials
        this.isCredentialLoading = false
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

  onPasswordChange(event: any, id: string) {
    if (event.target.value === this.shownPasswordDict[id]) {
      delete this.changedPasswordDict[id]
    } else {
      this.changedPasswordDict[id] = event.target.value
    }
  }

  isSavePasswordVisible() {
    return Object.values(this.changedPasswordDict).length > 0
  }
  getPasswordToShow(id: string) {
    if (id in this.changedPasswordDict) return this.changedPasswordDict[id]
    if (id in this.shownPasswordDict) return this.shownPasswordDict[id]

    return 'default'
  }

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

    if (this.masterPassword) {
      this.credentialsBackendService
        .getPasswordPill(displayedCredential.login, displayedCredential.host)
        .subscribe((password) => {
          if (!password) {
            return
          }

          this.isDecrtptionLoading = true
          this.shownPasswordDict = {
            ...this.shownPasswordDict,
            [displayedCredential.id]: decryptPill(
              password,
              this.masterPassword
            ),
          }
          this.isDecrtptionLoading = false
        })

      return
    }

    this.dialog
      .open(ValidatePasswordDialogComponent)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap((masterPassword) => {
          this.isDecrtptionLoading = true

          return this.credentialsBackendService
            .getPasswordPill(
              displayedCredential.login,
              displayedCredential.host
            )
            .pipe(map((pill) => [pill, masterPassword] as const))
        })
      )
      .subscribe(([pill, masterPassword]) => {
        if (!pill) {
          return
        }

        this.masterPassword = masterPassword
        this.shownPasswordDict = {
          ...this.shownPasswordDict,
          [displayedCredential.id]: decryptPill(pill, masterPassword),
        }

        this.isDecrtptionLoading = false
      })
  }

  onUpdatePasswords() {
    Object.entries(this.changedPasswordDict).map(([id, password]) => {
      const cred = this.displayedCredentialsFromServer.find(
        (cred) => cred.id === id
      )
      this.credentialsBackendService
        .updateCredentials(
          cred.host,
          cred.login,
          cred.displayName,
          createPill(this.changedPasswordDict[id], this.masterPassword)
        )
        .subscribe(() => {
          delete this.shownPasswordDict[id]
          delete this.changedPasswordDict[id]
        })
    })
  }
}
