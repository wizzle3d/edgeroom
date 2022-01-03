import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Store } from "../utils/ContextAndReducer";
import { createNotification } from "../utils/functions";
import { singleSchema } from "../utils/Schemas";

const AddComment = ({
  id,
  setShowAddComment,
  setParent,
  type_is_question,
  questionID,
}) => {
  const { store } = useContext(Store);
  const toServer = (formData) => {
    formData = {
      ...formData,
      type_is_question: type_is_question,
      questionID: questionID,
    };
    axios
      .post(`/api/create-comment/${id}`, formData, {
        headers: { Authorization: `Bearer ${store.authTokens.access}` },
      })
      .then((res) => {
        setParent(res.data);
        setShowAddComment(false);
      })
      .then(createNotification("success", "Comment Added!"));
  };
  const {
    register,
    handleSubmit,
    formState: errors,
  } = useForm({ resolver: yupResolver(singleSchema) });
  return (
    <form onSubmit={handleSubmit(toServer)}>
      <input
        type="text"
        {...register("input")}
        name="input"
        className="textfield mb-2"
      />
      {errors.input && (
        <p className="alert alert-danger">{errors.input?.message}</p>
      )}
      <input
        type="submit"
        className="btn btn-blue mb-2"
        value="Add comment"
        style={{ width: "fit-content", float: "right" }}
      />
    </form>
  );
};

export default AddComment;
