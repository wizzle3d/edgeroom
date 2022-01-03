import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuestionList from "../components/QuestionList";
import Interest from "../components/Interest";
import { Link } from "react-router-dom";
import { Store } from "../utils/ContextAndReducer";

const Tag = () => {
  const { name } = useParams();
  const [tag, setTag] = useState(null);
  const { store } = useContext(Store);
  useEffect(() => {
    axios.get(`/api/get-tag/${name}`).then((res) => setTag(res.data));
  }, [name]);
  return (
    <>
      {tag && (
        <div>
          <div className="content" style={{ padding: "25px 0px" }}>
            <div
              style={{
                margin: "0px 20px 10px 20px",
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
                {tag.name}
              </p>
              <Link to="/ask-question">
                <button className="btn btn-blue">Ask question</button>
              </Link>
            </div>
            <p style={{ margin: "0px 20px 5px 20px" }}>{tag.description}</p>
            <hr />
            <div className="">
              {tag.questions
                .sort((a, b) => {
                  if (a.created > b.created) return -1;
                  else return 1;
                })
                .map((question) => (
                  <QuestionList key={question.id} question={question} />
                ))}
            </div>
          </div>{" "}
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
      )}
    </>
  );
};

export default Tag;
