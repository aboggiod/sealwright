import { NextRequest, NextResponse } from "next/server";
import {
  generateAOOHTML,
  AOOData,
  DEFAULT_MANAGEMENT_TEXT,
  DEFAULT_EFFECTIVE_DATE_TEXT,
  DEFAULT_INDEMNIFICATION_TEXT,
} from "@/lib/pdf-template";

// Note: For production, install puppeteer or use a PDF generation service
// npm install puppeteer
// For now, returning HTML that can be converted to PDF client-side

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const aooData: AOOData = {
      llcName: body.businessName,
      openingStatement: body.openingStatement || "",
      nameTranslation: body.nameTranslation || "",
      purpose: body.businessPurpose,
      county: body.county,
      sopName: body.sopName,
      sopAddress1: body.sopStreet,
      sopAddress2: `${body.sopCity}, ${body.sopState} ${body.sopZip}`,
      managementText: body.managementText || DEFAULT_MANAGEMENT_TEXT,
      effectiveDateText: body.effectiveDateText || DEFAULT_EFFECTIVE_DATE_TEXT,
      indemnificationText: body.indemnificationText || DEFAULT_INDEMNIFICATION_TEXT,
      orgName: body.organizerName,
      orgAddress1: body.organizerStreet,
      orgAddress2: `${body.organizerCity}, ${body.organizerState} ${body.organizerZip}`,
      filerName: body.filerName || body.organizerName,
      filerAddress1: body.filerAddress1 || body.organizerStreet,
      filerAddress2:
        body.filerAddress2 || `${body.organizerCity}, ${body.organizerState} ${body.organizerZip}`,
      filerEmail: body.organizerEmail,
      filerPhone: body.organizerPhone,
    };

    const html = generateAOOHTML(aooData);

    // TODO: In production, use Puppeteer to convert to PDF
    // For now, return HTML that can be printed to PDF by the browser
    // or converted using a client-side library

    /*
    Example Puppeteer implementation (requires puppeteer package):

    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'Letter',
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in',
      },
      printBackground: false,
    });
    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="AOO-${aooData.llcName}.pdf"`,
      },
    });
    */

    // For now, return HTML
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error generating AOO PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
