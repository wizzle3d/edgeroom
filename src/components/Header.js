import { FiSearch } from "react-icons/fi";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArchive } from "react-icons/io";
import jwt_decode from "jwt-decode";
import { Store } from "../utils/ContextAndReducer";
import Notification from "./Notification";
import axios from "axios";
import { BsList } from "react-icons/bs";
import MobileMainNav from "./MobileMainNav";

const Header = ({ active, setActive }) => {
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
  }, [store?.authTokens, dispatch, tokenInfo?.user_id]);
  const [showNotification, setShowNotification] = useState(false);
  return (
    <>
      <header>
        <div className="header-container">
          <div>
            <Link to="/">
              <img
                src="https://res.cloudinary.com/wizzle3d/image/upload/v1641290915/vaito/jjj_qimqcb.svg"
                alt="home"
                style={{ marginTop: 8 }}
              />
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
              <Link to={`/user/${tokenInfo?.user_id}`}>
                <img
                  src={store?.avatar}
                  alt=""
                  className="avatar"
                  style={{ marginLeft: 10, marginTop: 5 }}
                />
              </Link>
            )}
            {store.authTokens && (
              <div
                style={{ position: "relative", marginTop: 2, marginRight: 10 }}
              >
                <span style={{ cursor: "pointer" }}>
                  <IoMdArchive
                    id="note-icon"
                    style={{ fontSize: 23, marginTop: 3 }}
                    onClick={() => setShowNotification(!showNotification)}
                  />
                  {store.notifications?.unseen_count > 0 && (
                    <small
                      className="new-notifications"
                      id="note-new"
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
              onClick={() => {
                setMobileNav(!mobileNav);
              }}
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
                <button
                  id="note-selector"
                  onClick={() => setShowNotification(!showNotification)}
                >
                  o
                </button>
                <span>
                  <IoMdArchive
                    id="noteicon"
                    style={{ fontSize: 23, marginTop: 3 }}
                  />
                  {store.notifications?.unseen_count > 0 && (
                    <small
                      id="notii"
                      className="new-notifications"
                      style={{ margin: 0 }}
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
        <MobileMainNav
          setMobileNav={setMobileNav}
          active={active}
          setActive={setActive}
        />
      )}
    </>
  );
};

export default Header;
