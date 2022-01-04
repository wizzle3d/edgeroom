import { useState, useEffect, useContext } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import moment from "moment";
import jwt_decode from "jwt-decode";
import { BsFillClockFill, BsFillCalendarCheckFill } from "react-icons/bs";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Store } from "../utils/ContextAndReducer";
import { profileUpdateSchema } from "../utils/Schemas";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import { createNotification } from "../utils/functions";
import TagComponent2 from "../components/TagComponent2";
import { check } from "../utils/functions";

const EditProfile = () => {
  const { store, dispatch } = useContext(Store);
  const [selectedTags, setSelectedTags] = useState([]);
  const tokenInfo = store?.authTokens && jwt_decode(store?.authTokens.access);
  const [tags, setTags] = useState(null);
  const [serverRes, setServerRes] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState();
  const dateJoined = new Date(user?.date_joined);
  const lastSeen = new Date(user?.last_login);
  const [formPopulate, setFormPopulate] = useState(null);
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((rep) => rep.id !== tag.id));
  };
  const addTag = (tag) => {
    if (!check(selectedTags, tag)) setSelectedTags([...selectedTags, tag]);
  };
  const searchTag = (name) =>
    axios
      .get(`/api/search-tags/${name}`)
      .then((res) => setTags(res.data))
      .catch(() => setTags(null));
  const showWidget = () => {
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "wizzle3d",
        uploadPreset: "hasuhajhj",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          axios
            .put(
              "/api/edit-avatar/",
              { avatar: result.info.url },
              {
                headers: {
                  Authorization: `Bearer ${store?.authTokens?.access}`,
                },
              }
            )
            .then(() => setUser({ ...user, avatar: result.info.url }))
            .then(createNotification("Profile picture updated"));
        }
      }
    );
    widget.open();
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(profileUpdateSchema) });
  const toServer = (formdata) => {
    axios
      .put(
        "/api/edit-profile/",
        { ...formdata, interests: selectedTags },
        {
          headers: {
            Authorization: `Bearer ${store?.authTokens?.access}`,
          },
        }
      )
      .then(() => {
        navigate(`/user/${user.id}`);
        dispatch({ type: "RESET_TAG" });
      })
      .then(createNotification("Profile picture updated"))
      .catch((err) => setServerRes(err.response.data));
  };

  useEffect(() => {
    if (!store?.authTokens) {
      navigate("/401");
    } else if (tokenInfo.user_id !== Number(id)) {
      navigate("/403");
    }
    axios
      .get(`/api/get-user/${id}`, {
        headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
      })
      .then((res) => {
        setFormPopulate(res.data);
        setUser(res.data);
        setSelectedTags(res.data.interests);
      });
  }, [dispatch, navigate]);

  return (
    <>
      <NotificationContainer />
      {user && (
        <div style={{ padding: "25px 20px" }}>
          <div className="profile-avatar-wrapper mb-2">
            <Link to={`/user?id=${user.id}`} className="link">
              <img
                style={{ float: "left", marginRight: 20 }}
                src={user.avatar}
                alt={user.name}
                className="profile-avatar"
              />
            </Link>
            <div style={{ float: "left", lineHeight: 1.8 }}>
              <p style={{ fontSize: 30 }}>{user.username}</p>
              <div>
                <BsFillCalendarCheckFill
                  className="icon"
                  style={{ marginTop: 6, marginRight: 10, float: "left" }}
                />
                <span>Joined {moment(dateJoined).fromNow()}</span>
              </div>
              <div>
                <BsFillClockFill
                  className="icon"
                  style={{ marginTop: 6, marginRight: 10, float: "left" }}
                />
                <span>Last seen {moment(lastSeen).fromNow()}</span>
              </div>
            </div>
          </div>
          <hr style={{ width: "100%", border: "none" }} />
          <label style={{ fontSize: 23 }}>Public Info</label>
          <hr className="mb-2" />
          <div className="profile-stats">
            <div className="edit-picture" style={{ margin: 10 }}>
              <img src={user.avatar} alt={user.name} />
              <button onClick={() => showWidget()}>Change image</button>
            </div>
            <div
              className="input-group"
              style={{ width: "50%", marginTop: 40 }}
            >
              <label style={{ fontSize: 18 }}>Username</label>
              <input
                type="text"
                name="username"
                className="textfield"
                {...register("username")}
                value={formPopulate.username}
                onChange={(e) =>
                  setFormPopulate({ ...formPopulate, username: e.target.value })
                }
              />
              {serverRes?.error && (
                <p className="alert alert-danger">{serverRes.error}</p>
              )}
              {errors.username && (
                <p className="alert alert-danger">{errors.username?.message}</p>
              )}
            </div>
          </div>

          <div className="input-group">
            <label style={{ fontSize: 18 }}>Bio</label>
            <textarea
              type="text"
              name="bio"
              style={{ height: "100px" }}
              className="textfield"
              {...register("bio")}
              value={formPopulate.bio}
              onChange={(e) =>
                setFormPopulate({ ...formPopulate, bio: e.target.value })
              }
            />
            {errors.bio && (
              <p className="alert alert-danger">{errors.bio?.message}</p>
            )}
          </div>
          <label style={{ fontSize: 18 }}>Interest</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {selectedTags.map((tag) => (
              <span
                className="tag"
                key={tag?.id}
                onClick={() => removeTag(tag)}
              >
                {tag?.name}{" "}
                <span style={{ color: "#ac5a2b", fontSize: 15 }}>x</span>
              </span>
            ))}
          </div>
          <div className="textfield" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex" }} className="mb-2">
              <FiSearch style={{ float: "left" }} className="icon" />
              <input
                className="tag-search"
                style={{ float: "left" }}
                type="text"
                onChange={(e) => searchTag(e.target.value)}
                placeholder="Search tags..."
              />
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {tags?.length > 0 &&
                tags.map((tag) => (
                  <TagComponent2
                    addTag={addTag}
                    tags={selectedTags}
                    tag={tag}
                    key={tag.id}
                    onClick={() =>
                      store.tags.length < 5 &&
                      dispatch({ type: "ADD_TAG", payload: tag })
                    }
                  />
                ))}
              {tags?.length === 0 && (
                <p
                  className="tag-wrapper alert-danger"
                  style={{ width: "100%", textAlign: "center", padding: 30 }}
                >
                  No tag matches your search.
                </p>
              )}
            </div>
          </div>
          <label style={{ fontSize: 23 }}>Private Info</label>
          <hr className="mb-2" />
          <div className="input-group">
            <label style={{ fontSize: 18 }}>Full Name</label>
            <input
              type="text"
              name="name"
              className="textfield"
              {...register("name")}
              value={formPopulate.name}
              onChange={(e) =>
                setFormPopulate({ ...formPopulate, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="alert alert-danger">{errors.name?.message}</p>
            )}
          </div>
          <button className="btn btn-orange" onClick={handleSubmit(toServer)}>
            Update profile
          </button>
        </div>
      )}
    </>
  );
};

export default EditProfile;
