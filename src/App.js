import "./App.css";
import { useAuth } from "./context/AuthProvider";
import Checkout from "./pages/Checkout";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Signup from "./pages/Pharmacists";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Pharmacists from "./pages/Pharmacists";

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
      <nav className="bg-blue-800 p-4 flex justify-between">
        <div>
          <ul>
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
                        to="/pharmacists"
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
                </>
              ) : null}
            </li>
          </ul>
        </div>
        <div className="flex justify-end">
          <ul>
            <li className="mx-4">
              {isAuthenticated ? (
                <>
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
        </div>
      </nav>

      <Routes>
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/pharmacists" element={<Pharmacists />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />
      </Routes>
    </>
  );
}

export default App;
