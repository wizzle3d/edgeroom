import axios from "axios";
import { useState, useEffect, useContext } from "react";
import QuestionList from "../components/QuestionList";
import { Store } from "../utils/ContextAndReducer";
import { Link } from "react-router-dom";
import Interest from "../components/Interest";

const Home = () => {
  const { store } = useContext(Store);
  const [questions, setQuestions] = useState(null);
  useEffect(() => {
    axios.get("/api/get-questions/").then((response) => {
      setQuestions(
        response.data.sort((a, b) => {
          if (a.vote.likes - a.vote.dislikes > b.vote.likes - b.vote.dislikes)
            return -1;
          else return 1;
        })
      );
    });
  }, []);
  return (
    <>
      {questions && (
        <div>
          <div className="content">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0px 15px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "rgb(58, 58, 58)",
                  fontSize: "26px",
                }}
              >
                Top Questions
              </p>
              <Link to="/ask-question" style={{ marginTop: 5 }}>
                <button className="btn btn-blue">Ask question</button>
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                margin: "15px 15px 0px 15px",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  marginTop: 6,
                  color: "rgb(58, 58, 58)",
                  fontSize: "large",
                }}
              >
                {questions.length} questions
              </p>
            </div>
            <hr />
            {questions?.map((question) => (
              <QuestionList key={question.id} question={question} />
            ))}
          </div>
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

export default Home;
