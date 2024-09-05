import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const newPasswordSchema = yup.object().shape({
    password: yup
        .string()
        .required("Enter new password.")
        .min(8, "Password must be at least 8 characters long.")
        .matches(
            /[~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.\?\/]/,
            "Password must contain at least one symbol."
        )
        .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
});

const NewPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(newPasswordSchema),
        mode: 'onBlur',
    });

    const handleNewPassword = async (data) => {
        try {
            // Send request to API for resetting password (you'll implement the API endpoint)
            await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: data.password }),
            });
            alert("Password reset successfully.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4">
                    <form onSubmit={handleSubmit(handleNewPassword)}>
                        <div className="mt-6">
                            <label
                                htmlFor="password"
                                className="block text-sm text-gray-400">
                                New Password
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required=""
                                    {...register("password")}
                                    className="block w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                </input>
                                <p>{errors.password?.message}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm text-gray-400">
                                Confirm Password
                            </label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required=""
                                    {...register("confirmPassword")}
                                    className="block w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                </input>
                                <p>{errors.confirmPassword?.message}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500">
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default NewPasswordForm;
