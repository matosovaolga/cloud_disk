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
const DiskSidebar = (props) => {
  const [uploadFile, setUploadFile] = useState(false);
  const dispatch = useDispatch();

  const { usedSpace, diskSpace } = props.storage;

  const folderStack = useSelector((state) => state.files.folderStack);

  const backClickHandler = () => {
    const backDirId = folderStack[folderStack.length - 1];
    dispatch(popFromStack(backDirId));
    dispatch(setCurrentDir(backDirId));
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
        <Transition in={uploadFile} timeout={500} mountOnEnter unmountOnExit>
          {(state) => (
            <Modal
              state={state}
              className={s.sidebar_slideUp}
              close={setUploadFile}
            >
              <div className={s.btnGroup}>
                <Button btnStyle="secondary" type="button">
                  Upload File
                </Button>
                <Button
                  btnStyle="primary"
                  type="button"
                  onClick={() => props.storage.setFolderNameDialog(true)}
                >
                  Create folder
                </Button>
              </div>
            </Modal>
          )}
        </Transition>
      </div>
      <div className={s.storage}>
        <h3>Storage</h3>
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
