import { Link } from "react-router-dom";
import { check } from "../utils/functions";

const ProfileInterest = ({ interest, questions, answers }) => {
  return (
    <div className="profile-interest-wrapper">
      <Link to="/">
        <button className="tag" style={{ fontSize: 13 }}>
          {interest.name}
        </button>
      </Link>
      <p style={{ marginTop: 5 }}>
        {
          questions.filter((question) => {
            if (check(question.tags, interest)) return true;
            else return false;
          }).length
        }{" "}
        questions
      </p>
    </div>
  );
};

export default ProfileInterest;
