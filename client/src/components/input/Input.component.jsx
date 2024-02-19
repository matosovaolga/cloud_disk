import React from "react";
import "./input.scss";
import cn from 'classnames';

const Input = (props) => {
  return (
    <>
      <label className="input_label">{props.label}</label>
      <input
        className={cn("input", props.className)}
        name={props.label}
        type={props.type} 
		value={props.value}
		onChange={(e) => props.setValue(e.target.value)}
        placeholder={props.placeholder}
      />
    </>
  );
};

export default Input;
