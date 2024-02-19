import React from "react";
import "./card.scss";
import cn from 'classnames';

const Card = ({className, ...props}) => {
  return (
    <div className={cn('card', className)} {...props}>
      <div className="card_body">{props.children}</div>
    </div>
  );
};

export default Card;
