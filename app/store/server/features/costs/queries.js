import http from '@/app/libs/http'
import { costKeys } from '@/app/store/server/features/costs/query-key-factory'
import { useQuery, useQueryClient } from '@tanstack/react-query'

async function getAllCosts() {
    return await http.get('/costs').then((res) => res.data)
}

export const useGetAllCosts = () =>
    useQuery({
        queryKey: costKeys.getAllCosts(),
        queryFn: getAllCosts,
    })

async function getCostById(id) {
    const costData = await http.get(`/costs/cost/${id}`)
    return costData.data
}

export function useGetCostDetailById(id) {
    const queryClient = useQueryClient()
    const { data } = useQuery(['cost', id], () => getCostById(id))

    const refetch = () => {
        return queryClient.invalidateQueries(['cost', id])
    }

    return { data, refetch }
}

async function searchCosts(searchData) {
    return await http
        .get(`/costs/search/?filter[projectName]=${searchData}`)
        .then((res) => res.data.data['CostData'])
}

export const useSearchCosts = (searchData) =>
    useQuery({
        queryKey: [costKeys.searchCosts, searchData],
        queryFn: () => searchCosts(searchData),
    })