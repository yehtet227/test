import * as yup from 'yup'

export const loginFormSchema = yup.object().shape({
    userEmail: yup.string().required('Please enter email or id.'),
    userPassword: yup.string().required('Please enter password.'),
})

export const registerFormSchema = yup.object().shape({
    userName: yup.string().required('Please enter name.'),
    userEmail: yup.string().email('Invalid email format').required('Please enter email.'),
    employeeId: yup.string().required('Please enter employee id.'),
    userPassword: yup.string().required('Password is required'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('userPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
})

export const resetFormSchema = yup.object().shape({
    userEmail: yup.string().email('Invalid email format').required('Please enter your email.'),
})

export const confirmEmailFormSchema = yup.object().shape({
    confirmCode: yup.string().required('Please enter your confirm code.'),
})

export const createPasswordFormSchema = yup.object().shape({
    newPassword: yup.string().required('Please enter new password.'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Please enter confirm password.'),
})

export const changePasswordFormSchema = yup.object().shape({
    oldPassword: yup.string().required('Please enter old password.'),
    newPassword: yup.string().required('Please enter new password.'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match').required('Please enter confirm password.'),
})
