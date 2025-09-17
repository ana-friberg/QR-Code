/**
 * Footer
 *
 * Simple footer component for the app. Displays copyright info.
 *
 * Usage:
 * <Footer />
 */
// Footer.jsx
import { Box, Container, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container maxWidth="sm" aria-label="footer-container">
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          component="p"
        >
          © 2024 Ana 
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;