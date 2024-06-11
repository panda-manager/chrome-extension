import { Component, OnInit } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { AuthenticationService } from '../../services/authentication.service'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { RouterModule } from '@angular/router'
import { NgxLoadingModule } from 'ngx-loading'
import { EMPTY, catchError } from 'rxjs'

@Component({
  selector: 'app-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    NgxLoadingModule,
  ],
})
export class LoginContainerComponent implements OnInit {
  public loginForm!: FormGroup
  public loading = false

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  public onSubmit() {
    this.loading = true

    this.authenticationService
      .login(
        this.loginForm.get('email')!.value,
        this.loginForm!.get('password')!.value // TODO: need to be hashed
      )
      .pipe(
        catchError((error) => {
          this.loading = false
          alert(error.message)
          return EMPTY
        })
      )
      .subscribe(() => (this.loading = false))
  }
}
