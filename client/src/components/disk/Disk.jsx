import React, { useEffect, useState } from "react";
import "./disk.scss";
import { useDispatch, useSelector } from "react-redux";
import { createFolder, getFiles } from "../../actions/file";

import DiskManager from "./diskManager/DiskManager.component";
import DiskSidebar from "./diskSidebar/DiskSidebar.component";
import Modal from "../modal/Modal.component";
import CreateFolderForm from "./createFolderForm/createFolderForm.component";
import { Transition } from "react-transition-group";

const Disk = (props) => {
  const dispatch = useDispatch();
  const { diskSpace, usedSpace } = useSelector(
    (state) => state.user.currentUser
  );
  const sort = useSelector((state) => state.files.sortStatus);
  const [folderNameDialog, setFolderNameDialog] = useState(false);
  const currentDir = useSelector((state) => state.files.currentDir);

  const creadeFolderHandler = (name) => {
    dispatch(createFolder(currentDir, name)).then(() => {
      setFolderNameDialog(false);
    });
  };

  useEffect(() => {
    dispatch(getFiles(currentDir, sort));
  }, [currentDir, sort]);

  return (
    <div className="disk">
      <DiskSidebar storage={{ diskSpace, usedSpace, setFolderNameDialog }} />

      <DiskManager />

      <Transition
        in={folderNameDialog}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <Modal state={state} close={setFolderNameDialog}>
            <CreateFolderForm createFolder={creadeFolderHandler} />
          </Modal>
        )}
      </Transition>
    </div>
  );
};

export default Disk;
