import { HttpClient } from '@angular/common/http'
import { Host, Injectable } from '@angular/core'
import { Observable, delay, map, of } from 'rxjs'
import { DisplayedCredential } from '../models/contracts/displayed-credentials-response'

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public login(email: string, master_password: string): Observable<string> {
    return this.http
      .post(
        'http://localhost:8080/auth/login',
        {
          email,
          master_password,
        },
        { responseType: 'json' }
      )
      .pipe(map((res) => res['access_token']))
    // return of('token mock')
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
        master_password: password,
        first_name: firstName,
        last_name: lastName,
      },
      {
        responseType: 'text',
      }
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
