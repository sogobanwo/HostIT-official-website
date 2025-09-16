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
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 25000)
    );

    const processRequest = async () => {
      await connectDB();
      const body: FuelAfricaRegistration = await request.json();
      return body;
    };

    const body = await Promise.race([processRequest(), timeoutPromise]) as FuelAfricaRegistration;
    
    // Validate required fields
    const requiredFields = ["name", "email", "phone", "country"];
    
    for (const field of requiredFields) {
      if (!body[field as keyof FuelAfricaRegistration]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate field lengths
    if (body.name.length > 100 || body.name.length < 1) {
      return NextResponse.json(
        { message: "Name must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    if (body.email.length > 254 || body.email.length < 1) {
      return NextResponse.json(
        { message: "Email must be between 1 and 254 characters" },
        { status: 400 }
      );
    }

    if (body.phone.length > 15 || body.phone.length < 1) {
      return NextResponse.json(
        { message: "Phone must be between 1 and 15 characters" },
        { status: 400 }
      );
    }

    if (body.country.length > 100 || body.country.length < 1) {
      return NextResponse.json(
        { message: "Country must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    // Validate optional fields if provided
    if (body.location && (body.location.length > 200 || body.location.length < 1)) {
      return NextResponse.json(
        { message: "Location must be between 1 and 200 characters" },
        { status: 400 }
      );
    }

    if (body.github && body.github.length > 100) {
      return NextResponse.json(
        { message: "Github URL must be less than 100 characters" },
        { status: 400 }
      );
    }

    // Clean up GitHub URL by removing backticks if present
    if (body.github) {
      body.github = body.github.replace(/`/g, '').trim();
    }

    // Validate other optional fields
    if (body.telegramusername && body.telegramusername.length > 50) {
      return NextResponse.json(
        { message: "Telegram username must be less than 50 characters" },
        { status: 400 }
      );
    }

    if (body.xhandle && body.xhandle.length > 50) {
      return NextResponse.json(
        { message: "X handle must be less than 50 characters" },
        { status: 400 }
      );
    }

    if (body.role && body.role.length > 500) {
      return NextResponse.json(
        { message: "Role description must be less than 500 characters" },
        { status: 400 }
      );
    }

    if (body.gender && body.gender.length > 20) {
      return NextResponse.json(
        { message: "Gender must be less than 20 characters" },
        { status: 400 }
      );
    }

    // Optimize database operations with timeout
    const dbOperations = async () => {
      // Find or create Fuel Africa event
      let event = await Event.findOne({ name: "Fuel Africa Event" });
      if (!event) {
        event = await Event.create({
          name: "Fuel Africa Event",
          description: "Fuel Africa - Shaping the future of Web3 in Africa",
          startDate: new Date("2025-09-27T10:00:00Z"),
          location: "Lagos, Nigeria",
          isActive: true
        });
      }

      // Check for existing registration
      const existingRegistration = await Registration.findOne({
        eventId: event._id,
        email: body.email,
      });

      if (existingRegistration) {
        throw new Error('DUPLICATE_REGISTRATION');
      }

      // Create registration
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

    // Send registration email asynchronously to avoid blocking
    setImmediate(async () => {
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
      }
    });

    return NextResponse.json(
      {
        message: "Registration successful for Fuel Africa event",
        registrationId: registration._id,
        eventId: registration.eventId,
        eventName: registration.eventName,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating registration:", error.message);
      
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