import React from "react";
import cn from "classnames";
import "./button.scss";

const Button = ({ btnStyle, className, ...props }) => {
  return (
	
    <button
      className={cn("btn", className, {
        primary: btnStyle === "primary",
        secondary: btnStyle === "secondary",
        error: btnStyle === "error",
      })}
      {...props}
    ></button>
  );
};

export default Button;
