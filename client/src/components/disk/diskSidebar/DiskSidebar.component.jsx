import Button from "../../button/button.component";
import { Transition } from "react-transition-group";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../modal/Modal.component";
import Card from "../../card/Card.component";
import { popFromStack, setCurrentDir } from "../../../reducers/fileReducer";
const DiskSidebar = (props) => {
  const [uploadFile, setUploadFile] = useState(false);
  const dispatch = useDispatch();

  const folderStack = useSelector((state) => state.files.folderStack);

  const backClickHandler = () => {
    const backDirId = folderStack[folderStack.length - 1];
    dispatch(popFromStack(backDirId));
    console.log(folderStack);
    dispatch(setCurrentDir(backDirId));
  };

  return (
    <Card className="sidebar">
      <div className="sidebar_btns">
        <Button
          className="formBtn"
          btnStyle="primary"
          type="button"
          onClick={backClickHandler}
        >
          Back
        </Button>
        <Button
          className="formBtn"
          btnStyle="secondary"
          type="button"
          onClick={() => setUploadFile(true)}
        >
          Create new +
        </Button>
        <div>
          {props.storage.usedSpace} / {props.storage.diskSpace}
        </div>
      </div>
      <Transition in={uploadFile} timeout={500} mountOnEnter unmountOnExit>
        {(state) => (
          <Modal state={state} close={setUploadFile}>
            uload File
            <Button onClick={() => props.storage.setFolderNameDialog(true)}>
              Create folder
            </Button>
          </Modal>
        )}
      </Transition>
    </Card>
  );
};

export default DiskSidebar;
