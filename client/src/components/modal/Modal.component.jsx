import React from "react";
import "./modal.scss";
import CloseIcon from "../icons/CloseIcon.component";
import cn from "classnames";
const Modal = (props) => {
  return (
    <div className={cn("modal", props.state)} onClick={() => props.close()}>
      <div className="modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="modal_header">
          <div className="modal_title">Create new folder</div>
          <div className="modal_close" onClick={() => props.close()}>
            <CloseIcon />
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default Modal;
