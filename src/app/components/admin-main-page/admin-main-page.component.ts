import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Patient } from '../../../models/patient';
import { Appointment } from '../../../models/appointment';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Staff } from '../../../models/staff';
import { Center } from '../../../models/center';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-admin-main-page',
    templateUrl: './admin-main-page.component.html',
    styleUrls: ['./admin-main-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatListModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AdminMainPageComponent implements OnInit {
    selectedTabIndex: number = 0;
    selectedPatient: Patient | null = null;
    selectedAppointment: Appointment | null = null;
    selectedDoctor: Staff | null = null;
    selectedCenter: Center | null = null;
    medecins: Staff[] = [];
    appointments: Appointment[] = [];
    selectedMedecin: Staff | null = null;
    searchMedecin: string = '';
    searchPatient: string = '';
    displayedColumns: string[] = ['date', 'patient', 'medecin', 'actions'];
    searchControl: FormControl = new FormControl('');
    patientSearchControl: FormControl = new FormControl('');
    filteredPatients: Patient[] = [];
    selectedPatientAppointments: Appointment[] = [];

    constructor(
        private http: HttpClient,
        private dialog: MatDialog,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.get<Staff[]>('http://localhost:8080/api/staff/doctors', {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (response) => {
                    this.medecins = response;
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des médecins:', error);
                }
            });
        }

        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                if (value) {
                    this.searchMedecins(value);
                }
            });

        this.patientSearchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                if (value) {
                    this.searchPatients(value);
                }
            });
    }

    loadMedecins() {
        this.http.get<Staff[]>('/api/medecins').subscribe({
            next: (response) => {
                this.medecins = response;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des médecins:', error);
            }
        });
    }

    loadAppointments() {
        this.http.get<Appointment[]>('/api/appointments').subscribe({
            next: (response) => {
                this.appointments = response;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des rendez-vous:', error);
            }
        });
    }

    selectMedecin(medecin: Staff) {
        this.selectedMedecin = medecin;
    }

    editMedecin(medecin: Staff) {
        this.http.put(`/api/medecins/${medecin.id}`, medecin).subscribe({
            next: () => {
                this.loadMedecins();
            },
            error: (error) => {
                console.error('Erreur lors de la modification:', error);
            }
        });
    }

    deleteMedecin(id: number) {
        this.http.delete(`/api/medecins/${id}`).subscribe({
            next: () => {
                this.loadMedecins();
                this.selectedMedecin = null;
            },
            error: (error) => {
                console.error('Erreur lors de la suppression:', error);
            }
        });
    }

    viewAppointment(appointment: Appointment) {
        this.selectedAppointment = appointment;
    }

    cancelAppointment(id: number) {
        this.http.delete(`/api/appointments/${id}`).subscribe({
            next: () => {
                this.loadAppointments();
                this.selectedAppointment = null;
            },
            error: (error) => {
                console.error('Erreur lors de l\'annulation:', error);
            }
        });
    }

    formatDate(date: string): Date {
        return new Date(date);
    }

    searchMedecins(value: string) {
        const searchValue = value.trim().toLowerCase();
        if (!searchValue) {
            this.medecins = [];
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.get<Staff[]>(`http://localhost:8080/api/staff/doctors/search`, {
                params: { 
                    email: searchValue
                },
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (data) => {
                    this.medecins = data;
                    console.log("Médecins trouvés :", this.medecins);
                },
                error: (error) => {
                    console.error("Erreur de recherche :", error);
                    if (error.status === 401) {
                        console.log("Problème d'authentification");
                    }
                    this.medecins = [];
                }
            });
        }
    }

    searchPatients(value: string) {
        const searchValue = value.trim().toLowerCase();
        if (!searchValue) {
            this.filteredPatients = [];
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
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
                },
                error: (error) => {
                    console.error("Erreur de recherche :", error);
                    this.filteredPatients = [];
                }
            });
        }
    }

    selectPatient(patient: Patient) {
        this.selectedPatient = patient;
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.get<Appointment[]>(`http://localhost:8080/api/appointments/patient/${patient.id}`, {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (appointments) => {
                    this.selectedPatientAppointments = appointments;
                },
                error: (error) => {
                    console.error("Erreur lors du chargement des rendez-vous:", error);
                    this.selectedPatientAppointments = [];
                }
            });
        }
    }

    modifyAppointment(appointment: Appointment) {
        // TODO: Implémenter la modification (peut-être avec un dialog)
    }

    deleteAppointment(appointmentId: number) {
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.delete(`http://localhost:8080/api/appointments/${appointmentId}`, {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: () => {
                    this.selectedPatientAppointments = this.selectedPatientAppointments
                        .filter(a => a.id !== appointmentId);
                },
                error: (error) => {
                    console.error("Erreur lors de la suppression:", error);
                }
            });
        }
    }
}
