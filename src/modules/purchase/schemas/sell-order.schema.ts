import * as mongoose from 'mongoose';

export const SellOrderSchema = new mongoose.Schema({
    orderId: Number,
    total: Number,
    createdAt: { type: Date, default: Date.now }
});