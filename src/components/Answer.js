import { useContext, useState, useRef } from "react";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { Link } from "react-router-dom";
import moment from "moment";
import { Store } from "../utils/ContextAndReducer";
import AddComment from "./AddComment";
import Comment from "./Comment";
import { ImCheckmark } from "react-icons/im";
import { useEffect } from "react/cjs/react.development";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { createNotification } from "../utils/functions";
import { AiFillDislike, AiFillLike } from "react-icons/ai";

const Answer = ({
  ans,
  questionID,
  refID,
  host_id,
  is_answered,
  setQuestion,
}) => {
  const { store } = useContext(Store);
  const myRef = useRef();
  const tokenInfo = store?.authTokens && jwt_decode(store?.authTokens.access);
  const executeRef = () =>
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    if (refID === ans.id) executeRef();
  }, [refID, ans.id]);
  const [showAddComment, setShowAddComment] = useState();
  const [answer, setAnswer] = useState(ans);
  let html = answer && stateToHTML(convertFromRaw(answer.body));
  let dateCreated = new Date(answer.created);
  const toServer = () => {
    axios
      .put(
        `/api/mark-answer/${questionID}`,
        { answer_id: ans.id },
        {
          headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
        }
      )
      .then((res) => setQuestion(res.data))
      .then(createNotification("success", "Your question has been solved"));
  };
  const vote = (value) => {
    axios
      .put(
        `/api/vote/${answer.id}`,
        { type_is_question: false, value: value },
        {
          headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
        }
      )
      .then((res) => setAnswer(res.data));
  };
  return (
    <div ref={myRef}>
      <div className="QnA-attribute">
        {tokenInfo?.user_id === host_id && !is_answered && (
          <ImCheckmark
            className="QnA-answered mb-1"
            onClick={() => toServer()}
            title="mark as solution"
          />
        )}
        {ans.is_solution && <ImCheckmark className="QnA-answered yes mb-1" />}
        <AiFillLike
          className={`QnA-vote like ${
            answer.vote.likes.includes(tokenInfo?.user_id) && "liked"
          }`}
          onClick={() => vote(true)}
        />
        <p className="vote-count mb-1">{answer.vote.likes.length}</p>
        <AiFillDislike
          className={`QnA-vote dislike ${
            answer.vote.dislikes.includes(tokenInfo?.user_id) && "disliked"
          }`}
          onClick={() => vote(false)}
        />
        <p className="vote-count">{answer.vote.dislikes.length}</p>
      </div>
      <div
        className="QnA-content"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
      <div style={{ float: "left", width: "100%" }}>
        <div style={{ float: "right", lineHeight: 1.2 }} className="mb-2">
          <small>answer {moment(dateCreated).fromNow()}</small>
          <Link to={`/user/${answer.author.id}`} className="link">
            <p className="link">{answer.author.username}</p>
          </Link>
        </div>
        <Link to={`/user/${answer.author.id}`} className="link">
          <img
            style={{ float: "right", marginRight: 5 }}
            src={answer.author.avatar}
            alt={answer.author.name}
            className="question-avatar"
          />
        </Link>
      </div>
      {answer.comments &&
        answer.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      {store.authTokens && (
        <div>
          {!showAddComment && (
            <button
              className="btn-link"
              onClick={() => setShowAddComment(true)}
            >
              Add a comment
            </button>
          )}
          {showAddComment && (
            <AddComment
              id={answer.id}
              setShowAddComment={setShowAddComment}
              setParent={setAnswer}
              type_is_question={false}
              questionID={questionID}
            />
          )}
        </div>
      )}
      <hr style={{ width: "100%" }} />
    </div>
  );
};

export default Answer;
