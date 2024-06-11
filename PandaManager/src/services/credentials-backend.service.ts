import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, map, of } from 'rxjs'
import { DisplayedCredential } from '../models/contracts/displayed-credentials-response'
import { AuthenticationService } from './authentication.service'
import { environment } from '../environments/environment'

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
      .get(environment.baseUrl + 'credentials', {
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

  deleteCredential(host: string, login: string): Observable<boolean> {
    return this.http
      .delete(environment.baseUrl + 'credentials', {
        body: { host, login },
        headers: {
          Authorization: `Bearer ${this.authenticationService.getToken()}`,
        },
      })
      .pipe(
        map(() => true),
        catchError((_error) => {
          return of(false)
        })
      )
  }

  validateMasterPassword(password: string) {
    return this.http.post(
      environment.baseUrl + 'auth/validate/master',
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

  getPasswordPill(login: string, host: string): Observable<string> {
    return this.http
      .post(
        environment.baseUrl + 'credentials/password',
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
        environment.baseUrl + 'credentials',
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

  updateCredentials(
    host: string,
    login: string,
    displayName: string,
    password: string
  ) {
    return this.http
      .put(
        environment.baseUrl + 'credentials',
        {
          host,
          login,
          new_password: password,
          // temporery fix until the backend accept them as nullable
          new_login: login,
          new_display_name: displayName,
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
