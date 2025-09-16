import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  eventName: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  location?: string;
  gender?: string;
  github?: string;
  telegramusername?: string;
  xhandle?: string;
  role?: string;
  address?: string;
  agreeToNewsletter?: boolean;
  registrationDate: Date;
}

const RegistrationSchema: Schema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    maxlength: 254
  },
  phone: {
    type: String,
    maxlength: 15
  },
  country: {
    type: String,
    maxlength: 100
  },
  location: {
    type: String,
    maxlength: 200
  },
  gender: {
    type: String,
    maxlength: 20
  },
  github: {
    type: String,
    maxlength: 100
  },
  telegramusername: {
    type: String,
    maxlength: 50
  },
  xhandle: {
    type: String,
    maxlength: 50
  },
  role: {
    type: String,
    maxlength: 500
  },
  address: {
    type: String,
    maxlength: 200
  },
  agreeToNewsletter: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index for eventId and email to prevent duplicate registrations
RegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export default mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);