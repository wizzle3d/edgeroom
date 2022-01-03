import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import jwt_decode from "jwt-decode";
import "react-notifications/lib/notifications.css";
import { BsFillCalendarCheckFill, BsFillClockFill } from "react-icons/bs";
import ProfileInterest from "../components/ProfileInterest";
import ProfileQuestion from "../components/ProfileQuestion";
import ProfileAnswer from "../components/ProfileAnswer";
import { Store } from "../utils/ContextAndReducer";

const UserProfile = () => {
  const { id } = useParams();
  const { store } = useContext(Store);
  const tokenInfo = store?.authTokens && jwt_decode(store?.authTokens.access);
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const dateJoined = new Date(user?.date_joined);
  const lastSeen = new Date(user?.last_login);
  useEffect(() => {
    axios.get(`/api/get-user/${id}`).then((res) => {
      setUser(res.data);
    });
  }, [id]);
  return (
    <>
      {user && (
        <div style={{ padding: "25px 20px" }}>
          <div className="profile-avatar-wrapper mb-2">
            <Link to={`/user?id=${user.id}`} className="link">
              <img
                style={{ float: "", marginRight: 20 }}
                src={user.avatar}
                alt={user.name}
                className="profile-avatar"
              />
            </Link>
            {tokenInfo?.user_id === Number(id) && (
              <Link to={`/user/edit/${user?.id}`} className="link">
                Edit
              </Link>
            )}
            <div style={{ float: "right", lineHeight: 1.8 }}>
              <p style={{ fontSize: 30 }}>{user.username}</p>
              <div>
                <BsFillCalendarCheckFill
                  className="icon"
                  style={{ marginTop: 6, marginRight: 10, float: "left" }}
                />
                <span>Joined {moment(dateJoined).fromNow()}</span>
              </div>
              <div>
                <BsFillClockFill
                  className="icon"
                  style={{ marginTop: 6, marginRight: 10, float: "left" }}
                />
                <span>Last seen {moment(lastSeen).fromNow()}</span>
              </div>
            </div>
          </div>
          <hr style={{ width: "100%" }} />
          <p className="mb-2">{user.bio}</p>
          <div>
            <label style={{ fontSize: 20 }}>Stats</label>
            <div className="profile-stats mb-2">
              <div>
                <p>{user.questions.reduce((a, b) => a + b.views, 0)}</p>
                <small>total views</small>
              </div>
              <div>
                <p>{user.questions.length}</p>
                <small>questions</small>
              </div>
              <div>
                <p>{user.answers?.length}</p>
                <small>answers</small>
              </div>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 20 }}>Interest</label>
            <div className="profile-interest mb-2">
              {user.interests.map((interest) => (
                <ProfileInterest
                  // style={{ flex: "20%" }}
                  key={interest.id}
                  interest={interest}
                  questions={user.questions}
                  answers={user.answers}
                />
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 20 }}>Activity</label>
            <div className="btn-group mb-2">
              <button
                className={`btn-select ${selected === 1 && "active"}`}
                onClick={() => setSelected(1)}
              >
                All
              </button>
              <button
                className={`btn-select ${selected === 2 && "active"}`}
                onClick={() => setSelected(2)}
              >
                Questions
              </button>
              <button
                className={`btn-select ${selected === 3 && "active"}`}
                onClick={() => setSelected(3)}
              >
                Answers
              </button>
            </div>
            <div className="profile-interest">
              {selected === 2 &&
                user?.questions.map((question) => (
                  <ProfileQuestion question={question} key={question.id} />
                ))}
              {selected === 3 &&
                user?.answers.map((answer) => (
                  <ProfileAnswer answer={answer} key={answer.id} />
                ))}
              {selected === 1 && (
                <div>
                  <div>
                    {user?.questions.map((question) => (
                      <ProfileQuestion question={question} key={question.id} />
                    ))}
                  </div>
                  <div>
                    {user?.answers.map((answer) => (
                      <ProfileAnswer answer={answer} key={answer.id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
