import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/user/userSlice";
import {
  useLoginMutation,
  useGetCurrentUserQuery,
} from "../features/api/apiSlice";
import { RootState } from "../store";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
  const { data: userData, refetch } = useGetCurrentUserQuery(undefined, {
    skip: false, // Permitir que el query se ejecute siempre
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && role) {
      const redirectPath = role === "ADMIN" ? "/admin/dashboard" : "/";
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    dispatch(loginStart());

    try {
      // Intentar iniciar sesión
      const response = await login({ email, password }).unwrap();
      console.log("Respuesta del servidor:", response);

      if (!response.token) {
        throw new Error("No se recibió un token válido del servidor.");
      }

      // Guardar el token en localStorage
      localStorage.setItem("token", response.token);

      // Refrescar datos del usuario autenticado
      const userResponse = await refetch();
      if (!userResponse.data) {
        throw new Error("Error al obtener los datos del usuario.");
      }

      console.log("Datos del usuario:", userResponse.data);

      // Guardar en el estado global
      dispatch(
        loginSuccess({ user: userResponse.data, token: response.token })
      );

      // Redirigir según el rol del usuario
      const redirectPath =
        userResponse.data.role === "ADMIN" ? "/admin/dashboard" : "/";
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      console.error("Error en el login:", err);
      const errorMessage =
        err.data?.message || err.message || "Ocurrió un error inesperado.";
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
            </Button>

            <Typography variant="body2" align="center">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" underline="hover">
                Regístrate aquí
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
