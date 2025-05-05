import axios from "axios";
import { setUser } from "../reducers/userReducer";


export const registration = async (email, password, name) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/registration`,
      {
        email,
        password,
        name,
      }
    );
  } catch (e) {
    console.log(e);
  }
};
export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      dispatch(setUser(response.data.user));
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (e) {
      
      return e;
    }
  };
};

export const auth = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/auth`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(setUser(response.data.user));
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
        `${process.env.REACT_APP_API_URL}/files/avatar`,
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
        `${process.env.REACT_APP_API_URL}/files/avatar`,

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
