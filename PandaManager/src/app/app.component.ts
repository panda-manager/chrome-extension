import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { NavbarComponent } from '../components/navbar/navbar.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  getConfig() {
    return this.http.get('.../')
  }
}
