import "./index.css";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
const App = () => {
  return (
    <div>
      <Routes>

        <Route element={<Login />} path="/login" />
        <Route element={<Signup />} path="/signup" />
        <Route element={<Dashboard/>} path="/" />
      </Routes>
    </div>
  );
};

export default App;
