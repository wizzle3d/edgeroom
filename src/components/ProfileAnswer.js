import moment from "moment";
import { Link } from "react-router-dom";

const ProfileAnswer = ({ answer }) => {
  let date = new Date(answer.created);
  return (
    <>
      <div className="profile-QnA-wrapper">
        <div style={{ width: "10%" }}>
          <strong className={`QnA ${answer.is_solution && "is-answered"}`}>
            A
          </strong>
        </div>
        <div style={{ width: "65%" }}>
          <Link to={`/question?id=${answer.question.id}`} className="link">
            {answer.question.title}
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

export default ProfileAnswer;
