import { NgClass, NgForOf, NgIf } from '@angular/common';
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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-customer-main-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgIf, NgClass, NgForOf,
    FormsModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule
  ],
  templateUrl: './customer-main-page.component.html',
  styleUrl: './customer-main-page.component.css'
})
export class CustomerMainPageComponent {
  isSideNavOpen = true;

  cities: string[] = [
    "Dijon", "Nancy", "Paris", "Strasbourg", "Mobeuge"
  ];

  selectedCities = this.cities; 

  onKey(event: EventTarget) { 
    let searchValue = (event as HTMLTextAreaElement).value ?? "";
    this.selectedCities = this.search(searchValue);
  }

  search(value: string) { 
    let filter = value.toLowerCase();
    return this.cities.filter(option => option.toLowerCase().startsWith(filter));
  }
}
