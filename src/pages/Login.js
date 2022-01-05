import axios from "axios";
import { loginSchema } from "../utils/Schemas";
import { Store } from "../utils/ContextAndReducer";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

const Login = () => {
  const [serverResponse, setServerResponse] = useState({});
  const { store, dispatch } = useContext(Store);
  const navigate = useNavigate();
  useEffect(() => {
    if (store.authTokens) navigate("/");
  });
  const toServer = (formData) => {
    axios
      .post("/api/token/", formData)
      .then((response) => {
        if (response.status === 200) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: response.data,
          });
          navigate("/");
        }
      })
      .catch((error) => setServerResponse(error.response.data));
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });
  return (
    <div className="signup-background">
      <form
        className="login-register-wrapper"
        style={{ marginTop: 150 }}
        onSubmit={handleSubmit(toServer)}
      >
        {serverResponse.detail && (
          <p className="alert alert-danger" style={{ marginBottom: 20 }}>
            {serverResponse?.detail}
          </p>
        )}
        <fieldset>
          <legend>Log in</legend>
          <div className="input-group">
            <label>Username</label>
            <input
              type="username"
              {...register("username")}
              name="username"
              onChange={() => setServerResponse({})}
              className="textfield"
            />
            {errors.username && (
              <p className="alert alert-danger">{errors.username?.message}</p>
            )}
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password")}
              onChange={() => setServerResponse({})}
              name="password"
              className="textfield"
            />
            {errors.password && (
              <p className="alert alert-danger">{errors.password?.message}</p>
            )}
          </div>
          <input
            type="submit"
            className="btn btn-blue"
            value="Log in"
            style={{ width: "100%", marginBottom: 10 }}
          />
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
