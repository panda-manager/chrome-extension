import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { RouterModule } from '@angular/router'
import { MatToolbarModule } from '@angular/material/toolbar'
import { AuthenticationService } from '../../services/authentication.service'

@Component({
  selector: 'pm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatListModule],
})
export class NavbarComponent {
  constructor(public authenticationService: AuthenticationService) {}

  onSignOutClicked() {
    this.authenticationService.logout()
  }
}
