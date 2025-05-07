import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, IconButton, Box } from "@mui/material";
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from "@mui/icons-material";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export const AppTheme = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  );

  const theme = React.useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: "#34495E", // azul sobrio
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#F39C8B", // coral cálido
          contrastText: "#000000",
        },
        background: {
          default: mode === "light" ? "#FAFAFA" : "#101010",
          paper: mode === "light" ? "#FFFFFF" : "#1A1A1A",
        },
        text: {
          primary: mode === "light" ? "#1A1A1A" : "#F5F5F5",
          secondary: mode === "light" ? "#4A4A4A" : "#B0B0B0",
        },
      },
      typography: {
        fontFamily: ['"Inter"', 'sans-serif'].join(","),
        body1: { fontSize: '1rem', lineHeight: 1.6 },
        body2: { fontSize: '0.95rem', lineHeight: 1.5 },
        h1: {
          fontFamily: ['"Literata"', 'serif'].join(","),
          fontWeight: 700,
        },
        h2: {
          fontFamily: ['"Literata"', 'serif'].join(","),
          fontWeight: 600,
        },
        h3: {
          fontFamily: ['"Literata"', 'serif'].join(","),
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: mode === "light" ? "#FAFAFA" : "#101010",
              margin: 0,
              padding: 0,
              transition: "background-color 0.3s ease",
            },
            p: {
              maxWidth: "36em",
              margin: "0 auto 1em",
              letterSpacing: "0.2px",
            },
            blockquote: {
              borderLeft: "4px solid #F39C8B",
              margin: "1em 0",
              paddingLeft: "1em",
              fontStyle: "italic",
              color: mode === "light" ? "#34495E" : "#F39C8B",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: mode === "light" ? "#FFFFFF" : "#1A1A1A",
              color: mode === "light" ? "#1A1A1A" : "#F5F5F5",
              padding: "1rem",
              boxShadow: mode === "light"
                ? "0 2px 4px rgba(0,0,0,0.05)"
                : "0 4px 12px rgba(0,0,0,0.3)",
              transition: "background-color 0.3s ease",
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: mode === "light" ? "#FFFFFF" : "#1A1A1A",
              color: mode === "light" ? "#1A1A1A" : "#F5F5F5",
              boxShadow: mode === "light"
                ? "0 2px 4px rgba(0,0,0,0.05)"
                : "0 4px 12px rgba(0,0,0,0.3)",
              transition: "background-color 0.3s ease",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              borderRadius: 6,
              ...(mode === "dark" && {
                backgroundColor: "#F39C8B",
                color: "#121212",
                ":hover": {
                  backgroundColor: "#f26f60",
                },
              }),
            },
          },
        },
      },
    }), [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box position="fixed" top={16} right={16} zIndex="tooltip">
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
