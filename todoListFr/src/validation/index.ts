import * as yup from "yup";

export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username is required!")
      .min(5, "Username should be at least 5 characters"),
    email: yup
      .string()
      .required("Email is required!")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not a Valid email address"),
    password: yup
      .string()
      .required("password is required!")
      .min(6, "password should be at least 6 characters"),
  })
  .required();


  export const loginSchema = yup
  .object({
    identifier: yup
    .string()
    .required("Email is required!")
    .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not a Valid email address"),
    password: yup
    .string()
    .required("Password is required!")
    .min(5, "password should be at least 5 characters")
  })
  .required()
