/**
 * OtpInput
 *
 * Component for phone number verification using OTP (One-Time Password).
 * Integrates with Web OTP API for auto-fill support on supported browsers.
 *
 * Props:
 *   - onSuccess: function (callback when authentication is successful)
 *   - isTestMode: boolean (whether this is test mode based on URL)
 *
 * Usage:
 * <OtpInput onSuccess={handleSuccess} isTestMode={isTestMode} />
 */
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import { verifyOtp, sendOtp } from "../services/api";

const OtpInput = ({ onSuccess, isTestMode }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const isWebOTPSupported = "OTPCredential" in window;

  useEffect(() => {
    if (showOtpField && isWebOTPSupported) {
      const abortController = new AbortController();

      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: abortController.signal,
        })
        .then((otp) => {
          setOtpCode(otp.code);
          // Auto-submit if code is valid
          if (otp.code.length === 4) {
            handleVerifyOtp({ preventDefault: () => {} });
          }
        })
        .catch((err) => {
          console.log("Web OTP API error:", err);
        });

      return () => {
        abortController.abort();
      };
    }
  }, [showOtpField]);

  const handleSendOtp = async () => {
    // Test mode: only allow phone number "1234"
    if (isTestMode) {
      if (phoneNumber !== "1234") {
        setError("במצב בדיקה, הכנס מספר טלפון 1234");
        return;
      }
      // In test mode, show OTP field immediately
      setShowOtpField(true);
      return;
    }

    // Normal mode: validate 10-digit phone number
    if (!phoneNumber.match(/^\d{10}$/)) {
      setError("נא להזין מספר טלפון תקין");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await sendOtp(phoneNumber);
      console.log("API Response:", response.send);
      if (response.send) {
        console.log("OTP sent successfully", response);
        setShowOtpField(true);
        setError("");
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      } else {
        setError("שליחת קוד האימות נכשלה");
      }
    } catch (error) {
      setError("שגיאה בשליחת קוד האימות");
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    // Test mode: only accept code "1234"
    if (isTestMode) {
      if (otpCode !== "1234") {
        setError("במצב בדיקה, הכנס קוד אימות 1234");
        return;
      }
      console.log("Test mode verification successful");
      onSuccess();
      return;
    }

    // Normal mode: verify with API
    if (!otpCode.match(/^\d{4}$/)) {
      setError("נא להזין קוד אימות תקין");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOtp(phoneNumber, otpCode);
      console.log(
        "API Response verOTP component:",
        response.signed,
        response.code,
        response
      );

      if (response.signed) {
        console.log("OTP verified successfully", response.code);
        onSuccess();
      } else {
        setError("קוד האימות שגוי");
      }
    } catch (error) {
      setError("שגיאה באימות הקוד");
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        mt: 2,
        mb: 2,
      }}
    >
      <Box component="form" onSubmit={handleVerifyOtp} dir="rtl">
        <Typography
          variant="h6"
          sx={{ mb: 3, fontFamily: "Rubik, sans-serif" }}
        >
          אימות מספר טלפון
        </Typography>

        <TextField
          fullWidth
          label="מספר טלפון"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          required
          disabled={isLoading || showOtpField}
          sx={{ mb: 2 }}
          inputProps={{
            maxLength: 10,
            inputMode: "numeric",
          }}
          helperText="לבדיקה: הכנס 1234"
        />

        {!showOtpField ? (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            disabled={isLoading || (phoneNumber.length !== 10 && phoneNumber !== "1234")}
            sx={{
              backgroundColor: "#006699",
              borderRadius: "8px",
              padding: "10px",
              fontFamily: "Rubik, sans-serif",
              "&.Mui-disabled": {
                color: "#333333",
              },
              "&:hover": {
                backgroundColor: "#005588",
              },
            }}
          >
            {isLoading ? "שולח..." : "שלח קוד אימות"}
          </Button>
        ) : (
          <>
            <TextField
              fullWidth
              label="קוד אימות"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              required
              disabled={isLoading}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: 4,
                inputMode: "numeric",
                autoComplete: "one-time-code", // Changed from autocomplete to autoComplete
                pattern: "[0-9]*",
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || otpCode.length !== 4}
              sx={{
                backgroundColor: "#006699",
                borderRadius: "8px",
                padding: "10px",
                fontFamily: "Rubik, sans-serif",
                "&:hover": {
                  backgroundColor: "#005588",
                },
                "&.Mui-disabled": {
                  color: "#333333",
                },
              }}
            >
              {isLoading ? "מאמת..." : "אמת קוד"}
            </Button>

            {isWebOTPSupported && (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ mt: 2, display: "block", textAlign: "center" }}
              >
                הקוד יתמלא אוטומטית כאשר יתקבל המסרון
              </Typography>
            )}
          </>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default OtpInput;
