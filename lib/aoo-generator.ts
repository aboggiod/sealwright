/**
 * Generates Articles of Organization document based on user form data
 * Mirrors the NY Business Express workflow and DOS-1336 form structure
 */

export interface AOOFormData {
  llcName: string;
  llcNameAlt1?: string;
  llcNameAlt2?: string;
  county: string;
  includeOpeningStatement: boolean;
  hasNonEnglishWords: boolean;
  nonEnglishTranslation?: string;
  includePurposeClause: boolean;
  specificPurpose?: string;
  forwardingName: string;
  forwardingAddress: string;
  forwardingCity: string;
  forwardingState: string;
  forwardingZip: string;
  includeRegisteredAgent: boolean;
  registeredAgentName?: string;
  registeredAgentAddress?: string;
  registeredAgentCity?: string;
  registeredAgentZip?: string;
  includeManagementStructure: boolean;
  managementType?: "member" | "manager";
  managerNames?: string;
  includeEffectiveDate: boolean;
  effectiveDate?: string;
  includeDissolutionDate: boolean;
  dissolutionDate?: string;
  includeLiabilityStatement: boolean;
  organizerName: string;
  organizerAddress: string;
  organizerCity: string;
  organizerState: string;
  organizerZip: string;
  filerName: string;
  filerEmail: string;
  filerPhone: string;
  filerAddress: string;
  filerCity: string;
  filerState: string;
  filerZip: string;
}

