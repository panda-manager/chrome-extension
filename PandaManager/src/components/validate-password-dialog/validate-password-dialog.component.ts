import { Component, Inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog'
import { CredentialsBackendService } from '../../services/credentials-backend.service'
import { EMPTY, catchError } from 'rxjs'

@Component({
  selector: 'pm-validate-password-dialog-dialog',
  templateUrl: './validate-password-dialog.component.html',
  styleUrls: ['./validate-password-dialog.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class ValidatePasswordDialogComponent {
  masterPassword = ''
  error = ''
  constructor(
    public dialogRef: MatDialogRef<ValidatePasswordDialogComponent>,
    private credentialsBackendService: CredentialsBackendService
  ) {}

  onApproveClick(): void {
    this.credentialsBackendService
      .validateMasterPassword(this.masterPassword)
      .pipe(
        catchError((error) => {
          this.error = error.message
          return EMPTY
        })
      )
      .subscribe(() => {
        this.dialogRef.close(this.masterPassword)
      })
  }

  onNoClick(): void {
    this.dialogRef.close(undefined)
  }
}
