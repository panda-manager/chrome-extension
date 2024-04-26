import { Component, ElementRef, ViewChild } from '@angular/core'
import { MatSliderModule } from '@angular/material/slider'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { Clipboard } from '@angular/cdk/clipboard'

@Component({
  selector: 'pm-generate-password-container',
  templateUrl: './generate-password-container.component.html',
  styleUrls: ['./generate-password-container.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule,
  ],
})
export class GeneratePasswordContainerComponent {
  // Alternative for checkboxes
  checkboxes = [
    {
      id: 'lowercase',
      label: 'a-z',
      library: 'abcdefghijklmnopqrstuvwxyz',
      checked: true,
    },
    {
      id: 'uppercase',
      label: 'A-Z',
      library: 'ABCDEFGHIJKLMNOPWRSTUVWXYZ',
      checked: true,
    },
    {
      id: 'numbers',
      label: '0-9',
      library: '0123456789',
      checked: true,
    },
    {
      id: 'symbols',
      label: '!-?',
      library: "!@#$%^&*-_=+\\|:;',.<>/?~",
      checked: false,
    },
  ]

  dictionary: Array<String>

  lowercase: boolean = this.checkboxes[0].checked
  uppercase: boolean = this.checkboxes[1].checked
  numbers: boolean = this.checkboxes[2].checked
  symbols: boolean = this.checkboxes[3].checked

  passwordLenght: number = 4
  buttonLabel: string = 'Generate'
  newPassword: string

  constructor(private clipboard: Clipboard) {}

  // Password length
  updatePasswordLength(event) {
    this.passwordLenght = event.target.value
  }

  // Checkbox value
  updateCheckboxValue(event) {
    if (event.target.id == 'lowercase') this.lowercase = event.target.checked

    if (event.target.id == 'uppercase') this.uppercase = event.target.checked

    if (event.target.id == 'numbers') this.numbers = event.target.checked

    if (event.target.id == 'symbols') this.symbols = event.target.checked
  }

  copyPassword() {
    this.clipboard.copy(this.newPassword)
  }

  // Generate password
  generatePassword(): void {
    if (
      this.lowercase === false &&
      this.uppercase === false &&
      this.numbers === false &&
      this.symbols === false
    ) {
      this.newPassword = '...'
      return
    }

    // Create array from chosen checkboxes
    this.dictionary = [].concat(
      this.lowercase ? this.checkboxes[0].library.split('') : [],
      this.uppercase ? this.checkboxes[1].library.split('') : [],
      this.numbers ? this.checkboxes[2].library.split('') : [],
      this.symbols ? this.checkboxes[3].library.split('') : []
    )

    // Generate random password from array
    var newPassword = ''
    for (var i = 0; i < this.passwordLenght; i++) {
      newPassword +=
        this.dictionary[Math.floor(Math.random() * this.dictionary.length)]
    }
    this.newPassword = newPassword

    // Call copy function
    this.copyPassword()

    // Change text on button when clicked
    this.buttonLabel = 'Copied!'
    setTimeout(() => {
      this.buttonLabel = 'Generate'
    }, 1500)
  }
}
