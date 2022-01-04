import { createContext } from "react";
import { useReducer, useEffect } from "react";
import { updateToken, checkNotifications } from "./functions";

export const initialState = {
  authTokens: localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null,
  loading: true,
};

export const Store = createContext();

export const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("authTokens", JSON.stringify(action.payload));
      newState = {
        ...state,
        authTokens: JSON.parse(localStorage.getItem("authTokens")),
        loading: false,
      };
      return newState;
    case "LOGOUT":
      localStorage.removeItem("authTokens", action.payload);
      newState = { ...state, authTokens: null };
      return newState;
    case "NOTIFICATIONS":
      newState = { ...state, notifications: action.payload };
      return newState;
    case "AVATAR":
      newState = { ...state, avatar: action.payload };
      return newState;
    case "INTERESTS":
      newState = { ...state, interests: action.payload };
      return newState;
    default:
      return;
  }
};

const ContextAndReducer = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (store.loading && store.authTokens) {
      updateToken(store, dispatch);
    }
    const interval = setInterval(() => {
      if (store.authTokens) {
        updateToken(store, dispatch);
      }
    }, 540000);
    return () => clearInterval(interval);
  }, [store]);
  useEffect(() => {
    if (!store.loading) {
      checkNotifications(store, dispatch);
    }
    const notifyinterval = setInterval(() => {
      if (store.authTokens) {
        checkNotifications(store, dispatch);
      }
    }, 10000);
    return () => clearInterval(notifyinterval);
  }, [store.loading]);
  return (
    <Store.Provider value={{ store, dispatch }}>
      {(store.authTokens && !store.loading) || !store.authTokens
        ? children
        : null}
    </Store.Provider>
  );
};

export default ContextAndReducer;
