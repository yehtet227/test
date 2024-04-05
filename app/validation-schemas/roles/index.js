import * as yup from 'yup'

export const roleFormSchema = yup.object().shape({
    roleName: yup.string().required('Please enter role name.'),
})
