import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Patient } from '../../../models/patient';
import { Address } from '../../../models/address';
import { Center } from '../../../models/center';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Appointment } from '../../../models/appointment';
import { Staff } from '../../../models/staff';
import { firstValueFrom } from 'rxjs'; 

@Component({
  selector: 'app-customer-main-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [NgForOf,
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

  centers: Center[] = [];

  filteredCities: string[] = []; 

  selectedCenter: Center = {
    id: -1,
    name: "Pas de centre sélectionné",
    address: {
      id: 0,
      street: "",
      city: "",
      zipCode: ""
    },
    phone: "",
    staffIds: []
  };

  name: string = localStorage.getItem("userName")!;

  date = new FormControl;
  readonly testMin = new FormControl('', [Validators.required]);
  hour: number = 8;
  mins: number = 0;

  constructor(private router: Router, private _httpClient: HttpClient){}

  private _snackBar = inject(MatSnackBar);

  async ngOnInit() {
    await this._httpClient.get<Center[]>('/api/centers').subscribe(response => {
      this.centers = response;
      this.filteredCities = this.search("");
    }); 
    const defaultDate = new Date();
    const m = defaultDate.getMinutes();
    const h = defaultDate.getHours();
    const remainder = m % 5;
    if (remainder === 0) {
      if (m === 60) {
        this.hour = h+1;
        this.mins = 0;
      } else {
        this.hour = h;
        this.mins = m+5;
      }
    } else {
      const n = m + (5 - remainder);
      if (n === 60) {
        this.hour = h+1;
        this.mins = 0;
      } else {
        this.hour = h;
        this.mins = n;
      }
    }

    defaultDate.setHours(this.hour);
    defaultDate.setMinutes(this.mins);
    defaultDate.setSeconds(0);
    defaultDate.setMilliseconds(0);

    const maxDate = new Date();
    maxDate.setHours(17);
    maxDate.setMinutes(55);

    const minDate = new Date();
    minDate.setHours(8);
    minDate.setMinutes(0);

    if (defaultDate >= maxDate) {
      defaultDate.setDate(defaultDate.getDate()+1);
      this.hour = 8;
      this.mins = 0;
    } else if (defaultDate <= minDate) {
      this.hour = 8;
      this.mins = 0;
    }
    this.date = new FormControl(defaultDate);
}

  onKey(event: EventTarget) { 
    let searchValue = (event as HTMLTextAreaElement).value ?? "";
    this.filteredCities = this.search(searchValue);
  }

  search(value: string) { 
    let filter = value.toLowerCase();
    let filteredCenters = this.centers.filter(center => center.address.city.toLowerCase().includes(filter));
    let resp: string[] = [];
    filteredCenters.forEach(centre => {
      let address: Address = centre.address;
      let res: string = centre.name + " | ";
      res += address.street + " | ";
      res += address.zipCode + ", " + address .city;

      resp.push(res);
    });
    return resp;
  }

  async book() {
    let doctor: Staff = {
      id: 0,
      firstName: "",
      lastName: "",
      phone: "",
      centerIds: [],
      privilege: 0,
      workTimeIds: []
    };
    let patient: Patient = {
      id: 0,
      firstName: "",
      lastName: "",
      gender: false,
      phone: "",
      email: "",
      address: {
        id: 0,
        street: "",
        city: "",
        zipCode: ""
      }
    };
    let date: Date = new Date(this.date.value ?? "01/01/1970");
    date.setHours(this.hour);
    date.setMinutes(this.mins);

    let app: Appointment = {
      patientId: patient,
      centerId: this.selectedCenter,
      doctorId: doctor,
      time: date
    }

    try {
      await firstValueFrom(this._httpClient.post('/api/appointments/create', app));

      this._snackBar.open(
        'Le rendez-vous a été enregistré avec succès.', '',
        { duration: 3000 }
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === HttpStatusCode.Unauthorized) {
          this._snackBar.open(
            'Les informations fournies n\'ont pas permis de vous identifier.', '',
            { duration: 3000 }
          );
        }
        if (error.status === HttpStatusCode.BadRequest) {
          this._snackBar.open(
            'Il n\'y a plus de rendez-vous disponibles pour cet horaire', '',
            { duration: 3000 }
          );
        }
        if (error.status === HttpStatusCode.InternalServerError) {
          this._snackBar.open(
            'Une erreur est survenue lors de l\'enregistrement du rendez-vous.', '',
            { duration: 3000 }
          );
        }
      }
    }
  }

  onSelect(id: number) {
    if (id == -1) {
      this.selectedCenter = {
        id: -1,
        name: "Pas de centre sélectionné",
        address: {
          id: 0,
          street: "",
          city: "",
          zipCode: ""
        },
        phone: "",
        staffIds: []
      };
    } else {
      this.selectedCenter = this.centers[id];
    }
  }

  onSelectTime(sel: number, t: string) {
    if (t == 'hour') {
      this.hour = sel;
    } else {
      this.mins = sel;
    }
  }

  getRange(t: string): number[] {
    if (t == 'hour') {
      return Array.from({ length: 10 }, (_, i) => i+8);
    }

    return Array.from({ length: 12 }, (_, i) => i*5);
  }
}
