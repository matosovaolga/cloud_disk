import React, { useState } from "react";
import "./auth.scss";
import Card from "../card/Card.component";
import Input from "../input/Input.component";
import RegImg from "../../assets/img/3.png";
import Button from "../button/button.component";
import Logo from "../logo/Logo.component";
import { registration } from '../../actions/user';

const Registration = (props) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="registration_wrap">
      <Logo />

      <Card className="regFormWrp">
        <div className="left_side">
          <img src={RegImg} alt="" />
        </div>
        <div className="right_side">
          <h2 className="title">Create New Account</h2>
          <form>
            <Input
              value={name}
              label="name"
              type="text"
              setValue={setName}
              placeholder="Enter name"
            />
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

            <Button onClick={() => registration(email, password, name)} className="formBtn" btnStyle="primary" type="button">
              Sign up
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Registration;
