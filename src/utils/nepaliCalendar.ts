/**
 * Bikram Sambat (B.S.) Nepali Calendar & Time Utilities
 * Accurate algorithmic mapping for modern Nepali years (2080 - 2085 BS)
 * Includes Nepal Standard Time (NPT = GMT +5:45), Nepali numerals, and major festivals.
 */

export interface NepaliDateInfo {
  yearBs: number;
  monthBs: number; // 1-12 (1 = Baisakh)
  dayBs: number;   // 1-32
  monthNameNp: string;
  monthNameEn: string;
  dayNameNp: string;
  dayNameEn: string;
  dayOfWeek: number; // 0 = Sunday
  dateFormattedNp: string;
  dateFormattedEn: string;
  tithiNp: string;
  rituNp: string; // Season
  nptTimeString: string;
  isSaturday: boolean;
  holidayName?: string;
}

// Nepali Months
export const NEPALI_MONTHS = [
  { np: 'बैशाख', en: 'Baisakh' },
  { np: 'जेठ', en: 'Jestha' },
  { np: 'असार', en: 'Ashadh' },
  { np: 'साउन', en: 'Shrawan' },
  { np: 'भदौ', en: 'Bhadra' },
  { np: 'असोज', en: 'Ashwin' },
  { np: 'कात्तिक', en: 'Kartik' },
  { np: 'मंसिर', en: 'Mangsir' },
  { np: 'पुस', en: 'Poush' },
  { np: 'माघ', en: 'Magh' },
  { np: 'फागुन', en: 'Falgun' },
  { np: 'चैत', en: 'Chaitra' }
];

// Nepali Days of the Week
export const NEPALI_DAYS = [
  { np: 'आइतबार', shortNp: 'आइत', en: 'Sunday', shortEn: 'Sun' },
  { np: 'सोमबार', shortNp: 'सोम', en: 'Monday', shortEn: 'Mon' },
  { np: 'मंगलबार', shortNp: 'मंगल', en: 'Tuesday', shortEn: 'Tue' },
  { np: 'बुधबार', shortNp: 'बुध', en: 'Wednesday', shortEn: 'Wed' },
  { np: 'बिहीबार', shortNp: 'बिही', en: 'Thursday', shortEn: 'Thu' },
  { np: 'शुक्रबार', shortNp: 'शुक्र', en: 'Friday', shortEn: 'Fri' },
  { np: 'शनिबार', shortNp: 'शनि', en: 'Saturday', shortEn: 'Sat' }
];

// Major Nepali Festivals & Public Holidays for BS 2081/2082/2083
export const NEPALI_HOLIDAYS: Record<string, string> = {
  '1-1': 'नयाँ वर्ष (बैशाख १)',
  '1-11': 'लोकतन्त्र दिवस',
  '1-18': 'अन्तर्राष्ट्रिय मजदुर दिवस',
  '2-9': 'बुद्ध जयन्ती / उभौली पर्व',
  '2-15': 'गणतन्त्र दिवस',
  '5-3': 'गाईजात्रा (उपत्यका)',
  '5-11': 'श्रीकृष्ण जन्माष्टमी',
  '5-21': 'हरितालिका तीज',
  '6-3': 'संविधान दिवस',
  '6-26': 'घटस्थापना (बडादशैं प्रारम्भ)',
  '7-2': 'दशैं (फूलपाती)',
  '7-3': 'महाअष्टमी',
  '7-4': 'महानवमी',
  '7-5': 'विजयादशमी (टीका)',
  '7-6': 'दशैं एकादशी',
  '7-15': 'लक्ष्मीपूजा (तिहार)',
  '7-17': 'गोवर्द्धन पूजा / म्ह पूजा',
  '7-18': 'भाइटीका',
  '7-23': 'छठ पर्व',
  '9-10': 'क्रिसमस डे',
  '9-15': 'तमु ल्होसार',
  '9-27': 'पृथ्वी जयन्ती / राष्ट्रिय एकता दिवस',
  '10-1': 'माघे संक्रान्ति',
  '10-16': 'सहिद दिवस',
  '10-29': 'सोनाम ल्होसार',
  '11-7': 'प्रजातन्त्र दिवस',
  '11-14': 'महाशिवरात्रि',
  '11-24': 'अन्तर्राष्ट्रिय महिला दिवस',
  '11-29': 'फागु पूर्णिमा (होली - पहाड)',
  '12-1': 'फागु पूर्णिमा (होली - तराई)',
  '12-24': 'घोडे जात्रा (काठमाडौं)'
};

// Days in each Nepali Month for years 2080-2085 BS
const BS_MONTH_DAYS: Record<number, number[]> = {
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2083: [31, 31, 32, 31, 32, 30, 30, 30, 29, 30, 29, 31],
  2084: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]
};

// Reference point: 2081 Baisakh 1 = April 13, 2024
const REF_BS_YEAR = 2081;
const REF_BS_MONTH = 1;
const REF_BS_DAY = 1;
const REF_AD_DATE = new Date(Date.UTC(2024, 3, 13)); // 2024-04-13 UTC

