import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Patient } from '../../../models/patient';

@Component({
  selector: 'app-customer-login-page',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './customer-login-page.component.html',
  styleUrl: './customer-login-page.component.css'
})
export class CustomerLoginPageComponent {
  patient?: Patient;

  step: number = 0;

  submit(step: number) {
    if (step == 1) {
      let firstName = (document.getElementsByName("firstName")[0] as HTMLInputElement).value ?? "";
      let lastName = (document.getElementsByName("name")[0] as HTMLInputElement).value ?? "";
      let email = (document.getElementsByName("email")[0] as HTMLInputElement).value ?? "";
      let phone = (document.getElementsByName("phone")[0] as HTMLInputElement).value ?? "";
      this.patient = {id: 1, firstName: firstName, lastName: lastName, gender: false, email: email, phone: phone, birthDate: new Date(), addressId: 1};
    }
    if (step == 0) {
      (document.getElementsByName("firstName")[0] as HTMLInputElement).value = this.patient!.firstName;
      (document.getElementsByName("name")[0] as HTMLInputElement).value = this.patient!.lastName;
      (document.getElementsByName("email")[0] as HTMLInputElement).value = this.patient!.email;
      (document.getElementsByName("phone")[0] as HTMLInputElement).value = this.patient!.phone;
    }
    this.step = step;
  }
}
