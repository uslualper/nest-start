import { Document } from 'mongoose';

export interface SellOrderInterface extends Document {
    readonly orderId: number;
    readonly total: number;
    readonly createdAt: Date;
}