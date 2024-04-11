import { sizeFormat } from "../../../../utils/sizeFormat";
import FolderIcon from "../../../icons/FolderIcon.component";
import Card from "../../../card/Card.component";
import "./folder.scss";

import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";

const Folder = (props) => {
  const { folder } = props;
  const dispatch = useDispatch();

  const currentDir = useSelector((state) => state.files.currentDir);
  const openDirHandler = () => {
	
    dispatch(pushToStack(currentDir));
    dispatch(setCurrentDir(folder._id));
  };

  return (
    <Card className="folderCard" onClick={() => openDirHandler()}>
      <div className="folderIcon">
        <FolderIcon />
      </div>
      <h3 className="folderTitle">{folder.name}</h3>
      <p>Folder Size: {sizeFormat(folder.size)} </p>
    </Card>
  );
};

export default Folder;
