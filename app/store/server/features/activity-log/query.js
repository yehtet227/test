import http from '@/app/libs/http';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { activityLogKeys } from './query-key-factory';

async function getActivities() {
  return await http.get('/activity').then((res) => res.data.data.ActivityData);
}

export const useGetActivityLog = () =>
  {
    const queryClient = useQueryClient();
      const { data } = useQuery(activityLogKeys.getActivities(), () => getActivities());
    
      const refetch = () => {
        return queryClient.invalidateQueries(activityLogKeys.getActivities());
      };
    
      return { data, refetch };
  }

