import "./App.css";
import { useAuth } from "./context/AuthProvider";
import Checkout from "./pages/Checkout";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";

function App() {
  document.title = "PharmaPay";

  const { auth, setAuth } = useAuth();

  const { isAuthenticated, role } = auth;

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
                <Link
                  to="/checkout"
                  className="m-4 text-white hover:text-gray-300"
                >
                  Checkout
                </Link>

                {role === "ADMIN" ? (
                  <>
                    <Link
                      to="/inventory"
                      className="text-white hover:text-gray-300 mx-4"
                    >
                      Manage Inventory
                    </Link>

                    <Link
                      to="/signup"
                      className="text-white hover:text-gray-300 mx-4"
                    >
                      Pharmacists
                    </Link>

                    <Link
                      to="/customers"
                      className="text-white hover:text-gray-300 mx-4"
                    >
                      Customers
                    </Link>

                    <Link
                      to="/sales"
                      className="text-white hover:text-gray-300 mx-4"
                    >
                      Sales
                    </Link>
                  </>
                ) : null}

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
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </>
  );
}

export default App;
