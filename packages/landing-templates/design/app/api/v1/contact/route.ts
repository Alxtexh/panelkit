import { NextRequest, NextResponse } from "next/server";

/**
 * /api/v1/contact — Contact Form API
 *
 * Accepts contact form submissions and demo requests from both
 * human visitors and AI agents (via agents.json).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Contact submissions are stored/forwarded by the infrastructure
    // No PII logging in production

    return NextResponse.json({
      success: true,
      message: "Thank you for your interest. Our team will get back to you shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
