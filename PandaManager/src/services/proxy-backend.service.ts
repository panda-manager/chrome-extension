import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, catchError, forkJoin, map, of } from 'rxjs'
import { DisplayedCredential } from '../models/contracts/displayed-credentials-response'
import { AuthenticationService } from './authentication.service'
import { environment } from '../environments/environment'

function getGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
const guid = getGuid()

@Injectable({
  providedIn: 'root',
})
export class ProxyBackendService {
  constructor(private http: HttpClient) {}

  post(
    url: string,
    body1: any | null,
    body2: any | null,
    options?: {
      responseType?: string
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[]
          }
    }
  ): Observable<Object> {
    let newOptions = undefined
    if (options === undefined) {
      newOptions = {
        header: {},
      }
    } else if (options.headers === undefined) {
      newOptions = {
        ...options,
        headers: {},
      }
    } else {
      newOptions = { ...options }
    }

    const id = getGuid()

    return forkJoin([
      this.http.post(url, body1, {
        ...newOptions,
        headers: { ...newOptions.headers, 'x-pair-redis-key': id },
      }),
      this.http.post(url, body2, {
        ...newOptions,
        headers: { ...newOptions.headers, 'x-pair-redis-key': id },
      }),
    ])
  }

  put(
    url: string,
    body1: any | null,
    body2: any | null,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[]
          }
    }
  ) {
    let newOptions = undefined
    if (options === undefined) {
      newOptions = {
        header: {},
      }
    } else if (options.headers === undefined) {
      newOptions = {
        ...options,
        headers: {},
      }
    } else {
      newOptions = { ...options }
    }

    const id = getGuid()

    return forkJoin([
      this.http.put(url, body1, {
        ...newOptions,
        headers: { ...newOptions.headers, 'x-pair-redis-key': id },
      }),
      this.http.put(url, body2, {
        ...newOptions,
        headers: { ...newOptions.headers, 'x-pair-redis-key': id },
      }),
    ])
  }
}
