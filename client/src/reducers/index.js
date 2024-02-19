import { combineReducers } from "redux";
import { configureStore, isPlain } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { Iterable } from "immutable";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import uploadReducer from './upload.reducer';
import appReducer from "./appReducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [

  ],
  blacklist: [

  ],
};

const rootReducer = combineReducers({
  user: userReducer,
  files: fileReducer,
  upload: uploadReducer,
  app: appReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const actionSanitizer = (action) => {
  const uiRouterActions = /@ui-router.+/g;
  return uiRouterActions.test(action.type)
    ? {
        type: action.type,
        transition: sanitizeUIRouterTransition(action.transition),
      }
    : action;
};

const stateSanitizer = (state) => {
  if (state.router && state.router.last && state.router.last) {
    return {
      ...state,
      router: sanitizeUIRouterTransition(state.router.last),
    };
  }
  return state;
};

const sanitizeUIRouterTransition = (transition) => ({
  params:
    transition.router &&
    transition.router.globals &&
    transition.router.globals.params,
  current:
    transition.router &&
    transition.router.globals &&
    transition.router.globals.current,
  targetState: transition.targetState && transition.targetState().state(),
  from: transition.from && transition.from(),
  to: transition.to && transition.to(),
});

const reduxDevtoolsExtensionOptions = {
  actionSanitizer,
  stateSanitizer,
};
const isSerializable = (value) =>
  Iterable.isIterable(value) || isPlain(value);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: reduxDevtoolsExtensionOptions,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        isSerializable,
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      actionSanitizer,
    })
});

export const persistor = persistStore(store);