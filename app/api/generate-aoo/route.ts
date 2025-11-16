import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const {
    businessName,
    businessPurpose,
    county,
    registeredAddress,
    memberName,
    memberAddress,
    selectedAddress
  } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);

  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  // NYS Header
  page.drawText('NEW YORK STATE', {
    x: 230, y: y, size: 14, font: helveticaBold
  });

  y -= 20;
  page.drawText('DEPARTMENT OF STATE', {
    x: 200, y: y, size: 14, font: helveticaBold
  });

  y -= 30;
  page.drawText('ARTICLES OF ORGANIZATION', {
    x: 180, y: y, size: 16, font: helveticaBold
  });

  y -= 20;
  page.drawText('OF', {
    x: 295, y: y, size: 12, font: helvetica
  });

  y -= 25;
  page.drawText(businessName.toUpperCase(), {
    x: 150, y: y, size: 14, font: helveticaBold
  });

  y -= 40;

  // Article 1: Name
  page.drawText('FIRST:', {
    x: 50, y: y, size: 12, font: helveticaBold
  });
  page.drawText('The name of the limited liability company is:', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 20;
  page.drawText(businessName, {
    x: 70, y: y, size: 12, font: helvetica
  });

  y -= 30;

  // Article 2: County
  page.drawText('SECOND:', {
    x: 50, y: y, size: 12, font: helveticaBold
  });
  page.drawText('The county within the state in which the office of the limited liability', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText('company is to be located is:', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 20;
  page.drawText(county || 'Albany', {
    x: 70, y: y, size: 12, font: helvetica
  });

  y -= 30;

  // Article 3: Latest Date
  page.drawText('THIRD:', {
    x: 50, y: y, size: 12, font: helveticaBold
  });
  page.drawText('The latest date upon which the limited liability company is to dissolve:', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 20;
  page.drawText('No specific date. Perpetual existence.', {
    x: 70, y: y, size: 12, font: helvetica
  });

  y -= 30;

  // Article 4: Purpose
  page.drawText('FOURTH:', {
    x: 50, y: y, size: 12, font: helveticaBold
  });
  page.drawText('The purpose of the limited liability company is to engage in any lawful', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText('act or activity for which limited liability companies may be organized under', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText('the Limited Liability Company Law, specifically:', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 20;
  const purposeLines = wrapText(businessPurpose, 480);
  for (const line of purposeLines) {
    page.drawText(line, {
      x: 70, y: y, size: 11, font: helvetica
    });
    y -= 15;
  }

  y -= 15;

  // Article 5: Secretary of State as Agent
  page.drawText('FIFTH:', {
    x: 50, y: y, size: 12, font: helveticaBold
  });
  page.drawText('The Secretary of State is designated as agent of the limited liability', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText('company upon whom process against it may be served. The post office', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText('address to which the Secretary of State shall mail a copy of any process', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText('against the limited liability company served upon him or her is:', {
    x: 120, y: y, size: 11, font: helvetica
  });

  y -= 20;
  const address = selectedAddress === 'sealwright'
    ? '123 State Street, Albany, NY 12207'
    : registeredAddress;

  const addressLines = wrapText(address, 480);
  for (const line of addressLines) {
    page.drawText(line, {
      x: 70, y: y, size: 11, font: helvetica
    });
    y -= 15;
  }

  y -= 20;

  // Signature Section
  page.drawText('IN WITNESS WHEREOF, this certificate has been subscribed this', {
    x: 50, y: y, size: 11, font: helvetica
  });

  y -= 15;
  const date = new Date();
  const dateStr = `${date.getDate()} day of ${date.toLocaleString('default', { month: 'long' })}, ${date.getFullYear()}`;
  page.drawText(dateStr + ', by the undersigned organizer.', {
    x: 50, y: y, size: 11, font: helvetica
  });

  y -= 30;
  page.drawText('_________________________________', {
    x: 50, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText(memberName, {
    x: 50, y: y, size: 11, font: helvetica
  });

  y -= 15;
  page.drawText('Organizer', {
    x: 50, y: y, size: 11, font: helvetica
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${businessName.replace(/[^a-zA-Z0-9]/g, '_')}_AOO.pdf"`
    }
  });
}

// Helper function to wrap text
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (testLine.length * 6.5 < maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}
