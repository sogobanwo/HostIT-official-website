#!/usr/bin/env tsx

import mongoose from 'mongoose';
import * as readline from 'readline';
import { config } from 'dotenv';
import Event from '../src/models/eventModel';

// Load environment variables
config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Helper function to parse date
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

// Main function to create event
async function createEvent(): Promise<void> {
  try {
    console.log('🎉 Event Creation Tool\n');
    console.log('Please provide the following information:\n');

    // Collect event information
    const name = await askQuestion('Event Name (required): ');
    if (!name) {
      console.log('❌ Event name is required!');
      process.exit(1);
    }

    const description = await askQuestion('Event Description (optional): ');
    
    const startDateInput = await askQuestion('Start Date (YYYY-MM-DD or YYYY-MM-DD HH:MM): ');
    const startDate = parseDate(startDateInput);
    if (!startDate) {
      console.log('❌ Valid start date is required!');
      process.exit(1);
    }

    const endDateInput = await askQuestion('End Date (optional, YYYY-MM-DD or YYYY-MM-DD HH:MM): ');
    const endDate = parseDate(endDateInput);

    const location = await askQuestion('Location (optional): ');
    
    const maxCapacityInput = await askQuestion('Max Capacity (optional, number): ');
    const maxCapacity = maxCapacityInput ? parseInt(maxCapacityInput) : undefined;

    const registrationDeadlineInput = await askQuestion('Registration Deadline (optional, YYYY-MM-DD): ');
    const registrationDeadline = parseDate(registrationDeadlineInput);

    console.log('\nEvent Types: conference, workshop, meetup, hackathon, webinar, other');
    const eventType = await askQuestion('Event Type (default: conference): ') || 'conference';

    const organizer = await askQuestion('Organizer (default: HostIT): ') || 'HostIT';

    const isActiveInput = await askQuestion('Is Active? (y/n, default: y): ') || 'y';
    const isActive = isActiveInput.toLowerCase() === 'y' || isActiveInput.toLowerCase() === 'yes';

    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URL;
    if (!mongoUri) {
      throw new Error('NEXT_PUBLIC_MONGODB_URL environment variable is not set');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create event object
    const eventData = {
      name,
      description: description || undefined,
      startDate,
      endDate: endDate || undefined,
      location: location || undefined,
      isActive,
      maxCapacity: maxCapacity || undefined,
      registrationDeadline: registrationDeadline || undefined,
      eventType: eventType as 'conference' | 'workshop' | 'meetup' | 'hackathon' | 'webinar' | 'other',
      organizer
    };

    // Create the event
    console.log('\n📝 Creating event...');
    const event = await Event.create(eventData);
    
    console.log('\n🎉 Event created successfully!');
    console.log('Event Details:');
    console.log(`- ID: ${event._id}`);
    console.log(`- Name: ${event.name}`);
    console.log(`- Description: ${event.description || 'N/A'}`);
    console.log(`- Start Date: ${event.startDate}`);
    console.log(`- End Date: ${event.endDate || 'N/A'}`);
    console.log(`- Location: ${event.location || 'N/A'}`);
    console.log(`- Max Capacity: ${event.maxCapacity || 'Unlimited'}`);
    console.log(`- Registration Deadline: ${event.registrationDeadline || 'N/A'}`);
    console.log(`- Event Type: ${event.eventType}`);
    console.log(`- Organizer: ${event.organizer}`);
    console.log(`- Is Active: ${event.isActive}`);
    console.log(`- Created: ${event.createdAt}`);

  } catch (error: any) {
    console.error('❌ Error creating event:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 An event with this name already exists. Please choose a different name.');
    }
    
    if (error.message.includes('IP')) {
      console.error('💡 Make sure your IP address is whitelisted in MongoDB Atlas.');
    }
  } finally {
    rl.close();
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n👋 Disconnected from MongoDB');
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  process.exit(0);
});

// Run the script
if (require.main === module) {
  createEvent();
}

export { createEvent };