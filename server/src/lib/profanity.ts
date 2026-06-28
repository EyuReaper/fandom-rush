const BLOCKED = new Set([
  "anal", "anus", "arse", "ass", "asshole",
  "bastard", "bitch", "bloody", "blowjob", "bollocks",
  "boner", "bullshit", "buttplug",
  "clit", "cock", "coon", "crap", "cunt",
  "damn", "dick", "dildo", "douche",
  "fag", "faggot", "fart", "fuck", "fucking",
  "goddamn", "goddamnit",
  "hell", "homo",
  "jackass", "jerk", "jizz",
  "kike", "knob",
  "labia", "licker",
  "masturbate", "motherfucker",
  "nazi", "nigga", "nigger",
  "orgasm",
  "pajeet", "paki", "pecker", "penis", "piss", "prick", "pube", "pussy",
  "queef", "queer",
  "rapist", "retard", "rimjob",
  "scrotum", "sex", "shit", "shlong", "slut",
  "smegma", "spunk", "suck",
  "testicle", "tit", "tits", "titty", "twat",
  "vagina",
  "wank", "whore",
]);

const BLOCKED_REGEX = new RegExp(`\\b(${[...BLOCKED].join("|")})\\b`, "i");

export function containsProfanity(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/@/g, "a")
    .replace(/\$/g, "s");

  return BLOCKED_REGEX.test(normalized);
}
