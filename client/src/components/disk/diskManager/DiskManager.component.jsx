import React, { useState } from "react";
import "./fileList.scss";
import Folder from "./folder/Folder.component";
import FileList from "./fileList/FileList.component";

import { uploadFile, searchFile, getFiles } from "../../../actions/file";
import { Uplolader } from "../uploader/Uploader.component";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Input from "../../input/Input.component";

import { showLoader } from "../../../reducers/appReducer";

//   const currentDir = useSelector((state) => state.files.currentDir);
//   const [dragEnter, setDragEnter] = useState(false);
//   const [search, setSearch] = useState("");
//   const [searchTimeout, setSearchTimeout] = useState(false);

//   const dragEnterHandler = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setDragEnter(true);
//   };

//   const dragLeaveHandler = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     setDragEnter(false);
//   };

//   const dropHandler = (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     let files = [...event.dataTransfer.files];

//     setDragEnter(false);
//     files.forEach((file) => {
//       dispatch(uploadFile(file, currentDir));
//     });
//   };

//   const searchHandler = (value) => {
//     setSearch(value);
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }

//     if (value !== "") {
//       setSearchTimeout(
//         setTimeout(
//           (value) => {
//             dispatch(showLoader());
//             dispatch(searchFile(value));
//           },
//           1000,
//           value
//         )
//       );
//     } else {
//       dispatch(getFiles(currentDir, sort));
//     }
//   };

//   if (loader === true) {
//     return <div className="loader"></div>;
//   }

//   return !dragEnter ? (
//     <div
//       className="fileList_wrap"
//       onDragEnter={dragEnterHandler}
//       onDragLeave={dragLeaveHandler}
//       onDragOver={dragEnterHandler}
//     >
//       <header className="fileList_Header">
//         <h3>File Manager</h3>
//         <Input
//           type="text"
//           value={search}
//           setValue={(e) => searchHandler(e)}
//           className="search_field"
//           placeholder="Search file"
//         />
//       </header>

//       <TransitionGroup className="folders_list">{folders}</TransitionGroup>
//       <FileList />
//       <Uplolader />
//     </div>
//   ) : (
//     <div
//       className="drop-area"
//       onDrop={dropHandler}
//       onDragEnter={dragEnterHandler}
//       onDragLeave={dragLeaveHandler}
//       onDragOver={dragEnterHandler}
//     >
//       Drag files here
//     </div>
//   );
// };

// export default DiskManager;
import { useSelector, useDispatch } from "react-redux";
const DiskManager = (props) => {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.app.loader);
  const sort = useSelector((state) => state.files.sortStatus);
  const folders = useSelector((state) => state.files.files).filter(
    (file) => file.type === "dir"
  );
  // .map((folder) => (
  //   <CSSTransition
  //     key={folder._id}
  //     timeout={500}
  //     classNames={"file"}
  //     exit={false}
  //   >
  //     <Folder folder={folder} />
  //   </CSSTransition>
  // ));
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
  const searchHandler = (value) => {
    setSearch(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value !== "") {
      setSearchTimeout(
        setTimeout(
          (value) => {
            dispatch(showLoader());
            dispatch(searchFile(value));
          },
          1000,
          value
        )
      );
    } else {
      dispatch(getFiles(currentDir, sort));
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

      {/* <div className="folders_list">{folders}</div> */}
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
