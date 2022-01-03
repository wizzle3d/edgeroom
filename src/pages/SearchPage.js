import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import QuestionList from "../components/QuestionList";
import TagComponent from "../components/TagComponent";
import UserComponent from "../components/UserComponent";
import { Link } from "react-router-dom";
import { Store } from "../utils/ContextAndReducer";
import Interest from "../components/Interest";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { store } = useContext(Store);
  const query = searchParams.get("query");
  const [tab, setTab] = useState(1);
  const [result, setResult] = useState(null);
  useEffect(() => {
    setResult(null);
    axios.get(`/api/search/${query}`).then((res) => setResult(res.data));
  }, [query]);
  return (
    <>
      {result && (
        <div className="content">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px 18px",
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
              Search Results
            </p>
            <Link to="/ask-question">
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
            <small
              style={{
                marginTop: 6,
                color: "rgb(58, 58, 58)",
                fontSize: "large",
              }}
            >
              {result.questions.length +
                result.tags.length +
                result.users.length}{" "}
              results
            </small>
            <div className="btn-group mb-2">
              <button
                className={`btn-select ${tab === 1 && "active"}`}
                onClick={() => setTab(1)}
              >
                Questions
              </button>
              <button
                className={`btn-select ${tab === 2 && "active"}`}
                onClick={() => setTab(2)}
              >
                Tags
              </button>
              <button
                className={`btn-select ${tab === 3 && "active"}`}
                onClick={() => setTab(3)}
              >
                Users
              </button>
            </div>
          </div>
          <hr />
          {tab === 1 && (
            <div>
              {result.questions.length > 0 ? (
                <div>
                  {result.questions.map((question) => (
                    <QuestionList key={question.id} question={question} />
                  ))}
                </div>
              ) : (
                <p
                  className="tag-wrapper"
                  style={{ width: "100%", textAlign: "center", padding: 30 }}
                >
                  No question matches your search.
                </p>
              )}
            </div>
          )}
          {tab === 2 && (
            <>
              {result.tags.length > 0 ? (
                <div>
                  {result.tags.map((tag) => (
                    <TagComponent key={tag.id} tag={tag} />
                  ))}
                </div>
              ) : (
                <p
                  className="tag-wrapper"
                  style={{ width: "100%", textAlign: "center", padding: 30 }}
                >
                  No tag matches your search.
                </p>
              )}
            </>
          )}
          {tab === 3 && (
            <div>
              {result.users.length > 0 ? (
                <div className="tags-wrapper">
                  {result.users.map((user) => (
                    <UserComponent key={user.id} user={user} />
                  ))}
                </div>
              ) : (
                <p
                  className="tag-wrapper"
                  style={{ width: "100%", textAlign: "center", padding: 30 }}
                >
                  No user matches your search.
                </p>
              )}
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
    </>
  );
};

export default SearchPage;