export function generateAOO(data: AOOFormData): string {
  let articleNumber = 1;
  const articles: string[] = [];

  // Header
  articles.push(`ARTICLES OF ORGANIZATION`);
  articles.push(`OF`);
  articles.push(`${data.llcName.toUpperCase()}`);
  articles.push(``);
  articles.push(
    `These Articles of Organization (the "Articles") of ${data.llcName} ` +
    `(the "Limited Liability Company"), are made pursuant to Section 203 of the ` +
    `New York Limited Liability Company Law.`
  );
  articles.push(``);

  // Optional Opening Statement
  if (data.includeOpeningStatement) {
    articles.push(`${toOrdinal(articleNumber)}: Optional Opening Statement`);
    articles.push(``);
    articles.push(
      `The Limited Liability Company is formed pursuant to the New York Limited Liability ` +
      `Company Law (the "LLC Law") by one or more adults at least eighteen (18) years of age.`
    );
    articles.push(``);
    articleNumber++;
  }

  // FIRST: Name of LLC
  articles.push(`${toOrdinal(articleNumber)}: Name of the Limited Liability Company`);
  articles.push(``);
  articles.push(`The name of the limited liability company is:`);
  articles.push(``);
  articles.push(`${data.llcName}.`);
  articles.push(``);

  if (data.hasNonEnglishWords && data.nonEnglishTranslation) {
    articles.push(`If the name contains non-English words or phrases, the English translation is:`);
    articles.push(`${data.nonEnglishTranslation}.`);
    articles.push(``);
  }

  articleNumber++;

  // Purpose Clause
  if (data.includePurposeClause) {
    articles.push(`${toOrdinal(articleNumber)}: Purpose of the Limited Liability Company`);
    articles.push(``);

    if (data.specificPurpose && data.specificPurpose.trim().length > 0) {
      articles.push(`The purpose of the Limited Liability Company is:`);
      articles.push(``);
      articles.push(data.specificPurpose);
    } else {
      articles.push(
        `To engage in any lawful act or activity for which a limited liability company ` +
        `may be formed under the LLC Law.`
      );
    }
    articles.push(``);
    articleNumber++;
  }

  // County Location (REQUIRED)
  articles.push(`${toOrdinal(articleNumber)}: County Location`);
  articles.push(``);
  articles.push(
    `The office of the Limited Liability Company is to be located in the County of ` +
    `${data.county}, State of New York.`
  );
  articles.push(``);
  articles.push(`(This county determines the newspapers used for statutory publication.)`);
  articles.push(``);
  articleNumber++;

  // Service of Process (REQUIRED)
  articles.push(`${toOrdinal(articleNumber)}: Service of Process`);
  articles.push(``);
  articles.push(
    `The Secretary of State of the State of New York is designated as the agent of the ` +
    `Limited Liability Company upon whom process against it may be served. The Secretary ` +
    `of State shall mail a copy of any such process to:`
  );
  articles.push(``);
  articles.push(`${data.forwardingName}`);
  articles.push(`${data.forwardingAddress}`);
  articles.push(`${data.forwardingCity}, ${data.forwardingState} ${data.forwardingZip}`);
  articles.push(``);
  articleNumber++;

  // Optional Registered Agent
  if (data.includeRegisteredAgent && data.registeredAgentName) {
    articles.push(`${toOrdinal(articleNumber)}: Registered Agent`);
    articles.push(``);
    articles.push(
      `The Limited Liability Company designates the following as a Registered Agent upon ` +
      `whom process against the Limited Liability Company may be served:`
    );
    articles.push(``);
    articles.push(`Name: ${data.registeredAgentName}`);
    articles.push(`Address: ${data.registeredAgentAddress || ''}`);
    articles.push(`${data.registeredAgentCity || ''}, NY ${data.registeredAgentZip || ''}`);
    articles.push(``);
    articleNumber++;
  }

  // Optional Management Structure
  if (data.includeManagementStructure) {
    articles.push(`${toOrdinal(articleNumber)}: Management Structure`);
    articles.push(``);

    if (data.managementType === "manager") {
      articles.push(`The LLC shall be managed by ONE OR MORE MANAGERS.`);
      if (data.managerNames && data.managerNames.trim().length > 0) {
        articles.push(``);
        articles.push(`The names and addresses of the initial managers are:`);
        articles.push(``);
        articles.push(data.managerNames);
      }
    } else {
      articles.push(`The LLC shall be managed by ITS MEMBERS.`);
    }
    articles.push(``);
    articleNumber++;
  }

  // Optional Effective Date
  if (data.includeEffectiveDate && data.effectiveDate) {
    articles.push(`${toOrdinal(articleNumber)}: Effective Date`);
    articles.push(``);
    articles.push(`The Limited Liability Company shall become effective on the following date:`);
    articles.push(``);
    articles.push(formatDate(data.effectiveDate));
    articles.push(``);
    articles.push(`(This date must be within 60 days of filing.)`);
    articles.push(``);
    articleNumber++;
  }

  // Optional Dissolution Date
  if (data.includeDissolutionDate && data.dissolutionDate) {
    articles.push(`${toOrdinal(articleNumber)}: Dissolution Date`);
    articles.push(``);
    articles.push(`The Limited Liability Company shall dissolve on the following date:`);
    articles.push(``);
    articles.push(formatDate(data.dissolutionDate));
    articles.push(``);
    articleNumber++;
  }

  // Optional Liability Statement
  if (data.includeLiabilityStatement) {
    articles.push(`${toOrdinal(articleNumber)}: Indemnification`);
    articles.push(``);
    articles.push(
      `The Limited Liability Company shall indemnify, defend, and hold harmless its members, ` +
      `managers, agents, or employees from and against any claims, liabilities, and expenses ` +
      `arising out of their status as such, to the fullest extent permitted by the LLC Law.`
    );
    articles.push(``);
    articleNumber++;
  }

  // Organizer (REQUIRED)
  articles.push(`${toOrdinal(articleNumber)}: Organizer`);
  articles.push(``);
  articles.push(`The name and address of the Organizer of the Limited Liability Company are:`);
  articles.push(``);
  articles.push(`Name: ${data.organizerName}`);
  articles.push(`Address: ${data.organizerAddress}`);
  articles.push(`${data.organizerCity}, ${data.organizerState} ${data.organizerZip}`);
  articles.push(``);
  articles.push(
    `The Organizer signs these Articles of Organization and affirms the truth of the ` +
    `statements herein.`
  );
  articles.push(``);
  articles.push(`Organizer Signature: _____________________________________________`);
  articles.push(`Printed Name: ${data.organizerName}`);
  articles.push(`Date: ____________________________`);
  articles.push(``);
  articleNumber++;

  // Filer Information (REQUIRED)
  articles.push(`${toOrdinal(articleNumber)}: Filer Information`);
  articles.push(``);
  articles.push(
    `The name and address of the individual submitting and filing these Articles with the ` +
    `New York Department of State are:`
  );
  articles.push(``);
  articles.push(`Name: ${data.filerName}`);
  articles.push(`Address: ${data.filerAddress}`);
  articles.push(`${data.filerCity}, ${data.filerState} ${data.filerZip}`);
  articles.push(`Email: ${data.filerEmail}`);
  articles.push(`Telephone: ${data.filerPhone}`);
  articles.push(``);
  articles.push(`END OF ARTICLES OF ORGANIZATION`);

  return articles.join('\n');
}

function toOrdinal(num: number): string {
  const ordinals = [
    "FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH", "SEVENTH",
    "EIGHTH", "NINTH", "TENTH", "ELEVENTH", "TWELFTH", "THIRTEENTH",
    "FOURTEENTH", "FIFTEENTH"
  ];
  return ordinals[num - 1] || `${num}TH`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
