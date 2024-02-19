import React, { useEffect } from "react";
import Navbar from "./components/navbar/Navbar.component";
import "./app.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Registration from "./components/auth/Registration.component";
import SignIn from "./components/auth/SignIn.component";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./actions/user";
import Disk from "./components/disk/Disk";
import Profile from "./components/profile/Profile.component";

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth());
  }, []);

  return (
    <BrowserRouter>
  
      <div className="App">
        <Navbar />
        {!isAuth ? (
          <Routes>
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Disk />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
