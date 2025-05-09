import axios from "axios";
import {
  createFile,
  setFiles,
  deleteCurrentFile,
} from "../reducers/fileReducer";
import {
  addUploadFile,
  changeUploadFile,
  showUploader,
} from "../reducers/upload.reducer";
import { hideLoader, showLoader } from "../reducers/appReducer";


export function getFiles(dirId, sort) {
  return async (dispatch) => {
    try {
      dispatch(showLoader());

       let url = `${process.env.REACT_APP_API_URL}/files?${
         dirId ? "parent_id=" + dirId + "&" : ""
       }sort=${JSON.stringify(sort)}`;


      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      dispatch(setFiles(response.data));
    } catch (e) {
      alert(e.response.data.message);
    } finally {
      dispatch(hideLoader());
    }
  };
}

export function createFolder(dirId, name) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/files`,
        {
          parent_id: dirId,
          type: "dir",
          name: name,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(createFile(response.data));
    } catch (e) {
      console.log(e);
      alert(e.response.data.message);
    }
  };
}

export function uploadFile(file, dirId) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (dirId) {
        formData.append("parent_id", dirId);
      }

      const uploadFile = { name: file.name, progress: 0, id: Date.now() };
      dispatch(showUploader());
      dispatch(addUploadFile(uploadFile));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/files/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          onUploadProgress: (progressEvent) => {
            const totalLength = progressEvent.event.lengthComputable
              ? progressEvent.total
              : progressEvent.event.target.getResponseHeader(
                  "content-length"
                ) ||
                progressEvent.event.target.getResponseHeader(
                  "x-decompressed-content-length"
                );

            if (totalLength) {
              uploadFile.progress = Math.round(
                (progressEvent.loaded * 100) / totalLength
              );
              dispatch(changeUploadFile(uploadFile));
            }
          },
        }
      );

      dispatch(createFile(response.data));
    } catch (e) {
      console.log(e);
      alert(e.response.data.message);
    }
  };
}

export async function downloadFile(file) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/files/download?id=${file._id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (response.status === 200) {
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export function deleteFile(file) {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/files?id=${file._id}`,

        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(deleteCurrentFile(file._id));
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };
}

export function searchFile(search) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/files/search?search=${search}`,

        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(setFiles(response.data));
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    } finally {
      dispatch(hideLoader());
    }
  };
}
