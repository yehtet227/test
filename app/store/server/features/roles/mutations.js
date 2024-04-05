import http from '@/app/libs/http'
import { roleKeys } from '@/app/store/server/features/roles/query-key-factory'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const createRole = async (body) => {
    const jsonBody = JSON.stringify(body)
    const response = await http.post('/roles', jsonBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useCreateRole = () => {
    const queryClient = useQueryClient()
    return useMutation(createRole, {
        mutationKey: roleKeys.createRole(),
        onError: (error) => {
            console.log(error)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(roleKeys.getAllRoles())
        },
    })
}

async function deleteRole(id) {
    return await http.delete(`/roles/${id}`).then((res) => res)
}

export const useDeleteRole = (id) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [roleKeys.deleteRole, id],
        mutationFn: () => deleteRole(id),
        onError: (error) => {
            console.log(error)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(roleKeys.getAllRoles())
        },
    })
}

const updateRole = async ({ body, id }) => {
    const jsonBody = JSON.stringify(body)
    const response = await http.put(`/roles/${id}`, jsonBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useUpdateRole = () => {
    const queryClient = useQueryClient()
    return useMutation(updateRole, {
        mutationKey: roleKeys.getRole(),
        onError: (error) => {
            console.log(error)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(roleKeys.getRole())
        },
    })
}
