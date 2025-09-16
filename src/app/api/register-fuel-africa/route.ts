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

    // Send confirmation email
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