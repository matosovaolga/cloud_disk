import React from "react";
import "./navbar.scss";
import Logo from "../logo/Logo.component";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../reducers/userReducer";
import UserTieIcon from "../icons/UserTie.component";


const Navbar = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const currUser = useSelector((state) => state.user.currentUser) || {};

  const dispatch = useDispatch();

  const avatarIcon = currUser.avatar ? (
    <div className="defaultAva">
      <img src={process.env.REACT_APP_API_URL + currUser.avatar} alt="" />
    </div>
  ) : (
    <div className="defaultAva">
      <UserTieIcon />
    </div>
  );

  return (
    <div className="navbar">
      <div className="container">
        <Logo />
        {!isAuth && (
          <div className="navbar_login ">
            <NavLink className="link" to="/login">
              Login
            </NavLink>
          </div>
        )}
        {!isAuth && (
          <div className="navbar_registration">
            <NavLink className="link" to="/registration">
              Registration
            </NavLink>
          </div>
        )}
        {isAuth && <NavLink to="/profile">{avatarIcon}</NavLink>}
        {isAuth && (
          <div
            className="navbar_signout"
            onClick={() => dispatch(logoutUser())}
          >
            Logout
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
