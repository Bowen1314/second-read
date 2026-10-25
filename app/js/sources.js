// Public guidance each rule is grounded in. URLs were checked on 2026-10-24.
export const SOURCES = {
  ftcPhishing: { org: 'FTC', title: 'How To Recognize and Avoid Phishing Scams', url: 'https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams' },
  ftcText: { org: 'FTC', title: 'How To Recognize and Report Spam Text Messages', url: 'https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages' },
  ftcUsps: { org: 'FTC', title: 'Think that text message is from USPS? It could be a scam (2025)', url: 'https://consumer.ftc.gov/consumer-alerts/2025/04/think-text-message-usps-it-could-be-scam' },
  ftcGiftAlert: { org: 'FTC', title: 'Only scammers tell you to buy a gift card to pay them (2024)', url: 'https://consumer.ftc.gov/consumer-alerts/2024/10/only-scammers-tell-you-buy-gift-card-pay-them' },
  ftcGift: { org: 'FTC', title: 'Avoiding and Reporting Gift Card Scams', url: 'https://consumer.ftc.gov/articles/gift-card-scams' },
  ftcGov: { org: 'FTC', title: 'How To Avoid a Government Impersonation Scam', url: 'https://consumer.ftc.gov/articles/how-avoid-government-impersonation-scam' },
  ftcJob: { org: 'FTC', title: 'Job Scams', url: 'https://consumer.ftc.gov/articles/job-scams' },
  ftcTask: { org: 'FTC', title: 'How to spot and avoid task scams (2025)', url: 'https://consumer.ftc.gov/consumer-alerts/2025/08/how-spot-avoid-task-scams' },
  ftcCode: { org: 'FTC', title: "What's a verification code and why would someone ask me for it? (2024)", url: 'https://consumer.ftc.gov/node/84809' },
  ftcCrypto: { org: 'FTC', title: 'What To Know About Cryptocurrency and Scams', url: 'https://consumer.ftc.gov/articles/what-know-about-cryptocurrency-and-scams' },
  ftcScammed: { org: 'FTC', title: 'What To Do if You Were Scammed', url: 'https://consumer.ftc.gov/articles/what-do-if-you-were-scammed' },
  ic3Gov: { org: 'FBI IC3', title: 'Scammers Impersonating Law Enforcement and Government Officials (PSA, Sep 2026)', url: 'https://www.ic3.gov/PSA/2026/PSA260917' },
  ic3Students: { org: 'FBI IC3', title: 'Impersonation Scheme Targeting Middle Eastern Students in the United States (PSA, May 2025)', url: 'https://www.ic3.gov/PSA/2025/PSA250513' },
  ic3Chinese: { org: 'FBI IC3', title: 'Chinese Police Imposters Target U.S.-Based Chinese Community (PSA, Jan 2024)', url: 'https://www.ic3.gov/PSA/2024/PSA240103' },
  rutgers: { org: 'Rutgers Global', title: 'Scams & Fraud: How to Stay Safe', url: 'https://global.rutgers.edu/scams' },
  berkeley: { org: 'UC Berkeley International Office', title: 'Scams and Safety', url: 'https://internationaloffice.berkeley.edu/node/378' },
  osu: { org: 'Ohio State Student Legal Services', title: 'Scams (international students)', url: 'https://studentlegal.osu.edu/international-students/scams' },
  csun: { org: 'CSUN International Exchange & Student Center', title: 'Scam and Fraud Advisory', url: 'https://www.csun.edu/international/international-students/scam-and-fraud-advisory' },
  uscis: { org: 'USCIS', title: 'Common Scams', url: 'https://www.uscis.gov/scams-fraud-and-misconduct/avoid-scams/common-scams' },
  irs: { org: 'IRS', title: 'Tax scams', url: 'https://www.irs.gov/help/tax-scams' },
  sevp: { org: 'DHS SEVP (Study in the States)', title: 'SEVP Will Never Call You to Collect Your I-901 SEVIS Fee', url: 'https://studyinthestates.dhs.gov/2015/05/students-sevp-will-never-call-you-collect-your-i-901-sevis-fee' },
  embassyCN: { org: 'Embassy of the PRC in the US', title: '提醒在美中国公民谨防电信网络诈骗 (2025)', url: 'https://us.china-embassy.gov.cn/lsfw/lsxz/lstx/202501/t20250104_11527001.htm' },
  getgov: { org: 'get.gov (CISA)', title: 'Eligibility for .gov domains', url: 'https://get.gov/domains/eligibility/' },
  uts39: { org: 'Unicode', title: 'UTS #39: Unicode Security Mechanisms (confusable characters)', url: 'https://www.unicode.org/reports/tr39/' },
};

// Where to report. Shown as plain text the user can type, plus a link they choose to follow.
export const REPORT = {
  ftc: { label: 'FTC: ReportFraud.ftc.gov', url: 'https://reportfraud.ftc.gov/' },
  ic3: { label: 'FBI Internet Crime Complaint Center: ic3.gov', url: 'https://www.ic3.gov/' },
  spam: { label: 'Forward a scam text to 7726 (SPAM) — free on major US carriers', url: null },
};
