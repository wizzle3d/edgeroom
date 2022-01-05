import { Link } from "react-router-dom";
import { BsQuestionCircleFill, BsTagFill } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import { FaJava, FaPython } from "react-icons/fa";
import { SiJavascript, SiCsharp, SiPhp } from "react-icons/si";

const MobileNav = ({ setMobileNav, active, setActive }) => {
  return (
    <div>
      <Link to="/" onClick={() => setMobileNav(false)}>
        <button
          className={`btn-link ${active === 1 && "active"}`}
          onClick={() => setActive(1)}
        >
          <p>Home</p>
        </button>
      </Link>
      <div>
        <p style={{ paddingLeft: 7, margin: "10px 0px", fontSize: "smaller" }}>
          CONTENT
        </p>
        <div>
          <Link to="/all-questions" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 2 && "active"}`}
              onClick={() => setActive(2)}
            >
              <BsQuestionCircleFill
                className={`icon ${active === 2 && "icon-orange"}`}
                style={{
                  float: "left",
                  marginRight: 10,
                }}
              />
              <p style={{ marginTop: 2 }}>Questions</p>
            </button>
          </Link>
          <Link to="/tags" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 3 && "active"}`}
              onClick={() => setActive(3)}
            >
              <BsTagFill
                style={{
                  transform: "rotate(135deg)",
                  float: "left",
                  marginRight: 10,
                }}
                className={`icon ${active === 3 && "icon-orange"}`}
              />
              <p style={{ marginTop: 1 }}>Tags</p>
            </button>
          </Link>
          <Link to="/users" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 4 && "active"}`}
              onClick={() => setActive(4)}
            >
              <HiUsers
                style={{
                  float: "left",
                  marginRight: 10,
                }}
                className={`icon ${active === 4 && "icon-orange"}`}
              />
              <p style={{ marginTop: 2 }}>Users</p>
            </button>
          </Link>
        </div>
      </div>
      <div>
        <p style={{ paddingLeft: 7, marginTop: 30, fontSize: "smaller" }}>
          POPULAR
        </p>
        <div>
          <Link to="/tags/javascript" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 5 && "active"}`}
              onClick={() => setActive(5)}
            >
              <SiJavascript
                className={`icon ${active === 5 && "icon-orange"}`}
                style={{
                  float: "left",
                  marginRight: 10,
                }}
              />
              <p style={{ marginTop: 3 }}>Javascript</p>
            </button>
          </Link>
          <Link to="/tags/python" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 6 && "active"}`}
              onClick={() => setActive(6)}
            >
              <FaPython
                style={{
                  float: "left",
                  marginRight: 10,
                }}
                className={`icon ${active === 6 && "icon-orange"}`}
              />
              <p style={{ marginTop: 2 }}>Python</p>
            </button>
          </Link>
          <Link to="/tags/java" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 7 && "active"}`}
              onClick={() => setActive(7)}
            >
              <FaJava
                style={{
                  float: "left",
                  marginRight: 10,
                }}
                className={`icon ${active === 7 && "icon-orange"}`}
              />
              <p style={{ marginTop: 3 }}>Java</p>
            </button>
          </Link>
          <Link to="/tags/c-sharp" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 8 && "active"}`}
              onClick={() => setActive(8)}
            >
              <SiCsharp
                style={{
                  float: "left",
                  marginRight: 10,
                }}
                className={`icon ${active === 8 && "icon-orange"}`}
              />
              <p style={{ marginTop: 2 }}>CSharp</p>
            </button>
          </Link>
          <Link to="/tags/php" onClick={() => setMobileNav(false)}>
            <button
              className={`btn-link ${active === 9 && "active"}`}
              onClick={() => setActive(9)}
            >
              <SiPhp
                style={{
                  float: "left",
                  marginRight: 10,
                }}
                className={`icon ${active === 9 && "icon-orange"}`}
              />
              <p style={{ marginTop: 3 }}>PHP</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
