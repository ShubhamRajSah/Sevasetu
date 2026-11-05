/**
 * SevaSetu - Citizen Scheme Awareness Portal
 * src/data/schemes.ts
 * EPCET Community Project: Government Scheme Awareness for Betterment of Livelihood
 */

export interface SchemeEligibilityCriteria {
  min_age: number | null;
  max_age: number | null;
  gender: 'All' | 'Female' | 'Male';
  max_annual_income: number | null;
  occupations: string[];
  caste_categories: string[];
  land_holding_max_acres: number | null;
}

export interface Scheme {
  id: string;
  name: string;
  name_kannada: string;
  name_hindi: string;
  category: 'Agriculture' | 'Women' | 'Youth' | 'Artisan' | 'Credit' | 'Healthcare';
  ministry: string;
  isKarnatakaState: boolean;
  brief_description: {
    en: string;
    kn: string;
    hi: string;
  };
  benefits: string;
  benefits_kannada?: string;
  benefits_hindi?: string;
  eligibility_criteria: SchemeEligibilityCriteria;
  required_documents: string[];
  official_portal_url: string;
}

export const SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    name_kannada: "ಪಿಎಂ-ಕಿಸಾನ್ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ)",
    name_hindi: "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
    category: "Agriculture",
    ministry: "Ministry of Agriculture and Farmers Welfare (Central)",
    isKarnatakaState: false,
    brief_description: {
      en: "Direct income support of ₹6,000 per year in three equal installments of ₹2,000 to all landholding farmer families across India, transferred directly to Aadhaar-linked bank accounts.",
      kn: "ಭಾರತದ ಎಲ್ಲಾ ಜಮೀನು ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ಆರ್ಥಿಕ ನೆರವು (ತಲಾ ₹2,000 ರ ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ) ನೇರವಾಗಿ ಆಧಾರ್ ಜೋಡಿತ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ.",
      hi: "देश के सभी भूमिधारक किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता (₹2,000 की तीन समान किस्तों में) सीधे उनके आधार से जुड़े बैंक खातों में दी जाती है।"
    },
    benefits: "₹6,000 per annum paid in 3 quarterly installments of ₹2,000 directly via Direct Benefit Transfer (DBT).",
    benefits_kannada: "ಪ್ರತಿ ವರ್ಷ ₹6,000 ನಗದು ನೆರವು (ತಲಾ ₹2,000 ರಂತೆ 3 ಕಂತುಗಳಲ್ಲಿ) ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಮೂಲಕ.",
    benefits_hindi: "प्रति वर्ष ₹6,000 की राशि डीबीटी के माध्यम से ₹2,000 की 3 समान किस्तों में सीधे बैंक खाते में।",
    eligibility_criteria: {
      min_age: 18,
      max_age: null,
      gender: "All",
      max_annual_income: null,
      occupations: ["Farmer"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card",
      "Land Ownership Records / RTC (Pahani) / Land Registry Copy",
      "Active Bank Account Passbook (Aadhaar Seeded & NPCI mapped)",
      "Mobile Number linked to Aadhaar"
    ],
    official_portal_url: "https://pmkisan.gov.in"
  },
  {
    id: "gruha-lakshmi",
    name: "Gruha Lakshmi Scheme",
    name_kannada: "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ (ಕರ್ನಾಟಕ)",
    name_hindi: "गृह लक्ष्मी योजना (कर्नाटक)",
    category: "Women",
    ministry: "Department of Women and Child Development (Government of Karnataka)",
    isKarnatakaState: true,
    brief_description: {
      en: "Financial assistance of ₹2,000 per month given to the woman head of every eligible household in Karnataka (identified as head in Antyodaya/BPL/APL ration cards) to empower homemakers and alleviate household expenses.",
      kn: "ಕರ್ನಾಟಕದ ಅಂತ್ಯೋದಯ, ಬಿಪಿಎಲ್ ಮತ್ತು ಎಪಿಎಲ್ ಪಡಿತರ ಚೀಟಿಗಳಲ್ಲಿ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥೆ ಎಂದು ಗುರುತಿಸಲ್ಪಟ್ಟ ಮಹಿಳೆಗೆ ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ಆರ್ಥಿಕ ನೆರವನ್ನು ಒದಗಿಸುವ ಜನಪ್ರಿಯ ಗ್ಯಾರಂಟಿ ಯೋಜನೆ.",
      hi: "कर्नाटक के अंत्योदय, बीपीएल और एपीएल राशन कार्ड में परिवार की महिला मुखिया के रूप में नामित पात्र महिलाओं को प्रति माह ₹2,000 की सीधी वित्तीय सहायता प्रदान की जाती है।"
    },
    benefits: "₹2,000 per month transferred directly to the designated female head of the family's bank account.",
    benefits_kannada: "ಪ್ರತಿ ತಿಂಗಳು ₹2,000 ಮಹಿಳಾ ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥೆಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ವರ್ಗಾವಣೆ.",
    benefits_hindi: "परिवार की महिला मुखिया के बैंक खाते में प्रति माह ₹2,000 का प्रत्यक्ष अंतरण।",
    eligibility_criteria: {
      min_age: 18,
      max_age: null,
      gender: "Female",
      max_annual_income: null,
      occupations: ["All", "Farmer", "Daily-wage", "Street Vendor", "Artisan", "Unemployed", "Other"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card of Woman Head",
      "Aadhaar Card of Husband",
      "Ration Card (Antyodaya / BPL / APL) mentioning woman as head",
      "Aadhaar-linked Bank Passbook / Account details",
      "Mobile Number registered with Aadhaar"
    ],
    official_portal_url: "https://sevasindhugs.karnataka.gov.in"
  },
  {
    id: "yuva-nidhi",
    name: "Yuva Nidhi Scheme",
    name_kannada: "ಯುವ ನಿಧಿ ಯೋಜನೆ (ಕರ್ನಾಟಕ)",
    name_hindi: "युवा निधि योजना (कर्नाटक)",
    category: "Youth",
    ministry: "Department of Skill Development, Entrepreneurship and Livelihood (Government of Karnataka)",
    isKarnatakaState: true,
    brief_description: {
      en: "Unemployment monthly allowance of ₹3,000 for degree holders and ₹1,500 for diploma holders who graduated in Karnataka and remained unemployed after 6 months from degree completion, valid for up to 2 years.",
      kn: "ಕರ್ನಾಟಕದಲ್ಲಿ ವ್ಯಾಸಂಗ ಪೂರ್ಣಗೊಳಿಸಿ 6 ತಿಂಗಳು ಕಳೆದರೂ ಉದ್ಯೋಗ ಸಿಗದ ಪದವೀಧರರಿಗೆ ಮಾಸಿಕ ₹3,000 ಹಾಗೂ ಡಿಪ್ಲೊಮಾ ಪೂರ್ಣಗೊಳಿಸಿದ ನಿರುದ್ಯೋಗಿಗಳಿಗೆ ಮಾಸಿಕ ₹1,500 ನೆರವು (ಗರಿಷ್ಠ 2 ವರ್ಷಗಳವರೆಗೆ).",
      hi: "कर्नाटक से स्नातक उत्तीर्ण बेरोजगार युवाओं को ₹3,000 प्रति माह तथा डिप्लोमा धारकों को ₹1,500 प्रति माह का बेरोजगारी भत्ता (अधिकतम 2 वर्ष की अवधि तक) प्रदान किया जाता है।"
    },
    benefits: "₹3,000/month for Unemployed Graduates; ₹1,500/month for Unemployed Diploma Holders for a maximum period of 24 months or until employment.",
    benefits_kannada: "ನಿರುದ್ಯೋಗಿ ಪದವೀಧರರಿಗೆ ಮಾಸಿಕ ₹3,000; ಡಿಪ್ಲೊಮಾದಾರರಿಗೆ ಮಾಸಿಕ ₹1,500 (ಗರಿಷ್ಠ 24 ತಿಂಗಳು ಅಥವಾ ಉದ್ಯೋಗ ಸಿಗುವವರೆಗೆ).",
    benefits_hindi: "बेरोजगार स्नातकों को ₹3,000/माह; डिप्लोमा धारकों को ₹1,500/माह (अधिकतम 2 वर्ष की अवधि तक)।",
    eligibility_criteria: {
      min_age: 18,
      max_age: 35,
      gender: "All",
      max_annual_income: null,
      occupations: ["Unemployed", "Student"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card",
      "Degree or Diploma Completion Certificate / Marks Cards",
      "Karnataka Domicile Certificate / Study Certificate (minimum 6 years schooling in Karnataka)",
      "Self-declaration of Unemployment",
      "Aadhaar-seeded Bank Account Passbook"
    ],
    official_portal_url: "https://sevasindhugs.karnataka.gov.in"
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi)",
    name_kannada: "ಪಿಎಂ ಸ್ವನಿಧಿ (ಬೀದಿ ವ್ಯಾಪಾರಿಗಳ ಆತ್ಮನಿರ್ಭರ ನಿಧಿ)",
    name_hindi: "पीएम स्वनिधि (प्रधानमंत्री स्ट्रीट वेंडर्स आत्मनिर्भर निधि)",
    category: "Credit",
    ministry: "Ministry of Housing and Urban Affairs (Central)",
    isKarnatakaState: false,
    brief_description: {
      en: "Micro-credit collateral-free working capital facility for urban and peri-urban street vendors starting with ₹10,000 initial loan, with step-up facilities to ₹20,000 and ₹50,000 upon timely repayment, along with 7% interest subsidy and digital cashbacks.",
      kn: "ನಗರ ಹಾಗೂ ಅರೆ-ನಗರ ಪ್ರದೇಶದ ಬೀದಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ₹10,000 ಆರಂಭಿಕ ಬಡ್ಡಿ ರಹಿತ/ಸಹಾಯಧನ ಸಾಲ, ಸಕಾಲಿಕ ಮರುಪಾವತಿಯಲ್ಲಿ ₹20,000 ಮತ್ತು ₹50,000 ವರೆಗೆ ಸಾಲ ವಿಸ್ತರಣೆ ಮತ್ತು ವಾರ್ಷಿಕ 7% ಬಡ್ಡಿ ಸಹಾಯಧನ.",
      hi: "शहरी एवं अर्ध-शहरी स्ट्रीट वेंडरों को अपने आजीविका व्यवसाय हेतु ₹10,000 का प्रारंभिक संपार्श्विक-मुक्त ऋण, समय पर भुगतान करने पर ₹20,000 व ₹50,000 का ऋण और 7% ब्याज सब्सिडी।"
    },
    benefits: "Collateral-free working capital loan of ₹10,000 (1st tranche), ₹20,000 (2nd tranche), and ₹50,000 (3rd tranche) with 7% interest subsidy and up to ₹1,200 annual digital cashback.",
    benefits_kannada: "ಜಾಮೀನು ರಹಿತ ದುಡಿಯುವ ಬಂಡವಾಳ ಸಾಲ ₹10,000, ₹20,000, ಮತ್ತು ₹50,000, ಶೇ. 7 ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಸಹಿತ.",
    benefits_hindi: "₹10,000, ₹20,000 और ₹50,000 का संपार्श्विक-मुक्त कार्यशील पूंजी ऋण, 7% ब्याज सब्सिडी और डिजिटल कैशबैक।",
    eligibility_criteria: {
      min_age: 18,
      max_age: 65,
      gender: "All",
      max_annual_income: null,
      occupations: ["Street Vendor"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card",
      "Vending Certificate / Urban Local Body (ULB) Identity Card or Letter of Recommendation (LoR)",
      "Bank Account Details / Passbook",
      "Active Mobile Number"
    ],
    official_portal_url: "https://pmsvanidhi.mohua.gov.in"
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Yojana",
    name_kannada: "ಪಿಎಂ ವಿಶ್ವಕರ್ಮ ಯೋಜನೆ",
    name_hindi: "पीएम विश्वकर्मा योजना",
    category: "Artisan",
    ministry: "Ministry of Micro, Small and Medium Enterprises (Central)",
    isKarnatakaState: false,
    brief_description: {
      en: "End-to-end support for traditional artisans and craftspeople across 18 designated trades including recognition via PM Vishwakarma Certificate & ID, skill training with ₹500/day stipend, ₹15,000 toolkit incentive, and collateral-free enterprise credit up to ₹3,00,000 at concessional 5% interest.",
      kn: "18 ಸಾಂಪ್ರದಾಯಿಕ ಕಸುಬುದಾರರು ಮತ್ತು ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ವಿಶ್ವಕರ್ಮ ಪ್ರಮಾಣಪತ್ರ, ಉಚಿತ ತರಬೇತಿ ಹಾಗೂ ದಿನಕ್ಕೆ ₹500 ಭತ್ಯೆ, ₹15,000 ಟೂಲ್‌ಕಿಟ್ ಅನುದಾನ ಮತ್ತು ರಿಯಾಯಿತಿ ಬಡ್ಡಿದರದಲ್ಲಿ (5%) ₹3 ಲಕ್ಷದವರೆಗೆ ಸಾಲ ಸೌಲಭ್ಯ.",
      hi: "18 पारंपरिक व्यवसायों में कार्यरत कारीगरों और शिल्पकारों को पहचान पत्र, ₹500/दिन वजीफे के साथ कौशल प्रशिक्षण, ₹15,000 का टूलकिट अनुदान और 5% रियायती ब्याज पर ₹3,00,000 तक का संपार्श्विक-मुक्त ऋण।"
    },
    benefits: "PM Vishwakarma Certificate & ID card, ₹15,000 modern toolkit e-voucher, skill upgradation with ₹500/day stipend, and collateral-free enterprise credit (₹1 Lakh in Tranche 1, ₹2 Lakh in Tranche 2) at 5% interest rate.",
    benefits_kannada: "ವಿಶ್ವಕರ್ಮ ಪ್ರಮಾಣಪತ್ರ, ₹15,000 ಟೂಲ್‌ಕಿಟ್ ಅನುದಾನ, ದಿನಕ್ಕೆ ₹500 ಸ್ಟೈಫಂಡ್‌ನೊಂದಿಗೆ ತರಬೇತಿ ಹಾಗೂ 5% ಬಡ್ಡಿಯಲ್ಲಿ ₹3,00,000 ವರೆಗೆ ಸಾಲ.",
    benefits_hindi: "विश्वकर्मा प्रमाण पत्र, ₹15,000 टूलकिट अनुदान, ₹500/दिन वजीफे सहित प्रशिक्षण और 5% ब्याज पर ₹3 लाख तक का ऋण।",
    eligibility_criteria: {
      min_age: 18,
      max_age: null,
      gender: "All",
      max_annual_income: null,
      occupations: ["Artisan"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card",
      "Active Mobile Number (Aadhaar linked)",
      "Bank Account Passbook / Account details",
      "Ration Card / Family details",
      "Proof of engagement in one of the 18 traditional family trades"
    ],
    official_portal_url: "https://pmvishwakarma.gov.in"
  },
  {
    id: "ayushman-bharat-pmjay",
    name: "Ayushman Bharat - PMJAY (Pradhan Mantri Jan Arogya Yojana)",
    name_kannada: "ಆಯುಷ್ಮಾನ್ ಭಾರತ - ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನ ಆರೋಗ್ಯ ಯೋಜನೆ (ಆರೋಗ್ಯ ಕರ್ನಾಟಕ)",
    name_hindi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (पीएम-जेएवाई)",
    category: "Healthcare",
    ministry: "National Health Authority, Ministry of Health and Family Welfare (Central / Karnataka)",
    isKarnatakaState: false,
    brief_description: {
      en: "Flagship public health assurance scheme providing cashless hospitalisation cover of up to ₹5,00,000 per family per year for secondary and tertiary healthcare across empaneled public and private hospitals across India.",
      kn: "ಪ್ರತಿ ಅರ್ಹ ಬಡ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ₹5,00,000 ವರೆಗೆ ಉಚಿತ ಹಾಗೂ ನಗದು ರಹಿತ ಚಿಕಿತ್ಸಾ ವೆಚ್ಚ ಒದಗಿಸುವ ವಿಶ್ವದ ಅತಿದೊಡ್ಡ ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ವಿಮಾ ಯೋಜನೆ (ಆಯುಷ್ಮಾನ್ ಭಾರತ್ - ಆರೋಗ್ಯ ಕರ್ನಾಟಕ).",
      hi: "गंभीर बीमारियों के द्वितीयक व तृतीयक उपचार हेतु प्रति पात्र परिवार को प्रति वर्ष ₹5,00,000 तक का कैशलेस एवं मुफ्त स्वास्थ्य बीमा कवर देशभर के सूचीबद्ध अस्पतालों में प्रदान किया जाता है।"
    },
    benefits: "Cashless in-patient hospitalization cover up to ₹5,00,000 per family per annum covering 1,949+ medical and surgical procedures with zero pre-existing condition restrictions.",
    benefits_kannada: "ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ₹5,00,000 ವರೆಗೆ ನಗದು ರಹಿತ ಆಸ್ಪತ್ರೆ ದಾಖಲಾತಿ ಚಿಕಿತ್ಸಾ ವೆಚ್ಚ (1,949+ ಚಿಕಿತ್ಸಾ ವಿಧಾನಗಳು ಲಭ್ಯ).",
    benefits_hindi: "प्रति परिवार प्रति वर्ष ₹5,00,000 तक का कैशलेस अस्पताल में भर्ती व उपचार कवर।",
    eligibility_criteria: {
      min_age: null,
      max_age: null,
      gender: "All",
      max_annual_income: null,
      occupations: ["All", "Farmer", "Daily-wage", "Street Vendor", "Artisan", "Student", "Unemployed", "Other"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card",
      "Ration Card (BPL / Antyodaya Anna Yojana card)",
      "Registered Mobile Number for OTP Verification"
    ],
    official_portal_url: "https://beneficiary.nha.gov.in"
  },
  {
    id: "mgnrega",
    name: "MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)",
    name_kannada: "ಮಹಾತ್ಮ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ಗ್ರಾಮೀಣ ಉದ್ಯೋಗ ಖಾತರಿ ಯೋಜನೆ (ಮನರೇಗಾ)",
    name_hindi: "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा)",
    category: "Agriculture",
    ministry: "Ministry of Rural Development (Central & State Panchayati Raj)",
    isKarnatakaState: false,
    brief_description: {
      en: "Legal guarantee of at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work, enhancing livelihood security and creating durable rural assets.",
      kn: "ಗ್ರಾಮೀಣ ಭಾಗದ ಪ್ರತಿಯೊಂದು ಕುಟುಂಬದ ವಯಸ್ಕ ಸದಸ್ಯರಿಗೆ ಸ್ವಯಂಪ್ರೇರಿತ ಅಕುಶಲ ದೈಹಿಕ ಕೆಲಸ ಮಾಡಲು ಹಣಕಾಸು ವರ್ಷದಲ್ಲಿ ಕನಿಷ್ಠ 100 ದಿನಗಳ ಖಾತರಿಪಡಿಸಿದ ಉದ್ಯೋಗ ಮತ್ತು ಶಾಸನಬದ್ಧ ಕೂಲಿ ವೇತನ ಒದಗಿಸುತ್ತದೆ.",
      hi: "ग्रामीण क्षेत्रों में प्रत्येक परिवार के उन वयस्क सदस्यों को जो अकुशल श्रम करने के इच्छुक हैं, प्रति वित्तीय वर्ष कम से कम 100 दिनों के सवैतनिक रोजगार की कानूनी गारंटी प्रदान करता है।"
    },
    benefits: "Guaranteed 100 days of wage employment per rural household per financial year (extended to 150 days in notified drought-hit taluks in Karnataka) at statutory minimum wage rates deposited straight to bank/post office accounts.",
    benefits_kannada: "ಪ್ರತಿ ಗ್ರಾಮೀಣ ಕುಟುಂಬಕ್ಕೆ ವಾರ್ಷಿಕ ಕನಿಷ್ಠ 100 ದಿನಗಳ ಗ್ಯಾರಂಟಿ ಕೂಲಿ ಉದ್ಯೋಗ (ಬರಪೀಡಿತ ತಾಲೂಕುಗಳಲ್ಲಿ 150 ದಿನಗಳವರೆಗೆ ವಿಸ್ತರಣೆ).",
    benefits_hindi: "प्रति ग्रामीण परिवार प्रति वित्तीय वर्ष कम से कम 100 दिनों का कानूनी गारंटीकृत सवैतनिक रोजगार।",
    eligibility_criteria: {
      min_age: 18,
      max_age: null,
      gender: "All",
      max_annual_income: null,
      occupations: ["Daily-wage", "Farmer", "Unemployed", "All", "Other"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card of all adult members",
      "MGNREGA Job Card (issued by Gram Panchayat) or application form",
      "Bank or Post Office Savings Passbook (Aadhaar linked)",
      "Passport-size Photographs",
      "Proof of Residence in Gram Panchayat"
    ],
    official_portal_url: "https://nrega.nic.in"
  },
  {
    id: "raitha-siri",
    name: "Raitha Siri Scheme",
    name_kannada: "ರೈತ ಸಿರಿ ಯೋಜನೆ (ಕರ್ನಾಟಕ)",
    name_hindi: "रैथा सिरी योजना (कर्नाटक)",
    category: "Agriculture",
    ministry: "Department of Agriculture (Government of Karnataka)",
    isKarnatakaState: true,
    brief_description: {
      en: "Financial incentive of ₹10,000 per hectare (up to a maximum of 2 hectares / ₹20,000) directly transferred to farmers who cultivate designated minor millets (Siri Dhanya like Ragi, Foxtail millet, Little millet, Browntop, etc.) to promote nutrition and climate-resilient farming.",
      kn: "ಕರ್ನಾಟಕದಲ್ಲಿ ಸಿರಿಧಾನ್ಯ (ಕಿರುಧಾನ್ಯಗಳಾದ ನವಣೆ, ಕೊರಲೆ, ಹಾರಕ, ಊದಲು, ಬರಗು, ಸಾಮೆ) ಬೆಳೆಯುವ ರೈತರನ್ನು ಪ್ರೋತ್ಸಾಹಿಸಲು ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ₹10,000 (ಗರಿಷ್ಠ 2 ಹೆಕ್ಟೇರ್‌ಗೆ ₹20,000) ನೇರ ನಗದು ಪ್ರೋತ್ಸಾಹಧನ.",
      hi: "कर्नाटक के किसानों द्वारा पौष्टिक मोटे अनाज (श्री अन्न/मिलेट्स जैसे कंगनी, सांवा, कोदो आदि) की खेती को बढ़ावा देने हेतु प्रति हेक्टेयर ₹10,000 (अधिकतम 2 हेक्टेयर हेतु ₹20,000) का प्रत्यक्ष प्रोत्साहन अनुदान।"
    },
    benefits: "Cash assistance of ₹10,000 per hectare for millet cultivation (capped at 2 hectares / maximum ₹20,000) paid directly to the farmer's bank account via DBT upon crop verification.",
    benefits_kannada: "ಸಿರಿಧಾನ್ಯ ಬೆಳೆಯುವ ರೈತರಿಗೆ ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ ₹10,000 ಪ್ರೋತ್ಸಾಹಧನ (ಗರಿಷ್ಠ 2 ಹೆಕ್ಟೇರ್‌ಗೆ ₹20,000).",
    benefits_hindi: "मिलेट्स (मोटे अनाज) की खेती हेतु प्रति हेक्टेयर ₹10,000 (अधिकतम 2 हेक्टेयर हेतु ₹20,000) की प्रत्यक्ष सब्सिडी।",
    eligibility_criteria: {
      min_age: 18,
      max_age: null,
      gender: "All",
      max_annual_income: null,
      occupations: ["Farmer"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: 4.94
    },
    required_documents: [
      "Aadhaar Card",
      "FID (Farmer Identification Number) registered on Karnataka FRUITS Portal",
      "Land RTC / Pahani showing millet crop cultivation",
      "Aadhaar-linked Bank Account Passbook"
    ],
    official_portal_url: "https://fruits.karnataka.gov.in"
  },
  {
    id: "ganga-kalyana",
    name: "Ganga Kalyana Scheme",
    name_kannada: "ಗಂಗಾ ಕಲ್ಯಾಣ ಯೋಜನೆ (ಕರ್ನಾಟಕ)",
    name_hindi: "गंगा कल्याण योजना (कर्नाटक)",
    category: "Agriculture",
    ministry: "Karnataka Backward Classes, SC/ST, and Minority Development Corporations",
    isKarnatakaState: true,
    brief_description: {
      en: "State-sponsored agricultural irrigation scheme providing free individual or collective borewells, electric pump sets, and energized irrigation pipelines to small and marginal farmers belonging to SC, ST, OBC, and minority communities with an annual family income under ₹1,50,000 (rural) or ₹2,00,000 (urban).",
      kn: "ಪರಿಶಿಷ್ಟ ಜಾತಿ, ಪರಿಶಿಷ್ಟ ಪಂಗಡ, ಹಿಂದುಳಿದ ವರ್ಗಗಳು ಮತ್ತು ಅಲ್ಪಸಂಖ್ಯಾತ ಸಮುದಾಯಗಳ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರ ಒಣ ಜಮೀನುಗಳಿಗೆ ಉಚಿತವಾಗಿ ಕೊಳವೆ ಬಾವಿ ಕೊರೆದು, ಪಂಪ್‌ಸೆಟ್ ಅಳವಡಿಸಿ ವಿದ್ಯುತ್ ಸಂಪರ್ಕ ಕಲ್ಪಿಸುವ ನೀರಾವರಿ ಯೋಜನೆ.",
      hi: "कर्नाटक के अनुसूचित जाति, जनजाति, अन्य पिछड़ा वर्ग और अल्पसंख्यक वर्ग के लघु एवं सीमांत किसानों की शुष्क भूमि को सिंचित करने के लिए निःशुल्क बोरवेल, पंपसेट और विद्युतीकरण युक्त सिंचाई सहायता।"
    },
    benefits: "Complete financial subsidy for drilling of borewell, supply and installation of submersible pump set, wiring, and energized pipeline connection (unit cost ranging from ₹3.5 Lakh to ₹4.75 Lakh per borewell unit, 100% state subsidized).",
    benefits_kannada: "ಸಂಪೂರ್ಣ ಉಚಿತ ಕೊಳವೆ ಬಾವಿ ಕೊರೆಯುವಿಕೆ, ಪಂಪ್‌ಸೆಟ್ ಅಳವಡಿಕೆ ಹಾಗೂ ವಿದ್ಯುದೀಕರಣ (ಘಟಕ ವೆಚ್ಚ ₹3.50 ಲಕ್ಷದಿಂದ ₹4.75 ಲಕ್ಷದವರೆಗೆ 100% ಸರ್ಕಾರಿ ಅನುದಾನ).",
    benefits_hindi: "निःशुल्क बोरवेल खनन, सबमर्सिबल पंपसेट स्थापना और विद्युतीकरण (₹3.5 लाख से ₹4.75 लाख तक पूर्णतः सरकारी सहायता)।",
    eligibility_criteria: {
      min_age: 18,
      max_age: 60,
      gender: "All",
      max_annual_income: 150000,
      occupations: ["Farmer"],
      caste_categories: ["OBC", "SC", "ST"],
      land_holding_max_acres: 5.0
    },
    required_documents: [
      "Aadhaar Card",
      "Caste Certificate issued by Tahsildar / Revenue Authority",
      "Income Certificate (annual family income below ₹1,50,000 in rural / ₹2,00,000 in urban areas)",
      "Land RTC / Pahani Records and Encumbrance Certificate (EC)",
      "Small / Marginal Farmer Certificate issued by the Agriculture/Horticulture Officer",
      "Bank Account Passbook (Aadhaar Seeded)",
      "BPL Ration Card"
    ],
    official_portal_url: "https://kmdc.karnataka.gov.in"
  },
  {
    id: "pmmvy",
    name: "PMMVY (Pradhan Mantri Matru Vandana Yojana)",
    name_kannada: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ (ಪಿಎಂಎಂವಿವೈ)",
    name_hindi: "प्रधानमंत्री मातृ वंदना योजना (पीएमएमवीवाई)",
    category: "Women",
    ministry: "Ministry of Women and Child Development (Central)",
    isKarnatakaState: false,
    brief_description: {
      en: "Direct maternity cash benefit of ₹5,000 in two installments for the first living child, and ₹6,000 in a single installment for the birth of a second girl child to pregnant women and lactating mothers for wage-loss compensation and better maternal health and nutrition.",
      kn: "ಗರ್ಭಿಣಿಯರು ಮತ್ತು ಬಾಣಂತಿಯರಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ವಿಶ್ರಾಂತಿಗಾಗಿ ಮೊದಲ ಮಗುವಿನ ಜನನಕ್ಕೆ ₹5,000 (ಎರಡು ಕಂತುಗಳಲ್ಲಿ) ಹಾಗೂ ಎರಡನೇ ಮಗು ಹೆಣ್ಣು ಮಗುವಾಗಿದ್ದಲ್ಲಿ ₹6,000 ನೇರ ನಗದು ಪ್ರೋತ್ಸಾಹಧನ ನೀಡುವ ತಾಯಂದಿರ ಕಲ್ಯಾಣ ಯೋಜನೆ.",
      hi: "गर्भवती महिलाओं और स्तनपान कराने वाली माताओं को पहले जीवित बच्चे के जन्म पर ₹5,000 (दो किस्तों में) और दूसरी कन्या संतान के जन्म पर ₹6,000 की प्रत्यक्ष मातृत्व पोषण सहायता।"
    },
    benefits: "Maternity cash incentive of ₹5,000 (1st installment of ₹3,000 on ANC registration, 2nd installment of ₹2,000 on child birth & first cycle of vaccination) for first child, and ₹6,000 in one go for second child if girl child.",
    benefits_kannada: "ಮೊದಲ ಮಗುವಿಗೆ ₹5,000 (2 ಕಂತುಗಳಲ್ಲಿ), ಮತ್ತು ಎರಡನೇ ಮಗು ಹೆಣ್ಣಾಗಿದ್ದಲ್ಲಿ ₹6,000 ನೇರ ನಗದು ಮಾತೃತ್ವ ನೆರವು.",
    benefits_hindi: "पहले बच्चे के जन्म पर ₹5,000 (दो किस्तों में) और दूसरी कन्या संतान के जन्म पर ₹6,000 की प्रत्यक्ष पोषण सहायता।",
    eligibility_criteria: {
      min_age: 19,
      max_age: 45,
      gender: "Female",
      max_annual_income: 800000,
      occupations: ["All", "Daily-wage", "Unemployed", "Artisan", "Farmer", "Street Vendor", "Other"],
      caste_categories: ["General", "OBC", "SC", "ST", "All"],
      land_holding_max_acres: null
    },
    required_documents: [
      "Aadhaar Card of the Mother",
      "Aadhaar Card of the Husband / Father",
      "Mother-Child Protection (MCP) Card / RCH Portal Registration Copy",
      "Child Birth Certificate (for 2nd installment)",
      "Bank / Post Office Passbook of the Beneficiary (Aadhaar linked)",
      "Proof of eligibility (e.g. BPL/E-Shram/MGNREGA Job Card or income certificate)"
    ],
    official_portal_url: "https://pmmvy.wcd.gov.in"
  }
];
