export interface Admin {
    id: number;
    firstName: string;
    lastName: string;
    gender: boolean;
    phone: string;
    email: string;
    addressId: number;
    birthDate?: Date;
    password?: string;
}