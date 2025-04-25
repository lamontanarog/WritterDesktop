import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline, IconButton, Box } from "@mui/material"
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from "@mui/icons-material"

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

export const AppTheme = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light')
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
    }),
    []
  )

  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode,
        primary: {
          main: "#5D4037",
          light: "#8D6E63",
          dark: "#3E2723",
          contrastText: "#FFFFFF",
        },
        secondary: {
          main: "#D7CCC8",
          light: "#EFEBE9",
          dark: "#BCAAA4",
          contrastText: "#000000",
        },
        background: {
          default: mode === 'light' ? "#FDF6E3" : "#2E1A0F",
          paper: mode === 'light' ? "#FCF6E3" : "#381F1C",
        },
        text: {
          primary: mode === 'light' ? "#3E2723" : "#EDE0D4",
          secondary: mode === 'light' ? "#5D4037" : "#D7CCC8",
        },
      },
      typography: {
        fontFamily: ['"Merriweather"', 'serif'].join(","),
        body1: { fontSize: '1rem', lineHeight: 1.7 },
        body2: { fontSize: '0.95rem', lineHeight: 1.6 },
        h1: { fontFamily: ['"Literata"', 'serif'].join(","), fontWeight: 700 },
        h2: { fontFamily: ['"Literata"', 'serif'].join(","), fontWeight: 600 },
        h3: { fontFamily: ['"Literata"', 'serif'].join(","), fontWeight: 600 },
      },
      shape: { borderRadius: 8 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: { backgroundColor: mode === 'light' ? '#FDF6E3' : '#2E1A0F', margin: 0, padding: 0 },
            p: { maxWidth: '36em', margin: '0 auto 1em', letterSpacing: '0.2px' },
            blockquote: {
              borderLeft: '4px solid #8D6E63',
              margin: '1em 0',
              paddingLeft: '1em',
              color: '#5D4037',
              fontStyle: 'italic',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'light' ? '#FCF6E3' : '#381F1C',
              padding: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: { textTransform: 'none', borderRadius: 4 },
          },
        },
      },
    }),
    [mode]
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box position="fixed" top={16} right={16} zIndex="tooltip">
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
