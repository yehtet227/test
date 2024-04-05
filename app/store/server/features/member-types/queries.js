import http from '@/app/libs/http'
import { membertypeKeys  } from '@/app/store/server/features/member-types/query-key-factory'
import { useQuery } from '@tanstack/react-query'

async function getAllMemberTypes() {
    return await http.get('/member/type').then((res) => res.data.data)
}

export const useGetAllMemberTypes = () =>
    useQuery({
        queryKey: membertypeKeys.getAllMemberTypes(),
        queryFn: getAllMemberTypes,
    })

