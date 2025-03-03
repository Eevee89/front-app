import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Staff } from '../../../models/staff';
import { Center } from '../../../models/center';
import { MatListModule } from '@angular/material/list';
import { isPlatformBrowser } from '@angular/common';

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
export class MedecinMainPageComponent implements OnInit {
    selectedTabIndex: number = 0;
    selectedPatient: Patient | null = null;
    selectedReservation: Reservation | null = null;
    selectedAppointment: Appointment | null = null;
    selectedDoctor: Staff | null = null;
    selectedCenter: Center | null = null;
    searchControl = new FormControl('');
    filteredPatients: Patient[] = [];
    patientAppointments: Appointment[] = [];
    patients: Patient[] = [];  // Ajout de la liste des patients

    // Nouvelles propriétés pour la validation
    validationSearchControl = new FormControl('');
    filteredPatientsValidation: Patient[] = [];
    selectedPatientValidation: Patient | null = null;
    lotNumberControl = new FormControl('');
    commentsControl = new FormControl('');

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        let userData = '';
        if (isPlatformBrowser(this.platformId)) {
            // Récupérer les données d'authentification existantes
            const rawUserData = localStorage.getItem('userData');
            if (!rawUserData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            try {
                const parsedUserData = JSON.parse(rawUserData);
                // S'assurer que c'est un staff
                if (!parsedUserData.role || parsedUserData.role !== "STAFF") {
                    parsedUserData.role = "STAFF";
                    localStorage.setItem('userData', JSON.stringify(parsedUserData));
                }
                userData = JSON.stringify(parsedUserData);

                // Faire la requête pour obtenir les patients
                this.http.get<Patient[]>('http://localhost:8080/api/patients', {
                    headers: {
                        'Custom-Auth': userData,
                        'Content-Type': 'application/json'
                    }
                }).subscribe({
                    next: (data) => {
                        this.patients = data;
                        console.log("Patients chargés :", this.patients);
                    },
                    error: (error) => {
                        console.error("Erreur détaillée:", error);
                        if (error.status === 401) {
                            console.log("Données d'authentification:", userData);
                        }
                    }
                });

            } catch (error) {
                console.error("Erreur lors du parsing des données d'authentification:", error);
            }
        }
        
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

    searchPatients(value: string) {
        const searchValue = value.trim().toLowerCase();
        if (!searchValue) {
            this.filteredPatients = [];
            return;
        }

        const userData = localStorage.getItem('userData');
        if (!userData) {
            console.error("Aucune donnée d'authentification trouvée");
            return;
        }

        this.http.get<Patient[]>(`http://localhost:8080/api/patients/search`, {
            params: { 
                email: searchValue
            },
            headers: {
                'Custom-Auth': userData,
                'Content-Type': 'application/json'
            }
        }).subscribe({
            next: (data) => {
                this.filteredPatients = data;
                console.log("Patients trouvés :", this.filteredPatients);
            },
            error: (error) => {
                console.error("Erreur de recherche :", error);
                if (error.status === 401) {
                    console.log("Données d'authentification:", userData);
                }
                this.filteredPatients = [];
            }
        });
    }

    searchPatientsForValidation(value: string) {
        const searchValue = value.trim().toLowerCase();
        if (!searchValue) {
            this.filteredPatientsValidation = [];
            return;
        }

        const userData = localStorage.getItem('userData');
        if (!userData) {
            console.error("Aucune donnée d'authentification trouvée");
            return;
        }

        // Utiliser la même API de recherche avec email
        this.http.get<Patient[]>(`http://localhost:8080/api/patients/search`, {
            params: { 
                email: searchValue
            },
            headers: {
                'Custom-Auth': userData,
                'Content-Type': 'application/json'
            }
        }).subscribe({
            next: (data) => {
                this.filteredPatientsValidation = data;
                console.log("Patients trouvés pour validation:", this.filteredPatientsValidation);
            },
            error: (error) => {
                console.error("Erreur de recherche :", error);
                if (error.status === 401) {
                    console.log("Données d'authentification:", userData);
                }
                this.filteredPatientsValidation = [];
            }
        });
    }

    selectPatient(patient: Patient) {
        this.selectedPatient = patient;
        // Charger les rendez-vous du patient
        this.http.get<Appointment[]>(`http://localhost:8080/api/appointments/patient/${patient.id}`, {
            headers: {
                'Custom-Auth': localStorage.getItem('userData') || ''
            }
        }).subscribe(
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
                console.log('Vaccination validée');
                this.resetValidationForm();
            },
            error => {
                console.error('Erreur lors de la validation', error);
            }
        );
    }

    reportProblem() {
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
