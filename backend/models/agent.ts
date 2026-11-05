import mongoose, { Schema, Model } from 'mongoose';

// "AgentStructure" defines the data
// and "model<AgentStructure>" tells mongoose that Agent.findOne() return an agent not any"

export interface AgentStructure {
  name: string;
  email: string;
  password: string;
  whatsappNumber?: string;
  profilePhoto?: string | null;
  branch?: string;
  role?: 'agent' | 'admin';
}

const agentSchema = new Schema<AgentStructure>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    whatsappNumber: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{9,14}$/, 'Enter a valid number with country code'],
    },

    profilePhoto: {
      type: String,
      default: null,
    },

    branch: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ['agent', 'admin'],
      default: 'agent',
    },
  },
  {
    timestamps: true,
  }
);

export const Agent: Model<AgentStructure> = mongoose.model<AgentStructure>('Agent', agentSchema);
