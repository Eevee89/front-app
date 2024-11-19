import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
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
    this.step = step;
  }
}
