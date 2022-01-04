import { useContext, useEffect, useState } from "react";
import { Store } from "../utils/ContextAndReducer";
import QuestionList from "../components/QuestionList";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Interest from "../components/Interest";

const UserQuestions = () => {
  const [questions, setQuestions] = useState(null);
  const { store } = useContext(Store);
  console.log(questions);
  useEffect(() => {
    if (!store.authTokens) {
      Navigate("/login");
    } else {
      axios
        .get("/api/get-user-questions/", {
          headers: { Authorization: `Bearer ${store.authTokens?.access}` },
        })
        .then((res) => setQuestions(res.data));
    }
  }, [store.authTokens]);
  return (
    <div>
      {store.authTokens && questions && (
        <div className="content">
          {questions
            ?.sort((a, b) => {
              if (a.created > b.created) {
                return -1;
              }
              return 1;
            })
            .map((question) => (
              <QuestionList key={question.id} question={question} />
            ))}
        </div>
      )}
      {store?.authTokens && (
        <div className="right-pane">
          <Interest className="bordered-sidebar" />
        </div>
      )}
    </div>
  );
};

export default UserQuestions;
