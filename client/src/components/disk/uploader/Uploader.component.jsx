import s from "./Uploader.module.scss";
import CloseIcon from "../../icons/CloseIcon.component";
import Card from "../../card/Card.component";
import { UploadFile } from "./uploadFile.component";

import { useDispatch, useSelector } from "react-redux";
import { hideUploader } from "../../../reducers/upload.reducer";

export const Uplolader = () => {
  const files = useSelector((state) => state.upload.files);

  const isVisible = useSelector((state) => state.upload.isVisible);
  const dispatch = useDispatch();

  return (
    isVisible && (
      <Card className={s.uploader}>
        <div className={s.uploader__header}>
          <div className={s.uploader__title}>Downloads</div>
          <CloseIcon onClick={() => dispatch(hideUploader())} />
        </div>
        {files.map((file) => (
          <UploadFile key={file.id} file={file} />
        ))}
      </Card>
    )
  );
};
