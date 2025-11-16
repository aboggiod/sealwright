/**
 * Comprehensive test for AOO Generator
 * Run with: npx ts-node test-aoo-generator.ts
 */

import { generateAOO, type AOOFormData } from './lib/aoo-generator.js';

// Test data with all required fields
const minimalTestData: AOOFormData = {
  llcName: "Test Company LLC",
  llcNameAlt1: "",
  llcNameAlt2: "",
  county: "Albany",
  includeOpeningStatement: false,
  hasNonEnglishWords: false,
  nonEnglishTranslation: "",
  includePurposeClause: false,
  specificPurpose: "",
  forwardingName: "John Doe",
  forwardingAddress: "123 Main Street",
  forwardingCity: "Albany",
  forwardingState: "NY",
  forwardingZip: "12207",
  includeRegisteredAgent: false,
  registeredAgentName: "",
  registeredAgentAddress: "",
  registeredAgentCity: "",
  registeredAgentZip: "",
  includeManagementStructure: false,
  managementType: "member",
  managerNames: "",
  includeEffectiveDate: false,
  effectiveDate: "",
  includeDissolutionDate: false,
  dissolutionDate: "",
  includeLiabilityStatement: false,
  organizerName: "Jane Smith",
  organizerAddress: "456 Oak Avenue",
  organizerCity: "Albany",
  organizerState: "NY",
  organizerZip: "12208",
  filerName: "Jane Smith",
  filerEmail: "jane@example.com",
  filerPhone: "(518) 555-1234",
  filerAddress: "456 Oak Avenue",
  filerCity: "Albany",
  filerState: "NY",
  filerZip: "12208",
};

// Test data with all optional fields enabled
const maximalTestData: AOOFormData = {
  ...minimalTestData,
  llcName: "Maximal Test Company LLC",
  includeOpeningStatement: true,
  hasNonEnglishWords: true,
  nonEnglishTranslation: "Test Company",
  includePurposeClause: true,
  specificPurpose: "To engage in software development and consulting services",
  includeRegisteredAgent: true,
  registeredAgentName: "Albany Registered Agent Services",
  registeredAgentAddress: "789 State Street",
  registeredAgentCity: "Albany",
  registeredAgentZip: "12207",
  includeManagementStructure: true,
  managementType: "manager",
  managerNames: "Robert Manager, 100 Manager Blvd, Albany NY 12207",
  includeEffectiveDate: true,
  effectiveDate: "2025-12-31",
  includeDissolutionDate: true,
  dissolutionDate: "2035-12-31",
  includeLiabilityStatement: true,
};

console.log("=".repeat(80));
console.log("AOO GENERATOR - COMPREHENSIVE TEST");
console.log("=".repeat(80));

console.log("\n\n" + "=".repeat(80));
console.log("TEST 1: MINIMAL AOO (Only Required Fields)");
console.log("=".repeat(80));
const minimalAOO = generateAOO(minimalTestData);
console.log(minimalAOO);

console.log("\n\n" + "=".repeat(80));
console.log("TEST 2: MAXIMAL AOO (All Optional Fields Enabled)");
console.log("=".repeat(80));
const maximalAOO = generateAOO(maximalTestData);
console.log(maximalAOO);

console.log("\n\n" + "=".repeat(80));
console.log("TEST 3: PURPOSE CLAUSE ONLY");
console.log("=".repeat(80));
const purposeOnlyData: AOOFormData = {
  ...minimalTestData,
  llcName: "Purpose Test LLC",
  includePurposeClause: true,
  specificPurpose: "",
};
const purposeOnlyAOO = generateAOO(purposeOnlyData);
console.log(purposeOnlyAOO);

console.log("\n\n" + "=".repeat(80));
console.log("TEST 4: REGISTERED AGENT ONLY");
console.log("=".repeat(80));
const agentOnlyData: AOOFormData = {
  ...minimalTestData,
  llcName: "Registered Agent Test LLC",
  includeRegisteredAgent: true,
  registeredAgentName: "Test Agent Inc",
  registeredAgentAddress: "999 Agent Plaza",
  registeredAgentCity: "Albany",
  registeredAgentZip: "12207",
};
const agentOnlyAOO = generateAOO(agentOnlyData);
console.log(agentOnlyAOO);

console.log("\n\n" + "=".repeat(80));
console.log("VALIDATION CHECKS");
console.log("=".repeat(80));

// Check minimal document
console.log("\n✓ Minimal AOO Tests:");
console.log(`  - Contains LLC name: ${minimalAOO.includes("Test Company LLC") ? "✓" : "✗"}`);
console.log(`  - Contains county: ${minimalAOO.includes("Albany") ? "✓" : "✗"}`);
console.log(`  - Contains organizer: ${minimalAOO.includes("Jane Smith") ? "✓" : "✗"}`);
console.log(`  - Contains filer: ${minimalAOO.includes("jane@example.com") ? "✓" : "✗"}`);
console.log(`  - Does NOT contain opening statement: ${!minimalAOO.includes("formed pursuant to the New York Limited Liability Company Law") ? "✓" : "✗"}`);
console.log(`  - Does NOT contain purpose clause: ${!minimalAOO.includes("engage in any lawful") ? "✓" : "✗"}`);

// Check maximal document
console.log("\n✓ Maximal AOO Tests:");
console.log(`  - Contains opening statement: ${maximalAOO.includes("formed pursuant to the New York Limited Liability") ? "✓" : "✗"}`);
console.log(`  - Contains purpose clause: ${maximalAOO.includes("software development") ? "✓" : "✗"}`);
console.log(`  - Contains registered agent: ${maximalAOO.includes("Albany Registered Agent Services") ? "✓" : "✗"}`);
console.log(`  - Contains management structure: ${maximalAOO.includes("MANAGERS") ? "✓" : "✗"}`);
console.log(`  - Contains effective date: ${maximalAOO.includes("December 31, 2025") ? "✓" : "✗"}`);
console.log(`  - Contains dissolution date: ${maximalAOO.includes("December 31, 2035") ? "✓" : "✗"}`);
console.log(`  - Contains liability statement: ${maximalAOO.includes("indemnify") ? "✓" : "✗"}`);

// Check article numbering
console.log("\n✓ Article Numbering Tests:");
const minimalArticles = minimalAOO.match(/^(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH):/gm);
const maximalArticles = maximalAOO.match(/^(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH|THIRTEENTH|FOURTEENTH|FIFTEENTH):/gm);

console.log(`  - Minimal document article count: ${minimalArticles?.length || 0}`);
console.log(`  - Maximal document article count: ${maximalArticles?.length || 0}`);
console.log(`  - Maximal has more articles: ${(maximalArticles?.length || 0) > (minimalArticles?.length || 0) ? "✓" : "✗"}`);

console.log("\n" + "=".repeat(80));
console.log("ALL TESTS COMPLETE");
console.log("=".repeat(80));
