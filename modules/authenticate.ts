import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserSession,
    ISignUpResult,
} from 'amazon-cognito-identity-js';
import cognitoUserPool from './cognitoUserPool';
import * as Yup from 'yup';

export const authenticateUser = (email: string, password: string): Promise<CognitoUserSession> => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: email,
            Pool: cognitoUserPool,
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log('login successful');
                resolve(result);
            },
            onFailure: (err) => {
                console.log('login failed', err);
                reject(err);
            },
        });
    });
};

export const signUpUser = (email: string, password: string): Promise<ISignUpResult> => {
    return new Promise((resolve, reject) => {
        const attributeList: CognitoUserAttribute[] = [];
        attributeList.push(
            new CognitoUserAttribute({
                Name: 'email',
                Value: email,
            })
        );
        const username = email;
        cognitoUserPool.signUp(username, password, attributeList, [], (err, data) => {
            if (err) {
                console.log(err);
                alert("Couldn't sign up");
                reject();
            } else {
                console.log(data);
                alert('User Added Successfully');
                if (data?.user) {
                    resolve(data);
                }
            }
        });
    });
};
export const logoutUser = () => {
    const user = cognitoUserPool.getCurrentUser();
    if (user) {
        user.signOut();
        window.location.href = '/';
    }
};

export interface NewUserInfoUI {
    confirmPassword: string;
    email: string;
    password: string;
}

export interface LoginInfo {
    email: string;
    password: string;
}

export const initialSignUpValues: NewUserInfoUI = {
    confirmPassword: '',
    email: '',
    password: '',
};

export const initialLoginValues: LoginInfo = {
    email: '',
    password: '',
};

export const newUserValidationSchema: Yup.ObjectSchema<NewUserInfoUI> = Yup.object({
    email: Yup.string().label('Email').trim().email().required('Valid email required'),
    password: Yup.string()
        .label('Password')
        .trim()
        .required('Please Enter your password')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        ),
    confirmPassword: Yup.string()
        .label('Confirm password')
        .trim()
        .required('Password confirmation is required')
        .min(8)
        .when('password', ([password], schema) =>
            schema.test('passwords-match', "Passwords don't match", (value: string) =>
                password?.length ? password === value : true
            )
        ),
});

export const loginValidationSchema: Yup.ObjectSchema<LoginInfo> = Yup.object({
    email: Yup.string().label('Email').trim().email().required('Valid email required'),
    password: Yup.string()
        .label('Password')
        .trim()
        .required('Please Enter your password')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        ),
});
