import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/user/userSlice";
import { useLoginMutation, useGetCurrentUserQuery, useLazyGetCurrentUserQuery } from "../features/api/apiSlice";
import { RootState } from "../store";
import {
  Box, Button, TextField, Typography, Paper,
  Container, Link, Alert, CircularProgress,
  Avatar
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from "@mui/material/styles";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [login] = useLoginMutation();
  // const { refetch } = useGetCurrentUserQuery(undefined, { skip: true });
  const [triggerGetCurrentUser] = useLazyGetCurrentUserQuery();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    dispatch(loginStart());

    try {
      const res = await login({ email, password }).unwrap();
      console.log({res});
      if (!res.token) throw new Error("Token inválido");

      console.log(res.token);
      
      localStorage.setItem("token", res.token);
      await new Promise((resolve) => setTimeout(resolve, 50));

      const userRes = await triggerGetCurrentUser().unwrap();
      console.log(userRes);
      if (!userRes) throw new Error("Usuario no encontrado");

      dispatch(loginSuccess({ user: userRes, token: res.token }));
      const redirect = localStorage.getItem("redirectAfterLogin");
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirect || (userRes.role === "ADMIN" ? "/admin/dashboard" : "/home"), { replace: true });

    } catch (err: any) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      dispatch(loginFailure("Login fallido"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", minHeight: { xs: "100vh", sm: "70vh", lg: "50vh" }, mt: { xs: 4, sm: 8, md: 12 }, mb: { xs: 4, sm: 8, md: 12 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
           <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mx: "auto", mb: 2 }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
            Iniciar Sesión
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required disabled={isLoading} />
            <TextField fullWidth label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required disabled={isLoading} />
            <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
            </Button>
            <Typography variant="body2" align="center">
              ¿No tienes una cuenta? <Link href="/register">Regístrate aquí</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
