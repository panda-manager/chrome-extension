import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, map, of } from 'rxjs'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class AuthBackendService {
  constructor(private http: HttpClient) {}

  public login(email: string, master_password: string): Observable<string> {
    return this.http
      .post(
        environment.baseUrl + 'auth/login',
        {
          email,
          master_password,
        },
        { responseType: 'json' }
      )
      .pipe(map((res) => res['access_token']))
  }

  public register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Observable<string> {
    return this.http.post(
      environment.baseUrl + 'auth/register',
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
  }
}
