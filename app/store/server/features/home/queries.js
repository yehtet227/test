import http from '@/app/libs/http'
import { dashboardKeys } from '@/app/store/server/features/home/query-key-factory'
import { useQuery, useQueryClient } from '@tanstack/react-query'

async function getDashboardApi() {
    return await http.get('/dashboard').then((res) => res.data.data)
}

export const useGetDashboardApi = () =>
    useQuery({
        queryKey: dashboardKeys.getDashboardApi(),
        queryFn: getDashboardApi,
    })

async function getDepartmentIncome(year) {
    return await http.get(`/dashboard/yearlyIncome/years/${year}`).then((res) => res.data.data)
}

export const useGetDepartmentIncome = (year) => {
    const queryClient = useQueryClient();
const { data } = useQuery(['departmentIncome', year], () => getDepartmentIncome(year));

const refetch = () => {
  return queryClient.invalidateQueries(['departmentIncome', year]);
};

return { data, refetch };
}

async function getEngineerStatusReport(year, month) {
    return await http.get(`/dashboard/engineerStatus/${year}/${month}`).then((res) => res.data.data)
}

export const useGetEngineerStatusReport = (year, month) => {
    const queryClient = useQueryClient();
    const {data} = useQuery(['engineerStatus', year, month], () => getEngineerStatusReport(year, month));
    const refetch = () => {
        return queryClient.invalidateQueries(['engineerStatus', year, month]);
    };

    return { data, refetch};
}

async function getMonthlyIncomeByYear(year) {
    return await http.get(`/dashboard/monthlyIncome/years/${year}`).then((res) => res.data.data)
}

export const useGetMonthlyIncomeByYear = (year) => {
    const queryClient = useQueryClient();
    const {data} = useQuery(['monthlyIncome', year], () => getMonthlyIncomeByYear(year));
    const refetch = () => {
        return queryClient.invalidateQueries(['monthlyIncome', year]);
    };

    return { data, refetch};
}

