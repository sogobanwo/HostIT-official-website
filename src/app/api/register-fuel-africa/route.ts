import { NextRequest, NextResponse } from "next/server";
import Registration from "@/models/registrationModel";
import Event from "@/models/eventModel";
import { connectDB } from "@/lib/db";

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
    await connectDB();
    
    const body: FuelAfricaRegistration = await request.json();
    
    if (!body.name || !body.email || !body.phone || !body.country) {
      return NextResponse.json(
        { message: "Missing required fields: name, email, phone, and country are required" },
        { status: 400 }
      );
    }

    // Find or create the Fuel Africa event
    let event = await Event.findOne({ name: "Fuel Africa Event" });

    // Check for existing registration
    const existingRegistration = await Registration.findOne({
      eventId: event._id,
      email: body.email,
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: "User is already registered for this event" },
        { status: 409 }
      );
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