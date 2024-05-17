import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AuthBackendService } from './auth-backend.service'

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token'

  constructor(
    private authBackendService: AuthBackendService,
    private router: Router
  ) {}

  public login(email: string, password: string): void {
    this.authBackendService.login(email, password).subscribe((token) => {
      chrome.storage.local.set({ [this.tokenKey]: token })
      localStorage.setItem(this.tokenKey, token)
      this.router.navigate(['/'])
    })
  }

  public register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): void {
    this.authBackendService
      .register(email, password, firstName, lastName)
      .subscribe((token) => {
        localStorage.setItem(this.tokenKey, token)
        this.router.navigate(['/login'])
      })
  }

  public logout() {
    localStorage.removeItem(this.tokenKey)
    this.router.navigate(['/login'])
  }

  public isLoggedIn(): boolean {
    let token = localStorage.getItem(this.tokenKey)
    return token != null && token.length > 0
  }

  public getToken(): string {
    return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : undefined
  }
}
