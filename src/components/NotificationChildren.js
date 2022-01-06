import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { Store } from "../utils/ContextAndReducer";
import axios from "axios";
import { BsFillChatSquareFill } from "react-icons/bs";

const NotificationChildren = ({ obj, setShowNotification }) => {
  const { store, dispatch } = useContext(Store);
  const comments = obj?.change.filter((chg) => chg.action_type === "comment");

  const newComments =
    comments?.length > 0 &&
    obj.change.filter((chg) => chg.action_type === "comment" && !chg.is_seen);

  const answers = obj?.change.filter((chg) => chg.action_type === "answer");
  const newAnswers =
    answers?.length > 0 &&
    obj.change.filter((chg) => chg.action_type === "answer" && !chg.is_seen);
  const solution = obj.change.filter((chg) => chg.action_type === "solution");

  const toServer = (type) => {
    let formData;
    if (type === "comment-answer") {
      formData = obj.change.filter((chg) => chg.is_seen === false);
    } else if (type === "solution") {
      formData = solution.filter((chg) => chg.is_seen === false);
    }
    if (formData?.length > 0) {
      axios
        .put(`/api/edit-notifications/${obj.id}`, formData, {
          headers: { Authorization: `Bearer ${store?.authTokens.access}` },
        })
        .then((res) => {
          setShowNotification(false);
          dispatch({
            type: "NOTIFICATIONS",
            payload: res.data,
          });
        });
    } else {
      setShowNotification(false);
    }
  };

  return (
    <div style={{ lineHeight: 1 }}>
      {obj.entity_type === "question" && (
        <Link to={`/question/${obj.entity.id}`}>
          <button
            className={`notification-btn ${
              (newComments?.length > 0 && "note-new") ||
              (newAnswers?.length > 0 && "note-new")
            }`}
            onClick={() => toServer("comment-answer")}
          >
            <div className="notification-attribute">
              <BsFillChatSquareFill style={{ marginLeft: 15 }} />
              <p className="note-attribute-placeholder">
                {obj.entity_type.slice(0, 1)}
              </p>
            </div>
            <div className="notification-content">
              {comments?.length > 0 && (
                <span>
                  {newComments?.length > 0 ? (
                    <small className="comment-answer new">
                      {newComments?.length}{" "}
                      {newComments?.length > 1 ? "new comments" : "new comment"}
                    </small>
                  ) : (
                    <small className={`comment-answer`}>
                      {comments?.length}{" "}
                      {comments?.length > 1 ? "comments" : "comment"}
                    </small>
                  )}
                </span>
              )}
              {answers?.length > 0 && (
                <span style={{ marginLeft: comments.length > 0 ? 15 : 0 }}>
                  {newAnswers?.length > 0 ? (
                    <small className="comment-answer new">
                      {newAnswers?.length}{" "}
                      {newAnswers?.length > 1 ? "new answers" : "new answer"}
                    </small>
                  ) : (
                    <small className={`comment-answer`}>
                      {" "}
                      {answers?.length}{" "}
                      {answers?.length > 1 ? "answers" : "answer"}
                    </small>
                  )}
                </span>
              )}
              <div className="link" style={{ marginTop: 5, fontSize: 14 }}>
                <small>
                  {obj.entity.title.slice(0, 63)}
                  {obj.entity.title?.length > 63 && "..."}
                </small>
              </div>
            </div>
          </button>
        </Link>
      )}
      {obj.entity_type === "answer" && comments?.length > 0 && (
        <Link to={`/question/${obj.parent.id}/${obj.entity.id}`}>
          <button
            className={`notification-btn ${
              (newComments?.length > 0 && "note-new") ||
              (newAnswers?.length > 0 && "note-new")
            }`}
            onClick={() => toServer("comment-answer")}
          >
            <div className="notification-attribute">
              <BsFillChatSquareFill style={{ marginLeft: 15 }} />
              <small className="note-attribute-placeholder">
                {obj.entity_type.slice(0, 1)}
              </small>
            </div>
            <div className="notification-content">
              {newComments?.length > 0 ? (
                <small className="comment-answer new">
                  {newComments?.length}{" "}
                  {newComments?.length > 1 ? "new comments" : "new comment"}
                </small>
              ) : (
                <small className={`comment-answer`}>
                  {comments?.length}{" "}
                  {comments?.length > 1 ? "comments" : "comment"}
                </small>
              )}
              <div className="link" style={{ marginTop: 5, fontSize: 14 }}>
                <small>
                  {obj.parent.title.slice(0, 63)}
                  {obj.parent.title?.length > 63 && "..."}
                </small>
              </div>
            </div>
          </button>
        </Link>
      )}
      {solution?.length > 0 && (
        <Link to={`/question/${obj.parent.id}/${obj.entity.id}`}>
          <button
            className={`notification-btn ${
              obj.change.filter(
                (chg) => chg.action_type === "solution" && !chg.is_seen
              )?.length > 0 && "note-new"
            }`}
            onClick={() => toServer("solution")}
          >
            <div className="notification-attribute">
              <BsFillChatSquareFill style={{ marginLeft: 15 }} />
              <small className="note-attribute-placeholder">
                {obj.entity_type.slice(0, 1)}
              </small>
            </div>
            <div className="notification-content">
              <small>Your answer is the solution</small>
              <div className="link" style={{ marginTop: 5, fontSize: 14 }}>
                <small>
                  {obj.parent.title.slice(0, 63)}
                  {obj.parent.title?.length > 63 && "..."}
                </small>
              </div>
            </div>
          </button>
        </Link>
      )}
    </div>
  );
};

export default NotificationChildren;
