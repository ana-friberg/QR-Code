
/**
 * ErrorFallback
 *
 * Displays an error alert with a retry button for error boundaries.
 * Used as a fallback UI when data loading fails.
 *
 * Props:
 *   - error: Error object (error details)
 *   - resetErrorBoundary: function (callback to reset error boundary)
 *
 * Usage:
 * <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
 */
import { Box, Alert, Typography } from "@mui/material";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Alert
      severity="error"
      onClose={resetErrorBoundary}
      sx={{
        m: 2,
        borderRadius: "8px",
        direction: 'ltr',
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          שגיאה בטעינת הנתונים
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {error.message}
        </Typography>
        <button
          onClick={resetErrorBoundary}
          style={{
            backgroundColor: "#d32f2f",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          נסה שוב
        </button>
      </Box>
    </Alert>
  );
};

export default ErrorFallback;
