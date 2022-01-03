const TagComponent2 = ({ tag, addTag }) => {
  return (
    <div className="tag-wrapper">
      <div>
        <span
          className="tag"
          style={{ fontSize: 14 }}
          onClick={() => {
            addTag(tag);
          }}
        >
          {tag.name}
        </span>
      </div>
      <small>{tag.description.slice(0, 100)}...</small>
    </div>
  );
};

export default TagComponent2;
