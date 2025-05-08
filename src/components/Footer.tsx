// Footer.tsx - Pie de página estilizado siguiendo la estética general

import { Box, Container, Typography, Link, Stack, Divider, useTheme } from '@mui/material';
import { Lightbulb } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        pt: 6,
        pb: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Lightbulb sx={{ color: theme.palette.primary.main }} />
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} WriterDesktop
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Link href="/" underline="hover" color="text.secondary" >Inicio</Link>
            <Link href="/register" underline="hover" color="text.secondary">Registrarse</Link>
            <Link href="/login" underline="hover" color="text.secondary">Iniciar sesión</Link>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3, borderColor: theme.palette.primary.main }} />

        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          display="block"
          sx={{ fontStyle: 'italic', opacity: 0.8, fontSize: '1rem' }}
        >
          "Cada gran historia empieza con una simple idea. Empieza la tuya hoy."
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;