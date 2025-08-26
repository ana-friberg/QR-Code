/**
 * SuccessfulPage
 *
 * Displays a success message and ticket information after a ticket is opened.
 * Uses React Router to receive ticket info via location.state.
 *
 * Props: None (uses location.state)
 *
 */
import { useLocation } from "react-router-dom";
import { Box, Paper, Typography, Button, Container } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function SuccessfulPage() {
  const location = useLocation();
  const ticketInfo = location.state?.ticketInfo || {};

  return (
    <Container maxWidth="sm" dir="rtl">
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
            הקריאה נפתחה בהצלחה!
          </Typography>

          <Box sx={{ mb: 3, textAlign: "left" }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>שם:</strong> {ticketInfo?.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>נושא:</strong> {ticketInfo?.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>סוג קריאה:</strong> {ticketInfo?.type}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>דחיפות:</strong> {ticketInfo?.urgency}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>מספר סידורי:</strong> {ticketInfo?.serialNumber}
            </Typography>
            {ticketInfo.ticketResponse && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>מספר קריאה:</strong>{" "}
                {ticketInfo?.ticketResponse?.DOCNO || "N/A"}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default SuccessfulPage;
