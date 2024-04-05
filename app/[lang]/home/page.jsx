'use client'

import ErrorPage from '@/app/components/error/ErrorPage'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetDashboardApi, useGetDepartmentIncome, useGetEngineerStatusReport, useGetMonthlyIncomeByYear } from '@/app/store/server/features/home'
import Image from 'next/image'
import Link from 'next/link'
import { forwardRef, useEffect, useState } from 'react'
import { Chart } from 'react-google-charts'
import { useDispatch } from 'react-redux'
import clientIcon from './images/client.png'
import currentPjIcon from './images/current-project.png'
import empIcon from './images/employee.png'
import pjIcon from './images/project.png'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from '@heroicons/react/20/solid'

const HomeComponent = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateForDepartment, setDateForDepartment] = useState(new Date());
    const [dateForIncome, setDateForIncome] = useState(new Date())
    const [engineerStatusReport, setEngineerStatusReport] = useState([])
    const [engineerRadio, setEngineerRadio] = useState('all')
    const [monthlyIncomeRadio, setMonthlyIncomeRadio] = useState('all')
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    // Fetch dashboard api
    const { data, isSuccess, isError, isLoading, refetch } =
        useGetDashboardApi()

    const {data: dataForEngineerStatus, refetch: refetchEngineerStatusReport} = useGetEngineerStatusReport(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
    useEffect(() => {
        refetchEngineerStatusReport();
    }, [selectedDate, refetchEngineerStatusReport]);

    let engineerStatusReportDataForAll = []
    let engineerStatusReportDataForJapan = []
    let engineerStatusReportDataForMyanmar = []
    if(dataForEngineerStatus) {
        engineerStatusReportDataForAll = [
            ['Project Type', ''],
            ['SES', Number(dataForEngineerStatus?.SES)],
            ['Japan', Number(dataForEngineerStatus?.['Offshore(Japan)'])],
            ['Myanmar', Number(dataForEngineerStatus?.['Offshore(Myanmar)'])],
            ['JPMM', Number(dataForEngineerStatus?.['Offshore(Japan+Myanmar)'])],
            ['Unassign', Number(dataForEngineerStatus?.Unassign)],
        ]

        engineerStatusReportDataForJapan = [
            ['Project Type', ''],
            ['Japan', Number(dataForEngineerStatus?.['Offshore(Japan)'])],
            ['Unassign', Number(dataForEngineerStatus?.Unassign)],
        ]

        engineerStatusReportDataForMyanmar = [
            ['Project Type', ''],
            ['Myanmar', Number(dataForEngineerStatus?.['Offshore(Myanmar)'])],
            ['Unassign', Number(dataForEngineerStatus?.Unassign)],
        ]
    }

    const { data: dataForDepartment, refetch: refetchDepartmentIncome } = useGetDepartmentIncome(dateForDepartment.getFullYear())
    useEffect(() => {
        refetchDepartmentIncome();
    }, [dateForDepartment, refetchDepartmentIncome]);

    // set profit of each department
    let departmentData = []
    if (dataForDepartment) {
        departmentData = [
            ['Departments', 'Cost'], 
            ...dataForDepartment.map(item => [item.department_name, item.cost]) 
          ];
    }

    const {data: dataForMonthlyIncome, refetch: refetchMonthlyIncome} = useGetMonthlyIncomeByYear(dateForIncome.getFullYear())
    useEffect(() => {
        refetchMonthlyIncome();
    }, [dateForIncome, refetchMonthlyIncome]);

    let dataForMonthlyIncomeForAll = []
    let dataForMonthlyIncomeForJapan = []
    let dataForMonthlyIncomeForMyanmar = []
    if(dataForMonthlyIncome) {
        dataForMonthlyIncomeForAll = [
            ['Month', 'Income'],
            ...dataForMonthlyIncome?.['all']?.map((item) => [item.month, item.income]),
        ]
        dataForMonthlyIncomeForJapan = [
            ['Month', 'Income'],
            ...dataForMonthlyIncome?.['jp']?.map((item) => [item.month, item.income]),
        ]
        dataForMonthlyIncomeForMyanmar = [
            ['Month', 'Income'],
            ...dataForMonthlyIncome?.['mm']?.map((item) => [item.month, item.income]),
        ]
    }

    // set options of pie chart
    const pieChartOptions = {
        legend: { position: 'right', alignment:'center', maxLines: 5 },
        colors: ['#57B4D1', '#B7E0A8', '#EFD54A', '#F9A03F', '#F86624'],
    }

    
    const barChartOptions = {
        orientation: 'horizontal',
        chartArea: { width: '80%', height: '50%' },
        bar: { groupWidth: '40%' },
        colors: ['#0ea5e9'],
        
        hAxis: {
            slantedText: true,
            slantedTextAngle: 45, 
        },
        legend: { position: 'none' },
    }

    const barChartOptionsForMonthlyIncome = {
        orientation: 'vertical',
        chartArea: { width: '80%', height: '90%' },
        bar: { groupWidth: '40%' },
        colors: ['#0ea5e9'],
        vAxis: {
            slantedText: true,
            slantedTextAngle: 45, 
        },
        legend: { position: 'none' },
    }


    useEffect(() => {
        refetch()
    }, [refetch])

      const CustomDateButton = forwardRef(({ value, onClick }, ref) => (
        <button className="w-[90px] border border-grey border-grey-300 bg-grey-600 px-2 py-1 rounded-md flex justify-between items-center" onClick={onClick} ref={ref}>
          <span>{value}</span>
          <div className='w-4 h-4'>
          <CalendarDaysIcon />
          </div>
        </button>
      ));
      CustomDateButton.displayName = 'CustomDateButton';
    return (
        <div className="flex flex-col text-xs" suppressHydrationWarning>
            {/* Header area */}
            <div className="mb-4 flex flex-col justify-between gap-2 pt-[11px]">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center">
                        <div className="cursor-pointer" onClick={toggleSideBar}>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col px-4">
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    <div
                        className="w-58 flex h-[95px] items-center justify-between rounded-lg border border-gray-200 py-1 pl-4 pr-2 font-medium text-black shadow-md shadow-gray-400"
                        style={{ background: '#B0ECE3B2' }}
                    >
                        <div className="flex-col">
                            <div>
                                <Link href="/customers">Customers</Link>
                            </div>
                            <div className="mt-8">
                                {isSuccess && data ? data?.customerCount : 0}
                            </div>
                        </div>
                        <div>
                            <Image
                                src={clientIcon}
                                className="h-20 w-20"
                                alt="no image"
                            />
                        </div>
                    </div>
                    <div
                        className="text-12 w-58 flex h-[95px] items-center justify-between rounded-lg border border-gray-200 py-1 pl-4 pr-2 font-medium text-black shadow-md shadow-gray-400"
                        style={{ background: '#8BD6E733' }}
                    >
                        <div className="flex-col">
                            <div>
                                <Link href="/projects">Projects</Link>
                            </div>
                            <div className="mt-8">
                                {isSuccess && data ? data?.totalProjects : 0}
                            </div>
                        </div>
                        <div>
                            <Image
                                src={pjIcon}
                                className="h-[70px] w-[70px]"
                                alt="no image"
                            />
                        </div>
                    </div>
                    <div
                        className="text-12 w-58 border-gray-200py-1 flex h-[95px] items-center justify-between rounded-lg border py-1 pl-4 pr-2 font-medium text-black shadow-md shadow-gray-400"
                        style={{ background: '#AEF9FEE5' }}
                    >
                        <div className="flex-col">
                            <div>
                                <Link href="/engineers">Employees</Link>
                            </div>
                            <div className="mt-8">
                                {isSuccess && data ? data?.employeeCount : 0}
                            </div>
                        </div>
                        <div>
                            <Image
                                src={empIcon}
                                className="h-[84px] w-[84px]"
                                alt="no image"
                            />
                        </div>
                    </div>
                    <div
                        className="text-12 w-58 flex  h-[95px] items-center justify-between rounded-lg border border-gray-200 px-4 py-2 font-medium text-black shadow-md shadow-gray-400"
                        style={{ background: '#BFCCFC66' }}
                    >
                        <div className="flex-col">
                            <Link href={`/projects/current`}>
                                Current Projects
                            </Link>
                            <div className="mt-8">
                                {isSuccess && data ? data?.currentProjects : 0}
                            </div>
                        </div>
                        <div>
                            <Image
                                src={currentPjIcon}
                                className="h-16 w-16"
                                alt="no image"
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={
                        isError ? 'mt-8 flex items-center justify-center' : ''
                    }
                >
                    {isError ? (
                        <ErrorPage message={'dashboard'} status={'500'} />
                    ) : (
                        <div className='w-full flex gap-x-4'>
                            <div className="my-6 w-1/3">
                            <div className='flex flex-col gap-y-8'>
                                {/* Pie chart area */}
                            <div className="min-h-[300px] w-full rounded-t-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex justify-between gap-x-4 items-center">
                                    <p className="text-sm font-bold">
                                        Engineer Status Report
                                    </p>
                                    <div style={{zIndex: '1000'}}>
                                    <DatePicker 
                                    selected={selectedDate} 
                                    className='w-[90px] border border-grey border-grey-300 bg-grey-600 px-2 py-1 rounded-md'
                                    onChange={date => setSelectedDate(date)}
                                    showMonthYearPicker
                                    dateFormat="yyyy/MM"
                                    customInput={<CustomDateButton />}
                                    />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    {isLoading ? (
                                        <p className="mt-8 text-sm">
                                            Loading...
                                        </p>
                                    ) : (
                                        <div className='w-full flex-col items-center justify-center flex-grow'>
                                        <div className='w-full' style={{ height: '250px' }}>
                                            <Chart
                                                chartType="PieChart"
                                                width="100%"
                                                height="100%"
                                                data={engineerRadio === 'all' ? engineerStatusReportDataForAll : engineerRadio === 'gicj' ? engineerStatusReportDataForJapan : engineerStatusReportDataForMyanmar}
                                                options={pieChartOptions}
                                            />
                                        </div>
                                    
                                        <div className=' w-full flex flex-row justify-center gap-x-2'>
                                            <input type="radio" id="all" name="chartOption" value="all" 
                                                checked={engineerRadio === 'all'}
                                                onChange={() => setEngineerRadio('all')}
                                            />
                                            <label htmlFor="all">All</label>
                                    
                                            <input type="radio" id="gicj" name="chartOption" value="gicj" 
                                                checked={engineerRadio === 'gicj'}
                                                onChange={() => setEngineerRadio('gicj')}
                                            />
                                            <label htmlFor="gicj">GICJ</label>
                                    
                                            <input type="radio" id="gicm" name="chartOption" value="gicm" 
                                                checked={engineerRadio === 'gicm'}
                                                onChange={() => setEngineerRadio('gicm')}
                                            />
                                            <label htmlFor="gicm">GICM</label>
                                        </div>
                                    </div>
                                        
                                    )}
                                </div>
                            </div>
                            {/* Bar chart area */}
                            <div className="min-h-[300px] w-full rounded-t-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                            <div className="flex justify-between gap-x-4 items-center">
                            <p
                                    className="z-40 text-sm font-bold"
                                    style={{
                                        position: 'relative',
                                        top: '0px',
                                    }}
                                >
                                    Income According to Department
                                </p>
                                <div style={{zIndex: '1000'}}>
                                    <DatePicker 
                                    selected={dateForDepartment} 
                                    className='w-[90px] border border-grey border-grey-300 bg-grey-600 px-2 py-1 rounded-md'
                                    onChange={date => setDateForDepartment(date)}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    customInput={<CustomDateButton />}
                                    />
                                    </div>
                            </div>
                                
                                <div
                                    style={{
                                        position: 'relative',
                                        top: '-1px',
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <p className="mt-8 text-sm">
                                            Loading...
                                        </p>
                                    ) : (
                                        <Chart
                                            chartType="BarChart"
                                            width="100%"
                                            height="300px"
                                            data={departmentData}
                                            options={barChartOptions}
                                        />
                                    )}
                                </div>
                            </div>
                            </div>
                            </div>

                            <div className='w-2/3 my-6'>
                            <div className="min-h-[300px] w-full rounded-t-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex justify-between gap-x-4 items-center">
                            <p
                                    className="z-40 text-sm font-bold w-[200px]"
                                    style={{
                                        position: 'relative',
                                        top: '0px',
                                    }}
                                >
                                    Monthly Income
                                </p>
                                <div className=' w-full flex flex-row justify-center gap-x-2'>
                                            <input type="radio" id="option1" name="barOption" value="Option 1"
                                                checked={monthlyIncomeRadio === 'all'}
                                                onChange={() => setMonthlyIncomeRadio('all')}
                                            />
                                            <label htmlFor="option1">All</label>
                                    
                                            <input type="radio" id="option2" name="barOption" value="Option 2" 
                                                checked={monthlyIncomeRadio === 'gicj'}
                                                onChange={() => setMonthlyIncomeRadio('gicj')}
                                            />
                                            <label htmlFor="option2">GICJ</label>
                                    
                                            <input type="radio" id="option3" name="barOption" value="Option 3" 
                                                checked={monthlyIncomeRadio === 'gicm'}
                                                onChange={() => setMonthlyIncomeRadio('gicm')}
                                            />
                                            <label htmlFor="option3">GICM</label>
                                        </div>
                                <div style={{zIndex: '1000'}}>
                                    <DatePicker 
                                    selected={dateForIncome} 
                                    className='w-[90px] border border-grey border-grey-300 bg-grey-600 px-2 py-1 rounded-md'
                                    onChange={date => setDateForIncome(date)}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    customInput={<CustomDateButton />}
                                    />
                                    </div>
                            </div>
                                
                                <div
                                    style={{
                                        position: 'relative',
                                        top: '-1px',
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <p className="mt-8 text-sm">
                                            Loading...
                                        </p>
                                    ) : (
                                        <Chart
                                            chartType="BarChart"
                                            width="95%"
                                            height="700px"
                                            data={monthlyIncomeRadio === 'all' ? dataForMonthlyIncomeForAll : monthlyIncomeRadio === 'gicj' ? dataForMonthlyIncomeForJapan : dataForMonthlyIncomeForMyanmar}
                                            options={barChartOptionsForMonthlyIncome}
                                        />
                                    )}
                                </div>
                            </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomeComponent
