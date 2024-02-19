import React, { useState } from "react";
import "./profile.scss";
import { useDispatch } from "react-redux";
import Button from "../button/button.component";
import FileIcon from "../icons/FileIcon.component";
import { deleteAvatar, uploadAvatar } from "../../actions/user";

const Profile = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const fileUploadhandler = (event) => {
    const file = event.target.files[0];

    setFile(file);
  };

  const handleUploadAvatar = () => {
    dispatch(uploadAvatar(file));
  };

  const handleDeleteAvatar = () => {
    dispatch(deleteAvatar());
  };
  return (
    <div className="profileSettings">
      <div className="uploadFile">
        <label htmlFor="uploadFile_input" className="uploadFile_label">
          <span className="addResourceLink">
            <FileIcon /> Upload avatar
          </span>
        </label>
        <input
          type="file"
          id="uploadFile_input"
          accept="image/*"
          // multiple={true}
          onChange={(event) => fileUploadhandler(event)}
          className="uploadFile_input"
        />
      </div>
      <p>File name: {file?.name}</p>
      <div className="buttonGroup">
        <Button btnStyle="primary" onClick={handleUploadAvatar}>
          Upload
        </Button>
        <Button btnStyle="error" onClick={handleDeleteAvatar}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default Profile;
