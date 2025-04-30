import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import "./auth.scss";
import Card from "../card/Card.component";
import Input from "../input/Input.component";
import LogImg from "../../assets/img/2.png";
import Button from "../button/button.component";
import Logo from "../logo/Logo.component";
import { login } from "../../actions/user";
import ErrorMessage from "../error/Error.component";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(email, password));
    if (result instanceof Error || result?.response) {
      console.log("err ", result?.response?.data.message);
      if (typeof result?.response?.data.message == "string") {
        setError(result?.response?.data.message);
      }
    } else {
      console.log("success ", result);
    }
  };

  return (
    <div className="registration_wrap">
      <Logo />

      <Card className="regFormWrp">
        <div className="left_side">
          <img src={LogImg} alt="" />
        </div>
        <div className="right_side">
          <h2 className="title">Login</h2>
          <p className="title_subtext">Please sign in to continue.</p>
          <form>
            <Input
              label="email"
              type="text"
              value={email}
              setValue={setEmail}
              placeholder="Enter email address"
            />
            <Input
              value={password}
              setValue={setPassword}
              label="password"
              type="password"
              placeholder="Password"
            />
            {error && <ErrorMessage msg={error} />}
            <Button
              onClick={handleSubmit}
              className="formBtn"
              btnStyle="primary"
              type="button"
            >
              Sign in
            </Button>
            <p className="signUp_link">
              Don't have account yet?{" "}
              <NavLink to="/registration">Sign Up</NavLink>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SignIn;
