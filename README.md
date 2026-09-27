# 🩺 HealthLens AI — Multi-User Clinical Health & Diagnostics Platform

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![Capacitor Android](https://img.shields.io/badge/Capacitor-Android_8.0-3880FF.svg)](https://capacitorjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_On--Device_Offline-emerald.svg)](#-privacy--zero-knowledge-security)

> **HealthLens AI** is an intelligent, privacy-first clinical laboratory analytics and diagnostic platform built for **Web & Android**. It transforms complex blood and laboratory reports into clear, actionable health insights, organ system maps, medical specialist recommendations, viral infection screenings, and personalized dietary/supplement protocols — operating **100% on-device and offline** with optional Google Gemini cloud AI augmentation.

---

## ✨ Key Features

### 🫀 1. Organ & System Health Map + Medical Specialist Referrals
* **7 Comprehensive Organ Systems Evaluated**:
  * **Heart & Cardiovascular**: Lipids, Arterial Inflammation, Atherogenic Index (AIP) $\rightarrow$ **Cardiologist / Preventive Lipidologist**
  * **Liver & Biliary**: ALT, AST, Alkaline Phosphatase, Bilirubin, GGT $\rightarrow$ **Hepatologist / Gastroenterologist**
  * **Kidneys & Renal Clearance**: Creatinine, BUN, eGFR, Uric Acid, Electrolytes $\rightarrow$ **Nephrologist / Renal Specialist**
  * **Blood & Bone Marrow**: Hemoglobin, RBC, WBC, Platelets, Ferritin $\rightarrow$ **Hematologist**
  * **Metabolism & Pancreas**: Fasting Glucose, HbA1c, Fasting Insulin, HOMA-IR $\rightarrow$ **Endocrinologist / Diabetologist**
  * **Bones, Joints & Minerals**: 25-OH Vitamin D3, Calcium, Vitamin B12, Phosphorus $\rightarrow$ **Orthopedist / Rheumatologist**
  * **Thyroid & Endocrine**: TSH, Free T3, Free T4, Anti-TPO $\rightarrow$ **Endocrinologist / Thyroidologist**
* **Specialist Doctor Referral Cards**: Displays consultation urgency, exact clinical rationale, diagnostic follow-ups, and tailored **"Questions to Ask the Doctor"**.

---

### 🦟 2. Viral & Infectious Disease Screen (Dengue, Malaria, Typhoid)
* **Dengue Fever / Hemorrhagic Assessment**:
  * **Platelet Nadir Monitor**: Live counter with severity tiers (*Normal >150k*, *Mild 100k–150k*, *Moderate 50k–100k*, *Critical <50k*).
  * **Hemoconcentration Alert**: Detects elevated Hematocrit / PCV ($ge 46%$) indicating capillary plasma leakage.
  * **Strict Contraindication Warnings**: Warns patients to **STRICTLY AVOID** Aspirin, Ibuprofen, Diclofenac or any NSAIDs (prevents severe internal hemorrhage).
* **Malaria Screen (P. vivax & P. falciparum)**:
  * Detects hemolytic triad (Thrombocytopenia + Elevated Indirect Bilirubin + Accelerated ESR + Anemia).
* **Typhoid & Enteric Fever**:
  * Step-ladder fever pattern, relative leukopenia, and hepatic transaminase elevation.
* **Acute Bacterial Infection & Sepsis Risk Alert**:
  * Severe leukocytosis ($> 12,000/mu\text{L}$), neutrophilia ($> 75%$), and acute-phase CRP elevation.
* **Gold-Standard Confirmatory Test Guides**:
  * Displays specific lab investigations for each pathogen (*Dengue NS1 Antigen ELISA, Dengue IgM/IgG, Peripheral Blood Smear for MP, Typhidot/Widal, Blood Culture*) with turnaround times and optimal timing windows.

---

### 🩺 3. Report-to-Symptom Predictor & Correlator
* **Predicts Physical Sensations from Blood Markers**:
  * *Platelets 38,000 /µL* $\rightarrow$ **Retro-orbital headache (pain behind eyes)**, **Breakbone joint aches**, **Petechiae / tiny red skin spots**.
  * *Hemoglobin 8.2 g/dL* $\rightarrow$ **Exertional breathlessness**, **Postural lightheadedness upon standing**.
  * *Vitamin D 6.81 ng/mL* $\rightarrow$ **Deep lower back & shin bone aches**, **Muscle weakness**.
  * *Bilirubin 2.8 mg/dL* $\rightarrow$ **Yellowish tint in eyes (sclera)**, **Tea-colored urine**.
  * *Fasting Glucose 180 mg/dL* $\rightarrow$ **Excessive thirst**, **Frequent nighttime urination**.
* **Interactive Patient Confirmation**: Patients can check off symptoms they are experiencing to compute a real-time **Clinical Alignment Score**.

---

### 🎯 4. Functional Longevity Dual-Range Targets
* Compares standard laboratory reference intervals with strict functional medicine longevity targets:
  * *Vitamin D3*: Standard $ge 30\text{ ng/mL}$ vs. Longevity **$50 - 80\text{ ng/mL}$**
  * *HbA1c*: Standard $< 5.7%$ vs. Longevity **$4.8 - 5.4%$**
  * *Triglycerides*: Standard $< 150\text{ mg/dL}$ vs. Longevity **$50 - 100\text{ mg/dL}$**
  * *hs-CRP*: Standard $< 3.0\text{ mg/L}$ vs. Longevity **$0.1 - 0.8\text{ mg/L}$**
  * *TSH*: Standard $0.4 - 4.5\text{ \mu IU/mL}$ vs. Longevity **$1.0 - 2.5\text{ \mu IU/mL}$**

---

### 📷 5. Live Paper Report Camera Scanner & Document Enhancer
* Snaps photos of physical paper lab printouts directly using the mobile camera or file picker.
* Real-time **High Contrast** and **Black & White Document Scan** filters to enhance faded ink and table borders for maximum OCR accuracy.

---

### 🗓️ 6. Automated Lab Retest Reminders (`.ICS`)
* Generates personalized follow-up test schedules with fasting prep rules (e.g., *10-12 hours fasting, hydration guidelines*).
* **1-Click `.ICS` Download**: Adds directly to Google Calendar, Apple Calendar, Android, or Outlook.

---

### 💊 7. Daily Supplement & Medication Adherence Tracker
* Checklists categorized by time of day: Morning (Breakfast), Afternoon (Lunch), Evening (Dinner / Bedtime).
* Daily compliance percentage meter with persistent local memory storage.

---

### 🛡️ 8. Encrypted Local Data Vault (AES-256 Backup & Restore)
* Password-protects all stored family profiles, report histories, and medication logs with **256-bit AES-GCM encryption** (PBKDF2 key derivation, 100,000 iterations).
* Export and restore `.healthvault` files across devices with zero cloud dependency.

---

### 👨‍👩‍👧‍👦 9. Multi-User Family Management & Historical Trends
* Isolated user profiles (*Self, Priya, Rohan, Dad, Mom*).
* Side-by-side date comparison with $\pm\%$ delta calculations.
* Permanent profile deletion and factory reset options.

---

### 🌐 10. Multi-Language & Voice Narration
* **5 Languages**: English, Hindi (हिंदी), Marathi (मराठी), Gujarati (ગુજરાતી), and Spanish (Español).
* Audio SpeechSynthesis voice reader for medical summaries.
* 1-Click formatted WhatsApp clinical summary sharing.

---

## 🏗️ Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Mobile Runtime** | Capacitor Android 8.0 (@capacitor/camera, @capacitor/filesystem) |
| **Cryptography** | Web Crypto API (SubtleCrypto: AES-GCM 256-bit, PBKDF2 with SHA-256) |
| **AI Augmentation** | Google Gemini API (@google/genai SDK) |
| **Offline Diagnostics** | Rule-Based Pattern Matcher & Clinical Diagnostic Inference Engine |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/health-lens-ai.git
cd health-lens-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📱 Android APK Compilation

### Prerequisites
- [Android Studio](https://developer.android.com/studio) or Android SDK with Command-line Tools
- Java Development Kit (JDK 17 or 21)

### Build Steps
```bash
# 1. Compile web assets
npm run build

# 2. Sync with Android Capacitor runtime
npx cap sync android

# 3. Build standalone debug APK
cd android
.\\gradlew.bat assembleDebug
```

The compiled APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔒 Privacy & Zero-Knowledge Security

* **100% On-Device by Default**: Blood test reports, patient demographics, and health histories are stored locally in the browser/device local storage.
* **No Unsolicited Cloud Uploads**: The application operates fully offline with built-in medical rule engines.
* **Encrypted Backups**: Exports are encrypted with military-grade AES-256-GCM.
* **Full Data Ownership**: Users can delete individual profiles or wipe all app data in 1 click.

---

## ⚠️ Medical Disclaimer

HealthLens AI is an educational and analytical tool designed to help patients understand laboratory blood reports and organize clinical discussions with their healthcare providers. It is **not a substitute for professional medical diagnosis, clinical judgment, or treatment**. Always seek the advice of a qualified physician or healthcare specialist with any questions regarding medical conditions.

---

## 📄 License

Distributed under the **MIT License**.
