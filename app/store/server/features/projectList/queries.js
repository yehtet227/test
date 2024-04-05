import http from '@/app/libs/http'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { projectsKeys } from './query-key-factory'

async function getAllProjects() {
    return await http.get('/projects').then((res) => res.data.data)
}

export const useGetAllProjects = () =>
    useQuery({
        queryKey: projectsKeys.getAllProjects(),
        queryFn: getAllProjects,
    })

async function getProjectsByCustomer(customerId) {
    return await http.get(`/projects/customer/${customerId}`).then((res) => res.data.data)
    
}

export const useGetProjectsByCustomer = () => {
    const queryClient = useQueryClient()
    const fetchProjectsByCustomer =  async (companyId) => {
        return await queryClient.fetchQuery(['projectsByCustomers', companyId], () => getProjectsByCustomer(companyId));
    };

    return { fetchProjectsByCustomer }
} 
