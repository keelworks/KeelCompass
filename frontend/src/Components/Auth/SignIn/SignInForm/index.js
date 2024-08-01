// src/Components/Auth/SignIn/SignInForm/index.js

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSignInSchema } from "../validation/userSignInSchema";

const SignInForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(userSignInSchema),
        mode: 'onBlur'
    });

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    }

    const handleUpdateField = (e) => {
        const updateUser = {
            ...user,
            [e.target.name]: e.target.value
        };
        setUser(updateUser);
    }

    const handleSignin = async () => {
        // TODO 
    }

    return (
        <>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4">
                    <form onSubmit={handleSubmit(handleSignin)}>
                        <div className="mt-6">
                            <label
                                htmlFor="email"
                                className="block text-sm text-gray-400">
                                Email address
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    id="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    type="email"
                                    required=""
                                    onChange={handleUpdateField}
                                    {...register("email")}
                                    className="block w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                </input>
                                <p>{errors.email?.message}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label
                                htmlFor="password"
                                className="block text-sm text-gray-400">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required=""
                                    onChange={handleUpdateField}
                                    {...register("password")}
                                    className="block w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                </input>
                                <p>{errors.password?.message}</p>
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={toggleShowPassword}
                                >
                                    {showPassword ? (
                                        <AiOutlineEye className="h-6 font-extralight" />
                                    ) : (
                                        <AiOutlineEyeInvisible className="h-6 font-extralight" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <span className="block w-full rounded-md shadow-sm">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    Sign in
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignInForm;
