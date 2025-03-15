import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";
import { Link, useNavigate } from "react-router-dom";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>( {resolver: yupResolver(registerSchema)});


  // ! Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoaded(true);
    try {
      const {status} = await axiosInstance.post('/auth/local/register', data )
      if(status === 200) {
        toast.success('You Will navigate to Login Page after 2 seconds to login!', {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content"
          },
        });
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>
      
      toast.error(`${errorObj.response?.data?.error.message}`, {
        position: "bottom-center",
        duration: 1500,
      });
    } finally {
      setIsLoaded(false)
    }
  };
  
  // ! renders
  const renderRegisterForm = REGISTER_FORM.map(({name, placeholder, type, validation}, idx) => {
    return (
      <div key={idx}>
        <Input
        type= {type}
          placeholder= {placeholder}
          {...register(name, validation )}
        />
        {errors[name] && <InputErrorMessage msg= {errors[name]?.message} />}
        </div>
    )
  })
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {renderRegisterForm}
      
        <Button fullWidth isLoading={isLoaded}>Register</Button>
      <p className="text-center text-sm text-gray-500 space-x-2">
          <span>have an account?</span>
          <Link to={"/login"} className="underline text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </form>

    </div>
  );
};

export default RegisterPage;
