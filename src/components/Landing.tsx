import { Container, Typography, Button, Box } from "@mui/material";
const Landing = () => {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom>Bienvenido a WriterDesktop</Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Inspírate con ideas para escribir y guarda tus textos.
        </Typography>
        <Box mt={4}>
          <Button variant="contained" href="/register" sx={{ mr: 2 }}>Registrarse</Button>
          <Button variant="outlined" href="/login">Iniciar sesión</Button>
        </Box>
      </Container>
    );
  };
  
  export default Landing;
  