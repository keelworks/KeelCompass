import * as yup from "yup";

export const userErrorSchema = yup
    .object()
    .shape({
        username: yup
            .string()
            .required("Enter an username")
            .matches(/^[a-zA-Z0-9+]+$/, "Username can only contain letters, numbers, and underscores") // this might change once we discuss with PM
            .test("checkUsernameExists", "Username already taken", async (value) => {
                try {
                    const response = "";// TODO API call for validating username
                    const data = await response.json();
                    return data.available;
                } catch (error) {
                    return false;
                }
            }),

        email: yup
            .string()
            .email()
            .required("Enter email."),

        password: yup
            .string()
            .required("No password provided.")
            .min(8, "Password is too short - should be atleast 8 characters.")
            .matches(
                /[~`!@#$%^&*()_\-+={[}\]\|\\:;"'<,>.\?\/]/,
                "The password should contain at least one symbol."
            )
            .matches(/[0-9]/, "The password should contain atleast one number"),

        passwordConfirmation: yup
            .string()
            .oneOf([yup.ref("password"), null], "Password must match")
            .required("Please confirm your password."),
    });