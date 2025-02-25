import { NgClass, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Patient } from '../../../models/patient';
import { Address } from '../../../models/address';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import fs from 'fs';

@Component({
  selector: 'app-customer-login-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgIf, NgClass, 
    FormsModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './customer-login-page.component.html',
  styleUrl: './customer-login-page.component.css',
})
export class CustomerLoginPageComponent {
  hide = signal(true);
  errorMessage = signal('');
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  showEmpty?: boolean = false;

  signin?: boolean = false;

  patient?: Patient = {
    id: 1, 
    firstName: "", 
    lastName: "", 
    gender: true, 
    email: "", 
    phone: "", 
    addressId: 1
  };

  address?: Address = {
    id: 1,
    street: "",
    city: "",
    zipCode: ""
  };

  step: number = 0;

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  constructor(private router: Router, private _httpClient: HttpClient){}

  submit(step: number) {
    if (step == 0) {
      this.step = step;
    }
    if (step == 1) {
      this.showEmpty = true;
      var patient = this.patient!;
      if (patient.firstName != '' && patient.lastName != '' && patient.birthDate && this.isValidEmail(patient.email)
        && this.isValidAddress(this.address!.street) && this.isValidPhoneNumber(patient.phone))
      {
        this.step = step;
      }
    }
  }

  connect() {
    // Call endpoint
    // Redirect
    console.log("ICI");
    this.router.navigate(["customer/index"]);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);  
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    const frenchPhoneNumberRegex = /^0[1-9]([-. ]?[0-9]{2}){4}$/;
    return frenchPhoneNumberRegex.test(phoneNumber);
  }

  isValidAddress(address: string): boolean {
    const addressRegex = /^\d+\s+[A-Za-z\s]+$/;
    return addressRegex.test(address);
  }

  showSigninModal(): void {
    this.signin = true;
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  async loginClick() {
    console.info("Calling API");
    /*let resp: Patient[] = [];
    await this._httpClient.get<Patient[]>('/api/patients').subscribe(response => {
      resp = response;
      console.table(resp);
    });

    this.router.navigate(["customer/index"]);*/
    let user = {
      email: this.email.value,
      password: this.password.value
    };

    localStorage.setItem('userData', JSON.stringify(user));
    this.router.navigate(["customer/index"]);
  }
}
