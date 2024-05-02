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

  public login(username: string, password: string): void {
    this.httpService.login(username, password).subscribe((token) => {
      localStorage.setItem(this.tokenKey, token)
      this.router.navigate(['/'])
    })
  }

  public register(username: string, password: string): void {
    this.httpService.register(username, password).subscribe((token) => {
      localStorage.setItem(this.tokenKey, token)
      this.router.navigate(['/'])
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