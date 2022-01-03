import { Link } from "react-router-dom";

const TagComponent = ({ tag }) => {
  return (
    <div className="tag-wrapper">
      <div>
        <Link to={`/tags/${tag.name}/`}>
          <button className="tag" style={{ fontSize: 14 }}>
            {tag.name}
          </button>
        </Link>
      </div>
      <small>{tag.description.slice(0, 100)}...</small>
      <div style={{ color: "grey" }}>
        <small>{tag.questions.length} questions</small>
      </div>
    </div>
  );
};

export default TagComponent;
