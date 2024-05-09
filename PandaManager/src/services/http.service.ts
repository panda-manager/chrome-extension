import { HttpClient } from '@angular/common/http'
import { Host, Injectable } from '@angular/core'
import { Observable, delay, of } from 'rxjs'
import { DisplayedCredential } from '../models/contracts/displayed-credentials-response'

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<string> {
    this.http.post(
      'http://localhost:8080/auth/login',
      {
        email,
        password,
      },
      { responseType: 'text' }
    )

    return of('token mock')
  }

  public register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<string> {
    return this.http.post(
      'http://localhost:8080/auth/register',
      {
        email,
        password,
        firstName,
        lastName,
      },
      { responseType: 'text' }
    )

    // return of('token mock')
  }

  getDisplayedCredentials(): Observable<DisplayedCredential[]> {
    this.http.get('http://localhost:8080/app_displayed_credentials')

    return of([
      { host: 'first host', login: 'first login' },
      { host: 'second host', login: 'second login' },
    ]).pipe(delay(2000))
  }
}
