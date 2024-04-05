'use client'

import ErrorPage from '@/app/components/error/ErrorPage'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllCosts } from '@/app/store/server/features/costs'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const Costs = () => {
    const [originalData, setOriginalData] = useState([])
    const [costData, setCostData] = useState([])

    const dispatch = useDispatch()

    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    const {
        data: costDataFromAPI,
        isLoading,
        isError,
        isSuccess,
        refetch: refetchCosts,
    } = useGetAllCosts()

    useEffect(() => {
        refetchCosts()
    }, [refetchCosts])

    useEffect(() => {
        if (costDataFromAPI && !isLoading && !isError) {
            setOriginalData(costDataFromAPI.costs)
            setCostData(costDataFromAPI.costs)
        }
    }, [costDataFromAPI, isLoading, isError])

    const searchCostData = (searchValue) => {
        const searchTerm = searchValue.trim().toLowerCase()

        if (searchTerm !== '') {
            const filtered = originalData.filter(
                (record) =>
                    record.project_name.toLowerCase().includes(searchTerm) ||
                    (record.project_name !== null &&
                        record.project_name.toLowerCase().includes(searchTerm)),
            )

            setCostData(filtered)
        } else {
            setCostData(originalData)
        }
    }

    const calculateProfit = (item) => {
        const estimateCost = item.estimate_cost
        const actualCost = item.actual_cost
        const profit = estimateCost - actualCost
        return profit.toLocaleString('en-US')
    }

    const columns = [
        {
            name: 'No.',
            index: 'no',
        },
        {
            name: 'Project Name',
            index: 'projectName',
        },
        {
            name: 'Estimate Cost',
            index: 'estimateCost',
        },
        {
            name: 'Actual Cost',
            index: 'actualCost',
        },
        {
            name: 'Profit',
            index: 'profit',
        },
    ]

    return (
        <div className="flex flex-col text-xs" suppressHydrationWarning>
            <div className="sticky top-0 z-10 mb-3 flex flex-col justify-between bg-white">
                <div className="my-1 flex flex-row items-center justify-between py-1">
                    <div className="flex w-full flex-row items-center">
                        <div className="cursor-pointer" onClick={toggleSideBar}>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        </div>
                        <div className="flex w-11/12">
                            <div className="pointer-events-none inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-4.35-4.35"
                                    />
                                    <circle cx="10.5" cy="10.5" r="7.5" />
                                </svg>
                            </div>
                            <input
                                className="w-full py-2 pl-2 pr-4 focus:outline-none"
                                type="text"
                                placeholder="Search by Project Name"
                                onChange={(e) => {
                                    searchCostData(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <hr />
            </div>

            <div
                className={`no-scrollbar max-h-[90vh] overflow-auto rounded border-t pb-2`}
            >
                <div className="rounded border-l border-r">
                    <table className="min-w-full border-collapse divide-y divide-gray-200 border">
                        <thead className="bg-gray-500 text-sm">
                            <tr className="h-[43px] bg-gray-50">
                                {columns.map((column, colIndex) => (
                                    <th
                                        key={colIndex}
                                        className={`sticky top-0 border bg-gray-50 ${
                                            colIndex === 0
                                                ? 'sticky w-10 border px-4 py-2 pl-4 pr-4 text-center font-medium text-gray-500'
                                                : 'border bg-gray-50 px-4 py-2 text-center font-medium text-gray-500'
                                        }`}
                                        style={{ fontSize: '14px' }}
                                    >
                                        {column.name}
                                    </th>
                                ))}
                                <th className="bg-gray-50"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="border-t">
                                    <td
                                        colSpan="100%"
                                        className="px-4 py-[10px] text-center"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : null}
                            {isError ? (
                                <tr className="border-t">
                                    <td
                                        colSpan="100%"
                                        className="px-4 py-[10px] text-center"
                                    >
                                        Data can not fetch.
                                    </td>
                                </tr>
                            ) : null}
                            {isSuccess &&
                            Array.isArray(costData) &&
                            costData.length > 0
                                ? costData.map((item, index) => (
                                      <tr key={index} className="border-t">
                                          <td
                                              className="w-5 border bg-white px-4 py-2 pl-2 pr-2 text-right"
                                              style={{ fontSize: '12px' }}
                                          >
                                              {index + 1}
                                          </td>
                                          <td
                                              className="w-100 border bg-white px-4 py-2 text-left"
                                              style={{ fontSize: '12px' }}
                                          >
                                              {item.project_name}
                                          </td>
                                          <td
                                              className="w-40 border bg-white px-4 py-2 text-right"
                                              style={{ fontSize: '12px' }}
                                          >
                                              {item?.estimate_cost?.toLocaleString(
                                                  'en-US',
                                              )}
                                          </td>

                                          <td
                                              className="w-40 border bg-white px-4 py-2 text-right"
                                              style={{ fontSize: '12px' }}
                                          >
                                              {item?.actual_cost?.toLocaleString(
                                                  'en-US',
                                              )}
                                          </td>
                                          <td
                                              className="w-40 border bg-white px-4 py-2 text-right"
                                              style={{ fontSize: '12px' }}
                                          >
                                              {calculateProfit(item)}
                                          </td>
                                          <td className="w-10 whitespace-nowrap border px-6 py-1 text-center">
                                              <div className="flex h-full items-center justify-end">
                                                  <Link
                                                      href={`costs/${item?.id}/details`}
                                                  >
                                                      <button className="h-[28px] w-[70px] rounded bg-blue-700 text-white shadow-md shadow-gray-400">
                                                          Details
                                                      </button>
                                                  </Link>
                                              </div>
                                          </td>
                                      </tr>
                                  ))
                                : null}
                            {isSuccess &&
                                Array.isArray(costData) &&
                                costData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="100%"
                                            className="px-4 py-[10px] text-center"
                                        >
                                            <p>No Data</p>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-center">
                {isError && (
                    <ErrorPage message={'cost list'} status={'500'} />
                )}
            </div>
        </div>
    )
}

export default Costs