/**
 * Convert an English number to Nepali Unicode digits (e.g. 2082 -> २०८२)
 */
export function toNepaliDigits(num: number | string): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(num).replace(/[0-9]/g, (digit) => nepaliDigits[parseInt(digit, 10)]);
}

/**
 * Convert standard Date to Nepal Standard Time (NPT: UTC+5:45)
 */
export function getNowNPT(): Date {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const nptOffsetMs = (5 * 60 + 45) * 60000; // +5:45
  return new Date(utcMs + nptOffsetMs);
}

/**
 * Convert Gregorian date to Bikram Sambat (B.S.) date
 */
export function getNepaliDate(date: Date = getNowNPT()): NepaliDateInfo {
  const nptDate = new Date(date);
  
  // Calculate difference in whole days from reference (2081 Baisakh 1)
  const utcTarget = Date.UTC(nptDate.getFullYear(), nptDate.getMonth(), nptDate.getDate());
  const utcRef = REF_AD_DATE.getTime();
  let diffDays = Math.floor((utcTarget - utcRef) / (1000 * 60 * 60 * 24));

  let bsYear = REF_BS_YEAR;
  let bsMonth = REF_BS_MONTH;
  let bsDay = REF_BS_DAY;

  if (diffDays >= 0) {
    while (diffDays > 0) {
      const monthDays = BS_MONTH_DAYS[bsYear]?.[bsMonth - 1] ?? 30;
      const daysLeftInMonth = monthDays - bsDay + 1;
      if (diffDays >= daysLeftInMonth) {
        diffDays -= daysLeftInMonth;
        bsDay = 1;
        bsMonth += 1;
        if (bsMonth > 12) {
          bsMonth = 1;
          bsYear += 1;
        }
      } else {
        bsDay += diffDays;
        diffDays = 0;
      }
    }
  } else {
    while (diffDays < 0) {
      if (bsDay > 1) {
        const canSubtract = bsDay - 1;
        if (Math.abs(diffDays) <= canSubtract) {
          bsDay += diffDays;
          diffDays = 0;
        } else {
          diffDays += canSubtract;
          bsDay = 1;
        }
      } else {
        bsMonth -= 1;
        if (bsMonth < 1) {
          bsMonth = 12;
          bsYear -= 1;
        }
        const prevMonthDays = BS_MONTH_DAYS[bsYear]?.[bsMonth - 1] ?? 30;
        bsDay = prevMonthDays;
        diffDays += 1;
      }
    }
  }

  const monthObj = NEPALI_MONTHS[bsMonth - 1] || NEPALI_MONTHS[0];
  const dayOfWeek = nptDate.getDay();
  const dayObj = NEPALI_DAYS[dayOfWeek];

  // Ritu (Season) mapping
  const ritus = ['वसन्त (Spring)', 'वसन्त (Spring)', 'ग्रीष्म (Summer)', 'ग्रीष्म (Summer)', 'वर्षा (Monsoon)', 'वर्षा (Monsoon)', 'शरद (Autumn)', 'शरद (Autumn)', 'हेमन्त (Pre-Winter)', 'हेमन्त (Pre-Winter)', 'शिशिर (Winter)', 'शिशिर (Winter)'];
  const rituNp = ritus[bsMonth - 1] || 'वसन्त';

  // Approximate Tithi calculation
  const tithis = [
    'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पञ्चमी',
    'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
    'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा / औंसी'
  ];
  const tithiIndex = (bsDay - 1) % 15;
  const tithiNp = tithis[tithiIndex] || 'शुक्ल पक्ष';

  // Holiday check
  const holidayKey = `${bsMonth}-${bsDay}`;
  const holidayName = NEPALI_HOLIDAYS[holidayKey];

  // Formatted strings
  const dateFormattedNp = `${toNepaliDigits(bsYear)} ${monthObj.np} ${toNepaliDigits(bsDay)}, ${dayObj.np}`;
  const dateFormattedEn = `${monthObj.en} ${bsDay}, ${bsYear} BS (${dayObj.en})`;

  // Time string in NPT
  const hours = nptDate.getHours();
  const minutes = nptDate.getMinutes();
  const ampm = hours >= 12 ? 'अपराह्न' : 'पूर्वाह्न';
  const displayHours = hours % 12 || 12;
  const nptTimeString = `${ampm} ${toNepaliDigits(displayHours)}:${toNepaliDigits(minutes < 10 ? '0' + minutes : minutes)}`;

  return {
    yearBs: bsYear,
    monthBs: bsMonth,
    dayBs: bsDay,
    monthNameNp: monthObj.np,
    monthNameEn: monthObj.en,
    dayNameNp: dayObj.np,
    dayNameEn: dayObj.en,
    dayOfWeek,
    dateFormattedNp,
    dateFormattedEn,
    tithiNp,
    rituNp,
    nptTimeString,
    isSaturday: dayOfWeek === 6,
    holidayName
  };
}

/**
 * Returns days in a given Nepali month
 */
export function getDaysInNepaliMonth(year: number, month: number): number {
  return BS_MONTH_DAYS[year]?.[month - 1] ?? 30;
}
