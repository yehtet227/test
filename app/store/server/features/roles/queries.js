import http from '@/app/libs/http'
import { roleKeys } from '@/app/store/server/features/roles/query-key-factory'
import { useQuery } from '@tanstack/react-query'

async function getAllRoles() {
    return await http.get('/roles').then((res) => res.data.data)
}

export const useGetAllRoles = () =>
    useQuery({
        queryKey: roleKeys.getAllRoles(),
        queryFn: getAllRoles,
    })

async function getRole(id) {
    return await http.get(`/roles/${id}`).then((res) => res.data.data)
}

export const useGetRole = (id) =>
    useQuery({
        queryKey: [roleKeys.getRole, id],
        queryFn: () => getRole(id),
    })
