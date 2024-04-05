import http from '@/app/libs/http'
import { useQuery } from '@tanstack/react-query'
import { projectTypeKeys } from './query-key-factory'

async function getAllProjectTypes() {
    const response = await http.get('/project_types');
    return response.data.data;
}

export const useGetAllProjectTypes = () =>
    useQuery({
        queryKey: projectTypeKeys.getAllProjectTypes(),
        queryFn: getAllProjectTypes,
    })

async function getAllProjectTypesWithoutSES() {
    const response = await http.get('/project_types/type/offshore');
    return response.data.data;
}

export const useGetAllProjectTypesWithoutSES = () => {
    return useQuery({
        queryKey: projectTypeKeys.getAllProjectTypesWithoutSES(),
        queryFn: getAllProjectTypesWithoutSES,
    })
}

async function getProjectTypeById(project_type) {
    const response = await http.get(`/project_types/${project_type}`);
    return response.data.data;
}

export function useGetProjectTypeById(id) {
    return useQuery(['project_type', id], () => getProjectTypeById(id));
  }