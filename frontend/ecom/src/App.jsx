import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProductDetails from "./pages/ProductDetails";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function App() {
  return (
    <div
      className="min-h-screen bg-base-200 transition-colors duration-300"
      data-theme="forest"
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/product/:id/edit" element={<ProductPage />} />
        <Route path="/login" element={<Login />} />         
        <Route path="/register" element={<Register />} />   
      </Routes>
    </div>
  );
}

export default App;
