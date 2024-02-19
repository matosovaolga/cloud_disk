import React, { useState } from "react";
import Input from "../../input/Input.component";
import Button from "../../button/button.component";
import "./createFolderForm.scss";

const CreateFolderForm = (props) => {
  const [folderName, setFolderName] = useState("");

  return (
    <div className="createFolderForm">
      <Input
        type="text"
        placeholder="Name of folder"
        value={folderName}
        setValue={setFolderName}
        className="createFolderForm_input"
      />
      <Button
        btnStyle="primary"
        onClick={() => {

          props.createFolder(folderName);
        }}
      >
        Add folder
      </Button>
    </div>
  );
};

export default CreateFolderForm;
