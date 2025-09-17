/**
 * HomePage
 *
 * Main landing page for the app. Handles device data fetching, authentication (OTP), and error/loading states.
 * Uses React Query for data management and error boundaries for robust UX.
 * Supports both Hebrew and English languages.
 *
 * Usage:
 * <HomePage />
 */
import React, { Suspense, useState } from "react";
import { QueryErrorResetBoundary, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Box, Container } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DataDevice from "./DataDevice";
import ErrorFallback from "./ErrorFallback";
import LoadingComponent from "./LoadingComponent";
import OtpInput from "./OtpInput";
import { useParams } from "react-router-dom";
import { fetchDataDevice } from "../services/api";
import { useCustomQuery } from "../hooks/useCustomQuery";
import { useLanguage } from "../contexts/LanguageContext";

const HomePage = () => {
  const { encode } = useParams();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isHebrew } = useLanguage();
  
  // Check if this is test mode based on URL
  const isTestMode = encode === "1234";
  
  // Default test data for test mode (language-aware)
  const getDefaultTestData = () => ({
    "PARTNAME": "G0010BBTT",
    "SERNUM": "AU125668790",
    "PARTDES": "A.T 7000AA Triple Quad bundle",
    "CUSTNAME": "13666666",
    "DCODEDES": isHebrew ? "מעמבדת א.פ.פ." : "A.P.P. Laboratory",
    "WARDATE": "2015-01-22T00:00:00+02:00",
    "WARDATEFINAL": "2017-01-21T00:00:00+02:00",
    "PHONE": "1234",
    "ELDN_CUSTSERNUM": "3Q AAM-11(1111)",
    "ELDN_DOCZNUM": "121212",
    "ELDN_STATDES": isHebrew ? "בתוקף" : "Active",
    "SERNSERVCONTRACTS_SUBFORM": [
      {
        "EXPIRYDATE": "2025-12-31T00:00:00+02:00",
        "STATDES": isHebrew ? "בתוקף" : "Active"
      }
    ]
  });
  
  // Data fetching function
  const fetchDataDeviceOrDefault = () => {
    if (isTestMode) {
      console.log("Test mode: using default test data");
      return Promise.resolve(getDefaultTestData());
    } else {
      console.log("Normal mode: fetching real device data for encode:", encode);
      return fetchDataDevice(encode);
    }
  };
  
  const { data, isLoading, error } = useCustomQuery(
    ["dataDevice", encode],
    fetchDataDeviceOrDefault,
    {
      retry: false,
      enabled: isAuthenticated && !!encode
    }
  );

  const isSignedIn = isAuthenticated && !error && !isLoading && data;

  const handleSignInSuccess = () => {
    // Set authenticated and trigger data fetch
    setIsAuthenticated(true);
  };

  const renderContent = () => {
    // Always show OTP input if not authenticated
    if (!isAuthenticated) {
      return (
        <OtpInput 
          onSuccess={handleSignInSuccess}
          isTestMode={isTestMode}
        />
      );
    }

    // If authenticated but still loading data
    if (isLoading) {
      return <LoadingComponent/>;
    }

    // If authenticated and have data, show device details
    if (data) {
      return (
        <DataDevice
          isLoading={isLoading}
          LoadingComponent={LoadingComponent}
          encode={encode}
          data={data}
        />
      );
    }

    // If authenticated but no data (error case)
    return (
      <OtpInput 
        onSuccess={handleSignInSuccess}
        isTestMode={isTestMode}
      />
    );
  };

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={reset}
        >
          <Suspense fallback={<LoadingComponent />}>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Navbar />
              <Container 
                component="main" 
                maxWidth="sm" 
                sx={{ 
                  mb: 2, 
                  flex: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  py: 2, 
                  px: { xs: 0 } 
                }}
              >
                {renderContent()}
              </Container>
              <Footer />
            </Box>
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default HomePage;