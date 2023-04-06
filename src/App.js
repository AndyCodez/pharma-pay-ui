import "./App.css";
import { useAuth } from "./context/AuthProvider";
import Checkout from "./pages/Checkout";
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
      <nav>
        <ul>
          <li>
            {isAuthenticated ? (
              <>
                <Link to="/cart"> Cart </Link>

                <a onClick={handleLogout} href="#">
                  Sign Out
                </a>
              </>
            ) : (
              <Link to="/login"> Login </Link>
            )}
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/cart" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
