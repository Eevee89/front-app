import { Address } from './address';

export interface Patient {
    firstName: string;
    lastName: string;
    gender: boolean;
    phone: string;
    email: string;
    address: Address;
    birthDate?: Date;
    appointmentIds?: number[];
    password?: string;
}