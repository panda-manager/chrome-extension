import { Component, OnInit } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { Router, RouterModule } from '@angular/router'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { getPathUrl } from '../../utils/path-utill'
import { MatDialog } from '@angular/material/dialog'
import { ValidatePasswordDialogComponent } from '../validate-password-dialog/validate-password-dialog.component'
import { filter, switchMap } from 'rxjs'
import { createPill } from '../../utils/crypto-utils'

@Component({
  selector: 'pm-create-new-credential',
  templateUrl: './create-new-credential.component.html',
  styleUrls: ['./create-new-credential.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class CreateNewCredentialComponent implements OnInit {
  public form: FormGroup

  constructor(
    private router: Router,
    private credentialsBackendService: CredentialsBackendService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      host: new FormControl('', [Validators.required]),
      displayName: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    })

    const autoSaveDefaults = chrome.storage.local
      .get('pm-auto-save')
      .then((defaults) => {
        if (!defaults['pm-auto-save']) {
          let queryOptions = { active: true, currentWindow: true }
          chrome.tabs.query(queryOptions).then((urls) => {
            this.form.get('displayName').setValue(urls[0].title)
            this.form.get('host').setValue(getPathUrl(urls[0].url))
          })
          return
        }

        const deafultValue = defaults['pm-auto-save']

        this.form.get('login').setValue(deafultValue.username)
        this.form.get('password').setValue(deafultValue.password)
        this.form.get('host').setValue(deafultValue.host)
        this.form.get('displayName').setValue(deafultValue.displayName)
      })
  }

  public onSubmit() {
    this.dialog
      .open(ValidatePasswordDialogComponent)
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap((masterPassword) =>
          this.credentialsBackendService.createCredentials(
            this.form.value.displayName,
            this.form.value.host,
            this.form.value.login,
            createPill(this.form.value.password, masterPassword)
          )
        )
      )
      .subscribe(() => {
        this.router.navigate(['/vault'])
      })
  }
}
