const SET_USER = "SET_USER";
const LOGOUT_USER = "LOGOUT_USER";

const defaultState = {
  currentUser: {
  },
  isAuth: false,
};

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAuth:  true 
      };
    case LOGOUT_USER:
      localStorage.removeItem("token");
      return {
        ...state,
        ...defaultState,
      };
    default:
      return state;
  }
}

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const logoutUser = (user) => ({ type: LOGOUT_USER, payload: user });
