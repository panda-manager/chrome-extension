import { Component, OnInit, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { catchError, EMPTY } from 'rxjs'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { ValidatePasswordDialogComponent } from '../validate-password-dialog/validate-password-dialog.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'pm-validate-password-content',
  templateUrl: './validate-password-content.component.html',
  styleUrls: ['./validate-password-content.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class ValidatePasswordContentComponent {
  masterPassword = ''
  error = ''

  isDone = false
  onApproveClicked = output<string>()

  constructor(private credentialsBackendService: CredentialsBackendService) {}

  onApproveClick(): void {
    this.credentialsBackendService
      .validateMasterPassword(this.masterPassword)
      .pipe(
        catchError((error) => {
          this.error = error.error.message
          return EMPTY
        })
      )
      .subscribe(() => {
        this.onApproveClicked.emit(this.masterPassword)
        this.isDone = true
      })
  }
}
