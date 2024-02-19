
import Button from "../../button/button.component";
const DiskSidebar = (props) => {
	
  return (
    <div className="sidebar">
      <div className="sidebar_btns">
        <Button>Back</Button>
        <Button onClick={() => props.storage.setFolderNameDialog(true)}>
          Upload file
        </Button>
      </div>
    </div>
  );
};

export default DiskSidebar;
