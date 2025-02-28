import { Patient } from './patient';
import { Staff } from './staff';
import { Center } from './center';

export interface Appointment {
    patientId: Patient;
    centerId: Center;
    doctorId: Staff;
    time: Date;
}