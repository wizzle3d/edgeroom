import { Link } from "react-router-dom";

const UserComponent = ({ user }) => {
  return (
    <div className="tag-wrapper" style={{}}>
      <Link to={`/user/${user.id}`} className="link">
        <img
          style={{ float: "left", marginRight: 5 }}
          src={user.avatar}
          alt={user.name}
          width="80px"
          height="80px"
        />
      </Link>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Link to={`/user/${user.id}`} className="link">
          @{user.username}
        </Link>
      </div>
    </div>
  );
};

export default UserComponent;
