import { Component } from '@angular/core';
import { Patient } from '../../../models/patient';
import { Appointment } from '../../../models/appointment';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Staff } from '../../../models/staff';
import { Center } from '../../../models/center';

interface Reservation {
    appointmentDate: string;
    startTime: string;
    endTime: string;
    medecin: Staff;
    centre: Center;
    patient: Patient;
}

@Component({
    selector: 'app-admin-main-page',
    templateUrl: './admin-main-page.component.html',
    styleUrls: ['./admin-main-page.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        FormsModule
    ]
})
export class AdminMainPageComponent {
    selectedTabIndex: number = 0;
    selectedPatient: Patient | null = null;
    selectedReservation: Reservation | null = null;
    selectedAppointment: Appointment | null = null;
    selectedDoctor: Staff | null = null;
    selectedCenter: Center | null = null;

    searchPatient(searchTerm: string) {
        // Logique de recherche à implémenter
    }

    formatDate(date: string): Date {
        return new Date(date);
    }
}
