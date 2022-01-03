import React from "react";
import { Link } from "react-router-dom";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <small>{comment.body}</small>
      <span>
        <strong> -</strong>
        <Link to={`/user/${comment.author.id}`} className="link">
          {comment.author.username}
        </Link>
      </span>
    </div>
  );
};

export default Comment;
