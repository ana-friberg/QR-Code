/**
 * OtpInput
 *
 * Component for phone number verification using OTP (One-Time Password).
 * Integrates with Web OTP API for auto-fill support on supported browsers.
 * Supports both Hebrew and English languages with proper RTL/LTR layout.
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
import { useLanguage } from "../contexts/LanguageContext";

const OtpInput = ({ onSuccess, isTestMode }) => {
  const { direction, isHebrew, t } = useLanguage();
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
        setError(t.testModePhone);
        return;
      }
      // In test mode, show OTP field immediately
      setShowOtpField(true);
      return;
    }

    // Normal mode: validate 10-digit phone number
    if (!phoneNumber.match(/^\d{10}$/)) {
      setError(t.invalidPhone);
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
        setError(t.otpSendFailed);
      }
    } catch (error) {
      setError(t.otpSendError);
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
        setError(t.testModeOtp);
        return;
      }
      console.log("Test mode verification successful");
      onSuccess();
      return;
    }

    // Normal mode: verify with API
    if (!otpCode.match(/^\d{4}$/)) {
      setError(t.invalidOtp);
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
        setError(t.wrongOtp);
      }
    } catch (error) {
      setError(t.otpVerifyError);
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
      <Box component="form" onSubmit={handleVerifyOtp} dir={direction}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontFamily: "Rubik, sans-serif",
            textAlign: "left",
          }}
        >
          {t.phoneVerification}
        </Typography>

        <TextField
          fullWidth
          label={t.enterPhone}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          required
          disabled={isLoading || showOtpField}
          sx={{ mb: 2 }}
          inputProps={{
            maxLength: 10,
            inputMode: "numeric",
            dir: isHebrew ? "rtl" : "ltr", // Phone numbers are always LTR
          }}
          helperText={t.testingNote}
        />

        {!showOtpField ? (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            disabled={
              isLoading || (phoneNumber.length !== 10 && phoneNumber !== "1234")
            }
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
            {isLoading ? t.sending : t.sendCode}
          </Button>
        ) : (
          <>
            <TextField
              fullWidth
              label={t.enterOtp}
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
              {isLoading ? t.verifying : t.verifyCode}
            </Button>

            {isWebOTPSupported && (
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  mt: 2,
                  display: "block",
                  textAlign: "center",
                  direction: direction,
                }}
              >
                {t.autoFillNote}
              </Typography>
            )}
          </>
        )}

        {error && (
          <Typography
            color="error"
            sx={{
              mt: 2,
              textAlign: "center",
              direction: direction,
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default OtpInput;
