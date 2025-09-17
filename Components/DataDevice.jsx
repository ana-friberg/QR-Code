/**
 * DataDevice
 *
 * Displays device details, warranty status, and provides a form for opening a service ticket.
 * Uses Material-UI components and CollapsibleCard for layout.
 * Supports both Hebrew and English languages.
 *
 * Props:
 *   - isLoading: boolean (loading state)
 *   - LoadingComponent: React component (shown while loading)
 *   - data: object (device data)
 *
 * Usage:
 * <DataDevice isLoading={isLoading} LoadingComponent={LoadingComponent} data={deviceData} />
 */
import { Container, Grid, Alert } from "@mui/material";
import CollapsibleCard from "./CollapsibleCard";
import OpeningReading from "./OpeningReading";
import TextComponent from "./TextComponent";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";

function DataDevice({ isLoading, LoadingComponent, data }) {
  const location = useLocation();
  const [deviceDetails, setdeviceDetails] = useState([]);
  const [status, setStatus] = useState({ title: "info", message: "" });
  const { direction, isHebrew, t } = useLanguage();

  // Process device details
  const processDeviceDetails = useMemo(() => {
    if (!data) return [];

    const WARDATE = new Date(data?.WARDATE).toLocaleDateString("en-GB");

    // Find active contract or use WARDATEFINAL
    let warrantyEndDate = "";
    let warrantyLabel = t.warrantyEndDate; // Default label

    if (
      data?.SERNSERVCONTRACTS_SUBFORM &&
      Array.isArray(data.SERNSERVCONTRACTS_SUBFORM)
    ) {
      // Look for active contract (STATDES = "בתוקף")
      const activeContract = data.SERNSERVCONTRACTS_SUBFORM.find(
        (contract) => contract.STATDES === (isHebrew ? "בתוקף" : "Active")
      );

      if (activeContract && activeContract.EXPIRYDATE) {
        warrantyEndDate = new Date(
          activeContract.EXPIRYDATE
        ).toLocaleDateString("en-GB");
        warrantyLabel = t.serviceContractEndDate; // Change label for active contract
      } else if (data?.WARDATEFINAL) {
        warrantyEndDate = new Date(data.WARDATEFINAL).toLocaleDateString(
          "en-GB"
        );
      }
    } else if (data?.WARDATEFINAL) {
      warrantyEndDate = new Date(data.WARDATEFINAL).toLocaleDateString("en-GB");
    }

    // Check if fields exist
    const hasServiceNumber = data?.ELDN_DOCZNUM;
    const hasPartName = data?.PARTNAME;

    // Calculate dynamic sizes
    const serviceNumberSize = !hasPartName ? 12 : 6;
    const partNameSize = !hasServiceNumber ? 12 : 6;

    const details = [
      { label: t.deviceSerialNumber, value: data?.SERNUM || "", size: 12 },
      {
        label: t.customerSystemId,
        value: data?.ELDN_CUSTSERNUM || "",
        size: 12,
      },
      {
        label: t.serviceNumber,
        value: data?.ELDN_DOCZNUM || "",
        size: serviceNumberSize,
      },
      { label: t.partCode, value: data?.PARTNAME || "", size: partNameSize },
      { label: t.site, value: data?.DCODEDES || "", size: 12 },
      { label: t.productDescription, value: data?.PARTDES || "", size: 12 },
      { label: warrantyLabel, value: warrantyEndDate || "", size: 6 },
      { label: t.warrantyStartDate, value: WARDATE || "", size: 6 },
    ];

    return details.filter((item) => item.value !== "");
  }, [data, t, isHebrew]); // Added t and isHebrew to dependencies

  useEffect(() => {
    if (data) {
      setdeviceDetails(processDeviceDetails);

      // Determine warranty status based on contracts
      let warrantyEndDate = null;
      if (
        data?.SERNSERVCONTRACTS_SUBFORM &&
        Array.isArray(data.SERNSERVCONTRACTS_SUBFORM)
      ) {
        // Look for active contract - check for both Hebrew and English status
        const activeContract = data.SERNSERVCONTRACTS_SUBFORM.find(
          (contract) => contract.STATDES === (isHebrew ? "בתוקף" : "Active")
        );

        if (activeContract && activeContract.EXPIRYDATE) {
          warrantyEndDate = new Date(activeContract.EXPIRYDATE);
        } else if (data?.WARDATEFINAL) {
          warrantyEndDate = new Date(data.WARDATEFINAL);
        }
      } else if (data?.WARDATEFINAL) {
        warrantyEndDate = new Date(data.WARDATEFINAL);
      }

      const today = new Date();

      // Set status based on conditions
      if (warrantyEndDate && today <= warrantyEndDate) {
        setStatus({ title: "info", message: t.underWarranty });
      } else if (data?.ELDN_STATDES) {
        // Translate the status instead of showing raw data
        const translatedStatus =
          data?.ELDN_STATDES === "Active"
            ? isHebrew
              ? "בתוקף"
              : "Active"
            : data?.ELDN_STATDES;

        setStatus({
          title: "info",
          message: `${isHebrew ? "חוזה" : "Contract"} ${translatedStatus}`,
        });
      } else {
        setStatus({ title: "error", message: t.chargeableService });
      }
    }
  }, [data, processDeviceDetails, t, isHebrew]); // Added t and isHebrew to dependencies

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        flexGrow: 1,
        py: 2,
        px: { xs: 0 },
      }}
    >
      <Alert
        severity={status.title}
        sx={{
          mb: 2,
          direction: isHebrew ? "" :direction,
        }}
      >
        {t.deviceStatus}: {status.message}
      </Alert>

      <CollapsibleCard title={t.deviceInfo}>
        <Grid container spacing={2}>
          {deviceDetails?.map((detail, index) => (
            <Grid item xs={detail.size} key={index}>
              <TextComponent
                label={detail.label}
                value={detail.value}
              />
            </Grid>
          ))}
        </Grid>
      </CollapsibleCard>

      <OpeningReading data={data} />
    </Container>
  );
}

export default DataDevice;
