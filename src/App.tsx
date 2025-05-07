import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Toaster } from "sonner";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </Router>
      <Footer />
    </>
  );
}

export default App;
