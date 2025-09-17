/**
 * LoadingComponent
 *
 * Displays a centered Material-UI CircularProgress spinner for loading states.
 *
 * Props: None (can accept delay or other props if extended)
 *
 * Usage:
 * <LoadingComponent />
 */
import { Box, CircularProgress } from "@mui/material";

const LoadingComponent = (delay) => (
  <Box
    data-testid="loading-container"
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="200px"
  >
    <CircularProgress sx={{ color: "#006699" }} />
  </Box>
);

export default LoadingComponent;