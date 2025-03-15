import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import InputErrorMessage from "../components/InputErrorMessage";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import axiosInstance from "../config/axios.config";
import { LOGIN_FORM } from "../data";
import { IErrorResponse } from "../interfaces";
import { loginSchema } from "../validation";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(loginSchema) });

  // Handler
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoaded(true)
    try {
      const { status, data: resData } = await axiosInstance.post('/auth/local', data);
  
      if(status === 200) {
        toast.success('You Will navigate to Home Page after 2 seconds!', {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content"
          },
        });

        localStorage.setItem("loggedInUser", JSON.stringify(resData))

        setTimeout(() => {
          location.replace('/')
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data?.error.message}`, {
        position: "bottom-center",
        duration: 1500,
      });
    } finally {
      setIsLoaded(false)
    } 
  };

  // ! render
  const renderLosginForm = LOGIN_FORM.map(
    ({ name, placeholder, type, validation }, idx) => {
      return (
        <div key={idx}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
        </div>
      );
    }
  );
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLosginForm}
        <Button fullWidth isLoading={isLoaded}>Login</Button>
        <p className="text-center text-sm text-gray-500 space-x-2">
          <span>No account?</span>
          <Link
            to={"/register"}
            className="underline text-indigo-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
