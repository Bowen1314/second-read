// Transparent text rules. Each pattern is a plain regular expression you can read below.
// tier: strong | moderate | weak | context (context = worth knowing, not a warning sign on its own)
import { SOURCES as S } from './sources.js';

export const SIGNS = {
  threat: {
    title: 'Threats of arrest, deportation or penalties',
    explain: 'Real agencies do not threaten arrest, deportation or a cancelled visa to make you pay or act right now. Fear is used to stop you from checking.',
    sources: [S.ftcGov, S.ic3Gov, S.uscis, S.rutgers],
  },
  urgency: {
    title: 'Time pressure',
    explain: 'A short deadline pushes you to act before you check. Real deadlines exist too, so the question is whether you can confirm this one through a channel you look up yourself.',
    sources: [S.ftcPhishing, S.ftcGift],
  },
  secrecy: {
    title: 'Asks you to keep it secret or stay on the line',
    explain: 'Being told not to tell your school, family or the police, or to stay on the phone or video, is a hallmark of impersonation scams. Your international student office wants you to tell them.',
    sources: [S.berkeley, S.osu, S.ic3Chinese],
  },
  unusual_payment: {
    title: 'Unusual way to pay',
    explain: 'Gift cards, cryptocurrency, crypto ATMs, wire transfers and payment apps work like cash: once sent, the money is very hard to get back. US government agencies do not take fees or fines this way.',
    sources: [S.ftcGiftAlert, S.ftcGov, S.ftcCrypto, S.uscis, S.irs],
  },
  credentials_request: {
    title: 'Asks for a code, password or personal numbers',
    explain: 'Anyone who asks you for a verification code is trying to get into your account. Real organisations do not ask for your password, PIN, SSN or passport number by text or email.',
    sources: [S.ftcCode, S.ftcPhishing],
  },
  authority_impersonation: {
    title: 'Claims to be an official body',
    explain: 'Claiming to be a government agency, police, an embassy or your university is not a warning sign by itself, but it is the most common disguise. Check it through a channel you find yourself.',
    sources: [S.ic3Gov, S.ftcGov, S.ic3Students],
  },
  domain_mismatch: {
    title: 'Claimed sender does not match the real address',
    explain: 'The message says it is from one organisation, but the email address or link belongs to someone else.',
    sources: [S.ftcPhishing, S.csun],
  },
  gov_edu_mismatch: {
    title: 'Government or school claim without a .gov / .edu address',
    explain: 'US government bodies use .gov addresses, and US universities normally use .edu. A message that claims to be one of them but uses another domain needs extra checking. (Some real services, like payment processors, use their own domains, so this is a reason to check, not proof.)',
    sources: [S.getgov, S.csun],
  },
  lookalike_domain: {
    title: 'Lookalike web address',
    explain: 'The address is built to look like a real brand: a swapped letter, characters from another alphabet, or a brand name inside a domain the brand does not own.',
    sources: [S.uts39, S.ftcPhishing],
  },
  link_shortener: {
    title: 'Shortened link hides the destination',
    explain: 'A short link hides where it really goes. Second Read never opens links, so it cannot see the destination either, and you cannot see it until you click.',
    sources: [S.ftcText],
  },
  suspicious_link: {
    title: 'Unusual link structure',
    explain: 'Something about how the link is built is unusual: an address hidden before an “@”, a raw IP address, another address tucked inside it, or an unknown ending.',
    sources: [S.ftcPhishing],
  },
  pay_to_earn: {
    title: 'Pay first to get money, a job or a package',
    explain: 'Being asked to pay a fee to receive a package, unlock earnings, get a job or release a refund is how job, task and delivery scams make money.',
    sources: [S.ftcJob, S.ftcTask, S.ftcUsps],
  },
  unsolicited_contact_switch: {
    title: 'Moves you to another channel or a number it gives you',
    explain: 'Asking you to continue on WhatsApp, Telegram or a personal number, or to call back a number in the message, keeps you away from the real organisation. Use a number or website you look up yourself.',
    sources: [S.ftcTask, S.ftcText, S.ftcGov],
  },
  generic_greeting: {
    title: 'Generic greeting',
    explain: 'Messages from organisations you deal with usually use your name. A generic greeting is weak evidence on its own, because plenty of real bulk messages use one too.',
    sources: [S.ftcPhishing],
  },
  free_hosting: {
    title: 'Hosted on a free site builder',
    explain: 'Anyone can make a site on a free hosting service in minutes. Real organisations sometimes use them too, so this is weak on its own.',
    sources: [S.ftcPhishing],
  },
  freemail_sender: {
    title: 'Official-sounding message from a free email account',
    explain: 'Government agencies, banks and universities do not contact you from Gmail, Outlook.com, QQ or similar free accounts.',
    sources: [S.ftcGov, S.berkeley],
  },
};

