// import * as Yup from 'yup';

// import {
//     signUp,
//     signIn,
//     type SignInInput,
//     confirmSignUp,
//     type ConfirmSignUpInput,
//     signOut,
//     SignUpOutput,
// } from 'aws-amplify/auth';

// type SignUpParameters = {
//     password: string;
//     email: string;
// };

// export async function handleSignUp({ password, email }: SignUpParameters) {
//     try {
//         const { isSignUpComplete, userId, nextStep }: SignUpOutput = await signUp({
//             username: email,
//             password,
//             options: {
//                 userAttributes: {
//                     email,
//                 },
//                 // optional
//                 autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
//             },
//         });

//         console.log(userId);
//     } catch (error) {
//         console.log('error signing up:', error);
//     }
// }

// export async function handleSignUpConfirmation({ username, confirmationCode }: ConfirmSignUpInput) {
//     try {
//         const { isSignUpComplete, nextStep } = await confirmSignUp({
//             username,
//             confirmationCode,
//         });
//     } catch (error) {
//         console.log('error confirming sign up', error);
//     }
// }

// export async function handleSignIn({ username, password }: SignInInput) {
//     try {
//         const { isSignedIn, nextStep } = await signIn({ username, password });
//     } catch (error) {
//         console.log('error signing in', error);
//     }
// }

// export async function handleSignOut() {
//     try {
//         await signOut();
//     } catch (error) {
//         console.log('error signing out: ', error);
//     }
// }

// export interface NewUserInfoUI {
//     confirmPassword: string;
//     email: string;
//     password: string;
// }

// export interface LoginInfo {
//     email: string;
//     password: string;
// }

// export const initialSignUpValues: NewUserInfoUI = {
//     confirmPassword: '',
//     email: '',
//     password: '',
// };

// export const initialLoginValues: LoginInfo = {
//     email: '',
//     password: '',
// };

// export const newUserValidationSchema: Yup.ObjectSchema<NewUserInfoUI> = Yup.object({
//     email: Yup.string().label('Email').trim().email().required('Valid email required'),
//     password: Yup.string()
//         .label('Password')
//         .trim()
//         .required('Please Enter your password')
//         .matches(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
//             'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
//         ),
//     confirmPassword: Yup.string()
//         .label('Confirm password')
//         .trim()
//         .required('Password confirmation is required')
//         .min(8)
//         .when('password', ([password], schema) =>
//             schema.test('passwords-match', "Passwords don't match", (value: string) =>
//                 password?.length ? password === value : true
//             )
//         ),
// });

// export const loginValidationSchema: Yup.ObjectSchema<LoginInfo> = Yup.object({
//     email: Yup.string().label('Email').trim().email().required('Valid email required'),
//     password: Yup.string()
//         .label('Password')
//         .trim()
//         .required('Please Enter your password')
//         .matches(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
//             'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
//         ),
// });
