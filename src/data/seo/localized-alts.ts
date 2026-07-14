import type { AppLocale } from "@/i18n/routing";

type LocaleAlt = Record<AppLocale, string>;

const SHARED: LocaleAlt = {
  en: "Abdulrahman Al Bastaki (Uncle Tim) — Bahrain equestrian heritage and endurance riding archive photograph",
  ar: "عبدالرحمن البستكي (العم تيم) — صورة أرشيفية من إرث الفروسية البحرينية ورياضة القدرة",
  fr: "Abdulrahman Al Bastaki (Oncle Tim) — photographie d’archives du patrimoine équestre et de l’endurance à Bahreïn",
};

/** Keyword-rich multilingual alt text for Moments Preserved gallery cards. */
export const galleryImageAlts: Record<string, LocaleAlt> = {
  "gal-01": {
    en: "Abdulrahman Al Bastaki Uncle Tim — early Bahrain endurance equestrian archive",
    ar: "عبدالرحمن البستكي العم تيم — أرشيف مبكر لرياضة القدرة والفروسية البحرينية",
    fr: "Abdulrahman Al Bastaki Oncle Tim — archives précoces de l’endurance équestre à Bahreïn",
  },
  "gal-02": {
    en: "Uncle Tim Bahrain — historic horsemanship moment from Bahraini equestrian heritage",
    ar: "العم تيم البحرين — لحظة تاريخية من تاريخ الفروسية البحرينية",
    fr: "Oncle Tim Bahreïn — moment historique du patrimoine équestre bahreïnien",
  },
  "gal-03": {
    en: "Abdulrahman Albastaki — Arabian horse and Bahrain Royal Endurance Team archive",
    ar: "عبدالرحمن البستكي — أرشيف الخيل العربية وفريق البحرين الملكي لسباقات القدرة",
    fr: "Abdulrahman Albastaki — archives des chevaux arabes et de l’équipe royale d’endurance",
  },
  "gal-04": {
    en: "Royal Endurance Team Bahrain — Abdulrahman Al Bastaki with royal equestrian figures",
    ar: "فريق البحرين الملكي لسباقات القدرة — عبدالرحمن البستكي مع رموز الفروسية الملكية",
    fr: "Équipe royale d’endurance de Bahreïn — Abdulrahman Al Bastaki et figures équestres royales",
  },
  "gal-05": {
    en: "Bahrain Equestrian Heritage — ceremonial archive with Uncle Tim",
    ar: "إرث الفروسية البحرينية — أرشيف احتفالي مع العم تيم",
    fr: "Patrimoine équestre de Bahreïn — archives cérémonielles avec Oncle Tim",
  },
  "gal-06": {
    en: "Bahraini Horse Trainer Abdulrahman Al Bastaki — training and grooming archive",
    ar: "مدرب الخيل البحريني عبدالرحمن البستكي — أرشيف التدريب والرعاية",
    fr: "Entraîneur bahreïnien Abdulrahman Al Bastaki — archives d’entraînement et de soin",
  },
  "gal-07": {
    en: "Bahrain Endurance Riding — Uncle Tim with Arabian horses in training",
    ar: "رياضة القدرة البحرين — العم تيم مع الخيل العربية في التدريب",
    fr: "Endurance équestre Bahreïn — Oncle Tim avec des chevaux arabes à l’entraînement",
  },
  "gal-08": {
    en: "Championship archive — Abdulrahman Al-Bastaki Bahrain endurance victory moment",
    ar: "أرشيف البطولات — لحظة إنجاز لعبدالرحمن البستكي في رياضة القدرة",
    fr: "Archives de championnat — moment de victoire d’Abdulrahman Al-Bastaki en endurance",
  },
  "gal-09": {
    en: "Bahrain Royal Endurance Team — competitive horsemanship archive photograph",
    ar: "فريق البحرين الملكي لسباقات القدرة — صورة أرشيفية من المنافسات الفروسية",
    fr: "Équipe royale d’endurance — photographie d’archives de compétition équestre",
  },
  "gal-10": {
    en: "Abdulrahman Al Bastaki personal archive — early years of Bahraini horsemanship",
    ar: "أرشيف شخصي لعبدالرحمن البستكي — السنوات الأولى في الفروسية البحرينية",
    fr: "Archives personnelles d’Abdulrahman Al Bastaki — premières années de l’équitation bahreïnie",
  },
};

