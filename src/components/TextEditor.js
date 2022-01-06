import React, { useState } from "react";
import { convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const TextEditor = ({ setDes, setInvalid }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContent, setConvertedContent] = useState(null);
  const convertToHTMLAndRaw = () => {
    let currentContentAsHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    setConvertedContent(currentContentAsHTML);
    setDes(convertToRaw(editorState.getCurrentContent()));
  };
  const handleEditorChange = (state) => {
    setEditorState(state);
    convertToHTMLAndRaw();
  };

  const createMarkup = (html) => {
    if (html?.length > 30) {
      setInvalid(false);
    }
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      <p style={{ fontWeight: 500, marginTop: 20 }}>Preview</p>
      <div
        className="preview"
        dangerouslySetInnerHTML={createMarkup(convertedContent)}
      ></div>
    </div>
  );
};
export default TextEditor;
