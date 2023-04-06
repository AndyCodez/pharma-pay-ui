import "./App.css";
import { useAuth } from "./context/AuthProvider";
import Checkout from "./pages/Checkout";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

function App() {
  const { auth, setAuth } = useAuth();

  const { isAuthenticated } = auth;

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({});
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-blue-800 p-4">
        <ul className="flex justify-end">
          <li className="mx-4">
            {isAuthenticated ? (
              <>
                <Link to="/checkout" className="text-white hover:text-gray-300">
                  Checkout
                </Link>
                <Link
                  to="/inventory"
                  className="text-white hover:text-gray-300 mx-4"
                >
                  Manage Inventory
                </Link>

                <a
                  onClick={handleLogout}
                  href="#"
                  className="text-white hover:text-gray-300"
                >
                  Sign Out
                </a>
              </>
            ) : (
              <Link to="/login" className="text-white hover:text-gray-300">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
