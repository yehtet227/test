import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { projectKeys } from './query-key-factory'

const { default: http } = require('@/app/libs/http')

const createEngineerInfoProjectAssign = async (body) => {
    const jsonBody = JSON.stringify(body)
    const response = await http.post('/assign/projects', jsonBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useCreateEngineerInfoProjectAssign = () => {
    const queryClient = useQueryClient()
    return useMutation(createEngineerInfoProjectAssign, {
        mutationKey: projectKeys.createEngineerInfoProjectAssign(),
        onError: (error) => {
            console.log(error)
            return toast.error(error)
        },
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries(
                projectKeys.getAllEngineerInfoProjectAssign(),
            )
            if (data?.meta?.status === 200) {
                return toast.success(data?.meta?.msg)
            } else {
                return toast.error(data?.meta?.msg)
            }
        },
    })
}

const deleteEngineerInfoProjectAssign = async (body) => {
    const response = await http.delete('/assign/projects', {
        data: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useDeleteEngineerInfoProjectAssign = (successCallback) => {
    const queryClient = useQueryClient()
    return useMutation(deleteEngineerInfoProjectAssign, {
        mutationKey: projectKeys.deleteEngineerInfoProjectAssign(),
        onError: (error) => {
            console.log(error)
            return toast.error(error)
        },
        onSuccess: (data) => {
            successCallback(data)
            console.log(data)
            queryClient.invalidateQueries(
                projectKeys.getAllEngineerInfoProjectAssign(),
            )
        },
    })
}

const editEngineerInfoProjectAssign = async ({ body, id }) => {
    const jsonBody = JSON.stringify(body)
    try {
        const response = await http.put(`/assign/projects/${id}`, jsonBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return response.data
    } catch (error) {
        console.error('Error:', error) // Log any caught errors
        throw error // Rethrow the error
    }
}

export const useEditEngineerInfoProjectAssign = (successCallback) => {
    const queryClient = useQueryClient()
    const mutation = useMutation(editEngineerInfoProjectAssign, {
        mutationKey: projectKeys.editEngineerInfoProjectAssign(),
        onError: (error) => {
            console.log(error)
            return toast.error(error)
        },
        onSuccess: (data) => {
            successCallback(data.meta)
            queryClient.invalidateQueries('assign/projects')
        },
    })
    const refetch = () => {
        return queryClient.invalidateQueries('assign/projects')
    }

    return { ...mutation, refetch }
}
