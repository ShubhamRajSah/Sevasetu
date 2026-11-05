"""
SevaSetu - Government Scheme Awareness for Betterment of Livelihood
backend/main.py

FastAPI backend providing REST endpoints for scheme discovery,
fine-grained citizen eligibility matching with near-miss detection,
de-duplicated document checklist aggregation, and trilingual voice keyword search.
"""

from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Support running either from workspace root or inside backend/ directory
try:
    from backend.schemes_data import SCHEMES
except ImportError:
    from schemes_data import SCHEMES

# Initialize FastAPI app
app = FastAPI(
    title="SevaSetu API",
    description="Government Scheme Awareness & Livelihood Eligibility Evaluation API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware so frontend applications never encounter cross-origin blocking
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 1. Pydantic Request & Response Models
# ==========================================

class CitizenProfile(BaseModel):
    age: int = Field(..., ge=0, le=125, description="Age of the applicant in years")
    gender: str = Field(..., description="Gender: 'Female', 'Male', or 'All'")
    annual_income: float = Field(..., ge=0, description="Total annual family income in Indian Rupees (INR)")
    occupation: str = Field(..., description="Primary occupation (e.g., 'Farmer', 'Street Vendor', 'Artisan', 'Student', 'Unemployed')")
    caste_category: str = Field(..., description="Social or caste category: 'General', 'OBC', 'SC', 'ST'")
    land_acres: float = Field(default=0.0, ge=0, description="Agricultural landholding in acres")


class VoiceQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Spoken/text query transcribed in English, Kannada, or Hindi")


class NearMissScheme(BaseModel):
    scheme: Dict[str, Any]
    failed_criteria: List[str]
    near_miss_reason: str


class EligibilityResponse(BaseModel):
    eligible_count: int
    near_miss_count: int
    eligible: List[Dict[str, Any]]
    near_miss: List[NearMissScheme]
    required_documents: List[str]


class VoiceQueryResponse(BaseModel):
    query: str
    detected_language: str
    matched_keywords: List[str]
    matched_scheme_ids: List[str]
    schemes: List[Dict[str, Any]]
    message: str


# ==========================================
# 2. API Endpoints
# ==========================================

@app.get("/")
def root():
    return {
        "app": "SevaSetu API",
        "tagline": "Government Scheme Awareness for Betterment of Livelihood",
        "total_schemes": len(SCHEMES),
        "endpoints": [
            "GET /api/schemes",
            "GET /api/schemes/{scheme_id}",
            "POST /api/check-eligibility",
            "POST /api/voice-query"
        ]
    }


@app.get("/api/schemes", response_model=List[Dict[str, Any]])
def get_schemes(category: Optional[str] = Query(None, description="Filter by category (e.g. Agriculture, Women, Youth, Artisan, Credit, Healthcare)")):
    """
    Returns all 10 Central and Karnataka state schemes.
    Supports optional case-insensitive query parameter ?category=
    """
    if category:
        filtered = [s for s in SCHEMES if s.get("category", "").lower() == category.lower()]
        return filtered
    return SCHEMES


@app.get("/api/schemes/{scheme_id}", response_model=Dict[str, Any])
def get_scheme_by_id(scheme_id: str):
    """
    Returns details for a single scheme or raises 404 if not found.
    """
    for scheme in SCHEMES:
        if scheme["id"].lower() == scheme_id.lower():
            return scheme
    raise HTTPException(status_code=404, detail=f"Scheme with ID '{scheme_id}' was not found in SevaSetu repository.")


@app.post("/api/check-eligibility", response_model=EligibilityResponse)
def check_eligibility(profile: CitizenProfile):
    """
    Evaluates citizen profile against all government schemes:
    - eligible: schemes matching all criteria.
    - near_miss: schemes failing by only ONE parameter (e.g. income slightly exceeding ceiling or age within 2 years).
    - required_documents: a de-duplicated master checklist across all matched eligible schemes.
    """
    eligible_schemes: List[Dict[str, Any]] = []
    near_miss_schemes: List[NearMissScheme] = []
    all_docs_set = set()

    for scheme in SCHEMES:
        crit = scheme.get("eligibility_criteria", {})
        failed_params: List[str] = []
        is_marginal_failure = False
        marginal_explanation = ""

        # 1. Age Evaluation
        min_age = crit.get("min_age")
        max_age = crit.get("max_age")
        if min_age is not None and profile.age < min_age:
            diff = min_age - profile.age
            failed_params.append(f"Minimum age required is {min_age} years (applicant is {profile.age})")
            if diff <= 2:
                is_marginal_failure = True
                marginal_explanation = f"Age is {profile.age}, within 2 years of the required minimum age ({min_age})."
        elif max_age is not None and profile.age > max_age:
            diff = profile.age - max_age
            failed_params.append(f"Maximum age allowed is {max_age} years (applicant is {profile.age})")
            if diff <= 2:
                is_marginal_failure = True
                marginal_explanation = f"Age is {profile.age}, within 2 years of the maximum age ceiling ({max_age})."

        # 2. Gender Evaluation
        scheme_gender = crit.get("gender", "All")
        if scheme_gender != "All" and profile.gender != "All":
            if scheme_gender.lower() != profile.gender.lower():
                failed_params.append(f"Scheme is specifically intended for {scheme_gender} beneficiaries")

        # 3. Income Evaluation
        max_income = crit.get("max_annual_income")
        if max_income is not None and profile.annual_income > max_income:
            income_excess = profile.annual_income - max_income
            pct_excess = (income_excess / max_income) * 100
            failed_params.append(f"Maximum annual income is ₹{max_income:,.0f} (applicant declared ₹{profile.annual_income:,.0f})")
            # If income exceeds by 15% or less, or within ₹25,000, consider it a near-miss
            if pct_excess <= 15 or income_excess <= 25000:
                is_marginal_failure = True
                marginal_explanation = f"Income of ₹{profile.annual_income:,.0f} marginally exceeds ceiling of ₹{max_income:,.0f} by {pct_excess:.1f}%."

        # 4. Occupation Evaluation
        occupations = crit.get("occupations", ["All"])
        if "All" not in occupations and profile.occupation not in occupations:
            failed_params.append(f"Designated for occupations: {', '.join(occupations)} (applicant is {profile.occupation})")

        # 5. Caste / Social Category Evaluation
        caste_categories = crit.get("caste_categories", ["All"])
        if "All" not in caste_categories and profile.caste_category not in caste_categories:
            failed_params.append(f"Reserved for categories: {', '.join(caste_categories)} (applicant is {profile.caste_category})")

        # 6. Landholding Evaluation
        max_land = crit.get("land_holding_max_acres")
        if max_land is not None and profile.land_acres > max_land:
            land_excess = profile.land_acres - max_land
            failed_params.append(f"Landholding capped at {max_land} acres (applicant holds {profile.land_acres} acres)")
            if land_excess <= 1.0:
                is_marginal_failure = True
                marginal_explanation = f"Landholding of {profile.land_acres} acres is within 1 acre of the {max_land}-acre ceiling."

        # Decision Logic:
        # Case A: Passes all criteria
        if len(failed_params) == 0:
            eligible_schemes.append(scheme)
            for doc in scheme.get("required_documents", []):
                all_docs_set.add(doc)

        # Case B: Fails by only ONE single parameter
        elif len(failed_params) == 1:
            reason = marginal_explanation if is_marginal_failure else f"Missed eligibility by 1 criterion: {failed_params[0]}"
            near_miss_schemes.append(
                NearMissScheme(
                    scheme=scheme,
                    failed_criteria=failed_params,
                    near_miss_reason=reason
                )
            )

    # Master de-duplicated documents sorted alphabetically
    master_documents = sorted(list(all_docs_set))

    return EligibilityResponse(
        eligible_count=len(eligible_schemes),
        near_miss_count=len(near_miss_schemes),
        eligible=eligible_schemes,
        near_miss=near_miss_schemes,
        required_documents=master_documents
    )


# ==========================================
# 3. Trilingual Voice Query Keyword Mappings
# ==========================================

KEYWORD_TO_SCHEMES: Dict[str, Dict[str, Any]] = {
    # Agriculture / Farmers
    "farmer": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana", "mgnrega"], "lang": "en"},
    "farmers": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana", "mgnrega"], "lang": "en"},
    "kisan": {"schemes": ["pm-kisan", "raitha-siri"], "lang": "en"},
    "agriculture": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana", "mgnrega"], "lang": "en"},
    "crop": {"schemes": ["pm-kisan", "raitha-siri"], "lang": "en"},
    "millet": {"schemes": ["raitha-siri"], "lang": "en"},
    "ragi": {"schemes": ["raitha-siri"], "lang": "en"},
    "borewell": {"schemes": ["ganga-kalyana"], "lang": "en"},
    "irrigation": {"schemes": ["ganga-kalyana"], "lang": "en"},
    "pump": {"schemes": ["ganga-kalyana"], "lang": "en"},
    "water": {"schemes": ["ganga-kalyana"], "lang": "en"},
    "100 days": {"schemes": ["mgnrega"], "lang": "en"},
    "nrega": {"schemes": ["mgnrega"], "lang": "en"},
    "rural work": {"schemes": ["mgnrega"], "lang": "en"},

    # Kannada - Agriculture & Farmers
    "ರೈತ": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana", "mgnrega"], "lang": "kn"},
    "ರೈತರು": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana", "mgnrega"], "lang": "kn"},
    "ಕೃಷಿ": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana"], "lang": "kn"},
    "ಜಮೀನು": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana"], "lang": "kn"},
    "ಸಿರಿಧಾನ್ಯ": {"schemes": ["raitha-siri"], "lang": "kn"},
    "ರಾಗಿ": {"schemes": ["raitha-siri"], "lang": "kn"},
    "ಬೆಳೆ": {"schemes": ["raitha-siri", "pm-kisan"], "lang": "kn"},
    "ಬೋರ್‌ವೆಲ್": {"schemes": ["ganga-kalyana"], "lang": "kn"},
    "ಕೊಳವೆ ಬಾವಿ": {"schemes": ["ganga-kalyana"], "lang": "kn"},
    "ನೀರಾವರಿ": {"schemes": ["ganga-kalyana"], "lang": "kn"},
    "ಉದ್ಯೋಗ ಖಾತರಿ": {"schemes": ["mgnrega"], "lang": "kn"},
    "ಮನರೇಗಾ": {"schemes": ["mgnrega"], "lang": "kn"},
    "ಕೂಲಿ": {"schemes": ["mgnrega"], "lang": "kn"},

    # Hindi - Agriculture & Farmers
    "किसान": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana", "mgnrega"], "lang": "hi"},
    "खेती": {"schemes": ["pm-kisan", "raitha-siri"], "lang": "hi"},
    "कृषि": {"schemes": ["pm-kisan", "raitha-siri", "ganga-kalyana"], "lang": "hi"},
    "श्री अन्न": {"schemes": ["raitha-siri"], "lang": "hi"},
    "मिलेट्स": {"schemes": ["raitha-siri"], "lang": "hi"},
    "मोटे अनाज": {"schemes": ["raitha-siri"], "lang": "hi"},
    "बोरवेल": {"schemes": ["ganga-kalyana"], "lang": "hi"},
    "सिंचाई": {"schemes": ["ganga-kalyana"], "lang": "hi"},
    "मनरेगा": {"schemes": ["mgnrega"], "lang": "hi"},
    "मजदूरी": {"schemes": ["mgnrega"], "lang": "hi"},
    "100 दिन": {"schemes": ["mgnrega"], "lang": "hi"},

    # Women & Maternal Welfare
    "women": {"schemes": ["gruha-lakshmi", "pmmvy"], "lang": "en"},
    "woman": {"schemes": ["gruha-lakshmi", "pmmvy"], "lang": "en"},
    "female": {"schemes": ["gruha-lakshmi", "pmmvy"], "lang": "en"},
    "mother": {"schemes": ["pmmvy", "gruha-lakshmi"], "lang": "en"},
    "pregnant": {"schemes": ["pmmvy"], "lang": "en"},
    "pregnancy": {"schemes": ["pmmvy"], "lang": "en"},
    "maternity": {"schemes": ["pmmvy"], "lang": "en"},
    "child": {"schemes": ["pmmvy"], "lang": "en"},
    "girl child": {"schemes": ["pmmvy"], "lang": "en"},
    "homemaker": {"schemes": ["gruha-lakshmi"], "lang": "en"},
    "gruha lakshmi": {"schemes": ["gruha-lakshmi"], "lang": "en"},
    "2000": {"schemes": ["gruha-lakshmi", "pm-kisan"], "lang": "en"},

    # Kannada - Women
    "ಮಹಿಳೆ": {"schemes": ["gruha-lakshmi", "pmmvy"], "lang": "kn"},
    "ಮಹಿಳೆಯರು": {"schemes": ["gruha-lakshmi", "pmmvy"], "lang": "kn"},
    "ತಾಯಿ": {"schemes": ["pmmvy", "gruha-lakshmi"], "lang": "kn"},
    "ಗರ್ಭಿಣಿ": {"schemes": ["pmmvy"], "lang": "kn"},
    "ಬಾಣಂತಿ": {"schemes": ["pmmvy"], "lang": "kn"},
    "ಹೆರಿಗೆ": {"schemes": ["pmmvy"], "lang": "kn"},
    "ಗೃಹಲಕ್ಷ್ಮಿ": {"schemes": ["gruha-lakshmi"], "lang": "kn"},
    "ಹೆಣ್ಣು ಮಗು": {"schemes": ["pmmvy"], "lang": "kn"},

    # Hindi - Women
    "महिला": {"schemes": ["gruha-lakshmi", "pmmvy"], "lang": "hi"},
    "माता": {"schemes": ["pmmvy", "gruha-lakshmi"], "lang": "hi"},
    "गर्भवती": {"schemes": ["pmmvy"], "lang": "hi"},
    "मातृ": {"schemes": ["pmmvy"], "lang": "hi"},
    "प्रसूति": {"schemes": ["pmmvy"], "lang": "hi"},
    "गृह लक्ष्मी": {"schemes": ["gruha-lakshmi"], "lang": "hi"},
    "बेटी": {"schemes": ["pmmvy"], "lang": "hi"},

    # Youth / Students / Unemployed
    "student": {"schemes": ["yuva-nidhi"], "lang": "en"},
    "graduate": {"schemes": ["yuva-nidhi"], "lang": "en"},
    "diploma": {"schemes": ["yuva-nidhi"], "lang": "en"},
    "unemployed": {"schemes": ["yuva-nidhi", "mgnrega"], "lang": "en"},
    "youth": {"schemes": ["yuva-nidhi"], "lang": "en"},
    "allowance": {"schemes": ["yuva-nidhi"], "lang": "en"},
    "3000": {"schemes": ["yuva-nidhi"], "lang": "en"},

    # Kannada - Youth
    "ವಿದ್ಯಾರ್ಥಿ": {"schemes": ["yuva-nidhi"], "lang": "kn"},
    "ಪದವೀಧರ": {"schemes": ["yuva-nidhi"], "lang": "kn"},
    "ಡಿಪ್ಲೊಮಾ": {"schemes": ["yuva-nidhi"], "lang": "kn"},
    "ನಿರುದ್ಯೋಗಿ": {"schemes": ["yuva-nidhi", "mgnrega"], "lang": "kn"},
    "ಯುವಕ": {"schemes": ["yuva-nidhi"], "lang": "kn"},
    "ಯುವ ನಿಧಿ": {"schemes": ["yuva-nidhi"], "lang": "kn"},

    # Hindi - Youth
    "छात्र": {"schemes": ["yuva-nidhi"], "lang": "hi"},
    "विद्यार्थी": {"schemes": ["yuva-nidhi"], "lang": "hi"},
    "स्नातक": {"schemes": ["yuva-nidhi"], "lang": "hi"},
    "बेरोजगार": {"schemes": ["yuva-nidhi", "mgnrega"], "lang": "hi"},
    "युवा": {"schemes": ["yuva-nidhi"], "lang": "hi"},
    "युवा निधि": {"schemes": ["yuva-nidhi"], "lang": "hi"},

    # Vendors / Business / Credit
    "vendor": {"schemes": ["pm-svanidhi"], "lang": "en"},
    "street vendor": {"schemes": ["pm-svanidhi"], "lang": "en"},
    "hawker": {"schemes": ["pm-svanidhi"], "lang": "en"},
    "loan": {"schemes": ["pm-svanidhi", "pm-vishwakarma"], "lang": "en"},
    "svanidhi": {"schemes": ["pm-svanidhi"], "lang": "en"},
    "credit": {"schemes": ["pm-svanidhi", "pm-vishwakarma"], "lang": "en"},
    "working capital": {"schemes": ["pm-svanidhi"], "lang": "en"},

    # Kannada - Vendor
    "ಬೀದಿ ವ್ಯಾಪಾರಿ": {"schemes": ["pm-svanidhi"], "lang": "kn"},
    "ವ್ಯಾಪಾರಿ": {"schemes": ["pm-svanidhi"], "lang": "kn"},
    "ಸಾಲ": {"schemes": ["pm-svanidhi", "pm-vishwakarma"], "lang": "kn"},
    "ಸ್ವನಿಧಿ": {"schemes": ["pm-svanidhi"], "lang": "kn"},

    # Hindi - Vendor
    "स्ट्रीट वेंडर": {"schemes": ["pm-svanidhi"], "lang": "hi"},
    "रेहड़ी": {"schemes": ["pm-svanidhi"], "lang": "hi"},
    "पटरी विक्रेता": {"schemes": ["pm-svanidhi"], "lang": "hi"},
    "ऋण": {"schemes": ["pm-svanidhi", "pm-vishwakarma"], "lang": "hi"},
    "स्वनिधि": {"schemes": ["pm-svanidhi"], "lang": "hi"},

    # Artisans / Craftspeople
    "artisan": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "craftsman": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "craftsperson": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "vishwakarma": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "toolkit": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "carpenter": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "blacksmith": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "potter": {"schemes": ["pm-vishwakarma"], "lang": "en"},
    "tailor": {"schemes": ["pm-vishwakarma"], "lang": "en"},

    # Kannada - Artisan
    "ಕುಶಲಕರ್ಮಿ": {"schemes": ["pm-vishwakarma"], "lang": "kn"},
    "ವಿಶ್ವಕರ್ಮ": {"schemes": ["pm-vishwakarma"], "lang": "kn"},
    "ಟೂಲ್‌ಕಿಟ್": {"schemes": ["pm-vishwakarma"], "lang": "kn"},
    "ಬಡಗಿ": {"schemes": ["pm-vishwakarma"], "lang": "kn"},
    "ಕಮ್ಮಾರ": {"schemes": ["pm-vishwakarma"], "lang": "kn"},
    "ಕುಂಬಾರ": {"schemes": ["pm-vishwakarma"], "lang": "kn"},
    "ದರ್ಜಿ": {"schemes": ["pm-vishwakarma"], "lang": "kn"},

    # Hindi - Artisan
    "कारीगर": {"schemes": ["pm-vishwakarma"], "lang": "hi"},
    "शिल्पकार": {"schemes": ["pm-vishwakarma"], "lang": "hi"},
    "विश्वकर्मा": {"schemes": ["pm-vishwakarma"], "lang": "hi"},
    "टूलकिट": {"schemes": ["pm-vishwakarma"], "lang": "hi"},
    "बढ़ई": {"schemes": ["pm-vishwakarma"], "lang": "hi"},
    "दर्जी": {"schemes": ["pm-vishwakarma"], "lang": "hi"},

    # Healthcare
    "health": {"schemes": ["ayushman-bharat-pmjay"], "lang": "en"},
    "hospital": {"schemes": ["ayushman-bharat-pmjay"], "lang": "en"},
    "ayushman": {"schemes": ["ayushman-bharat-pmjay"], "lang": "en"},
    "treatment": {"schemes": ["ayushman-bharat-pmjay"], "lang": "en"},
    "insurance": {"schemes": ["ayushman-bharat-pmjay"], "lang": "en"},
    "5 lakh": {"schemes": ["ayushman-bharat-pmjay"], "lang": "en"},
    "arogya": {"schemes": ["ayushman-bharat-pmjay"], "lang": "en"},

    # Kannada - Healthcare
    "ಆರೋಗ್ಯ": {"schemes": ["ayushman-bharat-pmjay"], "lang": "kn"},
    "ಆಸ್ಪತ್ರೆ": {"schemes": ["ayushman-bharat-pmjay"], "lang": "kn"},
    "ಚಿಕಿತ್ಸೆ": {"schemes": ["ayushman-bharat-pmjay"], "lang": "kn"},
    "ವಿಮೆ": {"schemes": ["ayushman-bharat-pmjay"], "lang": "kn"},
    "ಆಯುಷ್ಮಾನ್": {"schemes": ["ayushman-bharat-pmjay"], "lang": "kn"},

    # Hindi - Healthcare
    "स्वास्थ्य": {"schemes": ["ayushman-bharat-pmjay"], "lang": "hi"},
    "अस्पताल": {"schemes": ["ayushman-bharat-pmjay"], "lang": "hi"},
    "इलाज": {"schemes": ["ayushman-bharat-pmjay"], "lang": "hi"},
    "बीमा": {"schemes": ["ayushman-bharat-pmjay"], "lang": "hi"},
    "आयुष्मान": {"schemes": ["ayushman-bharat-pmjay"], "lang": "hi"}
}


@app.post("/api/voice-query", response_model=VoiceQueryResponse)
def voice_query(request: VoiceQueryRequest):
    """
    Extracts keywords from voice/spoken transcription in English, Kannada, or Hindi,
    and returns matched welfare schemes with a localized assistant response.
    """
    raw_query = request.query.strip().lower()
    matched_scheme_ids_set = set()
    matched_keywords_list = []
    detected_langs_count = {"en": 0, "kn": 0, "hi": 0}

    # Evaluate query against keyword dictionary
    for kw, meta in KEYWORD_TO_SCHEMES.items():
        if kw in raw_query:
            matched_keywords_list.append(kw)
            detected_langs_count[meta["lang"]] += 1
            for s_id in meta["schemes"]:
                matched_scheme_ids_set.add(s_id)

    # Determine primary language
    primary_lang = max(detected_langs_count, key=detected_langs_count.get)
    if detected_langs_count[primary_lang] == 0:
        primary_lang = "en"

    # Fetch corresponding scheme objects preserving original sequence
    matched_schemes = [s for s in SCHEMES if s["id"] in matched_scheme_ids_set]

    # Generate localized assistant feedback message
    if not matched_schemes:
        if primary_lang == "kn":
            msg = f"ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ಯೋಜನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ ('{request.query}'). ದಯವಿಟ್ಟು ರೈತ, ಗೃಹಲಕ್ಷ್ಮಿ, ನಿರುದ್ಯೋಗಿ, ಸಾಲ, ಆಯುಷ್ಮಾನ್ ಮೊದಲಾದ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ."
        elif primary_lang == "hi":
            msg = f"'{request.query}' के लिए कोई संबंधित योजना नहीं मिली। कृपया किसान, महिला, युवा, स्वनिधि, या आयुष्मान जैसे शब्दों का प्रयोग करें।"
        else:
            msg = f"No matching schemes found for '{request.query}'. Try searching for terms like 'farmer', 'women', 'student', 'vendor', or 'artisan'."
    else:
        count = len(matched_schemes)
        if primary_lang == "kn":
            msg = f"ನಿಮ್ಮ ಧ್ವನಿ ಪ್ರಶ್ನೆಗಾಗಿ {count} ಯೋಜನೆಗಳು ಪತ್ತೆಯಾಗಿವೆ ({', '.join(matched_keywords_list)})."
        elif primary_lang == "hi":
            msg = f"आपकी वॉयस क्वेरी के लिए {count} प्रासंगिक योजनाएं मिलीं ({', '.join(matched_keywords_list)})."
        else:
            msg = f"Found {count} matching welfare scheme(s) based on keyword(s): {', '.join(matched_keywords_list)}."

    return VoiceQueryResponse(
        query=request.query,
        detected_language=primary_lang,
        matched_keywords=matched_keywords_list,
        matched_scheme_ids=list(matched_scheme_ids_set),
        schemes=matched_schemes,
        message=msg
    )


if __name__ == "__main__":
    import uvicorn
    # Allows running directly via `python backend/main.py`
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
