import { DOCUMENT } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatListModule } from '@angular/material/list'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'pm-menu',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatListModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}
}
