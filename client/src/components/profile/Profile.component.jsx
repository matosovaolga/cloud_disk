import React, { useState } from "react";
import "./profile.scss";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button/button.component";
import FileIcon from "../icons/FileIcon.component";
import { deleteAvatar, uploadAvatar } from "../../actions/user";
import Card from "../card/Card.component";
import Avatar from "../avatar/Avatar.component";
import cn from 'classnames'

const Profile = () => {
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user.currentUser);
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
      <Card className="uploadFile">
        <Avatar className="profile_avatar" />
        <label
          htmlFor="uploadFile_input"
          className="uploadFile_label addResourceLink"
        >
          Upload avatar
        </label>{" "}
        <input
          type="file"
          id="uploadFile_input"
          accept="image/*"
          // multiple={true}
          onChange={(event) => fileUploadhandler(event)}
          className="uploadFile_input"
        />{" "}
        {file?.name && <p>File name: {file?.name}</p>}
        <div className="buttonGroup">
          <Button btnStyle="primary" onClick={handleUploadAvatar}>
            Save
          </Button>
          <Button btnStyle="error" onClick={handleDeleteAvatar}>
            Delete
          </Button>
        </div>
      </Card>
      <Card>
        <h3>Edit Profile</h3>
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      </Card>{" "}
    </div>
  );
};

export default Profile;
