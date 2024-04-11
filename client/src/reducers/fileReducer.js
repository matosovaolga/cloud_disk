const SET_FILES = "SET_FILES";
const SET_CURRENT_DIR = "SET_CURRENT_DIR";
const SET_SORT_STATUS = "SET_SORT_STATUS";
const ADD_FILE = "ADD_FILE";
const PUSH_TO_STACK = "PUSH_TO_STACK";
const POP_FROM_STACK = "POP_FROM_STACK";
const DELETE_FILE = "DELETE_FILE";
const SET_VIEW = "SET_VIEW";

const defaultState = {
  files: [],
  sortStatus: {
    value: 1,
    label: "name",
  },
  currentDir: null,
  folderStack: [],
  view: "list",
};

export default function fileReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_FILES:
      return {
        ...state,
        files: action.payload,
      };
    case SET_CURRENT_DIR:
      return {
        ...state,
        currentDir: action.payload,
      };
    case SET_SORT_STATUS:
      return {
        ...state,
        sortStatus: action.payload,
      };
    case ADD_FILE:
      return {
        ...state,
        files: [...state.files, action.payload],
      };

    case PUSH_TO_STACK:
      return {
        ...state,
        folderStack: [...state.folderStack, action.payload],
      };

    case POP_FROM_STACK:
      return {
        ...state,
        folderStack: state.folderStack.filter(
          (folder) => folder !== action.payload
        ),
      };
    case DELETE_FILE:
      return {
        ...state,
        files: [...state.files.filter((file) => file._id !== action.payload)],
      };

    case SET_VIEW:
      return {
        ...state,
        view: action.payload,
      };

    default:
      return state;
  }
}

export const setFiles = (files) => ({ type: SET_FILES, payload: files });
export const setCurrentDir = (dir) => ({ type: SET_CURRENT_DIR, payload: dir });
export const setSortStatus = (sort) => ({
  type: SET_SORT_STATUS,
  payload: sort,
});
export const createFile = (file) => ({ type: ADD_FILE, payload: file });
export const deleteCurrentFile = (file) => ({
  type: DELETE_FILE,
  payload: file,
});
export const pushToStack = (folder) => ({
  type: PUSH_TO_STACK,
  payload: folder,
});
export const popFromStack = (folder) => ({
  type: POP_FROM_STACK,
  payload: folder,
});

export const setView = (view) => ({
  type: SET_VIEW,
  payload: view,
});
