import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
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
import { ReactiveFormsModule } from '@angular/forms';
import { Staff } from '../../../models/staff';
import { Center } from '../../../models/center';
import { MatListModule } from '@angular/material/list';

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
    templateUrl: './medecin-main-page.component.html',
    styleUrls: ['./medecin-main-page.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        MatListModule
    ]
})
export class MedecinMainPageComponent {
    selectedTabIndex: number = 0;
    selectedPatient: Patient | null = null;
    selectedReservation: Reservation | null = null;
    selectedAppointment: Appointment | null = null;
    selectedDoctor: Staff | null = null;
    selectedCenter: Center | null = null;
    searchControl = new FormControl('');
    filteredPatients: Patient[] = [];
    patientAppointments: Appointment[] = [];

    // Nouvelles propriétés pour la validation
    validationSearchControl = new FormControl('');
    filteredPatientsValidation: Patient[] = [];
    selectedPatientValidation: Patient | null = null;
    lotNumberControl = new FormControl('');
    commentsControl = new FormControl('');

    constructor(private http: HttpClient) {
        // Écouter les changements dans le champ de recherche
        this.searchControl.valueChanges.subscribe(value => {
            if (value && value.length >= 2) {
                this.searchPatients(value);
            } else {
                this.filteredPatients = [];
            }
        });

        // Nouvelle recherche pour la validation
        this.validationSearchControl.valueChanges.subscribe(value => {
            if (value && value.length >= 2) {
                this.searchPatientsForValidation(value);
            } else {
                this.filteredPatientsValidation = [];
            }
        });
    }

    private searchPatients(query: string) {
        this.http.get<Patient[]>(`/api/patients/search?name=${query}`).subscribe(
            patients => {
                this.filteredPatients = patients;
            }
        );
    }

    private searchPatientsForValidation(query: string) {
        this.http.get<Patient[]>(`/api/patients/search?name=${query}`).subscribe(
            patients => {
                this.filteredPatientsValidation = patients;
            }
        );
    }

    selectPatient(patient: Patient) {
        this.selectedPatient = patient;
        // Charger les rendez-vous du patient
        this.http.get<Appointment[]>(`/api/appointments/patient/${patient.id}`).subscribe(
            appointments => {
                this.patientAppointments = appointments;
            }
        );
    }

    selectPatientForValidation(patient: Patient) {
        this.selectedPatientValidation = patient;
    }

    validateVaccination() {
        if (!this.selectedPatientValidation) return;
        
        const validationData = {
            patientId: this.selectedPatientValidation.id,
            lotNumber: this.lotNumberControl.value,
            comments: this.commentsControl.value
        };

        this.http.post('/api/vaccinations/validate', validationData).subscribe(
            response => {
                // Gérer la réponse
                console.log('Vaccination validée');
                // Réinitialiser les champs
                this.resetValidationForm();
            },
            error => {
                console.error('Erreur lors de la validation', error);
            }
        );
    }

    reportProblem() {
        // Implémenter la logique pour signaler un problème
        console.log('Problème signalé');
    }

    private resetValidationForm() {
        this.selectedPatientValidation = null;
        this.lotNumberControl.reset();
        this.commentsControl.reset();
        this.validationSearchControl.reset();
        this.filteredPatientsValidation = [];
    }

    formatDate(date: string): Date {
        return new Date(date);
    }
}
