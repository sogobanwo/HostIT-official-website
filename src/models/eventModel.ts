import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  isActive: boolean;
  maxCapacity?: number;
  registrationDeadline?: Date;
  eventType?: string;
  organizer?: string;
}

const EventSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    maxlength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxCapacity: {
    type: Number,
    min: 1
  },
  registrationDeadline: {
    type: Date
  },
  eventType: {
    type: String,
    enum: ['conference', 'workshop', 'meetup', 'hackathon', 'webinar', 'other'],
    default: 'conference'
  },
  organizer: {
    type: String,
    maxlength: 100,
    default: 'HostIT'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
EventSchema.index({ name: 1 }, { unique: true });
EventSchema.index({ isActive: 1 });
EventSchema.index({ startDate: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);