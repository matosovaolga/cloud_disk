import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.scss";
import AuthRoute from "./AuthRoute";
import GuestRoute from "./GuestRoute";
import SignIn from "./components/auth/SignIn.component";
import Registration from "./components/auth/Registration.component";
import Disk from "./components/disk/Disk";
import Profile from "./components/profile/Profile.component";
import Navbar from "./components/navbar/Navbar.component";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <SignIn />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Registration />
            </GuestRoute>
          }
        />
        <Route path="*" element={<SignIn />} />
        <Route
          path="/"
          element={
            <AuthRoute>
              <Disk />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <Profile />
            </AuthRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
