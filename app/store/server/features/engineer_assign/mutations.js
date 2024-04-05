import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { projectKeys } from './query-key-factory'

const { default: http } = require('@/app/libs/http')

const createEngineerAssign = async (body) => {
    const jsonBody = JSON.stringify(body)
    const response = await http.post('/assign/engineers', jsonBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export const useCreateEngineerAssign = () => {
    return useMutation(createEngineerAssign, {
        mutationKey: projectKeys.createEngineerAssign(),
        onError: (error) => {
            console.log(error)
            return toast.error(error)
        },
        onSuccess: (data) => {
            if (data?.meta?.status === 200) {
                return toast.success(data?.meta?.msg)
            }else {
                return toast.error(data?.[1])
            }
        },
    })
}
