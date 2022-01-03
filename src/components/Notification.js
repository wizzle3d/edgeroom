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
        .get("/api/get-notifications", {
          headers: { Authorization: `Bearer ${store?.authTokens.access}` },
        })
        .then((res) => setNotification(res.data)),
    [store?.authTokens.access]
  );
  return (
    <div className="notification-wrapper">
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
