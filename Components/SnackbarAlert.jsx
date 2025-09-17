/**
 * SnackbarAlert
 *
 * Displays a Material-UI Snackbar with an Alert message.
 * Props:
 *   - open: boolean (controls visibility)
 *   - message: string (message to display)
 *   - severity: string (alert severity: 'success', 'error', etc.)
 *   - onClose: function (callback when closed)
 *
 * Usage:
 * <SnackbarAlert open={true} message="Success!" severity="success" onClose={handleClose} />
 */
import { Snackbar, Alert } from '@mui/material';

const SnackbarAlert = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ 
          direction: 'ltr',
          mt: "85vh"
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
