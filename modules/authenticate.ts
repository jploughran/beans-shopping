import * as Yup from 'yup';

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
