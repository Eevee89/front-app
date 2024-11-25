import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Patient } from '../../../models/patient';
import { Address } from '../../../models/address';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-login-page',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule],
  templateUrl: './customer-login-page.component.html',
  styleUrl: './customer-login-page.component.css'
})
export class CustomerLoginPageComponent {
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

  constructor(private router: Router){}

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
}
