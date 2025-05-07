import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  useTheme,
  Zoom,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Lightbulb,
  Edit,
  RocketLaunch,
  Favorite,
  FormatQuote,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Bienvenido a WriterDesktop
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Una app para liberar tu creatividad, incluso si nunca escribiste
            antes
          </Typography>
        </motion.div>

        <Box mt={5}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            sx={{
              mr: 2,
              borderRadius: 3,
              color: theme.palette.primary.contrastText,
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.secondary.dark },
            }}
          >
            Comenzar ahora
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: 3,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.secondary.light,
              },
            }}
          >
            Ya tengo cuenta
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Zoom in style={{ transitionDelay: "100ms" }}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                height: "100%",
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.secondary.main}`,
                color: "text.primary",
                transition: "background-color 0.3s ease",
              }}
            >
              <Lightbulb
                sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Ideas creativas al instante
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Genera ideas al azar y encuentra inspiración para empezar tu
                próximo texto, sin presión.
              </Typography>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={4}>
          <Zoom in style={{ transitionDelay: "250ms" }}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                height: "100%",
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.secondary.main}`,
                color: "text.primary",
                transition: "background-color 0.3s ease",
              }}
            >
              <Edit
                sx={{
                  fontSize: 40,
                  color: theme.palette.secondary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Escribe con libertad
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Redacta directamente en nuestra app, con temporizador, contador
                de palabras y tiempo estimado de lectura.
              </Typography>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={4}>
          <Zoom in style={{ transitionDelay: "400ms" }}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                height: "100%",
                bgcolor: "background.paper",
                border: `1px solid ${theme.palette.secondary.main}`,
                color: "text.primary",
                transition: "background-color 0.3s ease",
              }}
            >
              <Favorite
                sx={{ fontSize: 40, color: theme.palette.error.main, mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Guarda y mejora tus textos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Accede a tus ideas favoritas, edítalas cuando quieras y haz
                crecer tu biblioteca de escritura personal.
              </Typography>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>

      {/* Sección de ejemplo inspirador */}
      <Box mt={10} textAlign="center">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Ejemplo de inspiración:
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mx: "auto",
            maxWidth: 600,
            borderLeft: `6px solid ${theme.palette.primary.main}`,
            bgcolor: "background.paper",
            color: "text.primary",
            transition: "background-color 0.3s ease",
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <FormatQuote sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="body1" color="text.secondary">
              "Es tu primer día como guardián de una biblioteca mágica donde
              cada libro susurra sus secretos por la noche..."
            </Typography>
          </Box>
          <Typography variant="body2" color="text.disabled">
            ¿Qué historia contarías tú?
          </Typography>
        </Paper>
      </Box>

      {/* Testimonios */}
      <Box mt={10}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
          Qué dicen nuestros usuarios:
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              name: "Lucía",
              text: "Nunca pensé que podía escribir. Esta app me abrió un mundo nuevo.",
            },
            {
              name: "Martín",
              text: "Uso las ideas todos los días para practicar. Es realmente motivadora.",
            },
            {
              name: "Sofía",
              text: "Lo que más me gusta es poder guardar y editar mis textos cuando quiero.",
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  border: `1px solid ${theme.palette.secondary.main}`,
                  color: "text.primary",
                  transition: "background-color 0.3s ease",
                }}
              >
                <Stack direction="column" spacing={2} alignItems="center">
                  <Avatar>{testimonial.name.charAt(0)}</Avatar>
                  <Typography variant="body1">"{testimonial.text}"</Typography>
                  <Typography variant="caption" color="text.secondary">
                    - {testimonial.name}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={10} textAlign="center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <RocketLaunch
            sx={{ fontSize: 60, color: theme.palette.success.main }}
          />
          <Typography variant="h5" fontWeight="bold" mt={2}>
            ¡Despega tu creatividad con WriterDesktop hoy mismo!
          </Typography>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Landing;
