import React, { useState } from "react";
import "./profile.scss";
import { useDispatch, useSelector } from "react-redux";
import Button from "../button/button.component";
import FileIcon from "../icons/FileIcon.component";
import { deleteAvatar, uploadAvatar } from "../../actions/user";
import Card from "../card/Card.component";
import Avatar from "../avatar/Avatar.component";
import cn from "classnames";
import Input from "../input/Input.component";
import ErrorMessage from "../error/Error.component";

const Profile = () => {
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user.currentUser);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    password: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        {file?.name && <p className="file_name">File name: {file?.name}</p>}
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
          <form className="form">
            <div className="formGroup">
              <Input
                label="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="formGroup">
              <Input
                label="email"
                type="text"
                value={profile.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="formGroup">
              <Input
                label="password"
                type="password"
                value={profile.password}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>
            {error && <ErrorMessage msg={error} />}
            <Button
              onClick={handleSubmit}
              className="formBtn"
              btnStyle="primary"
              type="button"
            >
              Save profile data
            </Button>
          </form>
        </div>
      </Card>{" "}
    </div>
  );
};

export default Profile;
