/**
 * Navbar
 *
 * Main navigation bar component with language toggle and logo.
 * Supports Hebrew (RTL) and English (LTR) languages.
 *
 * Usage:
 * <Navbar />
 */
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Tooltip
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import Logo from "../assets/logo.png";
import { useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";

function Navbar() {
  const { direction, toggleLanguage, isHebrew, t } = useLanguage();

  // Memoize styles to prevent recreation
  const appBarStyles = useMemo(() => ({
    backgroundColor: "#e6f3ff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }), []);

  const toolbarStyles = useMemo(() => ({
    minHeight: "56px",
    direction: direction,
  }), [direction]);

  const logoContainerStyles = useMemo(() => ({
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    py: 1,
  }), []);

  const logoStyles = useMemo(() => ({
    height: "60px",
    objectFit: "contain",
  }), []);

  const languageButtonStyles = useMemo(() => ({
    position: "absolute",
    [isHebrew ? 'left' : 'right']: 16,
    color: "#0066cc",
  }), [isHebrew]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={appBarStyles}
      >
        <Toolbar sx={toolbarStyles}>
          <Box
            sx={logoContainerStyles}
            data-testid="logo-container"
          >
            <img
              src={Logo}
              alt="Logo"
              style={logoStyles}
            />
          </Box>
          
          <Tooltip title={isHebrew ? t.switchToEnglish : t.switchToHebrew}>
            <IconButton
              onClick={toggleLanguage}
              sx={languageButtonStyles}
              aria-label={isHebrew ? "Switch to English" : "Switch to Hebrew"}
            >
              <LanguageIcon />
              <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem', fontWeight: 'bold' }}>
                {t.currentLanguage}
              </Box>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default Navbar;
