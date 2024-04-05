'use client'

import { saveYear } from '@/app/store/client/features/customTable/customTableSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import YearDropdown from './YearDropdown'
import './CostSummary.css'
import {
    costSummaryKeys,
    getCostSummary,
} from '@/app/store/server/features/cost-summary'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

const CostSummary = () => {
    const dispatch = useDispatch()
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const {
        data: costSummaryData,
        isLoading,
        isError,
        isSuccess,
        refetch: refetchCostSummary,
    } = useQuery(
        costSummaryKeys.getCostSummary(selectedYear),
        () => getCostSummary(selectedYear),
        {
            enabled: false,
        },
    )

    useEffect(() => {
        refetchCostSummary()
    }, [selectedYear, refetchCostSummary])

    const handleYearSelection = (year) => {
        setSelectedYear(year)
        queryClient.invalidateQueries(costSummaryKeys.getCostSummary(year))
        dispatch(saveYear(year))
    }

    const calculateJPMonthlyTotal = (month, costSummaryData) => {
        return costSummaryData?.data?.jp
            .reduce((acc, jp) => {
                const monthCost = jp[month]?.cost || 0
                return acc + monthCost
            }, 0)
            .toLocaleString('en-US', { style: 'decimal' })
    }

    const calculateMMMonthlyTotal = (month, costSummaryData) => {
        return costSummaryData?.data?.mm
            .reduce((acc, mm) => {
                const monthCost = mm[month]?.cost || 0
                return acc + monthCost
            }, 0)
            .toLocaleString('en-US', { style: 'decimal' })
    }

    const calculateJPProjectTotal = (projectIndex, costSummaryData) => {
        let projectTotal = 0

        ;[...Array(12).keys()].forEach((monthIndex) => {
            const month = [
                'january',
                'february',
                'march',
                'april',
                'may',
                'june',
                'july',
                'august',
                'september',
                'october',
                'november',
                'december',
            ][monthIndex]

            projectTotal += costSummaryData.data.jp[projectIndex][month].cost
        })

        return projectTotal.toLocaleString('en-US', {
            style: 'decimal',
        })
    }

    const calculateMMProjectTotal = (projectIndex, costSummaryData) => {
        let projectTotal = 0

        ;[...Array(12).keys()].forEach((monthIndex) => {
            const month = [
                'january',
                'february',
                'march',
                'april',
                'may',
                'june',
                'july',
                'august',
                'september',
                'october',
                'november',
                'december',
            ][monthIndex]

            projectTotal += costSummaryData.data.mm[projectIndex][month].cost
        })

        return projectTotal.toLocaleString('en-US', {
            style: 'decimal',
        })
    }

    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            <div className="sticky top-0 z-[1000] mb-3 flex flex-col justify-between bg-white">
                <div className="items my-1 mb-3 flex flex-row items-center py-[2px] text-sm">
                    <div
                        className="cursor-pointer"
                        onClick={() => dispatch(toggleCollapsible())}
                    >
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                        <YearDropdown
                            showYear={selectedYear}
                            handleYearSelection={handleYearSelection}
                        />
                    </div>
                </div>
                <hr />
            </div>
            <hr className="font-bold" />

            {isLoading ? (
                <tr className="border-t">
                    <td colSpan="100%" className="px-4 py-[10px] text-center">
                        Loading...
                    </td>
                </tr>
            ) : null}
            {isError ? (
                <tr className="border-t">
                    <td colSpan="100%" className="px-4 py-[10px] text-center">
                        Data can not fetch.
                    </td>
                </tr>
            ) : null}

            {isSuccess && costSummaryData && costSummaryData.data && (
                <div>
                    <div className="table-container overflow-x-auto">
                            
                        <table className="w-full border-separate border-spacing-0">
                                <thead className=" bg-gray-100 text-sm">
                                <tr>
                                    <th
                                        className="sticky left-0 bg-white py-2 pl-2 text-left font-medium text-gray-500"
                                    >
                                       Income
                                    </th>
                                </tr>
                            
                                    <tr>
                                        <th className="sticky left-0 z-[30] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                            No.
                                        </th>

                                        <th className="sticky left-[58px] whitespace-normal z-[20] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{
                                                            width: '260px',
                                                        }}>
                                            Project Name
                                        </th>
                                        <th className="z-[10] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '260px'}}>
                                            Customer Name
                                        </th>
                                        <th className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '180px'}}>
                                            Department
                                        </th>
                                        <th className="whitespace-normal border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '160px'}}>
                                            PM/PL
                                        </th>
                                        <th className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500">
                                            Marketing
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            January
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            February
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            March
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            April
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            May
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            June
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            July
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            August
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            September
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            October
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            November
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            December
                                        </th>
                                        <th
                                            className="border-r-[1px] bg-gray-100 border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                {costSummaryData && (
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {costSummaryData?.data?.income.map(
                                            (income, index) => {
                                                const calculateTotal = () => {
                                                    const months = [
                                                        'january',
                                                        'february',
                                                        'march',
                                                        'april',
                                                        'may',
                                                        'june',
                                                        'july',
                                                        'august',
                                                        'september',
                                                        'october',
                                                        'november',
                                                        'december',
                                                    ]
                                                    return months.reduce(
                                                        (acc, month) =>
                                                            acc +
                                                            (income[month] ||
                                                                0),
                                                        0,
                                                    )
                                                }

                                                return (
                                                    <tr key={income.id}>
                                                        <td className="sticky left-0 z-[30] bg-white border-r-[1px] border-b-[1px] border-l-[1px] border-gray-300   px-2 py-2 pl-2 pr-2 text-right text-xs">
                                                            {index + 1}
                                                        </td>
                                                        <td
                                                            className="sticky left-[58px] z-[20] whitespace-normal border-r-[1px] border-b-[1px]  border-gray-300 bg-white px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            style={{
                                                                width: '260px',
                                                            }}
                                                        >
                                                            {income.project_name}
                                                        </td> 
                                                        <td
                                                            className="z-[10] border-r-[1px] whitespace-normal border-b-[1px] bg-white  border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '260px'}}
                                                            
                                                        >
                                                            {income.customer_name}
                                                        </td>
                                                        <td
                                                            className="whitespace-normal border-r-[1px] border-b-[1px] border-gray-300 bg-white  px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '180px'}}
                                                           
                                                        >
                                                            {income.department}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] whitespace-normal bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '160px'}}
                                                            
                                                        >
                                                            {income.pm_pl}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            
                                                        >
                                                            {income.marketing}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.january?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.february?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.march?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px]  border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.april?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.may?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.june?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.july?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.august?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.september?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.october?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.november?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {income?.december?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>

                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                            {calculateTotal().toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            },
                                        )}

                                        <tr>
                                        <th className="sticky left-0 z-[30] bg-white border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                        </th>

                                        <th className="sticky left-[58px] bg-white whitespace-normal z-[20] border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{width: '270px'}}>
                                        </th>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>

                                        {[
                                            'january',
                                            'february',
                                            'march',
                                            'april',
                                            'may',
                                            'june',
                                            'july',
                                            'august',
                                            'september',
                                            'october',
                                            'november',
                                            'december',
                                        ].map((month) => (
                                            <td
                                                key={`total-${month}`}
                                                className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold"
                                            >
                                                {costSummaryData?.data?.income
                                                    .reduce(
                                                        (acc, income) =>
                                                            acc +
                                                            (income[month] ||
                                                                0),
                                                        0,
                                                    )
                                                    .toLocaleString('en-US', {
                                                        style: 'decimal',
                                                    })}
                                            </td>
                                        ))}

                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                            {[
                                                'january',
                                                'february',
                                                'march',
                                                'april',
                                                'may',
                                                'june',
                                                'july',
                                                'august',
                                                'september',
                                                'october',
                                                'november',
                                                'december',
                                            ]
                                                .reduce(
                                                    (acc, month) =>
                                                        acc +
                                                        costSummaryData?.data?.income.reduce(
                                                            (total, income) =>
                                                                total +
                                                                (income[
                                                                    month
                                                                ] || 0),
                                                            0,
                                                        ),
                                                    0,
                                                )
                                                .toLocaleString('en-US', {
                                                    style: 'decimal',
                                                })}
                                        </td>
                                    </tr> 
                                    </tbody>
                                )}
                        </table>
                        
                        <table className="w-full border-separate border-spacing-0">
                            <thead className=" bg-gray-100 text-sm">
                                <tr>
                                    <th colSpan={2}
                                        className="sticky left-0 bg-white py-2 pl-2 text-left font-medium text-gray-500"
                                    >
                                       Work in progress cost(GICJ)
                                    </th>
                                </tr>
                            
                                    <tr>
                                    <th className="sticky left-0 z-[30] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                            No.
                                        </th>

                                        <th className="sticky whitespace-normal left-[58px] z-[20] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{width: '260px'}}>
                                            Project Name
                                        </th>
                                        <th className="z-[10] whitespace-normal bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px]  border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '260px'}}>
                                            Customer Name
                                        </th>
                                        <th className="border-r-[1px] border-t-[1px] whitespace-normal bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '180px'}}>
                                            Department
                                        </th>
                                        <th className="border-r-[1px] border-t-[1px] whitespace-normal bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '160px'}}>
                                            PM/PL
                                        </th>
                                        <th className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500">
                                            Marketing
                                        </th>
                                    <th
                                        colSpan={2}
                                        className="col-span-4 whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        January
                                    </th>

                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        February
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2  text-center text-sm font-medium text-gray-500"
                                    >
                                        March
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        April
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        May
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        June
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        July
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        August
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        September
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        October
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2  text-center text-sm font-medium text-gray-500"
                                    >
                                        November
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2  text-center text-sm font-medium text-gray-500"
                                    >
                                        December
                                    </th>
                                    <th
                                        className="whitespace-nowrap border px-6 py-2 text-center text-sm font-medium text-gray-500"
                                        style={{ width: '125px' }}
                                    >
                                        Total
                                    </th>
                                </tr>

                                <tr>
                                <th className="sticky left-0 z-[30] bg-white border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                        </th>

                                        <th className="sticky left-[58px] bg-white whitespace-normal z-[20] border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{
                                                            width: '270px',
                                                        }}>
                                        </th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    {Array(12)
                                        .fill()
                                        .map((_, i) => (
                                            <>
                                                <td
                                                    className="border bg-white pl-2 pr-2 text-center text-xs font-medium text-gray-500"
                                                    style={{
                                                        width: '60px',
                                                    }}
                                                >
                                                    Man <br></br> Month
                                                </td>
                                                <td
                                                    className="border bg-white pl-2 pr-2 text-center text-xs font-medium text-gray-500"
                                                    style={{
                                                        width: '60px',
                                                    }}
                                                >
                                                    Cost
                                                </td>
                                            </>
                                        ))}
                                    <td
                                        className="border bg-white"
                                        style={{ width: '120px' }}
                                    ></td>
                                </tr>
                            </thead>

                            {costSummaryData &&
                                costSummaryData.data &&
                                costSummaryData.data.jp && (
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {costSummaryData?.data?.jp.map(
                                            (jp, index) => (
                                                <tr key={jp.id}>
                                                    <td className="sticky left-0 z-[30] bg-white border-r-[1px] border-b-[1px] border-l-[1px] border-gray-300   px-2 py-2 pl-2 pr-2 text-right text-xs">
                                                            {index + 1}
                                                        </td>
                                                        <td
                                                            className="sticky left-[58px] whitespace-normal z-[20]  border-r-[1px] border-b-[1px]  border-gray-300 bg-white px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            style={{
                                                                width: '260px',
                                                            }}
                                                        >
                                                            {
                                                                jp.project_name
                                                            }
                                                        </td> 
                                                        <td
                                                            className="z-[10] border-r-[1px] whitespace-normal border-b-[1px] bg-white  border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '260px'}}
                                                            
                                                        >
                                                            {
                                                                jp.customer_name
                                                            }
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] whitespace-normal border-gray-300 bg-white  px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '180px'}}
                                                           
                                                        >
                                                            {jp.department}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] whitespace-normal bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '160px'}}
                                                            
                                                        >
                                                            {jp.pm_pl}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            
                                                        >
                                                            {jp.marketing}
                                                        </td>

                                                    {[...Array(12).keys()].map(
                                                        (monthIndex) => {
                                                            const month = [
                                                                'january',
                                                                'february',
                                                                'march',
                                                                'april',
                                                                'may',
                                                                'june',
                                                                'july',
                                                                'august',
                                                                'september',
                                                                'october',
                                                                'november',
                                                                'december',
                                                            ][monthIndex]

                                                            return (
                                                                <React.Fragment
                                                                    key={month}
                                                                >
                                                                    <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                                        {
                                                                            jp[
                                                                                month
                                                                            ]
                                                                                .man_month
                                                                        }
                                                                    </td>

                                                                    <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                                        {jp[
                                                                            month
                                                                        ].cost.toLocaleString(
                                                                            'en-US',
                                                                            {
                                                                                style: 'decimal',
                                                                            },
                                                                        )}
                                                                    </td>
                                                                </React.Fragment>
                                                            )
                                                        },
                                                    )}
                                                    <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                        {calculateJPProjectTotal(
                                                            index,
                                                            costSummaryData,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}

                                        <tr
                                            style={{
                                                border: '2px solid #ccc',
                                            }}
                                        >
                                            <th className="sticky left-0 z-[30] bg-white border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                        </th>

                                        <th className="sticky left-[58px] bg-white whitespace-normal z-[20] border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{
                                                            width: '270px',
                                                        }}>
                                        </th>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>

                                            {[...Array(12).keys()].map(
                                                (monthIndex) => {
                                                    const month = [
                                                        'january',
                                                        'february',
                                                        'march',
                                                        'april',
                                                        'may',
                                                        'june',
                                                        'july',
                                                        'august',
                                                        'september',
                                                        'october',
                                                        'november',
                                                        'december',
                                                    ][monthIndex]

                                                    return (
                                                        <React.Fragment
                                                            key={month}
                                                        >
                                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                                &nbsp;
                                                            </td>
                                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                                {calculateJPMonthlyTotal(
                                                                    month,
                                                                    costSummaryData,
                                                                )}
                                                            </td>
                                                        </React.Fragment>
                                                    )
                                                },
                                            )}

                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                {costSummaryData.data.jp
                                                    .reduce(
                                                        (acc, jp) =>
                                                            acc +
                                                            Object.values(
                                                                jp,
                                                            ).reduce(
                                                                (
                                                                    monthAcc,
                                                                    month,
                                                                ) =>
                                                                    monthAcc +
                                                                    (month &&
                                                                    month.cost !==
                                                                        undefined
                                                                        ? month.cost
                                                                        : 0),
                                                                0,
                                                            ),
                                                        0,
                                                    )
                                                    .toLocaleString('en-US', {
                                                        style: 'decimal',
                                                    })}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                        </table>

                        <table className="w-full border-separate border-spacing-0">
                        <thead className=" bg-gray-100 text-sm">
                                <tr>
                                    <th colSpan={4}
                                        className="sticky left-0 bg-white py-2 pl-2 text-left font-medium text-gray-500"
                                    >
                                       Work in progress cost(GICM)
                                    </th>
                                </tr>
                            
                                    <tr>
                                    <th className="sticky left-0 z-[30] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                            No.
                                        </th>

                                        <th className="sticky whitespace-normal left-[58px] z-[20] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{width: '260px'}}>
                                            Project Name
                                        </th>
                                        <th className="z-[10] whitespace-normal bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '260px'}}>
                                            Customer Name
                                        </th>
                                        <th className="border-r-[1px] whitespace-normal border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '180px'}}>
                                            Department
                                        </th>
                                        <th className="border-r-[1px] whitespace-normal border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '160px'}}>
                                            PM/PL
                                        </th>
                                        <th className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500">
                                            Marketing
                                        </th>
                                    <th
                                        colSpan={2}
                                        className="col-span-4 whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        January
                                    </th>

                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        February
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2  text-center text-sm font-medium text-gray-500"
                                    >
                                        March
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        April
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        May
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        June
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        July
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        August
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        September
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2 text-center text-sm font-medium text-gray-500"
                                    >
                                        October
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2  text-center text-sm font-medium text-gray-500"
                                    >
                                        November
                                    </th>
                                    <th
                                        colSpan="2"
                                        className="whitespace-nowrap border py-2  text-center text-sm font-medium text-gray-500"
                                    >
                                        December
                                    </th>
                                    <th
                                        className="whitespace-nowrap border px-6 py-2 text-center text-sm font-medium text-gray-500"
                                        style={{ width: '125px' }}
                                    >
                                        Total
                                    </th>
                                </tr>

                                <tr>
                                <th className="sticky left-0 z-[30] bg-white border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                        </th>

                                        <th className="sticky left-[58px] bg-white whitespace-normal z-[20] border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{
                                                            width: '270px',
                                                        }}>
                                        </th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    <th className="text-based whitespace-nowrap border bg-white px-6 py-2"></th>
                                    {Array(12)
                                        .fill()
                                        .map((_, i) => (
                                            <>
                                                <td
                                                    className="border bg-white pl-2 pr-2 text-center text-xs font-medium text-gray-500"
                                                    style={{
                                                        width: '60px',
                                                    }}
                                                >
                                                    Man <br></br> Month
                                                </td>
                                                <td
                                                    className="border bg-white pl-2 pr-2 text-center text-xs font-medium text-gray-500"
                                                    style={{
                                                        width: '60px',
                                                    }}
                                                >
                                                    Cost
                                                </td>
                                            </>
                                        ))}
                                    <td
                                        className="border bg-white"
                                        style={{ width: '120px' }}
                                    ></td>
                                </tr>
                            </thead>

                            {costSummaryData &&
                                costSummaryData.data &&
                                costSummaryData.data.mm && (
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {costSummaryData?.data?.mm.map(
                                            (mm, index) => (
                                                <tr key={mm.id}>
                                                    <td className="sticky left-0 z-[30] bg-white border-r-[1px] border-b-[1px] border-l-[1px] border-gray-300   px-2 py-2 pl-2 pr-2 text-right text-xs">
                                                            {index + 1}
                                                        </td>
                                                        <td
                                                            className="sticky left-[58px] whitespace-normal z-[20]  border-r-[1px] border-b-[1px]  border-gray-300 bg-white px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            style={{
                                                                width: '260px',
                                                            }}
                                                        >
                                                            {mm.project_name}
                                                        </td> 
                                                        <td
                                                            className="z-[10] whitespace-normal border-r-[1px] border-b-[1px] bg-white  border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '260px'}}
                                                            
                                                        >
                                                            {mm.customer_name}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] whitespace-normal border-b-[1px] border-gray-300 bg-white  px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '180px'}}
                                                           
                                                        >
                                                            {mm.department}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            
                                                        >
                                                            {mm.pm_pl}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            
                                                        >
                                                            {mm.marketing}
                                                        </td>

                                                    {[...Array(12).keys()].map(
                                                        (monthIndex) => {
                                                            const month = [
                                                                'january',
                                                                'february',
                                                                'march',
                                                                'april',
                                                                'may',
                                                                'june',
                                                                'july',
                                                                'august',
                                                                'september',
                                                                'october',
                                                                'november',
                                                                'december',
                                                            ][monthIndex]

                                                            return (
                                                                <React.Fragment
                                                                    key={month}
                                                                >
                                                                    <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                                        {
                                                                            mm[
                                                                                month
                                                                            ]
                                                                                .man_month
                                                                        }
                                                                    </td>

                                                                    <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                                        {mm[
                                                                            month
                                                                        ].cost.toLocaleString(
                                                                            'en-US',
                                                                            {
                                                                                style: 'decimal',
                                                                            },
                                                                        )}
                                                                    </td>
                                                                </React.Fragment>
                                                            )
                                                        },
                                                    )}
                                                    <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                        {calculateMMProjectTotal(
                                                            index,
                                                            costSummaryData,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}

                                        <tr
                                            style={{
                                                border: '2px solid #ccc',
                                            }}
                                        >
                                            <th className="sticky left-0 z-[30] bg-white border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                        </th>

                                        <th className="sticky left-[58px] bg-white whitespace-normal z-[20] border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{
                                                            width: '270px',
                                                        }}>
                                        </th>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>

                                            {[...Array(12).keys()].map(
                                                (monthIndex) => {
                                                    const month = [
                                                        'january',
                                                        'february',
                                                        'march',
                                                        'april',
                                                        'may',
                                                        'june',
                                                        'july',
                                                        'august',
                                                        'september',
                                                        'october',
                                                        'november',
                                                        'december',
                                                    ][monthIndex]

                                                    return (
                                                        <React.Fragment
                                                            key={month}
                                                        >
                                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                                &nbsp;
                                                            </td>
                                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                                {calculateMMMonthlyTotal(
                                                                    month,
                                                                    costSummaryData,
                                                                )}
                                                            </td>
                                                        </React.Fragment>
                                                    )
                                                },
                                            )}

                                            <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                {costSummaryData.data.mm
                                                    .reduce(
                                                        (acc, mm) =>
                                                            acc +
                                                            Object.values(
                                                                mm,
                                                            ).reduce(
                                                                (
                                                                    monthAcc,
                                                                    month,
                                                                ) =>
                                                                    monthAcc +
                                                                    (month &&
                                                                    month.cost !==
                                                                        undefined
                                                                        ? month.cost
                                                                        : 0),
                                                                0,
                                                            ),
                                                        0,
                                                    )
                                                    .toLocaleString('en-US', {
                                                        style: 'decimal',
                                                    })}
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                        </table>

                        <table className="w-full border-separate border-spacing-0">
                                <thead className=" bg-gray-100 text-sm">
                                <tr>
                                    <th colSpan={4}
                                        className="sticky left-0 bg-white py-2 pl-2 text-left font-medium text-gray-500"
                                    >
                                       Overall Profit
                                    </th>
                                </tr>
                            
                                    <tr>
                                        <th className="sticky left-0 z-[30] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                            No.
                                        </th>

                                        <th className="sticky left-[58px] whitespace-normal z-[20] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{
                                                            width: '260px',
                                                        }}>
                                            Project Name
                                        </th>
                                        <th className="z-[10] bg-gray-100 border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '260px'}}>
                                            Customer Name
                                        </th>
                                        <th className="whiteapce-normal border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '180px'}}>
                                            Department
                                        </th>
                                        <th className="whitespace-normal border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500" style={{width: '160px'}}>
                                            PM/PL
                                        </th>
                                        <th className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500">
                                            Marketing
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            January
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            February
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            March
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            April
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            May
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            June
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            July
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            August
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            September
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            October
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            November
                                        </th>
                                        <th
                                            className="border-r-[1px] border-t-[1px] bg-gray-100 border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            December
                                        </th>
                                        <th
                                            className="border-r-[1px] bg-gray-100 border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center text-sm font-medium text-gray-500"
                                            style={{ width: '120px' }}
                                        >
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                {costSummaryData && (
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {costSummaryData?.data?.profit.map(
                                            (profit, index) => {
                                                const calculateTotal = () => {
                                                    const months = [
                                                        'january',
                                                        'february',
                                                        'march',
                                                        'april',
                                                        'may',
                                                        'june',
                                                        'july',
                                                        'august',
                                                        'september',
                                                        'october',
                                                        'november',
                                                        'december',
                                                    ]
                                                    return months.reduce(
                                                        (acc, month) =>
                                                            acc +
                                                            (profit[month] ||
                                                                0),
                                                        0,
                                                    )
                                                }

                                                return (
                                                    <tr key={profit.id}>
                                                        <td className="sticky left-0 z-[30] bg-white border-r-[1px] border-b-[1px] border-l-[1px] border-gray-300   px-2 py-2 pl-2 pr-2 text-right text-xs">
                                                            {index + 1}
                                                        </td>
                                                        <td
                                                            className="sticky left-[58px] z-[20] whitespace-normal border-r-[1px] border-b-[1px]  border-gray-300 bg-white px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            style={{
                                                                width: '260px',
                                                            }}
                                                        >
                                                            {profit.project_name}
                                                        </td> 
                                                        <td
                                                            className="z-[10] border-r-[1px] whitespace-normal border-b-[1px] bg-white  border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '260px'}}
                                                            
                                                        >
                                                            {profit.customer_name}
                                                        </td>
                                                        <td
                                                            className="whitespace-normal border-r-[1px] border-b-[1px] border-gray-300 bg-white  px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '180px'}}
                                                           
                                                        >
                                                            {profit.department}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] whitespace-normal bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs" style={{width: '160px'}}
                                                            
                                                        >
                                                            {profit.pm_pl}
                                                        </td>
                                                        <td
                                                            className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-left text-xs"
                                                            
                                                        >
                                                            {profit.marketing}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.january?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.february?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.march?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px]  border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.april?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.may?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.june?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.july?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.august?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.september?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.october?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.november?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300  px-6 py-2 pl-2 pr-2 text-right text-xs">
                                                            {profit?.december?.toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>

                                                        <td className="border-r-[1px] border-b-[1px] bg-white border-gray-300 px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                                            {calculateTotal().toLocaleString(
                                                                'en-US',
                                                                {
                                                                    style: 'decimal',
                                                                },
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            },
                                        )}

                                        <tr>
                                        <th className="sticky left-0 z-[30] bg-white border-r-[1px] border-t-[1px] border-b-[1px] border-l-[1px] border-gray-300 px-6 py-2 pl-4 pr-4 text-center font-medium text-gray-500">
                                        </th>

                                        <th className="sticky left-[58px] bg-white whitespace-normal z-[20] border-r-[1px] border-t-[1px] border-b-[1px] border-gray-300 px-6 py-2 text-center font-medium text-gray-500" style={{width: '270px'}}>
                                        </th>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>
                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs"></td>

                                        {[
                                            'january',
                                            'february',
                                            'march',
                                            'april',
                                            'may',
                                            'june',
                                            'july',
                                            'august',
                                            'september',
                                            'october',
                                            'november',
                                            'december',
                                        ].map((month) => (
                                            <td
                                                key={`total-${month}`}
                                                className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold"
                                            >
                                                {costSummaryData?.data?.profit
                                                    .reduce(
                                                        (acc, profit) =>
                                                            acc +
                                                            (profit[month] ||
                                                                0),
                                                        0,
                                                    )
                                                    .toLocaleString('en-US', {
                                                        style: 'decimal',
                                                    })}
                                            </td>
                                        ))}

                                        <td className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-right text-xs font-bold">
                                            {[
                                                'january',
                                                'february',
                                                'march',
                                                'april',
                                                'may',
                                                'june',
                                                'july',
                                                'august',
                                                'september',
                                                'october',
                                                'november',
                                                'december',
                                            ]
                                                .reduce(
                                                    (acc, month) =>
                                                        acc +
                                                        costSummaryData?.data?.profit.reduce(
                                                            (total, profit) =>
                                                                total +
                                                                (profit[
                                                                    month
                                                                ] || 0),
                                                            0,
                                                        ),
                                                    0,
                                                )
                                                .toLocaleString('en-US', {
                                                    style: 'decimal',
                                                })}
                                        </td>
                                    </tr> 
                                    </tbody>
                                )}
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <CostSummary />
        </QueryClientProvider>
    )
}

export default App
