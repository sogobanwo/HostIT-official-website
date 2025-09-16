#!/usr/bin/env node

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

// Import the Event model
const Event = require('../src/models/eventModel.ts').default;

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Helper function to parse date
function parseDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

// Main function to create event
async function createEvent() {
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
    const maxCapacity = maxCapacityInput ? parseInt(maxCapacityInput) : null;

    const registrationDeadlineInput = await askQuestion('Registration Deadline (optional, YYYY-MM-DD): ');
    const registrationDeadline = parseDate(registrationDeadlineInput);

    console.log('\nEvent Types: conference, workshop, meetup, hackathon, webinar, other');
    const eventType = await askQuestion('Event Type (default: conference): ') || 'conference';

    const organizer = await askQuestion('Organizer (default: HostIT): ') || 'HostIT';

    const isActiveInput = await askQuestion('Is Active? (y/n, default: y): ') || 'y';
    const isActive = isActiveInput.toLowerCase() === 'y' || isActiveInput.toLowerCase() === 'yes';

    // Connect to MongoDB
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URL);
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
      eventType,
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

  } catch (error) {
    console.error('❌ Error creating event:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 An event with this name already exists. Please choose a different name.');
    }
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n👋 Goodbye!');
  rl.close();
  await mongoose.disconnect();
  process.exit(0);
});

// Run the script
if (require.main === module) {
  createEvent();
}

module.exports = { createEvent };