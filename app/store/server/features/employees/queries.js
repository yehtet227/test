import http from '@/app/libs/http'
import { useQuery } from '@tanstack/react-query'
import { employeeKeys } from './query-key-factory'

async function getAllEmployees() {
    return await http.get('/employees').then((res) => res.data.data)
}

export const useGetAllEmployees = () =>
    useQuery({
        queryKey: employeeKeys.getAllEmployees(),
        queryFn: getAllEmployees,
    })
