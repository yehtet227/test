import http from '@/app/libs/http'
import { todoKeys } from '@/app/store/server/features/todos/query-key-factory'
import { useQuery } from '@tanstack/react-query'

async function getAllTodos() {
    return await http
        .get('https://jsonplaceholder.typicode.com/todos')
        .then((res) => res.data)
}

export const useGetAllTodos = () =>
    useQuery({
        queryKey: todoKeys.getAllTodos(),
        queryFn: getAllTodos,
    })
