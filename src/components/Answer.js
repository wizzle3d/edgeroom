import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { Store } from "../utils/ContextAndReducer";
import AddComment from "./AddComment";
import Comment from "./Comment";
import { ImCheckmark } from "react-icons/im";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { createNotification } from "../utils/functions";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import DOMPurify from "dompurify";
import draftToHtml from "draftjs-to-html";

const Answer = ({
  ans,
  questionID,
  refID,
  host_id,
  is_answered,
  setQuestion,
}) => {
  const { store } = useContext(Store);
  const navigate = useNavigate();
  const myRef = useRef();
  const tokenInfo = store?.authTokens && jwt_decode(store?.authTokens.access);
  const executeRef = () =>
    myRef?.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    if (refID == ans?.id) {
      executeRef();
    }
  }, [refID]);

  const [showAddComment, setShowAddComment] = useState();
  const [answer, setAnswer] = useState(ans);
  let html = answer && draftToHtml(answer.body);
  let dateCreated = new Date(answer.created);
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
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
    console.log(store.authTokens);
    if (!store.authTokens) {
      navigate("/login");
    } else {
      console.log(value);
      axios
        .put(
          `/api/vote/${answer.id}`,
          { type_is_question: false, value: value },
          {
            headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
          }
        )
        .then((res) => setAnswer(res.data));
    }
  };
  return (
    <div ref={myRef} style={{ marginTop: 10 }}>
      <div
        style={{
          padding: "0px 20px",
        }}
      >
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
          dangerouslySetInnerHTML={createMarkup(html)}
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
      </div>
      <hr style={{ width: "100%" }} />
    </div>
  );
};

export default Answer;