for (let i = 11; i <= 45; i += 1) {
  const id = `gal-${String(i).padStart(2, "0")}`;
  if (!galleryImageAlts[id]) {
    galleryImageAlts[id] = {
      en: `${SHARED.en} (${i})`,
      ar: `${SHARED.ar} (${i})`,
      fr: `${SHARED.fr} (${i})`,
    };
  }
}

export function getGalleryImageAlt(
  id: string,
  locale: string,
  fallback?: string,
): string {
  const entry = galleryImageAlts[id];
  if (!entry) return fallback ?? SHARED.en;
  if (locale === "ar" || locale === "fr" || locale === "en") {
    return entry[locale];
  }
  return entry.en;
}

export const newspaperImageAlts: Record<string, LocaleAlt> = {
  "news-01": {
    en: "Press cover — Abdulrahman Al Bastaki Uncle Tim Bahrain equestrian media archive",
    ar: "غلاف صحفي — أرشيف إعلامي لعبدالرحمن البستكي العم تيم وإرث الفروسية البحرينية",
    fr: "Couverture de presse — archives médiatiques d’Abdulrahman Al Bastaki Oncle Tim",
  },
  "news-02": {
    en: "Magazine feature — Bahrain Endurance Riding and Abdulrahman Albastaki",
    ar: "تغطية مجلة — رياضة القدرة البحرين وعبدالرحمن البستكي",
    fr: "Reportage magazine — endurance équestre de Bahreïn et Abdulrahman Albastaki",
  },
  "news-03": {
    en: "Interview archive — Bahraini Horse Trainer Uncle Tim in the press",
    ar: "أرشيف مقابلة — مدرب الخيل البحريني العم تيم في الصحافة",
    fr: "Archives d’interview — entraîneur bahreïnien Oncle Tim dans la presse",
  },
  "news-04": {
    en: "Event report — Royal Endurance Team Bahrain press clipping",
    ar: "تقرير فعالية — قصاصة صحفية عن فريق البحرين الملكي لسباقات القدرة",
    fr: "Compte rendu — coupure de presse de l’équipe royale d’endurance de Bahreïn",
  },
  "news-05": {
    en: "French press — Patrimoine Équestre de Bahreïn featuring Uncle Tim",
    ar: "صحافة فرنسية — إرث الفروسية البحرينية مع العم تيم",
    fr: "Presse francophone — Patrimoine Équestre de Bahreïn avec Oncle Tim",
  },
  "news-06": {
    en: "Gulf newspaper — Abdulrahman Al Bastaki career retrospective",
    ar: "صحيفة خليجية — محطات مسيرة عبدالرحمن البستكي",
    fr: "Journal du Golfe — rétrospective de la carrière d’Abdulrahman Al Bastaki",
  },
  "news-07": {
    en: "Arabic report — تاريخ الفروسية البحرين and endurance championships",
    ar: "تقرير عربي — تاريخ الفروسية البحرين وبطولات القدرة",
    fr: "Reportage arabe — histoire équestre de Bahreïn et championnats d’endurance",
  },
  "news-08": {
    en: "Legacy interview — Uncle Tim Bahrain equestrian heritage in media",
    ar: "مقابلة عن الإرث — العم تيم وإرث الفروسية البحرينية في الإعلام",
    fr: "Interview patrimoine — Oncle Tim et l’héritage équestre bahreïnien",
  },
  "news-09": {
    en: "Championship coverage — Bahrain Endurance Riding media archive",
    ar: "تغطية بطولة — أرشيف إعلامي لرياضة القدرة البحرين",
    fr: "Couverture de championnat — archives médias de l’endurance à Bahreïn",
  },
  "news-10": {
    en: "Spotlight feature — Musée Équestre Numérique of Abdulrahman Al Bastaki",
    ar: "تغطية خاصة — المتحف الرقمي لإرث عبدالرحمن البستكي",
    fr: "Portrait média — musée équestre numérique d’Abdulrahman Al Bastaki",
  },
};

export function getNewspaperImageAlt(
  id: string,
  locale: string,
  fallback?: string,
): string {
  const entry = newspaperImageAlts[id];
  if (!entry) {
    return (
      fallback ??
      "Press archive — Abdulrahman Al Bastaki Uncle Tim | Bahrain Equestrian Heritage"
    );
  }
  if (locale === "ar" || locale === "fr" || locale === "en") {
    return entry[locale];
  }
  return entry.en;
}
