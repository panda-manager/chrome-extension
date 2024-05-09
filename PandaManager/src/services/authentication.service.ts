import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { HttpService } from './http.service'

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'token'

  constructor(
    private httpService: HttpService,
    private router: Router
  ) {}

  public login(email: string, password: string): void {
    this.httpService.login(email, password).subscribe((token) => {
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
    this.httpService
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
