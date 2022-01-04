import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../utils/ContextAndReducer";
import NotificationChildren from "./NotificationChildren";

const Notification = ({ setShowNotification }) => {
  const [notification, setNotification] = useState(null);
  const { store } = useContext(Store);
  useEffect(
    () =>
      axios
        .get("/api/get-notifications/", {
          headers: { Authorization: `Bearer ${store?.authTokens.access}` },
        })
        .then((res) => setNotification(res.data)),
    [store?.authTokens.access]
  );
  window.onclick = function (event) {
    console.log(event.target);

    if (
      event.target !== document.getElementById("note-selector") &&
      event.target !== document.getElementById("notification-wrapper")
    ) {
      console.log(document.getElementById("notification-wrapper"), "test done");
      setShowNotification(false);
    }
  };
  return (
    <div id="notification-wrapper">
      {notification &&
        notification?.obj.map((obj) => (
          <NotificationChildren
            setShowNotification={setShowNotification}
            obj={obj}
            key={obj.id}
          />
        ))}
      {notification?.obj.length === 0 && (
        <p
          style={{
            width: "100%",
            textAlign: "center",
            padding: 30,
            boxSizing: "border-box",
            borderBottom: "1px solid #b9b9b9",
          }}
        >
          You have no notifications yet
        </p>
      )}
    </div>
  );
};

export default Notification;
