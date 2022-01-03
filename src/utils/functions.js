import { NotificationManager } from "react-notifications";
import axios from "axios";

// refresh access token
export const updateToken = (store, dispatch) => {
  axios
    .post("/api/token/refresh/", { refresh: store.authTokens.refresh })
    .then((response) => {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      });
    })
    .catch(() => {
      dispatch({ type: "LOGOUT" });
    });
};

export const checkNotifications = (store, dispatch) =>
  axios
    .get("/api/check-notifications", {
      headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
    })
    .then((res) =>
      dispatch({
        type: "NOTIFICATIONS",
        payload: res.data,
      })
    );

export const createNotification = (type, message) => {
  return () => {
    switch (type) {
      case "info":
        NotificationManager.info(message);
        break;
      case "success":
        NotificationManager.success(message);
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000
        );
        break;
      case "error":
        NotificationManager.error(message, "Error!", 5000, () => {
          alert("callback");
        });
        break;
      default:
        return;
    }
  };
};
// Get string from draft.js raw objects.
export const getString = (description) => {
  let output = "";
  description.blocks.forEach((block) => (output += " " + block.text));
  return output;
};

// check dictionary in array of dictionary using dict ID
export const check = (a, b) => {
  if (a.length > 0) {
    for (var i = 0; i < a.length; i++) {
      if (a[i].id === b.id) {
        return true;
      } else if (i === a.length - 1) return false;
    }
  } else {
    return false;
  }
};
