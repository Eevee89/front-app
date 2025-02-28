import { Address } from './address';

export interface Center {
    id: number;
    phone: string;
    staffIds: number[];
    address: Address;
    name: string;
}