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
    private credentialsBackendService: CredentialsBackendService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      host: new FormControl('', [Validators.required]),
      displayName: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    })

    let queryOptions = { active: true, currentWindow: true }
    chrome.tabs.query(queryOptions).then((urls) => {
      getPathUrl(urls[0].url)
      this.form.get('displayName').setValue(urls[0].title)
      this.form.get('host').setValue(getPathUrl(urls[0].url))
    })
  }

  public onSubmit() {
    this.credentialsBackendService
      .createCredentials(
        this.form.value.displayName,
        this.form.value.host,
        this.form.value.login,
        this.form.value.password
      )
      .subscribe(() => {
        this.router.navigate(['/vault'])
      })
  }
}
