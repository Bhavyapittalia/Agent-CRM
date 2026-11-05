export interface ClientDTO {
    _id: string;
    name: string;
    email?: string;
    dateOfBirth?: string;
    profilePhoto?: string | null;
    whatsappNumber?: string;
    alternateNumber?: string;
    pinned: boolean;
    gender?: "Male" | "Female" | "Other";
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
    agentId: string;            
}