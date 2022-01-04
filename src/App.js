import ContextAndReducer from "./utils/ContextAndReducer";
import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import UserQuestions from "./pages/UserQuestions";
import Question from "./pages/Question";
import LeftNav from "./components/LeftNav";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Header from "./components/Header";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import Error403 from "./pages/Error403";
import Tags from "./pages/Tags";
import Tag from "./pages/Tag";
import SearchPage from "./pages/SearchPage";
import { NotificationContainer } from "react-notifications";
import AllQuestions from "./pages/AllQuestions";
import Users from "./pages/Users";
import { useState } from "react";
import Footer from "./components/Footer";
import Error401 from "./pages/Error401";

function App() {
  const [active, setActive] = useState(0);
  return (
    <Router>
      <ContextAndReducer>
        <Header active={active} setActive={setActive} />
        <div className="container">
          <div className="left-pane">
            <LeftNav active={active} setActive={setActive} />
          </div>
          <div className="middle-pane">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ask-question" element={<AskQuestion />} />
              <Route path="/user-questions" element={<UserQuestions />} />
              <Route path="/all-questions" element={<AllQuestions />} />
              <Route path="/question/:id" element={<Question />}>
                <Route path=":refID" element={<Question />} />
              </Route>
              <Route path="/users" element={<Users />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/user/edit/:id" element={<EditProfile />} />
              <Route path="/tags" element={<Tags />}></Route>
              <Route path="/tags/:name" element={<Tag />} />
              <Route path="/search" element={<SearchPage />} />

              <Route path="/403" element={<Error403 />} />
              <Route path="*" element={<Error401 />} />
            </Routes>
          </div>
        </div>
        <NotificationContainer />
        {/* <Footer /> */}
      </ContextAndReducer>
    </Router>
  );
}

export default App;
