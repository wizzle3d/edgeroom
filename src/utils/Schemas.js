import * as yup from "yup";

export const signupSchema = yup.object().shape({
  name: yup.string().min(5).max(200).required("This field is required."),
  username: yup.string().min(2).max(20).required("This field is required."),
  email: yup.string().email().required("This field is required."),
  password: yup.string().required("This field is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords should match")
    .required(),
});

export const loginSchema = yup.object().shape({
  username: yup.string().required("This field is required."),
  password: yup.string().required("This field is required."),
});

export const profileUpdateSchema = yup.object().shape({
  username: yup.string().min(2).max(20).required("This field is required."),
  bio: yup.string().max(250).required("This field is required."),
  name: yup.string().min(5).max(200).required("This field is required."),
});

export const questionSchema = yup.object().shape({
  question: yup.string().min(5).max(400).required("This field is required"),
  description: yup.object().required("This field is required"),
});
export const tagSchema = yup.object().shape({
  tagName: yup.string().required("This field is required"),
  description: yup.string().min(5).max(400).required("This field is required"),
});

export const singleSchema = yup.object().shape({
  input: yup.string().min(5).required("This field is required"),
});
