/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Filter, 
  HelpCircle, 
  Languages, 
  Search, 
  Sparkles, 
  Users, 
  Wheat, 
  HeartHandshake, 
  GraduationCap, 
  Hammer, 
  Coins, 
  Stethoscope, 
  Copy, 
  Download, 
  Check, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Printer,
  RotateCcw,
  BookOpen,
  Briefcase,
  X
} from 'lucide-react';
import { SCHEMES, Scheme } from './data/schemes';

type Language = 'en' | 'kn' | 'hi';
type CategoryFilter = 'All' | 'Agriculture' | 'Women' | 'Youth' | 'Artisan' | 'Credit' | 'Healthcare';
type ViewFilter = 'all' | 'eligible' | 'near_miss';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>('pm-kisan');

  // Interactive Eligibility Assessment Wizard state
  const [age, setAge] = useState<number | ''>(26);
  const [gender, setGender] = useState<'Female' | 'Male' | 'All'>('Female');
  const [occupation, setOccupation] = useState<string>('Farmer');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(120000);
  const [casteCategory, setCasteCategory] = useState<string>('OBC');
  const [landAcres, setLandAcres] = useState<number | ''>(2.5);

  // Checked documents state (stored by doc string)
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    'Aadhaar Card': true,
    'Active Bank Account Passbook (Aadhaar Seeded & NPCI mapped)': true
  });

  // Speech Recognition (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechBlocked, setSpeechBlocked] = useState(false);
  const recognitionRef = useRef<any>(null);
  const schemesSectionRef = useRef<HTMLElement>(null);

  // Speech Synthesis (Text to Speech)
  const [speakingSchemeId, setSpeakingSchemeId] = useState<string | null>(null);

  // Translations dictionary for UI
  const t = {
    en: {
      collegeBadge: "EPCET Community Project",
      appTitle: "SevaSetu - Citizen Scheme Awareness Portal",
      appSubtitle: "Government Scheme Awareness for Betterment of Livelihood • East Point College of Engineering and Technology",
      searchPlaceholder: "Search by scheme name or keywords (e.g. Farmer, Women, Student, Vendor, Ayushman)...",
      voiceListening: "Listening... Speak in English (en-IN)",
      voiceButton: "Voice Search",
      evalTitle: "Interactive Eligibility Assessment Wizard",
      evalSubtitle: "Fill in citizen details to discover guaranteed entitlements and near-miss welfare opportunities.",
      ageLabel: "Applicant Age (Years)",
      genderLabel: "Gender",
      occLabel: "Primary Occupation",
      incomeLabel: "Annual Family Income (₹ INR)",
      casteLabel: "Social / Caste Category",
      landLabel: "Landholding (Acres)",
      checkBtn: "Check Eligible Schemes",
      resetBtn: "Reset Details",
      allTab: "All Schemes",
      eligibleTab: "Eligible for Me",
      nearMissTab: "Near-Miss Schemes",
      benefitsLabel: "Direct Financial & Social Benefits:",
      docsLabel: "Required Documents Checklist:",
      listenBtn: "Listen",
      stopBtn: "Stop Audio",
      portalBtn: "Official Portal",
      checklistTitle: "Consolidated Citizen Document Checklist",
      checklistSubtitle: "Prepare these authentic documents to successfully apply at Karnataka Grama One, Seva Sindhu, or CSC centers.",
      printBtn: "Print / Save Checklist",
      qualifiedBadge: "100% Eligible",
      nearMissBadge: "Near-Miss (1 Param Off)",
      centralTag: "Central Government",
      karnatakaTag: "Karnataka State"
    },
    kn: {
      collegeBadge: "ಇಪಿಸಿಇಟಿ ಕಮ್ಯುನಿಟಿ ಪ್ರಾಜೆಕ್ಟ್",
      appTitle: "ಸೇವಾ ಸೇತು - ನಾಗರಿಕ ಯೋಜನೆಗಳ ಮಾಹಿತಿ ಪೋರ್ಟಲ್",
      appSubtitle: "ಉತ್ತಮ ಜೀವನೋಪಾಯಕ್ಕಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಜಾಗೃತಿ • ಈಸ್ಟ್ ಪಾಯಿಂಟ್ ಇಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು (EPCET)",
      searchPlaceholder: "ಯೋಜನೆ ಅಥವಾ ಕೀವರ್ಡ್ ಹುಡುಕಿ (ಉದಾ: ರೈತ, ಮಹಿಳೆ, ವಿದ್ಯಾರ್ಥಿ, ಬೀದಿ ವ್ಯಾಪಾರಿ, ಆಯುಷ್ಮಾನ್)...",
      voiceListening: "ಆಲಿಸುತ್ತಿದೆ... ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ (kn-IN)",
      voiceButton: "ಧ್ವನಿ ಹುಡುಕಾಟ",
      evalTitle: "ಪಾರಸ್ಪರಿಕ ಅರ್ಹತಾ ಮೌಲ್ಯಮಾಪನ ಮಾರ್ಗದರ್ಶಿ",
      evalSubtitle: "ನಾಗರಿಕರ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ನೇರವಾಗಿ ಅರ್ಹವಾಗಿರುವ ಮತ್ತು ಸನಿಹದ (Near-Miss) ಯೋಜನೆಗಳನ್ನು ತಿಳಿಯಿರಿ.",
      ageLabel: "ಅರ್ಜಿದಾರರ ವಯಸ್ಸು (ವರ್ಷಗಳಲ್ಲಿ)",
      genderLabel: "ಲಿಂಗ",
      occLabel: "ಮುಖ್ಯ ಕಸುಬು / ಉದ್ಯೋಗ",
      incomeLabel: "ವಾರ್ಷಿಕ ಕುಟುಂಬದ ಆದಾಯ (₹)",
      casteLabel: "ಸಾಮಾಜಿಕ / ಜಾತಿ ವರ್ಗ",
      landLabel: "ಕೃಷಿ ಜಮೀನು (ಎಕರೆಗಳಲ್ಲಿ)",
      checkBtn: "ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
      resetBtn: "ಮರುಹೊಂದಿಸಿ",
      allTab: "ಎಲ್ಲಾ 10 ಯೋಜನೆಗಳು",
      eligibleTab: "ನನಗೆ ಅರ್ಹವಾದವು",
      nearMissTab: "ಸನಿಹದ ಯೋಜನೆಗಳು (Near-Miss)",
      benefitsLabel: "ನೇರ ಆರ್ಥಿಕ ಮತ್ತು ಸಾಮಾಜಿಕ ಸೌಲಭ್ಯಗಳು:",
      docsLabel: "ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳ ಪಟ್ಟಿ:",
      listenBtn: "ಆಲಿಸಿ (ಧ್ವನಿ)",
      stopBtn: "ನಿಲ್ಲಿಸಿ",
      portalBtn: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್",
      checklistTitle: "ಮಾಸ್ಟರ್ ದಾಖಲಾತಿ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
      checklistSubtitle: "ಗ್ರಾಮ ಒನ್, ಸೇವಾ ಸಿಂಧು ಅಥವಾ ಸಿಎಸ್‌ಸಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಈ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿಕೊಳ್ಳಿ.",
      printBtn: "ಮುದ್ರಿಸಿ / PDF ಉಳಿಸಿ",
      qualifiedBadge: "ಸಂಪೂರ್ಣ ಅರ್ಹ",
      nearMissBadge: "ಸನಿಹದ ಯೋಜನೆ (1 ನಿಯಮ ಬಾಕಿ)",
      centralTag: "ಕೇಂದ್ರ ಸರ್ಕಾರ",
      karnatakaTag: "ಕರ್ನಾಟಕ ಸರ್ಕಾರ"
    },
    hi: {
      collegeBadge: "ईपीसीईटी कम्युनिटी प्रोजेक्ट",
      appTitle: "सेवा सेतु - नागरिक योजना जागरूकता पोर्टल",
      appSubtitle: "बेहतर आजीविका हेतु सरकारी योजनाओं की जानकारी • ईस्ट पॉइंट कॉलेज ऑफ इंजीनियरिंग एंड टेक्नोलॉजी",
      searchPlaceholder: "योजना या कीवर्ड खोजें (उदा: किसान, महिला, छात्र, मजदूर, आयुष्मान)...",
      voiceListening: "सुन रहे हैं... हिन्दी में बोलें (hi-IN)",
      voiceButton: "वॉयस सर्च",
      evalTitle: "इंटरएक्टिव पात्रता मूल्यांकन विज़ार्ड",
      evalSubtitle: "नागरिक विवरण दर्ज करें और सीधे पात्र व निकटतम (नियर-मिस) कल्याणकारी योजनाओं की सूची देखें।",
      ageLabel: "आवेदक की आयु (वर्ष)",
      genderLabel: "लिंग",
      occLabel: "मुख्य व्यवसाय",
      incomeLabel: "वार्षिक पारिवारिक आय (₹)",
      casteLabel: "सामाजिक / जाति श्रेणी",
      landLabel: "कृषि भूमि (एकड़)",
      checkBtn: "पात्र योजनाएं देखें",
      resetBtn: "रीसेट करें",
      allTab: "सभी 10 योजनाएं",
      eligibleTab: "मेरे लिए पात्र",
      nearMissTab: "नियर-मिस योजनाएं",
      benefitsLabel: "प्रत्यक्ष वित्तीय व सामाजिक लाभ:",
      docsLabel: "आवश्यक दस्तावेजों की चेकलिस्ट:",
      listenBtn: "सुनें (ऑडियो)",
      stopBtn: "रोकें",
      portalBtn: "आधिकारिक पोर्टल",
      checklistTitle: "मास्टर दस्तावेज़ चेकलिस्ट",
      checklistSubtitle: "ग्राम वन, सेवा सिंधु या सीएससी केंद्रों पर आवेदन करने हेतु इन दस्तावेजों को तैयार रखें।",
      printBtn: "प्रिंट करें / सुरक्षित करें",
      qualifiedBadge: "पूर्णतः पात्र",
      nearMissBadge: "नियर-मिस (1 शर्त बाकी)",
      centralTag: "केंद्र सरकार",
      karnatakaTag: "कर्नाटक सरकार"
    }
  }[language];

  // Scroll smoothly to the schemes results section
  const scrollToResults = () => {
    if (schemesSectionRef.current) {
      schemesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quick tag click handler: immediately sets search query, reveals schemes tab, and triggers filtering
  const handleQuickTag = (tag: string) => {
    setSearchQuery(tag);
    setViewFilter('all');
    setSelectedCategory('All');
    setTimeout(() => {
      scrollToResults();
    }, 40);
  };

  // Automatically switch to 'all' tab when user types or speaks a search query so matches are never hidden
  useEffect(() => {
    if (searchQuery.trim()) {
      setViewFilter('all');
    }
  }, [searchQuery]);

  // Clean up any running speech instance on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  // Voice Search Handler with interimResults and language-aware configuration
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition API not available in this browser environment.");
      setSpeechBlocked(true);
      return;
    }

    setSpeechError(null);

    // If currently listening, stop it cleanly
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn("Error stopping SpeechRecognition:", err);
        }
      }
      setIsListening(false);
      return;
    }

    try {
      // Abort any previous instance if still hanging
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true; // Crucial so spoken words appear immediately

      // Configure recognition.lang based on active language
      if (language === 'kn') {
        recognition.lang = 'kn-IN';
      } else if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechBlocked(false);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        // Iterate through all captured results (interim and final)
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res && res[0] && res[0].transcript) {
            transcript += res[0].transcript;
          }
        }

        console.log("Captured speech:", transcript);

        // Immediately update search input state in real time
        if (transcript) {
          setSearchQuery(transcript);
          setViewFilter('all');
          setSelectedCategory('All');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
          setSpeechBlocked(true);
          setSpeechError(null);
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Always ensure listening state toggles back to idle
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (err: any) {
      console.warn("Failed to start SpeechRecognition:", err);
      setIsListening(false);
      setSpeechBlocked(true);
    }
  };

  // Text-To-Speech (TTS) using window.speechSynthesis
  const speakScheme = (scheme: Scheme) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingSchemeId === scheme.id) {
      window.speechSynthesis.cancel();
      setSpeakingSchemeId(null);
      return;
    }

    window.speechSynthesis.cancel();

    let textToSpeak = '';
    let voiceLang = 'en-IN';

    if (language === 'kn') {
      textToSpeak = `${scheme.name_kannada}. ${scheme.brief_description.kn}. ${scheme.benefits_kannada || scheme.benefits}`;
      voiceLang = 'kn-IN';
    } else if (language === 'hi') {
      textToSpeak = `${scheme.name_hindi}. ${scheme.brief_description.hi}. ${scheme.benefits_hindi || scheme.benefits}`;
      voiceLang = 'hi-IN';
    } else {
      textToSpeak = `${scheme.name}. ${scheme.brief_description.en}. Benefits: ${scheme.benefits}`;
      voiceLang = 'en-IN';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = voiceLang;
    utterance.rate = 0.95;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(voiceLang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onend = () => setSpeakingSchemeId(null);
    utterance.onerror = () => setSpeakingSchemeId(null);

    setSpeakingSchemeId(scheme.id);
    window.speechSynthesis.speak(utterance);
  };

  // Stop any audio on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Category Icon Meta
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'Agriculture':
        return { icon: Wheat, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'Women':
        return { icon: HeartHandshake, color: 'text-rose-700 bg-rose-50 border-rose-200' };
      case 'Youth':
        return { icon: GraduationCap, color: 'text-blue-700 bg-blue-50 border-blue-200' };
      case 'Artisan':
        return { icon: Hammer, color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'Credit':
        return { icon: Coins, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
      case 'Healthcare':
        return { icon: Stethoscope, color: 'text-teal-700 bg-teal-50 border-teal-200' };
      default:
        return { icon: Building2, color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  // Computation of Eligibility, Near-Miss, and Documents
  const evaluatedSchemes = useMemo(() => {
    return SCHEMES.map(scheme => {
      const c = scheme.eligibility_criteria;
      const failedReasons: string[] = [];
      let isMarginal = false;
      let marginalNote = '';

      // 1. Age
      if (age !== '') {
        if (c.min_age !== null && age < c.min_age) {
          const diff = c.min_age - age;
          failedReasons.push(language === 'kn' ? `ಕನಿಷ್ಠ ವಯಸ್ಸು ${c.min_age} ಅಗತ್ಯ (ದಾಖಲಿಸಿದ್ದು: ${age})` : language === 'hi' ? `न्यूनतम आयु ${c.min_age} वर्ष आवश्यक (दर्ज: ${age})` : `Min age ${c.min_age} required (You entered: ${age})`);
          if (diff <= 2) {
            isMarginal = true;
            marginalNote = language === 'kn' ? `ವಯಸ್ಸು ${age}, ಕನಿಷ್ಠ ವಯಸ್ಸಿಗಿಂತ ಕೇವಲ ${diff} ವರ್ಷ ಕಡಿಮೆ.` : language === 'hi' ? `आयु ${age}, न्यूनतम आयु से मात्र ${diff} वर्ष कम है।` : `Age ${age} is within ${diff} year(s) of minimum age (${c.min_age}).`;
          }
        }
        if (c.max_age !== null && age > c.max_age) {
          const diff = age - c.max_age;
          failedReasons.push(language === 'kn' ? `ಗರಿಷ್ಠ ವಯಸ್ಸು ${c.max_age} ಮಿತಿಯಿದೆ` : language === 'hi' ? `अधिकतम आयु ${c.max_age} वर्ष तक सीमित` : `Max age ceiling is ${c.max_age}`);
          if (diff <= 2) {
            isMarginal = true;
            marginalNote = language === 'kn' ? `ವಯಸ್ಸು ${age}, ಗರಿಷ್ಠ ವಯಸ್ಸಿನ ಮಿತಿಗಿಂತ 2 ವರ್ಷಗಳ ಒಳಗೆ.` : `Age ${age} is within 2 years of max age ceiling (${c.max_age}).`;
          }
        }
      }

      // 2. Gender
      if (c.gender !== 'All' && gender !== 'All' && c.gender !== gender) {
        failedReasons.push(language === 'kn' ? `ಕೇವಲ ${c.gender === 'Female' ? 'ಮಹಿಳೆಯರಿಗೆ' : 'ಪುರುಷರಿಗೆ'} ಮಾತ್ರ` : language === 'hi' ? `केवल ${c.gender === 'Female' ? 'महिलाओं' : 'पुरुषों'} के लिए` : `Specifically for ${c.gender} applicants`);
      }

      // 3. Income
      if (annualIncome !== '' && c.max_annual_income !== null && annualIncome > c.max_annual_income) {
        const excess = annualIncome - c.max_annual_income;
        const pct = (excess / c.max_annual_income) * 100;
        failedReasons.push(language === 'kn' ? `ವಾರ್ಷಿಕ ಆದಾಯ ಮಿತಿ ₹${c.max_annual_income.toLocaleString()} (ನಮೂದಿಸಿದ್ದು: ₹${annualIncome.toLocaleString()})` : `Max income ₹${c.max_annual_income.toLocaleString()} (Entered: ₹${annualIncome.toLocaleString()})`);
        if (pct <= 15 || excess <= 25000) {
          isMarginal = true;
          marginalNote = language === 'kn' ? `ಆದಾಯ ₹${annualIncome.toLocaleString()} ಮಿತಿಯನ್ನು ಕೇವಲ ${pct.toFixed(1)}% ನಷ್ಟು ಮೀರಿದೆ.` : `Income exceeds ceiling marginally by ${pct.toFixed(1)}%.`;
        }
      }

      // 4. Occupation
      if (!c.occupations.includes('All') && !c.occupations.includes(occupation)) {
        failedReasons.push(language === 'kn' ? `ನಿಗದಿತ ಕಸುಬು: ${c.occupations.join(', ')}` : `Applicable for: ${c.occupations.join(', ')}`);
      }

      // 5. Caste
      if (!c.caste_categories.includes('All') && !c.caste_categories.includes(casteCategory)) {
        failedReasons.push(language === 'kn' ? `ಅರ್ಹ ವರ್ಗಗಳು: ${c.caste_categories.join(', ')}` : `Reserved for: ${c.caste_categories.join(', ')}`);
      }

      // 6. Landholding
      if (landAcres !== '' && c.land_holding_max_acres !== null && landAcres > c.land_holding_max_acres) {
        const excess = landAcres - c.land_holding_max_acres;
        failedReasons.push(language === 'kn' ? `ಗರಿಷ್ಠ ಜಮೀನು ಮಿತಿ ${c.land_holding_max_acres} ಎಕರೆ` : `Land ceiling ${c.land_holding_max_acres} acres`);
        if (excess <= 1.0) {
          isMarginal = true;
          marginalNote = language === 'kn' ? `ಜಮೀನು ${landAcres} ಎಕರೆ, ಮಿತಿಗಿಂತ 1 ಎಕರೆಯ ಒಳಗೆ.` : `Landholding is within 1 acre of limit.`;
        }
      }

      const isEligible = failedReasons.length === 0;
      const isNearMiss = failedReasons.length === 1;

      return {
        scheme,
        isEligible,
        isNearMiss,
        failedReasons,
        marginalNote: isMarginal ? marginalNote : failedReasons[0] || ''
      };
    });
  }, [age, gender, occupation, annualIncome, casteCategory, landAcres, language]);

  // Master document list
  const masterDocumentList = useMemo(() => {
    const docMap = new Map<string, string[]>();
    // Consider eligible schemes if evaluated, else all schemes
    const targetSchemes = hasEvaluated 
      ? evaluatedSchemes.filter(s => s.isEligible).map(s => s.scheme)
      : SCHEMES;

    targetSchemes.forEach(s => {
      s.required_documents.forEach(doc => {
        const list = docMap.get(doc) || [];
        list.push(s.name);
        docMap.set(doc, list);
      });
    });

    return Array.from(docMap.entries()).map(([docName, schemes]) => ({
      docName,
      schemes
    }));
  }, [evaluatedSchemes, hasEvaluated]);

  // Comprehensive search matcher checking titles, categories, occupations, descriptions, and keywords in real time
  const matchesSearch = (scheme: Scheme, query: string): boolean => {
    if (!query || !query.trim()) return true;
    const q = query.toLowerCase().trim();

    // 1. Direct field checks
    const inTitle = scheme.name.toLowerCase().includes(q) ||
                    scheme.name_kannada.toLowerCase().includes(q) ||
                    scheme.name_hindi.toLowerCase().includes(q);
    if (inTitle) return true;

    const inCategory = scheme.category.toLowerCase().includes(q);
    if (inCategory) return true;

    const inOccupations = scheme.eligibility_criteria.occupations.some(occ => 
      occ.toLowerCase().includes(q)
    );
    if (inOccupations) return true;

    const inDescription = scheme.brief_description.en.toLowerCase().includes(q) ||
                          scheme.brief_description.kn.toLowerCase().includes(q) ||
                          scheme.brief_description.hi.toLowerCase().includes(q);
    if (inDescription) return true;

    const inBenefits = scheme.benefits.toLowerCase().includes(q) ||
                       (scheme.benefits_kannada && scheme.benefits_kannada.toLowerCase().includes(q)) ||
                       (scheme.benefits_hindi && scheme.benefits_hindi.toLowerCase().includes(q));
    if (inBenefits) return true;

    const inMinistry = scheme.ministry.toLowerCase().includes(q);
    if (inMinistry) return true;

    const inDocuments = scheme.required_documents.some(doc => doc.toLowerCase().includes(q));
    if (inDocuments) return true;

    // 2. Tokenized multi-word search (e.g. "small farmer", "borewell fund")
    const tokens = q.split(/[\s,]+/).filter(t => t.length >= 2);
    if (tokens.length > 1) {
      const combinedText = `${scheme.name} ${scheme.name_kannada} ${scheme.name_hindi} ${scheme.category} ${scheme.brief_description.en} ${scheme.brief_description.kn} ${scheme.brief_description.hi} ${scheme.benefits} ${scheme.eligibility_criteria.occupations.join(' ')}`.toLowerCase();
      if (tokens.some(token => combinedText.includes(token))) {
        return true;
      }
    }

    // 3. Trilingual domain keyword mappings
    // Agriculture / Farmers
    if ((q.includes('farmer') || q.includes('ರೈತ') || q.includes('किसान') || q.includes('agri') || q.includes('ಕೃಷಿ') || q.includes('crop') || q.includes('ಬೆಳೆ') || q.includes('millet') || q.includes('ಸಿರಿಧಾನ್ಯ') || q.includes('ragi') || q.includes('ರಾಗಿ') || q.includes('borewell') || q.includes('ಬೋರ್‌ವೆಲ್') || q.includes('ಕೊಳವೆ ಬಾವಿ') || q.includes('kisan')) && scheme.category === 'Agriculture') {
      return true;
    }

    // Women / Maternity / Homemaker
    if ((q.includes('women') || q.includes('woman') || q.includes('female') || q.includes('mother') || q.includes('pregnant') || q.includes('maternity') || q.includes('homemaker') || q.includes('ಮಹಿಳೆ') || q.includes('ತಾಯಿ') || q.includes('ಗರ್ಭಿಣಿ') || q.includes('ಬಾಣಂತಿ') || q.includes('ಹೆರಿಗೆ') || q.includes('ಗೃಹಲಕ್ಷ್ಮಿ') || q.includes('महिला') || q.includes('गर्भवती') || q.includes('गृह लक्ष्मी') || q.includes('मातृ')) && scheme.category === 'Women') {
      return true;
    }

    // Youth / Students / Unemployed
    if ((q.includes('student') || q.includes('youth') || q.includes('graduate') || q.includes('diploma') || q.includes('unemployed') || q.includes('allowance') || q.includes('ವಿದ್ಯಾರ್ಥಿ') || q.includes('ನಿರುದ್ಯೋಗಿ') || q.includes('ಪದವೀಧರ') || q.includes('ಯುವ ನಿಧಿ') || q.includes('छात्र') || q.includes('विद्यार्थी') || q.includes('युवा') || q.includes('बेरोजगार')) && scheme.category === 'Youth') {
      return true;
    }

    // Street Vendors / Micro Credit
    if ((q.includes('vendor') || q.includes('hawker') || q.includes('street') || q.includes('svanidhi') || q.includes('loan') || q.includes('credit') || q.includes('ಬೀದಿ ವ್ಯಾಪಾರಿ') || q.includes('ವ್ಯಾಪಾರಿ') || q.includes('ಸಾಲ') || q.includes('ಸ್ವನಿಧಿ') || q.includes('स्ट्रीट वेंडर') || q.includes('रेहड़ी') || q.includes('पटरी') || q.includes('स्वनिधि')) && (scheme.id === 'pm-svanidhi' || scheme.id === 'pm-vishwakarma')) {
      return true;
    }

    // Artisans / Traditional Craftspeople
    if ((q.includes('artisan') || q.includes('craft') || q.includes('craftsman') || q.includes('toolkit') || q.includes('carpenter') || q.includes('blacksmith') || q.includes('tailor') || q.includes('vishwakarma') || q.includes('ಕುಶಲಕರ್ಮಿ') || q.includes('ವಿಶ್ವಕರ್ಮ') || q.includes('ಟೂಲ್‌ಕಿಟ್') || q.includes('ಬಡಗಿ') || q.includes('ಕಾರಿगर') || q.includes('शिल्पकार') || q.includes('विश्वकर्मा')) && scheme.category === 'Artisan') {
      return true;
    }

    // Healthcare
    if ((q.includes('health') || q.includes('hospital') || q.includes('insurance') || q.includes('treatment') || q.includes('pmjay') || q.includes('ayushman') || q.includes('arogya') || q.includes('ಆರೋಗ್ಯ') || q.includes('ಆಸ್ಪತ್ರೆ') || q.includes('ಚಿಕಿತ್ಸೆ') || q.includes('ವಿಮೆ') || q.includes('ಆಯುಷ್ಮಾನ್') || q.includes('स्वास्थ्य') || q.includes('अस्पताल') || q.includes('इलाज') || q.includes('बीमा') || q.includes('आयुष्मान')) && scheme.category === 'Healthcare') {
      return true;
    }

    // Daily-wage / MGNREGA workers
    if ((q.includes('worker') || q.includes('daily') || q.includes('wage') || q.includes('mgnrega') || q.includes('nrega') || q.includes('100 days') || q.includes('ಕೂಲಿ') || q.includes('ಮನರೇಗಾ') || q.includes('ಉದ್ಯೋಗ ಖಾತರಿ') || q.includes('मजदूर') || q.includes('मनरेगा')) && (scheme.id === 'mgnrega' || scheme.eligibility_criteria.occupations.includes('Daily-wage'))) {
      return true;
    }

    return false;
  };

  // Filter schemes according to active view, category, and voice/search query in real time
  const displayedSchemes = useMemo(() => {
    const q = searchQuery.trim();

    return evaluatedSchemes.filter(({ scheme, isEligible, isNearMiss }) => {
      // If there is an active search query, verify it matches across titles, categories, occupations, etc.
      if (q) {
        const isMatch = matchesSearch(scheme, q);
        if (!isMatch) return false;

        // Respect explicit category filter if chosen and not 'All'
        if (selectedCategory !== 'All' && scheme.category !== selectedCategory) {
          return false;
        }

        // Respect explicit view filter tab if user chosen
        if (viewFilter === 'eligible' && !isEligible) return false;
        if (viewFilter === 'near_miss' && !isNearMiss) return false;

        return true;
      }

      // No active search query: apply view tab & category filters
      if (viewFilter === 'eligible' && !isEligible) return false;
      if (viewFilter === 'near_miss' && !isNearMiss) return false;
      if (selectedCategory !== 'All' && scheme.category !== selectedCategory) return false;

      return true;
    });
  }, [evaluatedSchemes, viewFilter, selectedCategory, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  const getSchemeTitle = (scheme: Scheme) => {
    if (language === 'kn') return scheme.name_kannada;
    if (language === 'hi') return scheme.name_hindi;
    return scheme.name;
  };

  const getSchemeDescription = (scheme: Scheme) => {
    return scheme.brief_description[language] || scheme.brief_description.en;
  };

  const getSchemeBenefits = (scheme: Scheme) => {
    if (language === 'kn' && scheme.benefits_kannada) return scheme.benefits_kannada;
    if (language === 'hi' && scheme.benefits_hindi) return scheme.benefits_hindi;
    return scheme.benefits;
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans print:bg-white print:text-black">
      
      {/* HEADER & BRANDING */}
      <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white shadow-md border-b border-emerald-800/40 print:bg-white print:text-black print:border-b-2 print:border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Title & College Badge */}
            <div className="flex items-start sm:items-center space-x-3.5">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg text-stone-950 flex items-center justify-center font-bold print:hidden">
                <Wheat className="w-8 h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black">
                    SevaSetu
                  </h1>
                  <span className="text-amber-400 font-mono text-xs px-2.5 py-0.5 bg-amber-400/20 rounded-full border border-amber-400/30 font-semibold print:text-black">
                    {t.collegeBadge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-1 print:text-stone-700">
                  {t.appSubtitle}
                </p>
              </div>
            </div>

            {/* Language Switcher Buttons */}
            <div className="flex items-center space-x-3 self-end md:self-auto print:hidden">
              <div className="inline-flex rounded-xl bg-emerald-950/70 p-1 border border-emerald-700/60 shadow-inner">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    language === 'en' 
                      ? 'bg-amber-400 text-stone-950 shadow-md scale-102' 
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('kn')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    language === 'kn' 
                      ? 'bg-amber-400 text-stone-950 shadow-md scale-102' 
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    language === 'hi' 
                      ? 'bg-amber-400 text-stone-950 shadow-md scale-102' 
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* HERO SECTION WITH WEB SPEECH API & INSTANT FILTER */}
      <section className="bg-gradient-to-b from-emerald-900/10 to-transparent py-8 px-4 sm:px-6 lg:px-8 border-b border-stone-200 print:hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            {language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಅರ್ಹತಾ ಮಾರ್ಗದರ್ಶಿ' : language === 'hi' ? 'सरकारी योजनाएं एवं पात्रता सहायता' : 'Find Your Government Schemes in Seconds'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
            {language === 'kn' 
              ? 'ಧ್ವನಿ ಮೂಲಕ ಮಾತನಾಡಿ ಅಥವಾ ಕೀವರ್ಡ್ ಟೈಪ್ ಮಾಡಿ ತಕ್ಷಣ ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ.' 
              : language === 'hi' 
              ? 'अपनी भाषा में बोलें या टाइप करें और सटीक सरकारी योजनाओं की जानकारी प्राप्त करें।' 
              : 'Search directly by voice in Kannada, Hindi, or English or type to explore Central & Karnataka state welfare.'}
          </p>

          {/* Search Bar + Microphone Action */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <div className={`flex items-center bg-white rounded-2xl shadow-md border-2 transition-all p-1.5 ${
              isListening ? 'border-amber-500 ring-4 ring-amber-400/20 shadow-lg' : 'border-emerald-700/30 hover:border-emerald-600'
            }`}>
              <Search className="w-5 h-5 text-stone-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim()) {
                    setViewFilter('all');
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    scrollToResults();
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="w-full px-3 py-2.5 text-sm sm:text-base bg-transparent focus:outline-none text-stone-800 placeholder-stone-400"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-2.5 py-1 text-xs font-semibold text-stone-500 hover:text-stone-800 bg-stone-100 rounded-lg mr-2"
                >
                  Clear
                </button>
              )}

              {/* Speech Recognition Button */}
              <button
                onClick={toggleSpeechRecognition}
                title={isListening ? "Stop Listening" : "Speak to Search"}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm ${
                  isListening 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-amber-300" />
                    <span className="hidden sm:inline">{t.voiceButton}</span>
                  </>
                )}
              </button>
            </div>

            {/* Listening Indicator */}
            {isListening && (
              <div className="mt-2 text-xs font-semibold text-amber-700 flex items-center justify-center gap-1.5 animate-bounce">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>{t.voiceListening}</span>
              </div>
            )}

            {/* Clean Dismissible Microphone Blocked Badge */}
            {speechBlocked && (
              <div className="mt-3 mx-auto max-w-xl p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-center justify-between gap-3 shadow-sm transition-all">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 bg-amber-200/80 rounded-lg text-amber-800 flex-shrink-0">
                    <MicOff className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-left">
                    Mic permission blocked by browser preview. You can type or use the quick tags below.
                  </span>
                </div>
                <button
                  onClick={() => setSpeechBlocked(false)}
                  className="text-amber-700 hover:text-amber-950 p-1.5 rounded-lg hover:bg-amber-200/60 transition flex-shrink-0"
                  title="Dismiss notice"
                  aria-label="Dismiss notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {speechError && !speechBlocked && (
              <div className="mt-2 text-xs text-rose-600 font-medium">
                {speechError}
              </div>
            )}

            {/* Quick Trigger Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-stone-600">
              <span className="font-semibold text-stone-500">Quick:</span>
              <button onClick={() => handleQuickTag('Farmer')} className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 rounded-lg border border-stone-200 transition font-medium">🌾 Farmer / ರೈತ</button>
              <button onClick={() => handleQuickTag('Women')} className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-800 hover:border-rose-300 rounded-lg border border-stone-200 transition font-medium">🌸 Women / ಮಹಿಳೆ</button>
              <button onClick={() => handleQuickTag('Student')} className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 rounded-lg border border-stone-200 transition font-medium">🎓 Student / ಯುವ ನಿಧಿ</button>
              <button onClick={() => handleQuickTag('Street Vendor')} className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 rounded-lg border border-stone-200 transition font-medium">🏪 Vendor / ಬೀದಿ ವ್ಯಾಪಾರಿ</button>
              <button onClick={() => handleQuickTag('Daily-wage')} className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 rounded-lg border border-stone-200 transition font-medium">⛏️ MGNREGA / ಕೂಲಿ</button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* INTERACTIVE ELIGIBILITY ASSESSMENT WIZARD */}
        <section className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-emerald-700" />
                {t.evalTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {t.evalSubtitle}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setAge(26);
                  setGender('Female');
                  setOccupation('Farmer');
                  setAnnualIncome(120000);
                  setCasteCategory('OBC');
                  setLandAcres(2.5);
                  setHasEvaluated(false);
                }}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 px-3 py-1.5 bg-stone-100 rounded-lg hover:bg-stone-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetBtn}</span>
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Age */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                {t.ageLabel}: <span className="text-emerald-700 font-extrabold">{age || '0'}</span>
              </label>
              <input
                type="number"
                min="0"
                max="110"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                {t.genderLabel}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Female', 'Male', 'All'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      gender === g 
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm' 
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {g === 'Female' ? (language === 'kn' ? 'ಮಹಿಳೆ' : language === 'hi' ? 'महिला' : 'Female') :
                     g === 'Male' ? (language === 'kn' ? 'ಪುರುಷ' : language === 'hi' ? 'पुरुष' : 'Male') : 
                     (language === 'kn' ? 'ಎಲ್ಲರೂ' : language === 'hi' ? 'अन्य / सभी' : 'All')}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                {t.occLabel}
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white transition font-medium"
              >
                <option value="Farmer">{language === 'kn' ? 'ರೈತರು (Farmer)' : language === 'hi' ? 'किसान (Farmer)' : 'Farmer (Cultivator)'}</option>
                <option value="Daily-wage">{language === 'kn' ? 'ದೈನಂದಿನ ಕೂಲಿ ಕಾರ್ಮಿಕರು (Daily-wage)' : language === 'hi' ? 'दैनिक मजदूर (Daily-wage)' : 'Daily-wage / Rural Worker'}</option>
                <option value="Street Vendor">{language === 'kn' ? 'ಬೀದಿ ವ್ಯಾಪಾರಿಗಳು (Street Vendor)' : language === 'hi' ? 'स्ट्रीट वेंडर (Street Vendor)' : 'Street Vendor / Hawker'}</option>
                <option value="Artisan">{language === 'kn' ? 'ಕುಶಲಕರ್ಮಿಗಳು (Artisan / 18 Trades)' : language === 'hi' ? 'शिल्पकार / कारीगर (Artisan)' : 'Artisan / Traditional Craftsperson'}</option>
                <option value="Student">{language === 'kn' ? 'ವಿದ್ಯಾರ್ಥಿ (Student)' : language === 'hi' ? 'विद्यार्थी (Student)' : 'Student'}</option>
                <option value="Unemployed">{language === 'kn' ? 'ನಿರುದ್ಯೋಗಿ ಪದವೀಧರರು (Unemployed)' : language === 'hi' ? 'बेरोजगार (Unemployed)' : 'Unemployed Graduate / Diploma'}</option>
                <option value="Other">{language === 'kn' ? 'ಇತರ ನಾಗರಿಕರು (Other)' : language === 'hi' ? 'अन्य नागरिक (Other)' : 'Other General Citizen'}</option>
              </select>
            </div>

            {/* Annual Household Income */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                {t.incomeLabel}: <span className="text-emerald-700 font-extrabold">₹{annualIncome ? Number(annualIncome).toLocaleString() : 0}</span>
              </label>
              <input
                type="number"
                step="10000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
              <div className="flex gap-2 pt-0.5">
                <button type="button" onClick={() => setAnnualIncome(90000)} className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-600">BPL (&lt; ₹1L)</button>
                <button type="button" onClick={() => setAnnualIncome(145000)} className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-600">₹1.45L</button>
                <button type="button" onClick={() => setAnnualIncome(250000)} className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-600">₹2.5L</button>
              </div>
            </div>

            {/* Social / Caste Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                {t.casteLabel}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['General', 'OBC', 'SC', 'ST'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCasteCategory(cat)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      casteCategory === cat
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Landholding */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">
                {t.landLabel}: <span className="text-emerald-700 font-extrabold">{landAcres || 0} Acres</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={landAcres}
                onChange={(e) => setLandAcres(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
              />
              <div className="flex gap-2 pt-0.5">
                <button type="button" onClick={() => setLandAcres(0)} className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-600">Landless (0)</button>
                <button type="button" onClick={() => setLandAcres(2.0)} className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-600">Small (2 Ac)</button>
                <button type="button" onClick={() => setLandAcres(4.5)} className="text-[10px] bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded text-stone-600">4.5 Ac</button>
              </div>
            </div>

          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Calculates 100% matches and near-miss welfare opportunities instantly.</span>
            </div>

            <button
              onClick={() => {
                setHasEvaluated(true);
                setViewFilter('eligible');
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t.checkBtn}</span>
            </button>
          </div>
        </section>

        {/* RESULTS SECTION: TAB TOGGLES & SCHEME CARDS */}
        <section id="schemes-results" ref={schemesSectionRef} className="space-y-6 scroll-mt-6">
          
          {/* View Filter Tabs: All Schemes vs Eligible for Me vs Near-Miss */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div className="inline-flex rounded-2xl bg-white p-1.5 border border-stone-200 shadow-sm">
              <button
                onClick={() => setViewFilter('all')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  viewFilter === 'all'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.allTab} ({SCHEMES.length})
              </button>
              <button
                onClick={() => setViewFilter('eligible')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  viewFilter === 'eligible'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.eligibleTab}</span>
                <span className="text-[11px] bg-emerald-700/80 px-2 py-0.2 rounded-full text-white ml-1">
                  {evaluatedSchemes.filter(s => s.isEligible).length}
                </span>
              </button>
              <button
                onClick={() => setViewFilter('near_miss')}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
                  viewFilter === 'near_miss'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.nearMissTab}</span>
                <span className="text-[11px] bg-amber-500/80 px-2 py-0.2 rounded-full text-white ml-1">
                  {evaluatedSchemes.filter(s => s.isNearMiss).length}
                </span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs py-1">
              {(['All', 'Agriculture', 'Women', 'Youth', 'Artisan', 'Credit', 'Healthcare'] as CategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 gap-6">
            {displayedSchemes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
                <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
                <h3 className="text-base font-bold text-stone-800">
                  {language === 'kn' ? 'ಯಾವುದೇ ಯೋಜನೆಗಳು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ' : 'No schemes match the selected filters.'}
                </h3>
                <p className="text-xs text-stone-500">
                  Try adjusting citizen income, age, or reset search keywords.
                </p>
                <button
                  onClick={() => { setViewFilter('all'); setSearchQuery(''); setSelectedCategory('All'); }}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Show All 10 Schemes
                </button>
              </div>
            ) : (
              displayedSchemes.map(({ scheme, isEligible, isNearMiss, marginalNote }) => {
                const meta = getCategoryMeta(scheme.category);
                const Icon = meta.icon;
                const isExpanded = expandedSchemeId === scheme.id;
                const isSpeakingThis = speakingSchemeId === scheme.id;

                return (
                  <div
                    key={scheme.id}
                    className={`bg-white rounded-3xl shadow-sm border transition-all overflow-hidden print:border-black print:shadow-none ${
                      isEligible 
                        ? 'border-emerald-300 ring-1 ring-emerald-500/15' 
                        : isNearMiss 
                        ? 'border-amber-300 bg-amber-50/20' 
                        : 'border-stone-200'
                    }`}
                  >
                    {/* Top Row: Category, Level, Title, Audio & Portal Button */}
                    <div className="p-6 sm:p-7 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-2xl border ${meta.color} flex-shrink-0 print:border-black`}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${meta.color}`}>
                                {scheme.category}
                              </span>

                              {scheme.isKarnatakaState ? (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-amber-700" />
                                  {t.karnatakaTag}
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
                                  {t.centralTag}
                                </span>
                              )}

                              {isEligible && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  {t.qualifiedBadge}
                                </span>
                              )}

                              {isNearMiss && !isEligible && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-amber-800" />
                                  {t.nearMissBadge}
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                              {getSchemeTitle(scheme)}
                            </h3>

                            {language !== 'en' && (
                              <p className="text-xs text-stone-500 font-medium mt-0.5">
                                {scheme.name}
                              </p>
                            )}

                            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>{scheme.ministry}</span>
                            </p>
                          </div>
                        </div>

                        {/* Top Right Action Buttons: Text to Speech & Portal Link */}
                        <div className="flex items-center space-x-2 self-start flex-shrink-0 print:hidden">
                          {/* Audio Listen Button */}
                          <button
                            onClick={() => speakScheme(scheme)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border shadow-sm ${
                              isSpeakingThis 
                                ? 'bg-amber-500 text-white border-amber-600 animate-pulse' 
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {isSpeakingThis ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                            <span>{isSpeakingThis ? t.stopBtn : t.listenBtn}</span>
                          </button>

                          {/* Direct Official Link */}
                          <a
                            href={scheme.official_portal_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white transition flex items-center space-x-1.5 shadow-sm"
                          >
                            <span>{t.portalBtn}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Brief Description */}
                      <p className="mt-3.5 text-sm sm:text-base text-stone-700 leading-relaxed bg-stone-50/80 p-4 rounded-2xl border border-stone-100">
                        {getSchemeDescription(scheme)}
                      </p>

                      {/* Direct Financial Benefits Callout */}
                      <div className="mt-3 flex items-start space-x-2.5 text-xs sm:text-sm bg-amber-50/90 border border-amber-300/70 p-3.5 rounded-2xl text-amber-950">
                        <Coins className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold text-amber-900">{t.benefitsLabel} </strong>
                          <span>{getSchemeBenefits(scheme)}</span>
                        </div>
                      </div>

                      {/* Near Miss Explanatory Notice */}
                      {isNearMiss && !isEligible && (
                        <div className="mt-2 text-xs bg-amber-100/70 border border-amber-300 p-2.5 rounded-xl text-amber-950 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                          <div>
                            <strong className="font-semibold">Notice: </strong>
                            <span>{marginalNote}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Bar: Expandable Documents and Details */}
                    <div className="px-6 sm:px-7 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3 text-stone-500">
                        <span>Target: <strong className="text-stone-800">{scheme.eligibility_criteria.occupations.join(', ')}</strong></span>
                        <span>•</span>
                        <span>Docs: <strong className="text-stone-800">{scheme.required_documents.length}</strong></span>
                      </div>

                      <button
                        onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                        className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 print:hidden"
                      >
                        <span>{isExpanded ? 'Hide Documents & Criteria' : 'View Checklist & Rules'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expanded Checklist & Criteria Section */}
                    {isExpanded && (
                      <div className="p-6 sm:p-7 bg-stone-50/50 border-t border-stone-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Left: Detailed Eligibility Rules */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                              Official Eligibility Parameters
                            </h4>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="p-3 bg-white rounded-xl border border-stone-200">
                                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Age Limit</span>
                                <span className="font-bold text-stone-800">
                                  {scheme.eligibility_criteria.min_age ?? 'No Min'} to {scheme.eligibility_criteria.max_age ?? 'No Max'} Yrs
                                </span>
                              </div>

                              <div className="p-3 bg-white rounded-xl border border-stone-200">
                                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Gender</span>
                                <span className="font-bold text-stone-800">
                                  {scheme.eligibility_criteria.gender}
                                </span>
                              </div>

                              <div className="p-3 bg-white rounded-xl border border-stone-200">
                                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Income Ceiling</span>
                                <span className="font-bold text-stone-800">
                                  {scheme.eligibility_criteria.max_annual_income 
                                    ? `₹${scheme.eligibility_criteria.max_annual_income.toLocaleString()} max` 
                                    : 'No Ceiling / Ration card'}
                                </span>
                              </div>

                              <div className="p-3 bg-white rounded-xl border border-stone-200">
                                <span className="text-stone-400 block text-[10px] font-semibold uppercase">Land Limit</span>
                                <span className="font-bold text-stone-800">
                                  {scheme.eligibility_criteria.land_holding_max_acres 
                                    ? `${scheme.eligibility_criteria.land_holding_max_acres} acres max` 
                                    : 'Any / None'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Required Documents with interactive checkboxes */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-emerald-700" />
                              {t.docsLabel}
                            </h4>

                            <div className="space-y-2">
                              {scheme.required_documents.map(doc => {
                                const isChecked = !!checkedDocs[doc];
                                return (
                                  <label
                                    key={doc}
                                    onClick={() => setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }))}
                                    className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition text-xs ${
                                      isChecked
                                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => {}}
                                      className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
                                    />
                                    <span className="flex-1">{doc}</span>
                                    {isChecked && (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded">
                                        Ready
                                      </span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* MASTER CONSOLIDATED DOCUMENT CHECKLIST & PRINT SECTION */}
        <section className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-emerald-700" />
                {t.checklistTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {t.checklistSubtitle}
              </p>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="self-start sm:self-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 shadow-sm print:hidden"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{t.printBtn}</span>
            </button>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterDocumentList.map(({ docName, schemes }) => {
              const isChecked = !!checkedDocs[docName];
              return (
                <div
                  key={docName}
                  onClick={() => setCheckedDocs(prev => ({ ...prev, [docName]: !prev[docName] }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-start space-x-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20'
                      : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-1 rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isChecked ? 'text-emerald-950' : 'text-stone-800'}`}>
                        {docName}
                      </span>
                      {isChecked && (
                        <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                          Verified Ready
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Required for: <strong className="text-stone-700">{schemes.map(s => s.split('(')[0].trim()).join(', ')}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-bold text-stone-700">SevaSetu Community Project</p>
            <p className="text-stone-400">East Point College of Engineering and Technology (EPCET), Bangalore</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-stone-400">10 Verified Schemes</span>
            <span>•</span>
            <span className="text-stone-400">Web Speech & TTS Enabled</span>
            <span>•</span>
            <span className="text-stone-400">Trilingual (EN, KN, HI)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
