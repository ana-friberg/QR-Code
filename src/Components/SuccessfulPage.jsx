/**
 * SuccessfulPage
 *
 * Displays a success message and ticket information after a ticket is opened.
 * Uses React Router to receive ticket info via location.state.
 * Shows default test message when no ticket info is available.
 *
 * Props: None (uses location.state)
 *
 */
import { useLocation } from "react-router-dom";
import { Box, Paper, Typography, Button, Container } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLanguage } from "../contexts/LanguageContext";

function SuccessfulPage() {
  const location = useLocation();
  const { direction, isHebrew, t } = useLanguage();
  const ticketInfo = location.state?.ticketInfo || {};
  
  // Default test data when no ticket info is provided
  const defaultTestData = {
    name: isHebrew ? "משתמש בדיקה" : "Test User",
    title: isHebrew ? "בדיקת מערכת" : "System Test",
    type: isHebrew ? "תקלה" : "Malfunction",
    urgency: isHebrew ? "דחוף" : "Urgent",
    serialNumber: "TEST12345",
    ticketResponse: {
      DOCNO: "TST-2025-001"
    }
  };
  
  // Use test data if no ticket info is available
  const displayInfo = Object.keys(ticketInfo).length === 0 ? defaultTestData : ticketInfo;

  return (
    <Container maxWidth="sm" dir={direction}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          role="article"
          sx={{
            p: 4,
            borderRadius: "12px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 64,
              color: "#4CAF50",
              mb: 2,
            }}
          />
          <Typography
            variant="h5"
            component="h1"
            sx={{
              mb: 2,
              fontFamily: "Rubik, sans-serif",
              fontWeight: 500,
            }}
          >
            {isHebrew ? "הקריאה נפתחה בהצלחה!" : "Service call opened successfully!"}
          </Typography>

          {/* Show default test message if using test data */}
          {Object.keys(ticketInfo).length === 0 && (
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                fontStyle: "italic",
                color: "text.secondary",
              }}
            >
              {isHebrew ? "(הודעת בדיקה - מידע ברירת מחדל)" : "(Test message - default information)"}
            </Typography>
          )}

          <Box sx={{ mb: 3, textAlign: direction === "rtl" ? "right" : "left" }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{isHebrew ? "שם:" : "Name:"}</strong> {displayInfo?.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{isHebrew ? "נושא:" : "Subject:"}</strong> {displayInfo?.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{isHebrew ? "סוג קריאה:" : "Call Type:"}</strong> {displayInfo?.type}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{isHebrew ? "דחיפות:" : "Urgency:"}</strong> {displayInfo?.urgency}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{isHebrew ? "מספר סידורי:" : "Serial Number:"}</strong> {displayInfo?.serialNumber}
            </Typography>
            {displayInfo.ticketResponse && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>{isHebrew ? "מספר קריאה:" : "Ticket Number:"}</strong>{" "}
                {displayInfo?.ticketResponse?.DOCNO || "N/A"}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default SuccessfulPage;
