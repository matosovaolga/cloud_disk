import React from "react";
import  "./error.scss";

const ErrorMessage = (props) => {
  return <p className="err">{props.msg}</p>;
};

export default ErrorMessage;
