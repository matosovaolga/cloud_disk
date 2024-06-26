import axios from "axios";
import { setUser } from "../reducers/userReducer";
import { API_URL } from "../config";

export const registration = async (email, password, name) => {
  try {
    await axios.post(`${API_URL}api/auth/registration`, {
      email,
      password,
      name,
    });
  } catch (e) {
    console.log(e);
  }
};
export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API_URL}api/auth/login`, {
        email,
        password,
      });
      console.log(response.data);

      dispatch(setUser(response.data));
      localStorage.setItem("token", response.data.token);
    } catch (e) {
      console.log(e);
    }
  };
};

export const auth = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}api/auth/auth`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      dispatch(setUser(response.data));
      localStorage.setItem("token", response.data.token);
    } catch (e) {
      console.log(e);
      localStorage.removeItem("token");
    }
  };
};

export const uploadAvatar = (file) => {
  return async (dispatch) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        `${API_URL}api/files/avatar`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(setUser(response.data));
    } catch (e) {
      console.log(e);
    }
  };
};

export const deleteAvatar = (file) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API_URL}api/files/avatar`,

        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(setUser(response.data));
    } catch (e) {
      console.log(e);
    }
  };
};
