import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { NavbarComponent } from '../components/navbar/navbar.component'
import { AutoFillPopupComponent } from '../components/autofill-popup/auto-fill-popup.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AutoFillPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  isIframe() {
    return window.location !== window.parent.location
  }

  getConfig() {
    return this.http.get('.../')
  }
}
