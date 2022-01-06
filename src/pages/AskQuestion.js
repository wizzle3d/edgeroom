import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { singleSchema } from "../utils/Schemas";
import { useState, useContext, useEffect } from "react";
import { Store } from "../utils/ContextAndReducer";
import { useNavigate, Link } from "react-router-dom";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import { createNotification, check, getString } from "../utils/functions";
import TagComponent2 from "../components/TagComponent2";
import Modal from "../components/Modal";
import TextEditor from "../components/TextEditor";
import Interest from "../components/Interest";

const AskQuestion = () => {
  const [tags, setTags] = useState(null);
  const [des, setDes] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const { store } = useContext(Store);
  const [serverResponse, setServerResponse] = useState(null);
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((rep) => rep.id !== tag.id));
  };
  const addTag = (tag) => {
    if (!check(selectedTags, tag) && selectedTags.length < 5)
      setSelectedTags([...selectedTags, tag]);
  };
  useEffect(() => {
    if (!store?.authTokens) navigate("/login");
  });
  const searchTag = (name) => {
    if (name.length > 1) {
      axios
        .get(`/api/search-tags/${name}`)
        .then((res) => setTags(res.data))
        .catch(() => setTags(null));
    }
  };

  // Tag Modal Initialization
  let modal = document.getElementById("modal");

  const toServer = (formData) => {
    if (!des || getString(des) < 5) {
      return setInvalid(true);
    } else {
      formData = { ...formData, tags: selectedTags, description: des };
      axios
        .post("/api/create-question/", formData, {
          headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
        })
        .then(() => navigate("/"))
        .then(createNotification("success", "Question posted"))
        .catch((error) => setServerResponse(error.response.data));
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(singleSchema) });
  return (
    <div>
      <div id="modal" className="modal">
        <Modal
          createNotification={createNotification}
          store={store}
          modal={modal}
        />
      </div>
      {store.authTokens && (
        <form
          className="content"
          onSubmit={handleSubmit(toServer)}
          style={{ padding: "25px 20px" }}
        >
          {serverResponse?.detail && (
            <p className="alert alert-danger" style={{ marginBottom: 20 }}>
              {serverResponse?.detail}
            </p>
          )}
          <fieldset>
            <legend>Ask a Question</legend>
            <div className="input-group">
              <label>Question?</label>
              <input
                type="text"
                {...register("input")}
                name="input"
                onChange={() => setServerResponse({})}
                className="textfield"
              />
              {errors.input && (
                <p className="alert alert-danger">{errors.input?.message}</p>
              )}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label>Description</label>
              <div>
                <TextEditor setDes={setDes} setInvalid={setInvalid} />
              </div>
              {invalid && (
                <p className="alert alert-danger">Description is too short</p>
              )}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {selectedTags?.map((tag) => (
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
            </div>
            <label>
              Add tags <small>(maximum of 5)</small>:
            </label>
            <div style={{ marginBottom: 20, border: "1px solid #dadada" }}>
              <div style={{ display: "flex", marginTop: 10 }} className="mb-2">
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
                  tags?.map((tag) => (
                    <TagComponent2
                      addTag={addTag}
                      tags={selectedTags}
                      tag={tag}
                      key={tag.id}
                    />
                  ))}
                {tags?.length === 0 && (
                  <p
                    className="tag-wrapper alert-danger"
                    style={{ width: "100%", textAlign: "center", padding: 30 }}
                  >
                    No tag matches your search.{" "}
                    <span
                      className="btn btn-blue"
                      style={{
                        margin: 0,
                        padding: "1px 5px",
                        height: "",
                        width: "fit-content",
                      }}
                      onClick={() => (modal.style.display = "block")}
                    >
                      Create a tag
                    </span>
                  </p>
                )}
              </div>
            </div>
            <input
              type="submit"
              className="btn btn-orange"
              value="Ask Question"
              style={{ height: 45, width: "100%", margin: 0 }}
            />
          </fieldset>
        </form>
      )}
      {store?.authTokens && (
        <div className="right-pane">
          <p
            className="bordered-sidebar"
            style={{ padding: 20, marginBottom: 20, textAlign: "center" }}
          >
            Go to{" "}
            <Link className="link" to="/user-questions">
              My Questions
            </Link>
          </p>
          <Interest className="bordered-sidebar" />
        </div>
      )}
      <NotificationContainer />
    </div>
  );
};

export default AskQuestion;
