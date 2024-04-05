import http from '@/app/libs/http'
import { departmentKeys } from '@/app/store/server/features/departments/query-key-factory'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const createDepartment = async (body) => {
    const jsonBody = JSON.stringify(body)
    const response = await http.post('/departments', jsonBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useCreateDepartment = () => {
    const queryClient = useQueryClient()
    return useMutation(createDepartment, {
        mutationKey: departmentKeys.createDepartment(),
        onError: (error) => {
            console.log(error)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(departmentKeys.getAllDepartments())
        },
    })
}

async function deleteDepartment(id) {
    return await http.delete(`/departments/${id}`).then((res) => res)
}

export const useDeleteDepartment = (id) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: [departmentKeys.deleteDepartment, id],
        mutationFn: () => deleteDepartment(id),
        onError: (error) => {
            console.log(error)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(departmentKeys.getAllDepartments())
        },
    })
}

const updateDepartment = async ({ body, id }) => {
    const jsonBody = JSON.stringify(body)
    const response = await http.put(`/departments/${id}`, jsonBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useUpdateDepartment = () => {
    const queryClient = useQueryClient()
    return useMutation(updateDepartment, {
        mutationKey: departmentKeys.getUpdateDepartment(),
        onError: (error) => {
            console.log(error)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(departmentKeys.getAllDepartments())
        },
    })
}
