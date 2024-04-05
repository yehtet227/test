import * as yup from 'yup'

export const projectCreateSchema = yup.object().shape({
    title: yup.string().required('Please enter the project title.'),
    company: yup.string().required('Please select a company.'),
    paymentStatus: yup.string().required('Please select a payment status.'),
    departmentId: yup.string().required('Please select a department.'),
    marketingName: yup.string().required('Please select a marketing name.'),
    contractStatus: yup.string().required('Please select a contract status.'),
    projectType: yup.string().required('Please select a project type.'),
})

export const projectLeaderSchema = yup.object().shape({
    projectLeaderName: yup.string().required('Please select a project leader.'),
})