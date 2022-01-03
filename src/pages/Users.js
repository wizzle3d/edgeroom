import axios from "axios";
import { useEffect, useState } from "react";
import UserComponent from "../components/UserComponent";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState(null);
  useEffect(() => {
    axios.get("/api/get-users").then((res) => setUsers(res.data));
  }, []);
  return (
    <div>
      {users && (
        <div style={{ padding: "25px 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                color: "rgb(58, 58, 58)",
                fontSize: 26,
              }}
            >
              All Users
            </p>
            <Link to="/ask-question">
              <button className="btn btn-blue">Ask question</button>
            </Link>
          </div>
          <p>{users?.length} users</p>
          <hr className="mb-2" />
          <div>
            {users && (
              <div className="tags-wrapper">
                {users?.map((user) => (
                  <UserComponent key={user.id} user={user} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
