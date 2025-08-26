/**
 * TextComponent
 *
 * A reusable read-only text field component using MUI's TextField.
 * Props:
 *   - label: string (label for the field)
 *   - value: string (value to display)
 *
 * Usage:
 * <TextComponent label="Name" value="John Doe" />
 */
import { TextField } from "@mui/material";

function TextComponent({ label, value }) {
  return (
    <TextField
      data-testid="text-field"
      fullWidth
      label={label}
      value={value}
      InputProps={{ readOnly: true }}
      variant="outlined"
      size="small"
      inputProps={{ style: { textAlign: 'right' } }}
      sx={{ mb: 2, backgroundColor: "white" }}
    />
  );
}

export default TextComponent;