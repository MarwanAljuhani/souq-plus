import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Home } from "./Pages/Home/Home";
import { Login } from "./Pages/login/Login";
import { ProductsPage } from "./Pages/productsPage/ProductsPage";
import { Signup } from "./Pages/signup/Signup";
import { Support } from "./Pages/support/Support";
import { Navbar } from "./components/Navbar/Navbar";
import { SingleProductPage } from "./Pages/singleProductPage/SingleProductPage";

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="appContainer">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={currentUser ? <Home /> : <Navigate to="/signup" />}
          />
          <Route
            path="/products"
            element={currentUser ? <ProductsPage /> : <Navigate to="/signup" />}
          />
          <Route
            path="/support"
            element={currentUser ? <Support /> : <Navigate to="/signup" />}
          />
          <Route
            path="/product/:productId"
            element={
              currentUser ? <SingleProductPage /> : <Navigate to="/signup" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
