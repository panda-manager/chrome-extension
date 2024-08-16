import { Component, OnInit } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { AuthenticationService } from '../../services/authentication.service'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { RouterModule } from '@angular/router'
import { NgxLoadingModule } from 'ngx-loading'
import { EMPTY, catchError } from 'rxjs'

@Component({
  selector: 'app-register-container',
  templateUrl: './register-container.component.html',
  styleUrls: ['./register-container.component.css'],
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
export class RegisterContainerComponent implements OnInit {
  public registerForm!: FormGroup
  loading = false

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  public onSubmit() {
    this.loading = true
    this.authenticationService
      .register(
        this.registerForm.get('email').value,
        this.registerForm!.get('password').value,
        this.registerForm!.get('firstName').value,
        this.registerForm!.get('lastName').value
      )
      .pipe(
        catchError((error) => {
          this.loading = false
          alert(error.error.message)
          return EMPTY
        })
      )
      .subscribe()
  }
}
