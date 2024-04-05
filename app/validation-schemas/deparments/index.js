import * as yup from 'yup'

export const departmentEditFormSchema = yup.object().shape({
    departmentName: yup.string().required('Please enter department name.'),
})

export const departmentCreateFormSchema = yup.object().shape({
    departmentName: yup.string().required('Please enter department name.'),
    departmentHead: yup.string().required('Please select a leader name.'),
    marketingName: yup.string().required('Please select a marketing name.'),
})
