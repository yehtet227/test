import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from './query-key-factory'
import http from '@/app/libs/http';

const createProject = async (body) => {
  const jsonBody = JSON.stringify(body);
  const response = await http.post('/projects', jsonBody,  {
    headers: {
      'Content-Type': 'application/json'
}});
  return response.data;
};


const deleteProject = async (body) => {
  const queryString = `ids=[${body.join(',')}]`;
  const response = await http.delete(`/projects/delete?${queryString}`);

  return response.data;

}

export const useDeleteProject = (successCallback) => {

  const queryClient = useQueryClient();

  return useMutation(deleteProject, {

    mutationKey: projectKeys.getAllProjects(),

    onError: (error) => {

    },

    onSuccess: (data) => {

      queryClient.invalidateQueries('projects');

      successCallback(data);

    },

  });

}

export const useCreateProject = (createCallback) => {
  const queryClient = useQueryClient();
  return useMutation(createProject, {
    mutationKey: projectKeys.createProject(),
    onError: (error) => {
      
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('projects');
      createCallback(data);
    },
  });
}

const updateProject = async ({body, id}) => {
  const jsonBody = JSON.stringify(body);
  const response = await http.put(`/projects/${id}`, jsonBody,  {
    headers: {
      'Content-Type': 'application/json'
}});
  return response.data;
};

async function getProjectById(id) {
  const project = await http.get(`/projects/${id}/edit`)
  return project.data.data;
 }
 
export const useUpdateProject = (updateCallback, projectId) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(updateProject, {
    mutationKey: projectKeys.updateProject(),
    onError: (error) => {
      
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries('projects');
      updateCallback(data);
    },
  });

  const { data } = useQuery(['project', projectId], () => getProjectById(projectId));
    
      const refetch = () => {
        return queryClient.invalidateQueries(['project', projectId]);
      };

  return { ...mutation, refetch };
};