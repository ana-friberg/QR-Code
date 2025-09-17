/**
 * CollapsibleCard
 *
 * Card component with expandable/collapsible content and a title.
 * Uses Material-UI for layout and icons.
 *
 * Props:
 *   - title: string (card title)
 *   - children: ReactNode (content inside the card)
 *
 * Usage:
 * <CollapsibleCard title="Details"> ... </CollapsibleCard>
 */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";

function CollapsibleCard({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflow: "hidden",
        direction: "rtl",
      }}
    >
      <Box
        role="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          "&:active": {
            backgroundColor: "#e9ecef",
          },
        }}
      >
        <IconButton
          size="small"
          aria-label="expand"
          sx={{
            color: "#006699",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.125rem",
              fontWeight: 500,
              fontFamily: "Rubik, sans-serif",
              color: "#2d3436",
            }}
          >
            {title}
          </Typography>
          <InfoIcon 
            aria-label="info"
            sx={{ color: "#2d3436" }} 
          />
        </Box>
      </Box>
      <Collapse
        in={isExpanded}
        sx={{
          "& .MuiCollapse-wrapper": {
            transition: "height 0.3s ease",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>{children}</CardContent>
      </Collapse>
    </Card>
  );
}

export default CollapsibleCard;