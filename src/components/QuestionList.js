import { Link } from "react-router-dom";
import moment from "moment";
import { getString } from "../utils/functions";

const QuestionList = ({ question }) => {
  const date = new Date(question.created);
  return (
    <div className="question-list">
      <div
        className="QList-left"
        style={{
          width: "90px",
          textAlign: "center",
          float: "left",
        }}
      >
        <div
          className={`question-views-answers ${
            question.is_answered && "QList-solved"
          }`}
          style={{ paddingTop: 10 }}
        >
          <p style={{ fontSize: 18, lineHeight: 0.5 }}>
            {question.answers.length}
          </p>
          <small>answers</small>
        </div>
        <div className="question-views-answers">
          <small style={{ lineHeight: 0.5 }}>{question.views}</small>
          <small> views</small>
        </div>
      </div>
      <div className="QList-attribute">
        <div
          style={{
            borderBottom: "1px solid #b9b9b9",
            width: "100%",
            padding: 3,
            boxSizing: "border-box",
          }}
        >
          <p className="QList-vote-count">{question.vote.likes.length}</p>
          <p className="QList-vote-count">Likes</p>
        </div>
        <div style={{ width: "100%", padding: 3, boxSizing: "border-box" }}>
          <p className="QList-vote-count">{question.vote.dislikes.length}</p>
          <p className="QList-vote-count">dislikes</p>
        </div>
      </div>
      <div className="QList-content">
        <Link to={`/question/${question.id}`} className="link">
          <p>{question.title}</p>
        </Link>
        <small>{getString(question.description).slice(0, 200)}...</small>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {question.tags.map((tag) => (
            <i className="tag" key={tag.id}>
              {tag.name}
            </i>
          ))}
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ float: "right", lineHeight: 1.2, marginRight: 5 }}>
            <small>asked {moment(date).fromNow()}</small>
            <Link to={`/user/${question.host.id}`} className="link">
              <p className="link">{question.host.username}</p>
            </Link>
          </div>
          <Link to={`/user/${question.host.id}`} className="link">
            <img
              style={{ float: "right", marginRight: 5, marginTop: 2 }}
              src={question.host.avatar}
              alt={question.host.name}
              className="question-avatar"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
