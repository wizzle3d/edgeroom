import { useContext } from "react";
import { Store } from "../utils/ContextAndReducer";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";

const Interest = () => {
  const { store } = useContext(Store);
  const tokenInfo = store.authTokens && jwt_decode(store.authTokens.access);
  return (
    <div>
      {store?.authTokens && (
        <div className="bordered-sidebar">
          <p
            style={{
              borderBottom: "1px solid #b9b9b9",
              textAlign: "center",
              marginBottom: 10,
              backgroundColor: "#eff9ff",
            }}
          >
            Tags you are interested in
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {store?.interests?.length > 0 &&
              store?.interests?.map((interest) => (
                <span className="tag" key={interest?.id}>
                  {interest?.name}
                </span>
              ))}
            {store?.interests?.length === 0 && (
              <p style={{ padding: 20 }}>
                You have added no interest.{" "}
                <Link to={`/user/edit/${tokenInfo.user_id}`} className="link">
                  Edit your profile
                </Link>{" "}
                to add interest.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interest;
