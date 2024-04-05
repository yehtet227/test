import http from '@/app/libs/http'
import { customerKeys } from '@/app/store/server/features/customers/query-key-factory'
import { useQuery } from '@tanstack/react-query'

async function getAllCustomers() {
    return await http.get('/customers').then((res) => res.data.data)
}

export const useGetAllCustomers = () =>
    useQuery({
        queryKey: customerKeys.getAllCustomers(),
        queryFn: getAllCustomers,
    })
