/**
 * Language Context for managing Hebrew/English translations and RTL/LTR layout
 * Default language is English (LTR)
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Translations object
export const translations = {
  english: {
    // Navigation
    home: "Home",
    qrScan: "QR Scan", 
    settings: "Settings",
    
    // OTP Component
    enterPhone: "Enter phone number",
    sendCode: "Send Code",
    enterOtp: "Enter verification code",
    verifyCode: "Verify Code",
    phoneVerification: "Phone Number Verification",
    invalidPhone: "Please enter a valid phone number",
    invalidOtp: "Please enter a valid verification code",
    otpSendFailed: "Failed to send verification code",
    otpSendError: "Error sending verification code",
    wrongOtp: "Wrong verification code",
    otpVerifyError: "Error verifying code",
    testModePhone: "In test mode, enter phone number 1234",
    testModeOtp: "In test mode, enter verification code 1234",
    autoFillNote: "Code will auto-fill when SMS is received",
    testingNote: "For testing: enter 1234",
    sending: "Sending...",
    verifying: "Verifying...",
    
    // General
    loading: "Loading...",
    error: "Error",
    success: "Success",
    continue: "Continue",
    cancel: "Cancel",
    
    // Device Information
    deviceInfo: "Device Information",
    deviceStatus: "Device Status",
    serviceHistory: "Service History",
    createServiceCall: "Create Service Call",
    warrantyStatus: "Warranty Status",
    partName: "Part Name",
    serialNumber: "Serial Number", 
    partDescription: "Part Description",
    customerName: "Customer Name",
    warrantyDate: "Warranty Date",
    warrantyEndDate: "Warranty End Date",
    phoneNumber: "Phone Number",
    customerSerialNumber: "Customer Serial Number",
    documentNumber: "Document Number",
    status: "Status",
    active: "Active",
    expired: "Expired",
    
    // Service Call Form
    openServiceCall: "Open Service Call",
    name: "Name",
    phone: "Phone",
    email: "Email",
    subject: "Subject",
    callType: "Call Type",
    urgency: "Urgency",
    description: "Description",
    problemDescription: "Problem description...",
    images: "images",
    confirm: "Confirm",
    sending: "Sending...",
    
    // Call Types
    malfunction: "Malfunction",
    calibration: "Calibration", 
    preventiveMaintenance: "Preventive Maintenance",
    
    // Urgency Levels
    notUrgent: "Not Urgent",
    urgent: "Urgent",
    veryUrgent: "Very Urgent",
    disabled: "Disabled",
    
    // Messages
    fillAllFields: "Please fill all required fields",
    maxImages: "Maximum 5 images allowed",
    selectedImages: "Selected only {count} images out of {total} due to 5 image limit",
    sendingError: "Error sending the call",
    deleteImage: "Delete Image",
    deleteImageConfirm: "Are you sure you want to delete this image?",
    delete: "Delete",
    
    // Device Details (from details array)
    deviceSerialNumber: "Serial Number",
    customerSystemId: "Customer System ID",
    serviceNumber: "Service Number",
    partCode: "Part Code",
    site: "Site",
    productDescription: "Product Description",
    warrantyEndDateLabel: "Warranty End Date",
    warrantyStartDate: "Warranty Start Date",
    serviceContractEndDate: "Service Contract End Date",
    deviceStatus: "Device Status",
    underWarranty: "Under Warranty",
    chargeableService: "Chargeable Service",
    
    // Language Toggle
    switchToHebrew: "עבור לעברית",
    currentLanguage: "EN"
  },
  
  hebrew: {
    // Navigation
    home: "בית",
    qrScan: "סריקת QR",
    settings: "הגדרות",
    
    // OTP Component
    enterPhone: "הזן מספר טלפון",
    sendCode: "שלח קוד",
    enterOtp: "הזן קוד אימות",
    verifyCode: "אמת קוד",
    phoneVerification: "אימות מספר טלפון",
    invalidPhone: "נא להזין מספר טלפון תקין",
    invalidOtp: "נא להזין קוד אימות תקין",
    otpSendFailed: "שליחת קוד האימות נכשלה",
    otpSendError: "שגיאה בשליחת קוד האימות",
    wrongOtp: "קוד האימות שגוי",
    otpVerifyError: "שגיאה באימות הקוד",
    testModePhone: "במצב בדיקה, הכנס מספר טלפון 1234",
    testModeOtp: "במצב בדיקה, הכנס קוד אימות 1234",
    autoFillNote: "הקוד יתמלא אוטומטית כאשר יתקבל המסרון",
    testingNote: "לבדיקה: הכנס 1234",
    sending: "שולח...",
    verifying: "מאמת...",
    
    // General
    loading: "טוען...",
    error: "שגיאה",
    success: "הצלחה", 
    continue: "המשך",
    cancel: "ביטול",
    
    // Device Information
    deviceInfo: "פרטי המכשיר",
    deviceStatus: "סטטוס המכשיר",
    serviceHistory: "היסטוריית שירות",
    createServiceCall: "צור קריאת שירות",
    warrantyStatus: "סטטוס אחריות",
    partName: "שם החלק",
    serialNumber: "מספר סידורי",
    partDescription: "תיאור החלק", 
    customerName: "שם הלקוח",
    warrantyDate: "תאריך אחריות",
    warrantyEndDate: "תאריך סיום אחריות",
    phoneNumber: "מספר טלפון",
    customerSerialNumber: "מספר סידורי לקוח",
    documentNumber: "מספר מסמך",
    status: "סטטוס",
    active: "בתוקף",
    expired: "פג תוקף",
    
    // Service Call Form
    openServiceCall: "פתיחת קריאה",
    name: "שם",
    phone: "טלפון",
    email: "אימייל",
    subject: "נושא",
    callType: "סוג קריאה",
    urgency: "דחיפות",
    description: "טקסט",
    problemDescription: "תיאור הבעיה...",
    images: "תמונות",
    confirm: "אישור",
    sending: "שולח...",
    
    // Call Types
    malfunction: "תקלה",
    calibration: "כיול",
    preventiveMaintenance: "אחזקה מונעת",
    
    // Urgency Levels
    notUrgent: "לא דחוף",
    urgent: "דחוף",
    veryUrgent: "דחוף מאוד",
    disabled: "מושבת",
    
    // Messages
    fillAllFields: "אנא מלא את כל השדות הנדרשים",
    maxImages: "ניתן להעלות מקסימום 5 תמונות",
    selectedImages: "נבחרו רק {count} תמונות מתוך {total} בגלל המגבלה של 5 תמונות",
    sendingError: "שגיאה בשליחת הקריאה",
    deleteImage: "מחיקת תמונה",
    deleteImageConfirm: "האם אתה בטוח שברצונך למחוק את התמונה?",
    delete: "מחק",
    
    // Device Details (from details array)
    deviceSerialNumber: "מספר סידורי",
    customerSystemId: "זיהוי מערכת לקוח",
    serviceNumber: "מספר שירות",
    partCode: "מק״ט",
    site: "אתר",
    productDescription: "תאור מוצר",
    warrantyEndDateLabel: "תאריך סיום אחריות",
    warrantyStartDate: "תאריך תחילת אחריות",
    serviceContractEndDate: "תאריך תום חוזה שירות",
    deviceStatus: "סטטוס מכשיר",
    underWarranty: "באחריות",
    chargeableService: "בחיוב",
    
    // Language Toggle
    switchToEnglish: "Switch to English",
    currentLanguage: "עב"
  }
};

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('english'); // Default to English
  const [direction, setDirection] = useState('ltr'); // Default to LTR

  // Initialize document direction on mount
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'hebrew' ? 'english' : 'hebrew';
    const newDirection = newLanguage === 'hebrew' ? 'rtl' : 'ltr';
    
    setLanguage(newLanguage);
    setDirection(newDirection);
    
    // Update document direction
    document.documentElement.dir = newDirection;
    document.documentElement.lang = newLanguage === 'hebrew' ? 'he' : 'en';
  };

  const value = {
    language,
    direction,
    toggleLanguage,
    isHebrew: language === 'hebrew',
    isEnglish: language === 'english',
    t: translations[language] || translations.english
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}