// NY State Articles of Organization PDF Template Generator
// Following exact NYS DOS formatting requirements

export interface AOOData {
  llcName: string;
  openingStatement?: string;
  nameTranslation?: string;
  purpose: string;
  county: string;
  sopName: string;
  sopAddress1: string;
  sopAddress2: string;
  managementText: string;
  effectiveDateText: string;
  indemnificationText: string;
  orgName: string;
  orgAddress1: string;
  orgAddress2: string;
  filerName: string;
  filerAddress1: string;
  filerAddress2: string;
  filerEmail: string;
  filerPhone: string;
}

export function generateAOOHTML(data: AOOData): string {
  // Use exact template provided by user
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body {
    font-family: "Times New Roman", serif;
    font-size: 12pt;
    margin: 1in;
    line-height: 1.15;
    color: #000;
  }

  h1, h2 {
    text-align: center;
    font-weight: bold;
    margin: 0;
    padding: 0;
  }

  h1 {
    margin-bottom: 0.3em;
  }

  .section-header {
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 1.2em;
    margin-bottom: 0.6em;
  }

  .signature-block {
    margin-top: 1.5em;
  }

  .sig-line {
    margin-top: 2em;
    margin-bottom: 0.2em;
  }
</style>
</head>

<body>

<h1>ARTICLES OF ORGANIZATION</h1>
<h1>OF</h1>
<h1>${data.llcName}</h1>

<p>These Articles of Organization (the "Articles") of ${data.llcName} (the "Limited Liability Company") are made pursuant to Section 203 of the New York Limited Liability Company Law.</p>

${
  data.openingStatement
    ? `<div class="section-header">FIRST: OPTIONAL OPENING STATEMENT</div>
<p>${data.openingStatement}</p>`
    : ""
}

<div class="section-header">FIRST: NAME OF THE LIMITED LIABILITY COMPANY</div>
<p>The name of the limited liability company is:</p>
<p><strong>${data.llcName}</strong></p>
${
  data.nameTranslation
    ? `<p>If the name contains non-English words or phrases, the English translation is:<br>
<strong>${data.nameTranslation}</strong></p>`
    : ""
}

<div class="section-header">SECOND: PURPOSE OF THE LIMITED LIABILITY COMPANY</div>
<p>${data.purpose}</p>

<div class="section-header">THIRD: COUNTY LOCATION</div>
<p>The office of the Limited Liability Company is to be located in the County of ${data.county}, State of New York.</p>

<div class="section-header">FOURTH: SERVICE OF PROCESS</div>
<p>The Secretary of State of the State of New York is designated as the agent of the Limited Liability Company upon whom process against it may be served. The Secretary of State shall mail a copy of any such process to:</p>
<p><strong>${data.sopName}<br>${data.sopAddress1}<br>${data.sopAddress2}</strong></p>

<div class="section-header">FIFTH: MANAGEMENT STRUCTURE</div>
<p>${data.managementText}</p>

<div class="section-header">SIXTH: EFFECTIVE DATE</div>
<p>${data.effectiveDateText}</p>

${
  data.indemnificationText
    ? `<div class="section-header">SEVENTH: INDEMNIFICATION</div>
<p>${data.indemnificationText}</p>`
    : ""
}

<div class="section-header">${data.indemnificationText ? "EIGHTH" : "SEVENTH"}: ORGANIZER</div>
<p>The name and address of the Organizer of the Limited Liability Company are:</p>
<p><strong>Name:</strong> ${data.orgName}<br>
<strong>Address:</strong> ${data.orgAddress1}, ${data.orgAddress2}</p>

<p>The Organizer signs these Articles of Organization and affirms the truth of the statements herein.</p>

<div class="signature-block">
  <div class="sig-line">________________________________________</div>
  <p>${data.orgName}<br>
  Organizer<br>
  Date: ____________________________</p>
</div>

<div class="section-header">${data.indemnificationText ? "NINTH" : "EIGHTH"}: FILER INFORMATION</div>
<p><strong>Name:</strong> ${data.filerName}<br>
<strong>Address:</strong> ${data.filerAddress1}, ${data.filerAddress2}<br>
<strong>Email:</strong> ${data.filerEmail}<br>
<strong>Telephone:</strong> ${data.filerPhone}</p>

<p><strong>END OF ARTICLES OF ORGANIZATION</strong></p>

</body>
</html>`;
}

// Default values for standard sections
export const DEFAULT_MANAGEMENT_TEXT =
  "The Limited Liability Company shall be managed by its members.";

export const DEFAULT_EFFECTIVE_DATE_TEXT =
  "These Articles of Organization shall be effective upon filing with the New York Department of State.";

export const DEFAULT_INDEMNIFICATION_TEXT =
  "The Limited Liability Company may indemnify any and all of its members, managers, employees, and agents to the fullest extent permitted by the New York Limited Liability Company Law.";
