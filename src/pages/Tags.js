import axios from "axios";
import { useState, useEffect } from "react";
import TagComponent from "../components/TagComponent";

const Tags = () => {
  const [tags, setTags] = useState(null);
  useEffect(() => {
    axios.get("/api/get-tags/").then((res) => setTags(res.data));
  }, []);

  return (
    <>
      {tags && (
        <div style={{ padding: "25px 20px" }}>
          <p
            style={{
              color: "rgb(58, 58, 58)",
              fontSize: 26,
            }}
          >
            Tags
          </p>
          <p>
            Tags are keywords that categorizes each question into fields
            relating to that question and makes it easy for someone interested
            in those fields to see your question.
          </p>
          <hr className="mb-2" />

          <div className="tags-wrapper">
            {tags.map((tag) => (
              <TagComponent key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Tags;
