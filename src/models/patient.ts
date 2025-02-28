import { Address } from './address';

export interface Patient {
    id: number,
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