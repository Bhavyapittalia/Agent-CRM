import mongoose, { Document, Types } from "mongoose";

interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
}

export interface ClientStructure extends Document {
    name: string;
    email?: string;
    dateOfBirth?: Date;
    profilePhoto?: string | null;
    whatsappNumber?: string;
    pinned: boolean;
    alternateNumber?: string;
    gender?: "Male" | "Female" | "Other";
    address?: IAddress;
    agentId: Types.ObjectId;
}

const clientSchema = new mongoose.Schema<ClientStructure>({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        trim: true,
    },

    dateOfBirth: {
        type: Date,
    },

    profilePhoto: {
        type: String,
        default: null,
    },

    whatsappNumber: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{9,14}$/, "Enter a valid number with country code"],
    },

    pinned: {
        type: Boolean,
        default: false,
    },

    alternateNumber: {
        type: String,
        trim: true,
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },

    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            trim: true,
        },
    },

    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
    },
});

export const Client = mongoose.model<ClientStructure>("Client", clientSchema);