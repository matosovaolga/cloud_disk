import { useDispatch } from "react-redux";
import CloseIcon from "../../icons/CloseIcon.component";
import s from "./Uploader.module.scss";
import { removeUploadFile } from "../../../reducers/upload.reducer";

export const UploadFile = ({ file }) => {
  const dispatch = useDispatch();
  return (
    <div className={s.upload_file}>
      <div className={s.upload_file__header}>
        <div className={s.upload_file__name}>{file.name}</div>
        <div className={s.upload_file__close}>
          <CloseIcon onClick={() => dispatch(removeUploadFile(file.id))} />
        </div>
      </div>
      <div className={s.upload_file__progress_bar}>
        <div
          className={s.upload_file__upload_bar}
          style={{ width: file.progress + "%" }}
        />
        <div className={s.upload_file__percent}>{file.progress}%</div>
      </div>
    </div>
  );
};
