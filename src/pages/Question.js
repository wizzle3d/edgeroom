import { useParams, Link } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import "react-notifications/lib/notifications.css";
import axios from "axios";
import moment from "moment";
import { Store } from "../utils/ContextAndReducer";
import { createNotification, getString } from "../utils/functions";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import TextEditor from "../components/TextEditor";
import Answer from "../components/Answer";
import AddComment from "../components/AddComment";
import Comment from "../components/Comment";
import Interest from "../components/Interest";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import jwt_decode from "jwt-decode";

const Question = () => {
  const { id } = useParams();
  const { refID } = useParams();
  const { store } = useContext(Store);
  const myRef = useRef();
  const tokenInfo = store?.authTokens && jwt_decode(store?.authTokens.access);
  const executeRef = () =>
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  const [question, setQuestion] = useState(null);
  const [des, setDes] = useState(null);
  const [showAddComment, setShowAddComment] = useState(false);
  const dateCreated = new Date(question?.created);
  const dateUpdated = new Date(question?.updated);
  const [invalid, setInvalid] = useState(false);
  let html =
    question?.description && stateToHTML(convertFromRaw(question.description));
  useEffect(() => {
    executeRef();
    setQuestion(null);
    axios.get(`/api/get-question/${id}`).then((res) => setQuestion(res.data));
  }, [id]);
  const toServer = () => {
    if (!des || getString(des).length < 5) return setInvalid(true);
    else {
      const formData = { input: des };
      axios
        .post(`/api/post-answer/${id}`, formData, {
          headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
        })
        .then((res) => setQuestion(res.data))
        .then(createNotification("success", "Answer posted"));
    }
  };
  const vote = (value) => {
    axios
      .put(
        `/api/vote/${question.id}`,
        { type_is_question: true, value: value },
        {
          headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
        }
      )
      .then((res) => setQuestion(res.data));
  };
  return (
    <div>
      {question && (
        <div className="content" style={{ padding: "25px 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgb(58, 58, 58)",
                fontSize: 26,
                lineHeight: 1.2,
              }}
            >
              {question.title}
            </p>
            <Link to="/ask-question">
              <button className="btn btn-blue">Ask question</button>
            </Link>
          </div>
          <div className="mb-2">
            <small style={{ marginRight: 5 }}>
              Asked <strong>{moment(dateCreated).fromNow()}</strong>.
            </small>
            <small style={{ marginRight: 5 }}>
              Last Activity <strong>{moment(dateUpdated).fromNow()}</strong>.
            </small>
            <small style={{ marginRight: 5 }}>
              Views <strong>{question.views}</strong>.
            </small>
          </div>
          <hr className="mb-1" />
          <div className="QnA-attribute">
            <AiFillLike
              className={`QnA-vote ${
                question.vote.likes.includes(tokenInfo?.user_id) && "liked"
              }`}
              onClick={() => vote(true)}
            />
            <p className="vote-count mb-1">{question.vote.likes.length}</p>
            <AiFillDislike
              className={`QnA-vote dislike ${
                question.vote.dislikes.includes(tokenInfo?.user_id) &&
                "disliked"
              }`}
              onClick={() => vote(false)}
            />
            <p className="vote-count">{question.vote.dislikes.length}</p>
          </div>
          <div
            className="QnA-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div
            className="QnA-content"
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {question?.tags.map((tag) => (
              <span className="tag" key={tag?.id}>
                {tag?.name}
              </span>
            ))}
          </div>
          <div style={{ float: "right", width: "100%" }} className="mb-2">
            <div style={{ float: "right", marginTop: 5 }}>
              <Link to={`/user/${question.host.id}`} className="link">
                <p className="link">{question.host.username}</p>
              </Link>
            </div>
            <Link to={`/user/${question.host.id}`} className="link">
              <img
                style={{ float: "right", marginRight: 5 }}
                src={question.host.avatar}
                alt={question.host.name}
                className="question-avatar"
              />
            </Link>
          </div>
          {question.comments &&
            question.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          {store.authTokens && (
            <div>
              {!showAddComment && (
                <button
                  className="btn-link"
                  onClick={() => setShowAddComment(true)}
                  style={{ margin: 0 }}
                >
                  Add a comment
                </button>
              )}
              {showAddComment && (
                <AddComment
                  id={question.id}
                  setShowAddComment={setShowAddComment}
                  setParent={setQuestion}
                  type_is_question={true}
                />
              )}
            </div>
          )}
          <hr className="mb-2" />
          {question.answers?.length > 0 && (
            <div>
              <label>Answers ({question.answers.length})</label>
              <div>
                {question.answers.map((answer) => (
                  <Answer
                    key={answer.id}
                    ans={answer}
                    questionID={question.id}
                    refID={refID}
                    host_id={question.host.id}
                    is_answered={question.is_answered}
                    setQuestion={setQuestion}
                  />
                ))}
              </div>
            </div>
          )}
          {store?.authTokens && (
            <div className="input-group">
              <fieldset className="mb-2">
                <legend>Post an answer</legend>
                <TextEditor setDes={setDes} setInvalid={setInvalid} />
                {invalid && (
                  <p className="alert alert-danger">
                    Answer must be more than 5 characters
                  </p>
                )}
              </fieldset>
              <button
                className="btn btn-blue"
                style={{ width: "30%" }}
                onClick={() => toServer()}
              >
                Post answer
              </button>
            </div>
          )}
        </div>
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
    </div>
  );
};

export default Question;
