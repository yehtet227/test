import { todoKeys } from '@/app/store/server/features/todos/query-key-factory'
import { useMutation } from '@tanstack/react-query'

const createPost = async (body) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return res.json()
}

export const useCreatePost = () =>
    useMutation({
        mutationKey: todoKeys.createTodo(),
        mutationFn: createPost,
    })
