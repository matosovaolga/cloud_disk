import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./fileList.scss";
import { CSSTransition } from "react-transition-group";

import FileList from "./fileList/FileList.component";
import Folder from "./folder/Folder.component";
import { uploadFile, searchFile, getFiles } from "../../../actions/file";
import { Uplolader } from "../uploader/Uploader.component";

import Input from "../../input/Input.component";

import { showLoader } from "../../../reducers/appReducer";

const DiskManager = (props) => {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.app.loader);
   const sort = useSelector((state) => state.files.sortStatus);
//   const [sort, setSort] = useState("type");
  const folders = useSelector((state) => state.files.files)
    .filter((file) => file.type === "dir")
    .map((folder) => (
      <CSSTransition
        key={folder._id}
        timeout={500}
        classNames={"file"}
        exit={false}
      >
        <>
          <Folder folder={folder} />
        </>
      </CSSTransition>
    ));

  const currentDir = useSelector((state) => state.files.currentDir);
  const [dragEnter, setDragEnter] = useState(false);
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(false);
  const dragEnterHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  };
  const dragLeaveHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(false);
  };
  const dropHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let files = [...event.dataTransfer.files];
    setDragEnter(false);
    files.forEach((file) => {
      dispatch(uploadFile(file, currentDir));
    });
  };

  const searchHandler = (e) => {
    setSearch(e.target.value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (e.target.value !== "") {
      setSearchTimeout(
        setTimeout(
          (value) => {
            dispatch(showLoader());
            dispatch(searchFile(value));
          },
          1000,
          e.target.value
        )
      );
    } else {
         dispatch(getFiles(currentDir, sort));
    //   dispatch(getFiles(currentDir));
    }
  };



  if (loader === true) {
    return <div className="loader"></div>;
  }

  return !dragEnter ? (
    <div
      className="fileList_wrap"
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <header className="fileList_Header">
        <h3>File Manager</h3>
        <Input
          type="text"
          value={search}
          setValue={(e) => searchHandler(e)}
          className="search_field"
          placeholder="Search file"
        />
      </header>

      <div className="folders_list">{folders}</div>
      <FileList />
      <Uplolader />
    </div>
  ) : (
    <div
      className="drop-area"
      onDrop={dropHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      Drag files here
    </div>
  );
};

export default DiskManager;
