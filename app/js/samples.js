// Synthetic example messages for trying the tool. None of these are real messages, numbers or people.
// Domains in the scam examples are invented; phone numbers use the fictional 555-01XX range.
export const SAMPLES = [
  {
    id: 'uscis',
    label: '“USCIS officer” voicemail',
    sender: '(202) 555-0188',
    links: '',
    text: 'This is Officer Daniel Ross with U.S. Citizenship and Immigration Services. Your F-1 visa has been flagged and your SEVIS record will be terminated today. A warrant for your arrest will be issued unless you pay the $950 correction fee with Target gift cards. Call us back immediately at (202) 555-0188. Do not discuss this case with your school or anyone else.',
  },
  {
    id: 'usps',
    label: 'Package “redelivery fee” text',
    sender: '+1 (305) 555-0170',
    links: '',
    text: 'USPS: Your parcel is on hold due to an incomplete address. Pay the $1.99 redelivery fee within 12 hours to avoid return: https://usps-parcel-care.top/redeliver?id=88231',
  },
  {
    id: 'apple',
    label: 'Lookalike “Apple ID” email',
    sender: 'Apple Support <no-reply@xn--pple-43d.com>',
    links: '',
    text: 'Your Apple ID was used to sign in on a new device. If this wasn\'t you, verify your account now at https://xn--pple-43d.com/account',
  },
  {
    id: 'task',
    label: 'Remote “task job” chat',
    sender: 'Recruiter Amy',
    links: '',
    text: 'Hi! I\'m a recruiter from a digital marketing agency. We have a remote part-time job for students: just rate hotels online and earn $300-$800 per day. You need to recharge 50 USDT to unlock your first task set. Please add me on Telegram @amy_tasks_hr.',
  },
  {
    id: 'police-zh',
    label: '“Chinese police” call (中文)',
    sender: '+86 10 5555 0199',
    links: '',
    text: '您好，这里是北京市公安局。您的护照涉嫌一宗国际洗钱案件，已被立案调查。为配合调查，您必须保密，不要告诉任何人，并将资金转入安全账户。请立即加微信联系办案警官。',
  },
  {
    id: 'code-legit',
    label: 'A real-style 2FA code you asked for',
    sender: '72975',
    links: '',
    text: 'Your Chase verification code is 418203. Don\'t share this code with anyone. We\'ll never call to ask for it.',
  },
  {
    id: 'isss-legit',
    label: 'A real-style school reminder',
    sender: 'Office of Global Services <ogs@university.edu>',
    links: '',
    text: 'Reminder: F-1 students must report a change of address within 10 days. If you do not update your address, your SEVIS record could be affected. Update it through the portal: https://global.university.edu/address-reporting',
  },
];
