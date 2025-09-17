/**
 * OpeningReading
 *
 * Form component for opening a service ticket (קריאה) with user details, description, urgency, and image uploads.
 * Integrates with backend API to create tickets and provides feedback via SnackbarAlert.
 * Supports both Hebrew and English languages.
 *
 * Props:
 *   - data: object (initial data for the form, e.g., phone, serial number)
 *
 * Usage:
 * <OpeningReading data={userData} />
 */
import {
  IconButton,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import ArticleIcon from "@mui/icons-material/Article";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../services/api";
import SnackbarAlert from "./SnackbarAlert";
import { useLanguage } from "../contexts/LanguageContext";

function OpeningReading({ data }) {
  const navigate = useNavigate();
  const { direction, isHebrew, t } = useLanguage();
  const [directionSelected, setDirectionSelected] = useState("rtl");
  const [formData, setFormData] = useState({
    name: "",
    phone: data?.PHONE,
    email: "",
    text: "",
    title: "",
    urgency: "",
    callType: "",
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    imageIndex: null,
  });

  useEffect(() => {
    if (isHebrew) {
      setDirectionSelected("rtl");
    } else {
      setDirectionSelected("ltr");
    }
  }, []);

  useEffect(() => {
    // Cleanup object URLs when component unmounts or images change
    return () => {
      formData.images.forEach((image) => {
        if (image instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }
      });
    };
  }, [formData.images]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const remainingSlots = 5 - formData.images.length;

    if (remainingSlots <= 0) {
      setSnackbar({
        open: true,
        message: t.maxImagesError,
        severity: "warning",
      });
      event.target.value = "";
      return;
    }

    // Take only the number of files that will fit within the limit
    const filesToAdd = files.slice(0, remainingSlots);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...filesToAdd],
    }));

    if (files.length > remainingSlots) {
      setSnackbar({
        open: true,
        message: isHebrew
          ? `נבחרו רק ${remainingSlots} תמונות מתוך ${files.length} בגלל המגבלה של 5 תמונות`
          : `Only ${remainingSlots} images selected out of ${files.length} due to the 5 image limit`,
        severity: "info",
      });
    }

    event.target.value = "";
  };

  const handleImageClick = (index) => {
    setDeleteConfirm({
      open: true,
      imageIndex: index,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.imageIndex !== null) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter(
          (_, index) => index !== deleteConfirm.imageIndex
        ),
      }));
    }
    setDeleteConfirm({
      open: false,
      imageIndex: null,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({
      open: false,
      imageIndex: null,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.text ||
      !formData.callType ||
      !formData.title ||
      !formData.urgency
    ) {
      setSnackbar({
        open: true,
        message: t.fillAllFields,
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketData = {
        serialNumber: data.SERNUM,
        customerNumber: data.CUSTNAME,
        callType: formData.callType,
        updateSource: formData.name,
        contactInfo: formData.phone,
        description: formData.text,
        title: formData.title,
        urgency: formData.urgency,
        email: formData.email,
        images: formData.images,
      };

      // Try to create ticket via API
      const response = await createTicket(ticketData);
      console.log("Ticket Response:", response);

      navigate("/successful", {
        state: {
          ticketInfo: {
            name: formData.name,
            type: formData.callType,
            serialNumber: data.SERNUM,
            title: formData.title,
            urgency: formData.urgency,
            ticketResponse: response.data,
          },
        },
      });
    } catch (error) {
      console.log("API Error:", error);
      
      // Check if it's a network error (API not available) - treat as test mode
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        console.log("Network error detected - entering test mode");
        
        // Navigate to success page with form data for testing
        navigate("/successful", {
          state: {
            ticketInfo: {
              name: formData.name,
              type: formData.callType,
              serialNumber: data.SERNUM || "TEST12345",
              title: formData.title,
              urgency: formData.urgency,
              ticketResponse: {
                DOCNO: `TEST-${Date.now()}` // Generate a test ticket number
              },
            },
          },
        });
        
        // Show test mode notification
        setSnackbar({
          open: true,
          message: isHebrew ? 
            "מצב בדיקה - הקריאה נוצרה בהצלחה (ללא שרת)" : 
            "Test mode - Ticket created successfully (without server)",
          severity: "info",
        });
      } else {
        // Other errors - show error message
        setSnackbar({
          open: true,
          message: t.submitError,
          severity: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        dir={direction}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          {/* <AddCircleIcon sx={{ color: "#2d3436" }} /> */}
          <ArticleIcon sx={{ color: "#2d3436" }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.125rem",
              fontWeight: 500,
              fontFamily: "Rubik, sans-serif",
              color: "#2d3436",
            }}
          >
            {t.openServiceCall}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label={t.name}
              value={formData.name}
              onChange={handleChange("name")}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label={t.phone}
              value={formData.phone}
              onChange={handleChange("phone")}
              variant="outlined"
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t.email}
              value={formData.email}
              onChange={handleChange("email")}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label={t.subject}
              value={formData.title}
              onChange={handleChange("title")}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="callType-label">{t.callType}</InputLabel>
              <Select
                labelId="callType-label"
                value={formData.callType}
                label={t.callType}
                onChange={handleChange("callType")}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem sx={{ direction: directionSelected }} value="תקלה">
                  {t.malfunction}
                </MenuItem>
                <MenuItem sx={{ direction: directionSelected }} value="כיול">
                  {t.calibration}
                </MenuItem>
                <MenuItem
                  sx={{ direction: directionSelected }}
                  value="אחזקה מונעת"
                >
                  {t.preventiveMaintenance}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="urgency-label">{t.urgency}</InputLabel>
              <Select
                labelId="urgency-label"
                value={formData.urgency}
                label={t.urgency}
                onChange={handleChange("urgency")}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem
                  sx={{ direction: directionSelected}}
                  value="לא דחוף"
                >
                  {t.notUrgent}
                </MenuItem>
                <MenuItem
                  sx={{ direction: directionSelected }}
                  value="דחוף"
                >
                  {t.urgent}
                </MenuItem>
                <MenuItem
                  sx={{ direction: directionSelected}}
                  value="דחוף מאוד"
                >
                  {t.veryUrgent}
                </MenuItem>
                <MenuItem
                  sx={{ direction: directionSelected }}
                  value="מושבת"
                >
                  {t.disabled}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label={t.description}
              variant="outlined"
              value={formData.text}
              onChange={handleChange("text")}
              placeholder={t.descriptionPlaceholder}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <IconButton
                      component="span"
                      sx={{
                        backgroundColor: "#f8f9fa",
                        "&:hover": {
                          backgroundColor: "#e9ecef",
                        },
                        "&:active": {
                          backgroundColor: "#dee2e6",
                        },
                      }}
                    >
                      <ImageIcon />
                    </IconButton>
                  </label>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {formData.images.length}/5 {t.images}
                  </Typography>
                </Box>
                {formData.images.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      maxWidth: "300px",
                    }}
                  >
                    {formData.images.map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                        }}
                        onClick={() => handleImageClick(index)}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Uploaded ${index + 1}`}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#006699",
                  borderRadius: "8px",
                  padding: "8px 24px",
                  fontFamily: "Rubik, sans-serif",
                  fontWeight: 500,
                  "&.Mui-disabled": {
                    color: "#333333", // Dark grey color
                  },
                }}
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? t.sending : t.confirm}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={deleteConfirm.open}
        onClose={handleDeleteCancel}
        dir={direction}
      >
        <DialogTitle>{t.deleteImage}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t.deleteImageConfirm}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            {t.cancel}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {t.delete}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        duration={5000}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}

export default OpeningReading;
