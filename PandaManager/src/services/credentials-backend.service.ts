import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, map, of } from 'rxjs'
import { DisplayedCredential } from '../models/contracts/displayed-credentials-response'
import { AuthenticationService } from './authentication.service'
import { environment } from '../environments/environment'
import { ProxyBackendService } from './proxy-backend.service'
import { getuid } from 'process'

function getGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

@Injectable({
  providedIn: 'root',
})
export class CredentialsBackendService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private proxyBackendService: ProxyBackendService
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
            id: cred['_id'] ?? getGuid(),
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
    return this.proxyBackendService
      .post(
        environment.baseUrl + 'credentials/password',
        {
          login,
          host,
        },
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
        map(([partA, partB]: [string, string]) => {
          if (partA.startsWith('0')) {
            return partA.substring(1) + partB.substring(1)
          } else {
            return partB.substring(1) + partA.substring(1)
          }
        }),
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
    const middleIndex = Math.floor(password.length / 2)
    // Include middle character in the first half
    const firstHalf = '0' + password.substring(0, middleIndex + 1)
    const secondHalf = '1' + password.substring(middleIndex + 1)

    const body1 = {
      login,
      display_name: displayName,
      password: firstHalf,
      host,
    }

    const body2 = {
      login,
      display_name: displayName,
      password: secondHalf,
      host,
    }

    return this.proxyBackendService
      .post(environment.baseUrl + 'credentials', body1, body2, {
        headers: {
          Authorization: `Bearer ${this.authenticationService.getToken()}`,
        },
      })
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
