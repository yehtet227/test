import http from '@/app/libs/http'
import { departmentKeys } from '@/app/store/server/features/departments/query-key-factory'
import { useQuery } from '@tanstack/react-query'

async function getAllDepartments() {
    return await http.get('/departments').then((res) => res.data.data)
}

export const useGetAllDepartments = () =>
    useQuery({
        queryKey: departmentKeys.getAllDepartments(),
        queryFn: getAllDepartments,
    })

async function getAllEmployees() {
    return await http.get('/employees').then((res) => res.data.data)
}

export const useGetAllEmployees = () =>
    useQuery({
        queryKey: departmentKeys.getAllEmployees(),
        queryFn: getAllEmployees,
    })

async function getDepartmentById(id) {
    return await http.get(`/departments/${id}`).then((res) => res.data.data)
}

export const useGetDepartmentById = (id) =>
    useQuery({
        queryKey: [departmentKeys.getDepartmentById, id],
        queryFn: () => getDepartmentById(id),
    })
