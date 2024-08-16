import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AuthBackendService } from './auth-backend.service'
import { map, tap } from 'rxjs'
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token'
  public registrationEmailKey = 'pm-email'

  constructor(
    private authBackendService: AuthBackendService,
    private router: Router
  ) {}

  public login(email: string, password: string) {
    return this.authBackendService.login(email, password).pipe(
      tap((token) => {
        chrome.storage.local.set({ [this.tokenKey]: token })
        localStorage.setItem(this.tokenKey, token)
        this.router.navigate(['/'])
      })
    )
  }

  public register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    return this.authBackendService
      .register(email, password, firstName, lastName)
      .pipe(
        tap(() => {
          localStorage.setItem(this.registrationEmailKey, email)
          this.router.navigate(['/otp'])
        })
      )
  }

  public verifyOTP(otp: string) {
    const email = localStorage.getItem(this.registrationEmailKey)

    return this.authBackendService.verify(email, otp).pipe(
      tap((token) => {
        chrome.storage.local.set({ [this.tokenKey]: token })
        localStorage.setItem(this.tokenKey, token)
        localStorage.removeItem(this.registrationEmailKey)
        this.router.navigate(['/'])
      })
    )
  }

  resentOtpClick() {
    const email = localStorage.getItem(this.registrationEmailKey)
    return this.authBackendService.resendOtp(email)
  }

  public logout() {
    localStorage.removeItem(this.tokenKey)
    this.router.navigate(['/login'])
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.tokenKey)
    return token != null && token.length > 0
  }

  public isDuringOtpVerification(): boolean {
    let email = localStorage.getItem(this.registrationEmailKey)
    return !!email
  }
  public cancelOtpVerification() {
    localStorage.removeItem(this.registrationEmailKey)
  }

  public getToken(): string {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : undefined
  }
}
