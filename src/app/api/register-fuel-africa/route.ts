import { NextRequest, NextResponse } from "next/server";
import { sendRegistrationEmail } from "@/lib/sendRegistrationEmail";

interface GeneralRegistration {
  id?: number;
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
    const body: GeneralRegistration = await request.json();
    
    // Validate required fields
    const requiredFields = ["name", "email", "phone", "country"];
    
    for (const field of requiredFields) {
      if (!body[field as keyof GeneralRegistration]) {
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

    // Forward to external backend
    const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://hostit-backend-v2.onrender.com";
    const response = await fetch(`${backendUrl}/api/general-registrations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        event: "fuel-africa" // Add event identifier
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Registration failed" },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Send registration email
     await sendRegistrationEmail({
       email: body.email,
       name: body.name,
       eventName: "Fuel Africa Event",
       eventDate: "27th September, 2025",
       eventTime: "10:00 AM WAT",
       eventLocation: "Lagos, Nigeria",
       eventUrl: "https://hostit.africa/w3lc/fuel-africa",
       eventDescription: "Welcome to <strong style=\"color: #007CFA;\">Fuel Africa Event</strong>! 🚀 We're thrilled to have you join us in shaping the future of Web3 in Africa.",
       eventHighlights: [
         "Cutting-edge Web3 insights and trends",
         "Networking with Africa's top blockchain innovators",
         "Hands-on workshops and technical sessions",
         "Exclusive access to funding opportunities"
       ],
       organizerName: "HostIT",
       supportEmail: "support@hostit.africa",
       websiteUrl: "https://hostit.africa",
     });

    return NextResponse.json(
      { message: "Registration successful for Fuel Africa event", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
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