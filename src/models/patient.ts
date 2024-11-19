export interface Patient {
    id: number;
    irstName: string;
    lastName: string;
    gender: boolean;
    phone: string;
    email: string;
    addressId: number;
    birthDate: Date;
    appointmentIds: number[];

}