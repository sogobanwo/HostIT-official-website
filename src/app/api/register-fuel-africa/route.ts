import { NextRequest, NextResponse } from "next/server";
import Registration from "@/models/registrationModel";
import Event from "@/models/eventModel";
import { connectDB } from "@/lib/db";
import { sendRegistrationEmail } from "@/lib/sendRegistrationEmail";

interface FuelAfricaRegistration {
  name: string;
  email: string;
  phone: string;
  country: string;
  location?: string;
  gender?: string;
  github?: string;
  telegramusername?: string;
  xhandle?: string;
  role?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Reduce timeout to 15 seconds (well below most serverless limits)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 15000)
    );

    const processRequest = async () => {
      // Connect to DB first
      await connectDB();
      
      const body: FuelAfricaRegistration = await request.json();
      
      // Validate required fields
      const requiredFields = ["name", "email", "phone", "country"];
      
      for (const field of requiredFields) {
        if (!body[field as keyof FuelAfricaRegistration]) {
          throw new Error(`${field} is required`);
        }
      }

      // Validate field lengths (keep existing validation)
      if (body.name.length > 100 || body.name.length < 1) {
        throw new Error("Name must be between 1 and 100 characters");
      }

      if (body.email.length > 254 || body.email.length < 1) {
        throw new Error("Email must be between 1 and 254 characters");
      }

      if (body.phone.length > 15 || body.phone.length < 1) {
        throw new Error("Phone must be between 1 and 15 characters");
      }

      if (body.country.length > 100 || body.country.length < 1) {
        throw new Error("Country must be between 1 and 100 characters");
      }

      // Validate optional fields if provided
      if (body.location && (body.location.length > 200 || body.location.length < 1)) {
        throw new Error("Location must be between 1 and 200 characters");
      }

      if (body.github && body.github.length > 100) {
        throw new Error("Github URL must be less than 100 characters");
      }

      // Clean up GitHub URL by removing backticks if present
      if (body.github) {
        body.github = body.github.replace(/`/g, '').trim();
      }

      // Validate other optional fields
      if (body.telegramusername && body.telegramusername.length > 50) {
        throw new Error("Telegram username must be less than 50 characters");
      }

      if (body.xhandle && body.xhandle.length > 50) {
        throw new Error("X handle must be less than 50 characters");
      }

      if (body.role && body.role.length > 500) {
        throw new Error("Role description must be less than 500 characters");
      }

      if (body.gender && body.gender.length > 20) {
        throw new Error("Gender must be less than 20 characters");
      }

      return body;
    };

    const body = await Promise.race([processRequest(), timeoutPromise]) as FuelAfricaRegistration;
    
    // Optimize database operations - combine queries where possible
    const dbOperations = async () => {
      // Use parallel queries to speed up operations
      const [existingEvent, existingRegistration] = await Promise.all([
        Event.findOne({ name: "Fuel Africa Event" }),
        Registration.findOne({ 
          eventName: "Fuel Africa Event", // Use eventName instead of eventId for faster lookup
          email: body.email 
        })
      ]);

      if (existingRegistration) {
        throw new Error('DUPLICATE_REGISTRATION');
      }

      // Create event if it doesn't exist
      let event = existingEvent;
      if (!event) {
        event = await Event.create({
          name: "Fuel Africa Event",
          description: "Fuel Africa - Shaping the future of Web3 in Africa",
          startDate: new Date("2025-09-27T10:00:00Z"),
          location: "Lagos, Nigeria",
          isActive: true
        });
      }

      // Create registration with minimal data
      const registration = await Registration.create({
        eventId: event._id,
        eventName: event.name,
        name: body.name,
        email: body.email,
        phone: body.phone,
        country: body.country,
        location: body.location || null,
        gender: body.gender || null,
        github: body.github || null,
        telegramusername: body.telegramusername || null,
        xhandle: body.xhandle || null,
        role: body.role || null,
        registrationDate: new Date(),
      });

      return { event, registration };
    };

    const { event, registration } = await Promise.race([
      dbOperations(),
      timeoutPromise
    ]) as { event: any, registration: any };

    // Return success response immediately
    const response = NextResponse.json(
      {
        message: "Registration successful for Fuel Africa event",
        registrationId: registration._id.toString(),
        eventId: registration.eventId.toString(),
        eventName: registration.eventName,
      },
      { status: 201 }
    );

    // Send email asynchronously AFTER response (non-blocking)
    // Use setTimeout instead of setImmediate for better serverless compatibility
    setTimeout(async () => {
      try {
        await sendRegistrationEmail({
          email: body.email,
          name: body.name,
          eventName: "Fuel Africa Event",
          eventDate: "27th September, 2025",
          eventTime: "10:00 AM WAT",
          eventLocation: "Lagos, Nigeria",
          eventUrl: "https://hostit.events/w3lc/fuel-africa",
          eventDescription: "Welcome to <strong style=\"color: #007CFA;\">Fuel Africa Event</strong>! 🚀 We're thrilled to have you join us in shaping the future of Web3 in Africa.",
          eventHighlights: [
            "Cutting-edge Web3 insights and trends",
            "Networking with Africa's top blockchain innovators",
            "Hands-on workshops and technical sessions",
            "Exclusive access to funding opportunities"
          ],
          organizerName: "HostIT",
          supportEmail: "support@hostit.events",
          websiteUrl: "https://hostit.events",
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Optionally, you could queue this for retry or use a background job service
      }
    }, 100); // Small delay to ensure response is sent first

    return response;

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating registration:", error.message);
      
      // Handle validation errors
      if (error.message.includes('required') || 
          error.message.includes('must be') || 
          error.message.includes('characters')) {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }
      
      if (error.message === 'DUPLICATE_REGISTRATION') {
        return NextResponse.json(
          { message: "User is already registered for this event" },
          { status: 409 }
        );
      }
      
      if (error.message === 'Request timeout') {
        return NextResponse.json(
          { message: "Request timeout - please try again" },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { message: "Failed to create registration" },
        { status: 500 }
      );
    } else {
      console.error("An unknown error occurred:", error);
      return NextResponse.json(
        { message: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}