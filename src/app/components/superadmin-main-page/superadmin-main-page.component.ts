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
import { MatListModule } from '@angular/material/list';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Staff } from '../../../models/staff';
import { Center } from '../../../models/center';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
    selector: 'app-superadmin-main-page',
    templateUrl: './superadmin-main-page.component.html',
    styleUrls: ['./superadmin-main-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatListModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SuperAdminMainPageComponent implements OnInit {
    selectedTabIndex: number = 0;
    selectedPatient: Patient | null = null;
    selectedReservation: Reservation | null = null;
    selectedAppointment: Appointment | null = null;
    selectedDoctor: Staff | null = null;
    selectedCenter: Center | null = null;
    selectedAdmin: any | null = null;
    centers: Center[] = [];
    centerDoctors: Staff[] = [];
    searchControl: FormControl = new FormControl('');
    admins: Staff[] = [];
    editingAdminId: number | null = null;
    adminForm: FormGroup;

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.adminForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required]
        });
    }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            // Charger la liste des centres
            this.http.get<Center[]>('http://localhost:8080/api/centers', {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (response) => {
                    this.centers = response;
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des centres:', error);
                }
            });
        }

        // Configuration de la recherche
        this.searchControl.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                if (value) {
                    this.searchCenters(value);
                }
            });

        // Charger la liste initiale des administrateurs
        this.loadAllAdmins();
    }

    searchCenters(value: string) {
        const searchValue = value.trim();
        if (!searchValue) {
            this.loadAllCenters();  // Méthode à créer pour recharger tous les centres
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.get<Center[]>(`http://localhost:8080/api/centers/search`, {
                params: { query: searchValue },
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (response) => {
                    this.centers = response;
                },
                error: (error) => {
                    console.error('Erreur lors de la recherche des centres:', error);
                }
            });
        }
    }

    // Ajouter cette méthode pour recharger tous les centres
    private loadAllCenters() {
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.get<Center[]>('http://localhost:8080/api/centers', {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (response) => {
                    this.centers = response;
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des centres:', error);
                }
            });
        }
    }

    selectCenter(center: Center) {
        this.selectedCenter = center;
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            // Charger les médecins du centre
            this.http.get<Staff[]>(`http://localhost:8080/api/staff/center/${center.id}`, {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (doctors) => {
                    this.centerDoctors = doctors.filter(staff => staff.privilege === 2);
                },
                error: (error) => {
                    console.error("Erreur lors du chargement des médecins:", error);
                    this.centerDoctors = [];
                }
            });
        }
    }

    searchPatient(searchTerm: string) {
        // Logique de recherche à implémenter
    }

    formatDate(date: string): Date {
        return new Date(date);
    }

    searchAdmins(value: string) {
        const searchValue = value.trim();
        if (!searchValue) {
            this.loadAllAdmins();  // Méthode pour recharger tous les admins
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.get<Staff[]>(`http://localhost:8080/api/admins/search`, {
                params: { email: searchValue },  // Notez le changement ici : on utilise 'email' comme paramètre
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (response) => {
                    this.admins = response;
                },
                error: (error) => {
                    console.error('Erreur lors de la recherche des administrateurs:', error);
                }
            });
        }
    }

    // Ajouter cette méthode pour charger tous les admins
    private loadAllAdmins() {
        if (isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            this.http.get<Staff[]>('http://localhost:8080/api/admins', {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (response) => {
                    this.admins = response;
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des administrateurs:', error);
                }
            });
        }
    }

    startEditing(admin: Staff) {
        this.editingAdminId = admin.id;
        this.adminForm.patchValue({
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            phone: admin.phone
        });
    }

    cancelEditing() {
        this.editingAdminId = null;
        this.adminForm.reset();
    }

    saveAdmin(adminId: number) {
        if (this.adminForm.valid && isPlatformBrowser(this.platformId)) {
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.error("Aucune donnée d'authentification trouvée");
                return;
            }

            const updatedAdmin = {
                ...this.adminForm.value,
                id: adminId
            };

            this.http.put<Staff>(`http://localhost:8080/api/staff/${adminId}`, updatedAdmin, {
                headers: {
                    'Custom-Auth': userData,
                    'Content-Type': 'application/json'
                }
            }).subscribe({
                next: (response) => {
                    // Mettre à jour la liste des admins
                    this.admins = this.admins.map(admin => 
                        admin.id === adminId ? response : admin
                    );
                    this.editingAdminId = null;
                    this.adminForm.reset();
                },
                error: (error) => {
                    console.error('Erreur lors de la mise à jour de l\'administrateur:', error);
                }
            });
        }
    }
}
