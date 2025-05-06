import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/user/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  useRegisterMutation,
  useGetCurrentUserQuery,
} from "../features/api/apiSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { refetch } = useGetCurrentUserQuery(undefined, { skip: true });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    dispatch(loginStart());

    try {
      const response = await register({ name, email, password }).unwrap();
      localStorage.setItem("token", response.token);

      const userResponse = await refetch();
      if (!userResponse.data) throw new Error("No se pudo obtener el usuario");

      dispatch(
        loginSuccess({ user: userResponse.data, token: response.token })
      );
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Register error:", err);
      setError("Error al registrar el usuario. Intente nuevamente.");
      dispatch(loginFailure("Error al registrar el usuario"));
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "primary.dark",
        padding: 2,
      }}
    >
      <Card
        sx={{ maxWidth: 400, width: "100%", boxShadow: 3, borderRadius: 2 }}
      >
        <CardHeader
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            textAlign: "center",
            padding: 3,
          }}
          title={
            <Typography variant="h5" fontWeight="bold">
              Crear una cuenta
            </Typography>
          }
          subheader={
            <Typography
              variant="subtitle1"
              sx={{ color: "white", opacity: 0.9 }}
            >
              Únete a nuestra plataforma
            </Typography>
          }
        />
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: -3 }}>
          <Avatar
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              width: 56,
              height: 56,
            }}
          >
            <PersonAddIcon fontSize="large" />
          </Avatar>
        </Box>
        <CardContent sx={{ padding: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, py: 1.5, fontWeight: "bold" }}
            >
              Registrarse
            </Button>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  component="button"
                  onClick={() => navigate("/login")}
                  sx={{ color: "primary.main" }}
                >
                  Inicia sesión
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
