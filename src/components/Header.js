import { FiSearch } from "react-icons/fi";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArchive } from "react-icons/io";
import jwt_decode from "jwt-decode";
import { Store } from "../utils/ContextAndReducer";
import MobileNav from "./MobileNav";
import Notification from "./Notification";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { BsList } from "react-icons/bs";

const Header = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const navigate = useNavigate();
  const { store, dispatch } = useContext(Store);
  const tokenInfo = store.authTokens && jwt_decode(store?.authTokens?.access);
  useEffect(() => {
    if (store.authTokens)
      axios.get(`/api/get-user/${tokenInfo?.user_id}`).then((res) => {
        dispatch({ type: "AVATAR", payload: res.data.avatar });
        dispatch({ type: "INTERESTS", payload: res.data.interests });
      });
  }, [store?.authTokens, tokenInfo?.user_id]);
  const [showNotification, setShowNotification] = useState(false);
  return (
    <>
      <header>
        <div className="header-container">
          <div>
            <Link to="/">
              <img src="../jjj.svg" alt="home" style={{ marginTop: 8 }} />
              <h2
                className="word"
                style={{ margin: 0, paddingBottom: 5, float: "right" }}
              >
                edge<span style={{ color: "#ee8723" }}>Room</span>
              </h2>
            </Link>
          </div>
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/search?query=${e.target.query.value}`);
            }}
          >
            <i className="search-icon">
              <FiSearch />
            </i>
            <input
              type="text"
              name="query"
              placeholder="Search..."
              className="textfield"
              style={{ paddingLeft: 26, background: "none" }}
            />
          </form>
          <div className="header-toggle">
            {store.authTokens && (
              <img src={store?.avatar} alt="" className="avatar" />
            )}
            {store.authTokens && (
              <div
                style={{ position: "relative", marginTop: 2, marginRight: 10 }}
              >
                <span style={{ cursor: "pointer" }}>
                  <IoMdArchive
                    style={{ fontSize: 23, marginTop: 3 }}
                    onClick={() => setShowNotification(!showNotification)}
                  />
                  {store.notifications?.unseen_count > 0 && (
                    <small
                      className="new-notifications"
                      style={{ margin: 0 }}
                      onClick={() => setShowNotification(!showNotification)}
                    >
                      {store.notifications?.unseen_count}
                    </small>
                  )}
                </span>
                {showNotification && (
                  <Notification setShowNotification={setShowNotification} />
                )}
              </div>
            )}
            <BsList
              style={{ fontSize: 25, cursor: "pointer" }}
              className={mobileNav && "liked"}
              onClick={() => setMobileNav(!mobileNav)}
            />
          </div>
          {store?.authTokens === null ? (
            <nav className="main-nav">
              <Link to="/login">
                <button className="btn btn-dark" style={{ marginRight: 20 }}>
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-blue">Create account</button>
              </Link>
            </nav>
          ) : (
            <nav className="main-nav">
              <img src={store?.avatar} alt="" className="avatar" />
              <div
                style={{ position: "relative", marginTop: 2, marginRight: 30 }}
              >
                <span style={{ cursor: "pointer" }}>
                  <IoMdArchive
                    style={{ fontSize: 23, marginTop: 3 }}
                    onClick={() => setShowNotification(!showNotification)}
                  />
                  {store.notifications?.unseen_count > 0 && (
                    <small
                      className="new-notifications"
                      style={{ margin: 0 }}
                      onClick={() => setShowNotification(!showNotification)}
                    >
                      {store.notifications?.unseen_count}
                    </small>
                  )}
                </span>
                {showNotification && (
                  <Notification setShowNotification={setShowNotification} />
                )}
              </div>
              <button
                onClick={() => dispatch({ type: "LOGOUT" })}
                className="btn btn-dark"
              >
                Log out
              </button>
            </nav>
          )}
        </div>
      </header>
      {mobileNav && (
        <nav className="mobile-nav">
          <div style={{ height: 43, borderBottom: "2px solid #dadada" }}>
            <Link to="/" onClick={() => setMobileNav(false)}>
              <img
                src="../jjj.svg"
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
            <MobileNav setMobileNav={setMobileNav} />
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
