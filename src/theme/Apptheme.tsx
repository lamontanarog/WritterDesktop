import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React from "react";

const theme = createTheme({
    palette: {
        primary: {
          main: "#9e9d24", // green[800]
          light: "#cddc39", // green[500]
          dark: "#827717", // green[900]
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#d4e157", // green[50]
          light: "#f0f4c3", // green[100]
          dark: "#e6ee9c", // green[200]
          contrastText: "#afb42b",
        },
        background: {
          default: "#f1f8e9", // light green background
          paper: "#ffffff",
          
        },
        text: {
          primary: "#827717", // green[900]
          secondary: "#9e9d24", // green[800]
        },
      },
    })

export const AppTheme = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
