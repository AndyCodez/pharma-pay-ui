import "./App.css";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import { Link, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/cart"> Cart </Link>
            <Link to="/login"> Login </Link>
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
