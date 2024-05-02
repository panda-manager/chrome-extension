import { HttpClient } from '@angular/common/http'
import { Host, Injectable } from '@angular/core'
import { Observable, delay, of } from 'rxjs'
import { DisplayedCredential } from '../models/contracts/displayed-credentials-response'

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getDisplayedCredentials(): Observable<DisplayedCredential[]> {
    this.http.get('.../app_displayed_credentials')

    return of([
      { host: 'first host', login: 'first login' },
      { host: 'second host', login: 'second login' },
    ]).pipe(delay(2000))
  }
}
