import { Component, OnInit } from '@angular/core'
import { OtpInputComponent } from '../otp-input/otp-input.component'
import { CommonModule } from '@angular/common'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { EMPTY, catchError, filter } from 'rxjs'
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { NgxLoadingComponent, NgxLoadingModule } from 'ngx-loading'

@Component({
  selector: 'pm-otp-container',
  templateUrl: './otp-container.component.html',
  styleUrls: ['./otp-container.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OtpInputComponent,
    MatButtonModule,
    NgxLoadingModule,
  ],
})
export class OtpContainerComponent implements OnInit {
  otpForm = new FormControl('')

  loading = false
  errorMessage = ''
  email = ''

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem(
      this.authenticationService.registrationEmailKey
    )

    this.otpForm.valueChanges
      .pipe(filter((otp: string) => otp.length === 6))
      .subscribe((otpCode) => {
        this.loading = true

        this.authenticationService
          .verifyOTP(otpCode)
          .pipe(
            catchError((error) => {
              this.errorMessage = error.error.message
              this.loading = false
              return EMPTY
            })
          )
          .subscribe(() => {
            this.loading = false
            this.errorMessage = ''
          })
      })
  }

  onResendOtpClick() {
    this.loading = true
    this.authenticationService
      .resentOtpClick()
      .subscribe(() => (this.loading = false))
  }

  onGoBack() {
    this.authenticationService.cancelOtpVerification()
    this.router.navigate(['/register'])
  }
}
