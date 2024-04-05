import * as yup from 'yup';

export const engineerAssignSchema = yup.object().shape({
    companyId: yup.string().required('Please select a company.'),
    projectId: yup.string().required('Please select a project.'),
    startDate: yup.date().required('Please select a start date.'),
    endDate: yup.date().required('Please select a end date.'),
})

export const engineerAssignSchemaWithoutCustomer = yup.object().shape({
    projectId: yup.string().required('Please select a project.'),
    startDate: yup.date().required('Please select a start date.'),
    endDate: yup.date().required('Please select a end date.'),
})