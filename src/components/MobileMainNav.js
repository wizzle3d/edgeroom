import { useContext } from "react";
import { Link } from "react-router-dom";
import { Store } from "../utils/ContextAndReducer";
import MobileNav from "./MobileNav";
import { FaTimes } from "react-icons/fa";

const MobileMainNav = ({ setMobileNav, active, setActive }) => {
  const { store, dispatch } = useContext(Store);
  window.onclick = function (event) {
    if (event.target === document.getElementById("mobile-nav")) {
      setMobileNav(false);
    }
  };
  return (
    <div id="mobile-nav">
      <div className="mobile-nav">
        <div style={{ height: 43, borderBottom: "2px solid #dadada" }}>
          <Link to="/" onClick={() => setMobileNav(false)}>
            <img
              src="https://res.cloudinary.com/wizzle3d/image/upload/v1641290915/vaito/jjj_qimqcb.svg"
              alt="home"
              style={{
                margin: "12px 4px 10px 10px",
                width: 27,
                float: "left",
              }}
            />
            <h2
              className="word"
              style={{
                margin: "4px 0px 0px 0px",
                paddingBottom: 5,
                float: "left",
                color: "black",
              }}
            >
              edge<span style={{ color: "#ee8723" }}>Room</span>
            </h2>
          </Link>
          <FaTimes
            style={{
              margin: "11px 4px 4px 4px",
              fontSize: 20,
              paddingBottom: 5,
              float: "right",
              cursor: "pointer",
            }}
            className="dislike"
            onClick={() => setMobileNav(false)}
          />
        </div>
        <div className="mobile-header-content mb-2">
          <p>edgeRoom is a community of amazing developers.</p>
          {store?.authTokens === null ? (
            <>
              <Link to="/login" onClick={() => setMobileNav(false)}>
                <button className="btn btn-dark">Log in</button>
              </Link>
              <Link to="/signup" onClick={() => setMobileNav(false)}>
                <button className="btn btn-blue">Create account</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/user-questions" onClick={() => setMobileNav(false)}>
                <button className="btn btn-blue">My questions</button>
              </Link>
              <button
                onClick={() => {
                  setMobileNav(false);
                  dispatch({ type: "LOGOUT" });
                }}
                className="btn btn-dark"
              >
                Log out
              </button>
            </>
          )}
        </div>
        <div style={{ marginLeft: "10%" }}>
          <MobileNav
            setMobileNav={setMobileNav}
            active={active}
            setActive={setActive}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileMainNav;
