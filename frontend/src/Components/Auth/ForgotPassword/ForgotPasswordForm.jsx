import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const forgotPasswordSchema = yup.object().shape({
    email: yup
        .string()
        .email("Enter a valid email.")
        .required("Enter email.")
});

const ForgotPasswordForm = () => {
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onBlur',
    });

    const handleForgotPassword = async (data) => {
        try {
            // Send request to API for forgot password (you'll implement the API endpoint)
            await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
            });
            setEmailSent(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4">
                    <form onSubmit={handleSubmit(handleForgotPassword)}>
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
                                    {...register("email")}
                                    className="block w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                </input>
                                <p>{errors.email?.message}</p>
                            </div>
                        </div>

                        {emailSent && <p>Email has been sent, please check your inbox.</p>}

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgotPasswordForm;
