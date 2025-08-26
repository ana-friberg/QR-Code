/**
 * Navbar
 *
 * Main navigation bar component with a menu items, and a drawer for navigation.
 * Uses Material-UI components and icons.
 *
 * Usage:
 * <Navbar />
 */
import {
  AppBar,
  Toolbar,
  Box
} from "@mui/material";
import Logo from "../assets/logo.png";
import { useState, useMemo } from "react";

function Navbar() {


  // Memoize styles to prevent recreation
  const appBarStyles = useMemo(() => ({
    backgroundColor: "#e6f3ff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  }), []);

  const toolbarStyles = useMemo(() => ({
    minHeight: "56px"
  }), []);

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
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default Navbar;
