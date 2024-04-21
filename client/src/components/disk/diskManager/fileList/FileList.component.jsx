import { useSelector, useDispatch } from "react-redux";
import Card from "../../../card/Card.component";
import PDFIcon from "../../../icons/PDF.component";
import DownloadIcon from "../../../icons/DownloadIcon.component";
import Doc from "../../../icons/Doc.component";
import XSL from "../../../icons/XSL.component";
import ListIcon from "../../../icons/ListIcon.component";
import FolderViewIcon from "../../../icons/FolderView.component";
import "./fileList.scss";
import { useState } from "react";
import { downloadFile, deleteFile } from "../../../../actions/file";
import DeleteIcon from "../../../icons/DeleteIcon.component";
import JpgIcon from "../../../icons/JPG.component";
import { sizeFormat } from "../../../../utils/sizeFormat";
import { setSortStatus, setView } from "../../../../reducers/fileReducer";
import Button from "../../../button/button.component";

const FIcons = {
  pdf: <PDFIcon />,
  docx: <Doc />,
  doc: <Doc />,
  xlsx: <XSL />,
  jpg: <JpgIcon />,
  jpeg: <JpgIcon />,
  png: <JpgIcon />,
};

const FileList = (props) => {
  const [openSelect, setOpenSelect] = useState(false);

  const dispatch = useDispatch();
  const sort = useSelector((state) => state.files.sortStatus);
  const fileView = useSelector((state) => state.files.view);
  const files = useSelector((state) => state.files.files)
    .filter((file) => file.type !== "dir")
    .map((file, index) => {
      if (fileView == "list") {
        return (
          <div className="row" key={index}>
            <div className="column">
              <span className="fileIcon">{FIcons[file.type]}</span>
            </div>
            <div className="column">{file.name}</div>
            <div className="column">{file.date.slice(0, 10)}</div>
            <div className="column">{sizeFormat(file.size)}</div>
            <div className="column actions">
              <div onClick={() => setOpenSelect(true)}>
                <ul className="actions_icons">
                  <li onClick={(e) => downloadClickHandler(e, file)}>
                    <DownloadIcon />
                  </li>
                  <li
                    className="removeIcon"
                    onClick={(e) => deleteFileHandler(e, file)}
                  >
                    <DeleteIcon />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      }
      if (fileView == "plate") {
        return (
          <div className="file_card" key={index}>
            <span className="fileIcon">{FIcons[file.type]}</span>

            <div className="file_name">{file.name}</div>
            <div className="column actions">
              <Button
                btnStyle="primary"
                className="buttonIcon"
                onClick={(e) => downloadClickHandler(e, file)}
              >
                <DownloadIcon /> Download
              </Button>
              <Button
                btnStyle="secondary"
                className="buttonIcon"
                onClick={(e) => deleteFileHandler(e, file)}
              >
                <DeleteIcon /> Delete
              </Button>
            </div>
          </div>
        );
      }
    });

  if (files.length === 0) {
    return <div>Files not found</div>;
  }

  const downloadClickHandler = (e, file) => {
    e.stopPropagation();

    downloadFile(file);
  };

  const deleteFileHandler = (e, file) => {
    e.stopPropagation();

    dispatch(deleteFile(file));
  };

  const handleSort = (e) => {
    const value = e.target.getAttribute("aria-current");
    const label = e.target.getAttribute("aria-label");
    if (!value) return;

    dispatch(
      setSortStatus({
        label,
        value: value,
      })
    );
  };

  if (fileView == "list") {
    return (
      <>
        <Card className="filesWrap">
          <header className="filesWrap__header">
            <h4>Files</h4>
            <div className="viewListBtns">
              <ListIcon onClick={() => dispatch(setView("list"))} />

              <FolderViewIcon onClick={() => dispatch(setView("plate"))} />
            </div>
          </header>

          <div className="table">
            <div className="row header" onClick={(e) => handleSort(e)}>
              <div
                className="column sort"
                aria-current={sort.value}
                aria-label="type"
              >
                Type
              </div>
              <div
                className="column sort"
                aria-current={sort.value}
                aria-label="name"
              >
                Name
              </div>
              <div
                className="column sort"
                aria-current={sort.value}
                aria-label="date"
              >
                Last modified
              </div>
              <div className="column">File size</div>
              <div className="column">Actions</div>
            </div>
            {files}
          </div>
        </Card>
      </>
    );
  }
  if (fileView == "plate") {
    return (
      <>
        <Card className="filesWrap">
          <header className="filesWrap__header">
            <h4>Files</h4>
            <div className="viewListBtns">
              <ListIcon onClick={() => dispatch(setView("list"))} />
              <FolderViewIcon onClick={() => dispatch(setView("plate"))} />
            </div>
          </header>

          <div className="plate">{files}</div>
        </Card>
      </>
    );
  }
};

export default FileList;
