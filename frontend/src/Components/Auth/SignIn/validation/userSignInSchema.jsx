import * as yup from "yup";

export const userSignInSchema = yup.object().shape({
    email: yup
        .string()
        .email("Enter a valid email.")
        .required("Enter email."),
    password: yup
        .string()
        .required("No password provided.")
        .min(8, "Password is too short - should be at least 8 characters.")
        .matches(
            /[~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.\?\/]/,
            "The password should contain at least one symbol."
        )
        .matches(/[0-9]/, "The password should contain at least one number"),
});
