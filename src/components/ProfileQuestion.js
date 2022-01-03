import moment from "moment";
import { Link } from "react-router-dom";

const ProfileQuestion = ({ question }) => {
  let date = new Date(question.created);
  return (
    <>
      <div className="profile-QnA-wrapper">
        <div style={{ width: "10%" }}>
          <strong className={`QnA ${question.is_answered && "is-answered"}`}>
            Q
          </strong>
        </div>
        <div style={{ width: "65%" }}>
          <Link to={`/question?id=${question.id}`} className="link">
            {question.title}
          </Link>
        </div>
        <small style={{ width: "20%", textAlign: "right" }}>
          {moment(date).fromNow()}
        </small>
      </div>
      <hr style={{ borderColor: "#d8d8d8" }} />
    </>
  );
};

export default ProfileQuestion;