// Words that, shortly BEFORE a match, flip its meaning ("never share your code").
const NEG_BEFORE = /(never|no one|nobody|won['’]t|wouldn['’]t|shouldn['’]t|can['’]t|don['’]t|doesn['’]t|(will|would|should|must|do|does|is|are) not|not (ask|share|send|give)|绝不|不会|不要|切勿)[^.!?\n]{0,40}$/i;

// Each rule: sign, tier, re (global), optional neg (true = check NEG_BEFORE), optional after (reject if text after matches)
export const RULES = [
  // ---- threats
  { sign: 'threat', tier: 'strong', re: /\b(arrest(ed)?|warrant|deport(ed|ation)?|detain(ed)?|detention|prosecut(e|ed|ion)|jail|prison|criminal (charges?|case|investigation)|legal action|lawsuit|removal proceedings|extradit(e|ed|ion))\b/gi, neg: true },
  { sign: 'threat', tier: 'strong', re: /\b(visa|SEVIS( record)?|status|I-20|green card|OPT|F-1)\b[^.!?\n]{0,30}\b(will be |has been |is being |be )?(terminat(ed|ion)|cancel(l)?(ed|ation)|revok(ed|ation)|invalid(ated)?|suspend(ed)?)\b/gi, neg: true },
  { sign: 'threat', tier: 'moderate', re: /\b(account|card|access|NetID|email)\b[^.!?\n]{0,30}\b(will be |has been |is )?(suspend(ed)?|locked|disabled|deactivat(ed|ion)|clos(ed|ure)|terminat(ed)?)\b/gi, neg: true },
  { sign: 'threat', tier: 'moderate', re: /\b(penalt(y|ies)|fines?|late fee)\b[^.!?\n]{0,30}\$\s?\d/gi },
  { sign: 'threat', tier: 'moderate', re: /\b(report(ed)? (you )?to|notify|refer(red)? (you )?to)\b (the )?(immigration|ICE|USCIS|the police|police|authorities|law enforcement|FBI|IRS)\b/gi, neg: true },
  { sign: 'threat', tier: 'strong', re: /(逮捕|通缉|拘留|遣返|冻结|涉嫌|洗钱|立案|刑事|坐牢|引渡)/g },

  // ---- urgency
  { sign: 'urgency', tier: 'weak', re: /\b(within (24|48|72|\d{1,2}) hours?|within \d+ (minutes|mins)|immediately|right away|right now|urgent(ly)?|act now|final (notice|warning|reminder)|last (chance|warning)|today only|expires? (today|tonight|soon|in \d+)|as soon as possible|ASAP|before (it'?s too late|midnight|end of (the )?day)|time[- ]sensitive)\b/gi },
  { sign: 'urgency', tier: 'weak', re: /\b(pay|call|act|respond|reply|verify|confirm|send|update|speak (with|to)|contact|click|wire|transfer|deposit|buy|purchase|log ?in|sign ?in)\b[^.!?\n]{0,45}\b(now|today|tonight)\b|\b(failure to|if you do not|unless you)\b[^.!?\n]{0,30}\b(today|now|immediately|within)\b|\bin \d{1,2} (hours?|minutes)\b/gi },
  { sign: 'urgency', tier: 'weak', re: /(立即|立刻|马上|尽快|紧急|24小时内|今天之内|否则)/g },

  // ---- secrecy / isolation
  { sign: 'secrecy', tier: 'strong', re: /\b(do not|don['’]t|must not|cannot|can['’]t|not allowed to)\s+(tell|inform|discuss|contact|call|speak (to|with)|talk (to|with)|notify)\b[^.!?\n]{0,40}\b(anyone|anybody|family|friends?|school|university|DSO|advisors?|ISSS|police|lawyer|attorney|bank|parents?|roommates?)\b/gi },
  { sign: 'secrecy', tier: 'strong', re: /\b(keep (this|it) (confidential|secret|private|between us)|strictly confidential|confidential (investigation|case|matter)|(stay|remain) on the (line|phone|call)|do not (hang up|disconnect|end the call)|don['’]t (hang up|disconnect))\b/gi },
  { sign: 'secrecy', tier: 'strong', re: /(保密|不要告诉|不得(向|与)?[^。！？\n]{0,8}(透露|告诉|联系)|不要挂(断|电话)?|视频监控|保持视频|24小时[^。]{0,4}(视频|监控)|单独(在房间|一个人))/g },

  // ---- unusual payment
  { sign: 'unusual_payment', tier: 'strong', re: /\b(gift ?cards?|(apple|itunes|google play|steam|target|amazon|walmart|ebay|sephora|razer gold|vanilla)( gift)? cards?|prepaid (debit )?cards?|card numbers? and (the )?pin)\b/gi, neg: true },
  { sign: 'unusual_payment', tier: 'strong', re: /\b(bitcoin|BTC|USDT|tether|ethereum|crypto(currency|currencies)?|crypto wallet|wallet address|bitcoin ATM|crypto ATM|BTM)\b/gi, neg: true },
  { sign: 'unusual_payment', tier: 'strong', re: /\b(wire (transfer|the money|the funds|it)|Western Union|MoneyGram|cash courier|courier (will|to) (collect|pick up)|(mail|send|ship) (the )?cash|cash in an envelope)\b/gi, neg: true },
  { sign: 'unusual_payment', tier: 'moderate', re: /\b(Zelle|Venmo|Cash ?App|PayPal (friends|f&f))\b/gi, neg: true },
  { sign: 'unusual_payment', tier: 'strong', re: /(礼品卡|比特币|虚拟货币|加密货币|USDT|安全账户|保证金|保释金)/g },

  // ---- credentials / codes
  { sign: 'credentials_request', tier: 'strong', re: /\b(send|reply( with)?|text|share|give|tell|read|provide|forward|confirm|enter|type|submit|update|verify)\b( me| us| back)?( the| your| that| this)?[^.!?\n]{0,30}\b(verification code|security code|one[- ]time (pass)?code|OTP|6[- ]digit code|code (we|I|that was) (just )?sent|login code|access code|passcode|password|PIN|SSN|social security( number)?|passport( number| details)?|visa number|I-94|A-?number|bank (account|login|details)|routing number|card (number|details)|CVV|credentials|NetID password|login details)\b/gi, neg: true },
  { sign: 'credentials_request', tier: 'strong', re: /\b(sent|texted|forwarded) (you )?(a |the |my |your )?(verification |security |login |6[- ]digit |one[- ]time )?code\b[^\n]{0,80}\b(by mistake|accident(ally)?|wrong number|send it|read it|share it|tell me|send (it )?back|what (it|the code) (is|says))\b/gi },
  { sign: 'credentials_request', tier: 'moderate', re: /\b(verify|confirm|validate|update|restore|re-?enter)\b (your )?(account|identity|login|payment (information|info|details|method)|billing (information|info|details)|password|card details)\b/gi, neg: true },
  { sign: 'credentials_request', tier: 'moderate', re: /\b(by )?(sign(ing)?|log(ging)?) ?in (below|here|now|at the link|using the link|via the link|through the link)\b/gi, neg: true },
  { sign: 'credentials_request', tier: 'moderate', re: /\b(log ?in|sign ?in|click|tap|visit|follow)\b[^.!?\n]{0,40}\b(to )?(verify|confirm|validate|restore|unlock|update|reactivate|re-?activate)\b[^.!?\n]{0,25}\b(your )?(account|identity|details|information|payment|address|status|mailbox|email)\b/gi, neg: true },
  { sign: 'credentials_request', tier: 'strong', re: /(验证码|密码|银行卡号|护照号|身份证号)/g, neg: true },

  // ---- pay to earn / advance fee
  { sign: 'pay_to_earn', tier: 'strong', re: /\b(redelivery|re-delivery|customs|clearance|processing|release|handling|shipping|activation|registration|training|unlock(ing)?|withdrawal|application|onboarding|equipment|starter kit)( fee| charge| deposit| payment)\b/gi, neg: true },
  { sign: 'pay_to_earn', tier: 'strong', re: /\b(pay|deposit|top up|recharge|send)\b[^.!?\n]{0,40}\b(to (unlock|withdraw|release|receive|claim|activate|continue|start|get paid)|before (you can )?(withdraw|start|receive|we (can )?(release|ship|deliver)))\b/gi, neg: true },
  { sign: 'pay_to_earn', tier: 'strong', re: /\b(earn|make)\b[^.!?\n]{0,15}\$\s?\d{2,4}(\s?-\s?\$?\d{2,4})?\s?(\/|per|a|each)\s?(day|hour|task|order)\b|\b(like|rate|review|optimi[sz]e) (videos|products|apps|hotels)\b[^.!?\n]{0,40}\b(commission|earn|paid)\b|\b(task|order) (bundle|set|combination)s?\b|\bcommission\b[^.!?\n]{0,30}\b(per|each) task\b/gi },
  { sign: 'pay_to_earn', tier: 'strong', re: /\b(deposit|cash)\b (the |this |a |our )?(check|cheque|it)\b[^\n]{0,80}\b(send|return|wire|transfer|forward|pay)\b[^.!?\n]{0,40}\b(remaining|rest|difference|balance|back|excess|vendor)\b/gi },
  { sign: 'pay_to_earn', tier: 'strong', re: /\b(deposit|invest(ment)?)\b[^.!?\n]{0,40}\b(withdraw|profits?|returns?|earnings)\b|\bguaranteed (returns?|profits?|income)\b/gi, neg: true },
  { sign: 'pay_to_earn', tier: 'strong', re: /\b(deposit|payment|pay)\b[^.!?\n]{0,50}\bbefore (you |we )?(can )?(see|view|tour|visit|meet)\b|\bto (hold|reserve|secure) the (apartment|room|unit|place|lease)\b/gi, neg: true },
  { sign: 'pay_to_earn', tier: 'strong', re: /(刷单|返利|佣金|手续费|解冻费|激活费)/g },

  // ---- move to another channel / call this number
  { sign: 'unsolicited_contact_switch', tier: 'moderate', re: /\b(WhatsApp|Telegram|Signal app|WeChat|Line app|Kakao(Talk)?)\b/gi, neg: true },
  { sign: 'unsolicited_contact_switch', tier: 'moderate', re: /\b(call|text|contact|reach|message|dial|ring)\b( us| me| our (agent|officer|department|team)| the (officer|agent|department))?( back)?( immediately| now| today)?( at| on)?:?\s*(\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\+\d[\d\s.-]{7,})/gi, neg: true, after: /^[^.!?\n]{0,10}$/ },
  { sign: 'unsolicited_contact_switch', tier: 'moderate', re: /\b(add me|add (our|my) (agent|manager|recruiter|mentor)|text me (on|at)|(my|our) personal (number|email))\b/gi },
  { sign: 'unsolicited_contact_switch', tier: 'moderate', re: /(加微信|加我|联系(以下)?(号码|电话)|拨打[^。]{0,6}\d)/g },

  // ---- generic greeting
  { sign: 'generic_greeting', tier: 'weak', re: /^\s*(dear|hello|hi|attention)[,:]?\s+(valued |dear )?(customer|user|client|member|account ?holder|student|sir\/madam|sir or madam|beneficiary|applicant)s?\b/gim },
];

// Phrases that make a "call this number" request legitimate: the number is one you already have.
export const SAFE_CALLBACK = /(on the back of your (card|debit card|credit card)|on our (official )?website|you (already )?(know|trust)|on your (statement|card)|listed (at|on) (our|the) official|from (the|our) official)/i;

/** Apply all rules to text. Returns [{sign, tier, start, end, text}] */
export function runTextRules(text) {
  const hits = [];
  for (const rule of RULES) {
    rule.re.lastIndex = 0;
    for (const m of text.matchAll(rule.re)) {
      const start = m.index, end = m.index + m[0].length;
      if (rule.neg) {
        const before = text.slice(Math.max(0, start - 60), start);
        const sentenceStart = Math.max(before.lastIndexOf('.'), before.lastIndexOf('!'), before.lastIndexOf('?'), before.lastIndexOf('\n'), before.lastIndexOf('。'));
        if (NEG_BEFORE.test(before.slice(sentenceStart + 1))) continue;
      }
      if (rule.sign === 'unsolicited_contact_switch') {
        const around = text.slice(Math.max(0, start - 80), end + 80);
        if (SAFE_CALLBACK.test(around)) continue;
      }
      hits.push({ sign: rule.sign, tier: rule.tier, start, end, text: m[0] });
    }
  }
  return hits;
}
