# Second Read — demo transcript

On-screen captions of `demo/demo.mp4` (no voice-over). Recorded with Playwright from the app; all messages are synthetic. Length 2:53.

- **0:00** Second Read: a private second opinion on a suspicious message, before you click, pay or reply.
- **0:06** Lin is an F-1 student (a fictional example). A caller says he is from USCIS and that her SEVIS record will be terminated today.
- **0:13** He says there is a warrant for her arrest, that she must pay a $950 fee in Target gift cards, and that she must not tell her school.
- **0:20** The FBI and the FTC warn about exactly this script. Under pressure, people often pay first and check later.
- **0:27** Lin pastes the voicemail transcript into Second Read and presses “Check message”.
- **0:31** Result: “Several strong warning signs”. Second Read never calls a message safe. It says how closely it matches public scam warnings.
- **0:39** Each warning sign is highlighted in the message itself and numbered. Strength is shown by colour and by line style, not colour alone.
- **0:47** Every sign is explained in plain language, with links to the FTC, FBI, USCIS or university guidance it comes from.
- **0:56** The safer outcome: instead of buying gift cards, Lin hangs up and calls her international student office, using the number on her school’s website.
- **1:05** If someone has already paid, or shared a code or password, there are concrete recovery steps for each payment type.
- **1:14** Links are taken apart as text. Second Read never opens them, and it never makes them clickable.
- **1:20** This “apple.com” is not Apple: its first letter is a Cyrillic “а”. Second Read decodes the punycode and highlights the impostor letter.
- **1:30** The “real website” is the part someone had to register. usps-parcel-care.top is not USPS, whatever the text says.
- **1:38** A real two-step code you asked for gets “No known warning signs found”, plus a reminder that this does not mean it is safe.
- **1:46** It also knows a small set of Chinese phrases used in fake “Chinese police” calls, which the FBI says target Chinese students.
- **1:53** Nothing leaves the device. The page’s security policy forbids sending data (connect-src 'none'). Nothing is stored, and it works offline.
- **2:02** Automated tests paste a marker, run a check, and confirm zero network requests, and that the browser blocks any attempt to send data.
- **2:10** Evidence: on 60 synthetic messages the rules had never seen, it flagged 22 of 30 scams and wrongly flagged 4 of 30 real ones.
- **2:19** After fixing what that test showed, the current rules flag 28/30 and 2/30 on that set, but that is no longer an independent test.
- **2:28** Limits: rules miss new tricks, cannot verify a sender, cannot see images or calls, and can be fooled by messages that quote scam wording.
- **2:37** It is a checking aid, not a guarantee and not an emergency service. If you are in danger, call 911.
- **2:45** Second Read · built during SafeSpace Hacks 2026 · bowen1314.github.io/second-read · source: github.com/Bowen1314/second-read
