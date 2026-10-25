// Organisations that scam messages most often pretend to be, with the domains they actually use.
// Compiled by hand for Second Read from each organisation's own website. Not exhaustive:
// an organisation missing from this table simply gets no domain-match check.
//
// kind: 'gov' (US government, must use .gov / .mil), 'foreign-gov', 'edu', 'company'
// tokens: lowercase strings that, when they appear inside an unrelated domain, suggest impersonation.
export const ORGS = [
  // --- US government ---
  { id: 'uscis', name: 'USCIS', kind: 'gov', re: /\bUSCIS\b|Citizenship and Immigration Services/i, domains: ['uscis.gov', 'dhs.gov'], tokens: ['uscis'] },
  { id: 'ice', name: 'ICE / SEVP', kind: 'gov', re: /\b(ICE|SEVP|HSI)\b|Immigration and Customs Enforcement|Student and Exchange Visitor Program|Homeland Security Investigations/, domains: ['ice.gov', 'dhs.gov', 'fmjfee.com'], tokens: ['sevp', 'sevis', 'ice'] },
  { id: 'dhs', name: 'Department of Homeland Security', kind: 'gov', re: /\bDHS\b|Homeland Security/i, domains: ['dhs.gov'], tokens: ['dhs'] },
  { id: 'irs', name: 'IRS', kind: 'gov', re: /\bIRS\b|Internal Revenue Service/, domains: ['irs.gov', 'treasury.gov'], tokens: ['irs'] },
  { id: 'ssa', name: 'Social Security Administration', kind: 'gov', re: /\bSSA\b|Social Security Administration/, domains: ['ssa.gov'], tokens: ['ssa'] },
  { id: 'state', name: 'US Department of State', kind: 'gov', re: /\b(U\.?S\.? )?(Department of State|State Department)\b|US Embassy|U\.S\. Embassy/i, domains: ['state.gov', 'usembassy.gov'], tokens: ['usembassy', 'travelstate'] },
  { id: 'fbi', name: 'FBI', kind: 'gov', re: /\bFBI\b|Federal Bureau of Investigation/, domains: ['fbi.gov', 'ic3.gov'], tokens: ['fbi'] },
  { id: 'ftc', name: 'FTC', kind: 'gov', re: /\bFTC\b|Federal Trade Commission/, domains: ['ftc.gov'], tokens: ['ftc'] },
  { id: 'cbp', name: 'US Customs and Border Protection', kind: 'gov', re: /\bCBP\b|Customs and Border Protection/, domains: ['cbp.gov'], tokens: ['cbp'] },
  { id: 'marshals', name: 'US Marshals', kind: 'gov', re: /\b(U\.?S\.? )?Marshals?( Service)?\b/i, domains: ['usmarshals.gov'], tokens: ['usmarshals'] },
  { id: 'ed', name: 'US Department of Education / Federal Student Aid', kind: 'gov', re: /Department of Education|Federal Student Aid|\bFAFSA\b/i, domains: ['ed.gov', 'studentaid.gov'], tokens: ['studentaid', 'fafsa'] },
  { id: 'govgeneric', name: 'a government office', kind: 'gov', re: /海关|\b(the )?(Embassy|Consulate|Customs( Office| Department)?|police department|sheriff['’]?s office|immigration (office|department|services|officer)|Department of (Justice|Labor)|investigating officer|federal agent|government agency|Supreme Court|district court)\b/i, domains: [], tokens: [] },
  // --- foreign government (must use a government suffix such as gov.cn) ---
  { id: 'cnpolice', name: 'Chinese police / embassy', kind: 'foreign-gov', re: /Chinese (police|embassy|consulate)|Embassy of China|公安|警察|大使馆|领事馆|检察院|法院/i, domains: ['china-embassy.gov.cn', 'mps.gov.cn', 'mfa.gov.cn'], tokens: [] },
  // --- universities (generic) ---
  { id: 'school', name: 'your university', kind: 'edu', re: /\b(international (student|scholar)s? (office|services|center)|ISSS|OIA|Office of International( (Affairs|Programs|Students))?|Global Services|Bursar|Registrar|Student Accounts|Financial Aid Office|(your|our|the) (university|college|school)|University IT|IT (Service|Support|Help) (Desk|Team)|IT Department|NetID|student portal|Professor|Dean of Students)\b|学校|大学/i, domains: [], tokens: [] },
  // --- couriers ---
  { id: 'usps', name: 'USPS', kind: 'gov', re: /\bUSPS\b|Postal Service|US Post\b/i, domains: ['usps.com', 'usps.gov'], tokens: ['usps'] },
  { id: 'ups', name: 'UPS', kind: 'company', re: /\bUPS\b/, domains: ['ups.com'], tokens: ['ups'] },
  { id: 'fedex', name: 'FedEx', kind: 'company', re: /\bFed ?Ex\b/i, domains: ['fedex.com'], tokens: ['fedex'] },
  { id: 'dhl', name: 'DHL', kind: 'company', re: /\bDHL\b/i, domains: ['dhl.com'], tokens: ['dhl'] },
  { id: 'ezpass', name: 'E-ZPass', kind: 'gov', re: /\bE-?ZPass\b|\btoll (services|authority|balance)\b/i, domains: ['e-zpassny.com', 'ezpassnj.com', 'e-zpassiag.com'], tokens: ['ezpass', 'zpass'] },
  // --- shopping, payments, tech ---
  { id: 'amazon', name: 'Amazon', kind: 'company', re: /\bAmazon\b/i, domains: ['amazon.com', 'amazon.jobs', 'amazonaws.com'], tokens: ['amazon'] },
  { id: 'paypal', name: 'PayPal', kind: 'company', re: /\bPay ?Pal\b/i, domains: ['paypal.com', 'paypal.me'], tokens: ['paypal'] },
  { id: 'apple', name: 'Apple', kind: 'company', re: /\bApple( ID| Support| Pay)?\b|\biCloud\b/, domains: ['apple.com', 'icloud.com'], tokens: ['apple', 'icloud', 'appleid'] },
  { id: 'microsoft', name: 'Microsoft', kind: 'company', re: /\bMicrosoft\b|\bOffice ?365\b|\bOutlook\b/, domains: ['microsoft.com', 'office.com', 'live.com', 'outlook.com', 'microsoftonline.com', 'microsoft365.com'], tokens: ['microsoft', 'office365', 'outlook'] },
  { id: 'google', name: 'Google', kind: 'company', re: /\bGoogle\b|\bGmail\b/, domains: ['google.com', 'gmail.com', 'youtube.com'], tokens: ['google', 'gmail'] },
  { id: 'netflix', name: 'Netflix', kind: 'company', re: /\bNetflix\b/i, domains: ['netflix.com'], tokens: ['netflix'] },
  { id: 'venmo', name: 'Venmo', kind: 'company', re: /\bVenmo\b/i, domains: ['venmo.com'], tokens: ['venmo'] },
  { id: 'zelle', name: 'Zelle', kind: 'company', re: /\bZelle\b/i, domains: ['zellepay.com', 'zelle.com'], tokens: ['zelle'] },
  { id: 'cashapp', name: 'Cash App', kind: 'company', re: /\bCash ?App\b/i, domains: ['cash.app', 'square.com', 'squareup.com'], tokens: ['cashapp'] },
  { id: 'coinbase', name: 'Coinbase', kind: 'company', re: /\bCoinbase\b/i, domains: ['coinbase.com'], tokens: ['coinbase'] },
  // --- banks ---
  { id: 'bankgeneric', name: 'your bank', kind: 'company', re: /\b(fraud (department|team|prevention)|your bank|bank['’]s (fraud|security) (team|department))\b/i, domains: [], tokens: [] },
  { id: 'chase', name: 'Chase', kind: 'company', re: /\bChase\b|JPMorgan/, domains: ['chase.com', 'jpmorgan.com', 'jpmorganchase.com'], tokens: ['chase', 'jpmorgan'] },
  { id: 'bofa', name: 'Bank of America', kind: 'company', re: /Bank of America|\bBofA\b/i, domains: ['bankofamerica.com', 'bofa.com'], tokens: ['bankofamerica', 'bofa'] },
  { id: 'wells', name: 'Wells Fargo', kind: 'company', re: /Wells ?Fargo/i, domains: ['wellsfargo.com', 'wf.com'], tokens: ['wellsfargo'] },
  { id: 'citi', name: 'Citi', kind: 'company', re: /\bCiti(bank)?\b/i, domains: ['citi.com', 'citibank.com'], tokens: ['citibank'] },
  { id: 'capone', name: 'Capital One', kind: 'company', re: /Capital One/i, domains: ['capitalone.com'], tokens: ['capitalone'] },
  // --- login / identity providers students see ---
  { id: 'duo', name: 'Duo', kind: 'company', re: /\bDuo( Security| Mobile| Push)?\b/, domains: ['duo.com', 'duosecurity.com'], tokens: ['duosecurity'] },
  { id: 'okta', name: 'Okta', kind: 'company', re: /\bOkta\b/i, domains: ['okta.com', 'oktapreview.com'], tokens: ['okta'] },
  { id: 'linkedin', name: 'LinkedIn', kind: 'company', re: /\bLinkedIn\b/i, domains: ['linkedin.com', 'lnkd.in'], tokens: ['linkedin'] },
  { id: 'handshake', name: 'Handshake', kind: 'company', re: /\bHandshake\b/, domains: ['joinhandshake.com'], tokens: ['joinhandshake'] },
  { id: 'flywire', name: 'Flywire', kind: 'company', re: /\bFlywire\b/i, domains: ['flywire.com'], tokens: ['flywire'] },
];

// Free webmail providers: a real agency or bank will not write to you from one of these.
export const FREEMAIL = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'ymail.com', 'aol.com',
  'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'gmx.com', 'mail.com', 'qq.com', '163.com', '126.com',
  'yandex.com', 'zoho.com',
]);

// URL shorteners: the real destination is hidden until you click.
export const SHORTENERS = new Set([
  'bit.ly', 'bitly.com', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly', 'cutt.ly',
  't.ly', 'rb.gy', 'shorturl.at', 'tiny.cc', 's.id', 'bit.do', 'qrco.de', 'shorte.st', 'v.gd', 'tr.im', 'x.co',
  'lnkd.in', 'surl.li', 'u.to', 'clck.ru', 'short.gy', 'tiny.one', 'urlz.fr', 'sl.al', 'did.li',
]);
