import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, map, of } from 'rxjs'
import { DisplayedCredential } from '../models/contracts/displayed-credentials-response'
import { AuthenticationService } from './authentication.service'

@Injectable({
  providedIn: 'root',
})
export class CredentialsBackendService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getDisplayedCredentials(): Observable<DisplayedCredential[]> {
    return this.http
      .get('http://localhost:8080/credentials', {
        headers: {
          Authorization: `Bearer ${this.authenticationService.getToken()}`,
        },
      })
      .pipe(
        map((res: any[]) =>
          res.map((cred) => ({
            id: cred['_id'],
            login: cred['login'],
            displayName: cred['display_name'],
            host: cred['host'],
          }))
        ),
        catchError((error) => {
          alert(error.message)
          return of([])
        })
      )
  }

  public validateMasterPassword(password: string) {
    return this.http.post(
      'http://localhost:8080/auth/validate/master',
      {
        master_password: password,
      },
      {
        headers: {
          Authorization: `Bearer ${this.authenticationService.getToken()}`,
        },
      }
    )
  }

  getPassword(login: string, host: string): Observable<string> {
    return this.http
      .post(
        'http://localhost:8080/credentials/password',
        {
          login,
          host,
        },
        {
          responseType: 'text',
          headers: {
            Authorization: `Bearer ${this.authenticationService.getToken()}`,
          },
        }
      )
      .pipe(
        map((a: string) => a),
        catchError((error) => {
          alert(error.message)
          return of(undefined)
        })
      )
  }

  createCredentials(
    displayName: string,
    host: string,
    login: string,
    password: string
  ) {
    return this.http
      .post(
        'http://localhost:8080/credentials',
        {
          login,
          display_name: displayName,
          password: password,
          host,
        },
        {
          headers: {
            Authorization: `Bearer ${this.authenticationService.getToken()}`,
          },
        }
      )
      .pipe(
        catchError((error) => {
          alert(error.message)
          return of(undefined)
        })
      )
  }
}
