import http from '@/app/libs/http'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from './query-key-factory'

async function getAllProjects() {
    return await http.get('/projects').then((res) => res.data.data)
}

export const useGetAllProjects = () =>
    useQuery({
        queryKey: projectKeys.getAllProjects(),
        queryFn: getAllProjects,
    })

    async function getProjectById(id) {
     const project = await http.get(`/projects/${id}/edit`)
     return project.data.data;
    }
    export function useGetProjectById(id) {
      const queryClient = useQueryClient();
      const { data } = useQuery(['project', id], () => getProjectById(id));
    
      const refetch = () => {
        return queryClient.invalidateQueries(['project', id]);
      };
    
      return { data, refetch };
    }

    async function getCurrentProjects() {
      return await http.get('/projects/current').then((res) => res.data.data)
  }
  
  export const useGetCurrentProjects = () =>
      useQuery({
          queryKey: projectKeys.getCurrentProjects(),
          queryFn: getCurrentProjects,
      })
