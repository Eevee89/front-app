import { Patient } from './patient';
import { Staff } from './staff';
import { Center } from './center';

export interface Appointment {
    id: number;
    date: string;
    patient: Patient;
    patientId?: Patient;  // Pour la compatibilité avec le composant customer
    medecin: Staff;
    doctorId?: Staff;     // Pour la compatibilité avec le composant customer
    center: {
        id: number;
        name: string;
    };
    centerId?: Center;    // Pour la compatibilité avec le composant customer
    status?: string;
    time?: Date;          // Pour la compatibilité avec le composant customer
}