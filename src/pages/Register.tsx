// Register.tsx - Registro de usuario con lógica clara y estructurada

import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Container, TextField, Typography, Alert, Link, Paper, Avatar, CircularProgress
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useRegisterMutation, useLazyGetCurrentUserQuery } from "../features/api/apiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

  const [register] = useRegisterMutation();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    if (isAuthenticated && role) {
      const redirect = localStorage.getItem("redirectAfterLogin");
      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect, { replace: true });
      } else {
        navigate(role === "ADMIN" ? "/admin/dashboard" : "/home", { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const res = await register({ name, email, password }).unwrap();
      if (!res.token) throw new Error("Token inválido");

      localStorage.setItem("token", res.token);
      const userRes = await getCurrentUser().unwrap();
      if (!userRes) throw new Error("Usuario no encontrado");

      dispatch(loginSuccess({ user: userRes, token: res.token }));
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Register error:", err);
      setError("Error al registrar. Verifica tus datos e inténtalo nuevamente.");
      dispatch(loginFailure("Registro fallido"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{minHeight: 'auto', display: "flex", justifyContent: "center", flexDirection: "column", mt:{xs: 2, sm: 4}}}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              <PersonAddIcon fontSize="large" />
            </Avatar>
          </Box>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "primary.main" }}>
            Crear cuenta
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
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
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Registrarse"}
            </Button>
            <Typography variant="body2" align="center">
              ¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
