import { Component, OnInit } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { Staff } from '../../../models/staff';
import { Center } from '../../../models/center';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

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
        FormsModule
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

    constructor(
        private http: HttpClient,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.loadMedecins();
        this.loadAppointments();
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
}
