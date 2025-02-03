export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    gender: boolean;
    phone: string;
    email: string;
    addressId: number;
    birthDate?: Date;
    appointmentIds?: number[];
    password?: string;
}