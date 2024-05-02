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
import { VaultCredentialDialogData } from './vault-credentials-dialog-data'

@Component({
  selector: 'app-vault-credentials-dialog',
  templateUrl: './vault-credentials-dialog.component.html',
  styleUrls: ['./vault-credentials-dialog.component.css'],
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
export class VaultCredentialDialogComponent {
  masterPassword = ''

  constructor(
    public dialogRef: MatDialogRef<VaultCredentialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VaultCredentialDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close()
  }
}
