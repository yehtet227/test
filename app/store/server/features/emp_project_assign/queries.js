import http from '@/app/libs/http'
import { useQuery, useQueryClient } from '@tanstack/react-query'

async function getAllEngineerInfoProjectAssignWithYear(year) {
    return await http
        .get(`/assign/projects/years/${year}`)
        .then((res) => res.data.data)
}

export function useGetAllEngineerInfoProjectAssignWithYear(year) {
    const { data, isSuccess, isLoading, isError, error, refetch } = useQuery(
        ['assignprojects', year],
        () => getAllEngineerInfoProjectAssignWithYear(year),
    )

    return { data, isSuccess, isLoading, isError, error, refetch }
}

async function getEngineerInfoProjectById(projectId,year,empcode) {
    const response = await http.get(`/assign/projects/${projectId}/edit/${year}/${empcode}`)
    return response.data
}
export function useGetEngineerInfoProjectById(id,year,empcode) {
    const queryClient = useQueryClient()
    const { data } = useQuery(['assign/projects', id], () =>
        getEngineerInfoProjectById(id,year,empcode),
    )

    const refetch = () => {
        return queryClient.refetchQueries(['assign/projects', id])
    }

    return { data, refetch }
}
