import http from '@/app/libs/http';
import { useQuery } from '@tanstack/react-query';
import { costSummaryKeys } from './query-key-factory';

costSummaryKeys.getCostSummary = (year) => ['costSummary', { year }];

export const getCostSummary = async (year) => {
  return await http.get(`/costs/costSummary/years/${year}`).then((res) => res.data);
};

export const useGetCostSummary = (selectedYear) =>
  useQuery({
    queryKey: costSummaryKeys.getCostSummary(selectedYear),
    queryFn: () => getCostSummary(selectedYear),
  });

  