import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../utils/Schemas";

const SignUp = () => {
  const [serverResponse, setServerResponse] = useState({});
  const [part, setPart] = useState(0);
  const toServer = async (formData) => {
    axios
      .post("api/create-user/", formData)
      .then((response) => {
        setPart(1);
        setServerResponse(response?.data);
      })
      .catch((error) => setServerResponse(error.response.data));
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signupSchema) });
  return (
    <div className="signup-background">
      {part === 0 && (
        <form
          className="login-register-wrapper"
          onSubmit={handleSubmit(toServer)}
        >
          <fieldset>
            <legend>Create an account</legend>
            <div className="input-group">
              <label>Name</label>
              <input
                {...register("name")}
                type="text"
                name="name"
                className="textfield"
              />
              {errors.name && (
                <p className="alert alert-danger">{errors.name?.message}</p>
              )}
            </div>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                {...register("username")}
                name="username"
                onChange={() => setServerResponse({})}
                className="textfield"
              />
              {serverResponse?.username && (
                <p className="alert alert-danger">{serverResponse.username}</p>
              )}
              {errors.username && (
                <p className="alert alert-danger">{errors.username?.message}</p>
              )}
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                {...register("email")}
                onChange={() => setServerResponse({})}
                className="textfield"
              />
              {serverResponse?.email && (
                <p className="alert alert-danger">{serverResponse.email}</p>
              )}
              {errors.email && (
                <p className="alert alert-danger">{errors.email?.message}</p>
              )}
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                {...register("password")}
                type="password"
                name="password"
                className="textfield"
              />
              {errors.password && (
                <p className="alert alert-danger">{errors.password?.message}</p>
              )}
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                name="confirmPassword"
                className="textfield"
              />
              {errors.confirmPassword && (
                <p className="alert alert-danger">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>
            <div className="input-group">
              <input
                type="submit"
                className="btn btn-blue"
                value="Sign up"
                style={{ width: "100%", borderRadius: 4 }}
              />
            </div>
          </fieldset>
        </form>
      )}
      {part === 1 && (
        <div className="login-register-wrapper">
          <p className="alert alert-success">{serverResponse?.message}</p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
