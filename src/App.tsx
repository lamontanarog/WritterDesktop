import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Toaster } from 'sonner'

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
