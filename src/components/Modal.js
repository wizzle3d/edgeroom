import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { tagSchema } from "../utils/Schemas";
import { useState } from "react";

const Modal = ({ createNotification, store, modal }) => {
  const [serverRes, setServerRes] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(tagSchema) });
  const toServer = (formData) => {
    axios
      .post("/api/create-tag/", formData, {
        headers: { Authorization: `Bearer ${store?.authTokens?.access}` },
      })
      .then(
        createNotification(
          "success",
          "Tag created",
          "You can now search and select your tag."
        )
      )
      .then(() => (modal.style.display = "none"))
      .catch((error) => {
        if (error.response.status === 400) setServerRes(error.response.data);
      });
  };

  // Tag Modal Initialization
  let span = document.getElementById("close");
  if (span) {
    span.onclick = function () {
      modal.style.display = "none";
    };
  }
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  return (
    <div className="modal-content">
      <form onSubmit={handleSubmit(toServer)}>
        <legend>Create a tag</legend>
        <div className="mb-2">
          <label>Name</label>
          <input
            type="text"
            {...register("tagName")}
            className="textfield"
            name="tagName"
            placeholder="Enter tag name"
            onChange={() => setServerRes(null)}
          />
          {errors.tagName && (
            <p className="alert alert-danger">{errors.tagName?.message}</p>
          )}
          {serverRes && <p className="alert alert-danger">{serverRes.error}</p>}
        </div>
        <div className="mb-1">
          <label>Description</label>
          <textarea
            type="text"
            style={{ height: 90 }}
            onChange={() => setServerRes(null)}
            {...register("description")}
            className="textfield"
            name="description"
            placeholder="Describe tag"
          />
        </div>
        <div style={{ float: "right" }}>
          <button
            id="close"
            className="btn btn-grey"
            style={{ width: "fit-content", marginRight: 10 }}
          >
            Close
          </button>
          <input
            className="btn btn-blue"
            type="submit"
            value="Create tag"
            style={{ width: "fit-content" }}
          />
        </div>
      </form>
    </div>
  );
};

export default Modal;
