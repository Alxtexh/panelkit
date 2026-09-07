import { NextResponse } from "next/server";
import { siteConfig } from "../../../../site.config";

export const dynamic = "force-static";

/**
 * /api/v1/company — Company Information API
 *
 * Returns structured company data for AI agents
 * and programmatic access (via agents.json).
 */
export function GET() {
  const siteUrl = siteConfig.company.url;

  const company = {
    name: siteConfig.company.name,
    description: siteConfig.company.description,
    url: siteUrl,
    address: {
      street: siteConfig.address.street,
      zip: siteConfig.address.zip,
      city: siteConfig.address.city,
      country: siteConfig.address.countryCode,
    },
    contact: {
      phone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
    },
    hours: siteConfig.hours.structured,
    social: siteConfig.social,
    ai_ready: true,
    provider: siteConfig.company.name,
  };

  return NextResponse.json(company, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
