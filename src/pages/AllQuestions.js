import axios from "axios";
import { useState, useEffect, useContext } from "react";
import QuestionList from "../components/QuestionList";
import { Store } from "../utils/ContextAndReducer";
import { Link } from "react-router-dom";
import Interest from "../components/Interest";

const AllQuestions = () => {
  const { store } = useContext(Store);
  const [questions, setQuestions] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState();
  const [selected, setSelected] = useState(1);
  useEffect(() => {
    axios.get("api/get-questions").then((response) => {
      setQuestions(
        response.data.sort((a, b) => {
          if (a.created > b.created) return -1;
          else return 1;
        })
      );
      setFilteredQuestions(
        response.data.sort((a, b) => {
          if (a.created > b.created) return -1;
          else return 1;
        })
      );
    });
  }, [store?.authTokens?.access]);
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
                All Questions
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
              <div className="btn-group mb-2">
                <button
                  className={`btn-select ${selected === 1 && "active"}`}
                  onClick={() => {
                    setSelected(1);
                    setFilteredQuestions(questions);
                  }}
                >
                  Newest
                </button>
                <button
                  className={`btn-select ${selected === 2 && "active"}`}
                  onClick={() => {
                    setSelected(2);
                    setFilteredQuestions(
                      questions.sort((a, b) => {
                        if (a.vote.likes.length > b.vote.likes.length)
                          return -1;
                        else return 1;
                      })
                    );
                  }}
                >
                  Likes
                </button>
                <button
                  className={`btn-select ${selected === 3 && "active"}`}
                  onClick={() => {
                    setSelected(3);
                    setFilteredQuestions(
                      questions
                        .filter((q) => q.is_answered === true)
                        .sort((a, b) => {
                          if (a.created > b.created) return -1;
                          else return 1;
                        })
                    );
                  }}
                >
                  Answered
                </button>
              </div>
            </div>
            <hr />
            {filteredQuestions?.map((question) => (
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

export default AllQuestions;
