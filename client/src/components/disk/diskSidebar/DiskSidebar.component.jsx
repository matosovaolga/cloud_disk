import Button from "../../button/button.component";
import { Transition } from "react-transition-group";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sizeFormat } from "../../../utils/sizeFormat";
import Modal from "../../modal/Modal.component";
import Card from "../../card/Card.component";
import { popFromStack, setCurrentDir } from "../../../reducers/fileReducer";
import s from "./DiskSidebar.module.scss";
import cn from "classnames";
import { uploadFile } from "../../../actions/file";
const DiskSidebar = (props) => {
  const [uploadFileModal, setUploadFile] = useState(false);
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const { usedSpace, diskSpace } = props.storage;

  const folderStack = useSelector((state) => state.files.folderStack);

  const backClickHandler = () => {
    const backDirId = folderStack[folderStack.length - 1];
    dispatch(popFromStack(backDirId));
    dispatch(setCurrentDir(backDirId));
  };

  const fileUploadHandler = (e) => {
    const files = [...e.target.files];
    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    setUploadFile(false);
  };

  const createFolderhandler = () => {
    props.storage.setFolderNameDialog(true);
    setUploadFile(false);
  };

  return (
    <Card className={s.sidebar}>
      <div className={s.sidebar_btns}>
        <Button btnStyle="primary" type="button" onClick={backClickHandler}>
          Back
        </Button>
        <Button
          btnStyle="secondary"
          type="button"
          onClick={() => setUploadFile(true)}
        >
          Create new +
        </Button>
        <Transition
          in={uploadFileModal}
          timeout={500}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <Modal
              state={state}
              className={s.sidebar_slideUp}
              close={setUploadFile}
            >
              <div className={s.btnGroup}>
                <div className={s.uploaderWrap}>
                  <label htmlFor="upload_input" className={s.upload_label}>
                    Upload file
                  </label>
                  <input
                    type="file"
                    id="upload_input"
                    className={s.upload_input}
                    onChange={(e) => fileUploadHandler(e)}
                    multiple={true}
                  />
                </div>

                <Button
                  btnStyle="primary"
                  type="button"
                  onClick={() => createFolderhandler()}
                >
                  Create folder
                </Button>
              </div>
            </Modal>
          )}
        </Transition>
      </div>
      <div className={s.storage}>
        <h3>Storage Data</h3>
        <div className={s.storage_progress}>
          <div
            className={cn(
              s.progress_bar,
              s.progress_bar_striped,
              s.progress_bar_animated
            )}
            style={{
              width: usedSpace / (diskSpace / 100) + "%",
            }}
            role="progressbar"
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className={s.storage_size}>
          {sizeFormat(usedSpace)} / {sizeFormat(diskSpace)}
        </div>
      </div>
    </Card>
  );
};

export default DiskSidebar;
