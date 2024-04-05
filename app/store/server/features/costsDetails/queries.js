import http from '@/app/libs/http'
import { costDetailKeys } from '@/app/store/server/features/costDetails/query-key-factory' // Define costDetailKeys as needed
import { useQuery } from '@tanstack/react-query'

async function getCostDetails(costDetailId) {
    return await http.get(`/costs/cost/${costDetailId}`).then((res) => res.data)
}

export const useGetCostDetails = (costDetailId) =>
    useQuery({
        queryKey: costDetailKeys.getCostDetails(costDetailId), 
        queryFn: () => getCostDetails(costDetailId),
    })

