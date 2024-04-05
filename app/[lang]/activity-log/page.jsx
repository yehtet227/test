'use client'

import ErrorPage from '@/app/components/error/ErrorPage'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import './ActivityLog.css'
import Link from 'next/link'
import React, { forwardRef, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useGetActivityLog } from '@/app/store/server/features/activity-log'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import searchIcon from '@/public/icon/search.svg'
import Image from 'next/image'

const ActivityLog = () => {
    const [startDate, setStartDate] = useState();
    const [searchQuery, setSearchQuery] = useState('')
    const dispatch = useDispatch()

    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    const {data: activities, isError, isSuccess, refetch} = useGetActivityLog();
    useEffect(() => {
        refetch()
    }, [refetch])

    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        let dataToFilter = activities;
      
        if (startDate) {
          const startDateString = `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${startDate.getUTCDate() + 1}`;
          dataToFilter = dataToFilter.filter(activity => {
            const activityDate = new Date(activity.created_at);
            const activityDateString = `${activityDate.getUTCFullYear()}-${activityDate.getUTCMonth() + 1}-${activityDate.getUTCDate()}`;
            return activityDateString === startDateString;
          });
        }
      
        if (searchQuery) {
          const lowerCaseSearchQuery = searchQuery.toLowerCase();
          dataToFilter = dataToFilter.filter(activity =>
            activity.name.toLowerCase().includes(lowerCaseSearchQuery) ||
            activity.action.toLowerCase().includes(lowerCaseSearchQuery) ||
            activity.description.toLowerCase().includes(lowerCaseSearchQuery)
          );
        }
      
        setFilteredData(dataToFilter);
      }, [activities, startDate, searchQuery]);
      console.log(filteredData)
    const handleStartDate = () => {
        setStartDate('')
    }

    const DateButton = forwardRef(({ value, onClick }, ref) => (
        <button className="bg-gray bg-gray-300 w-[120px] py-2 text-xs rounded-md" onClick={onClick} ref={ref}>
          {value}
        </button>
      ));
      DateButton.displayName = 'DateButton';

    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            <div className="sticky top-0 mb-3 flex flex-col justify-between bg-white z-[1000]">
                <div className="items mb-1 flex flex-row justify-between items-center py-[2px] text-sm">
                <div className="flex w-full flex-row items-center">
                        <div className="cursor-pointer" onClick={toggleSideBar}>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        </div>
                        <div className="flex w-11/12">
                            <div className="pointer-events-none inset-y-0 left-0 flex items-center pl-3">
                                <Image
                                    src={searchIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </div>
                            <input
                                className="w-full py-2 pl-2 pr-4 focus:outline-none"
                                type="text"
                                placeholder="Search by Name, Action Type, and Description"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className='flex justify-end'>
                        <div className='flex gap-2'>
                            <div className='mr-8'>
                            <button className='bg-gray bg-gray-300 w-[80px] py-2 text-xs rounded-md' onClick={handleStartDate}>Reset</button>
                            </div>
                        <div>
                        <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className='w-[120px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                        popperPlacement='bottom-start'
                        customInput={startDate ? <DateButton /> : <button className='bg-gray bg-gray-300 w-[120px] py-2 rounded-md'>yyyy / mm / dd</button>}
                        dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                        />
                        </div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
            <hr className="font-bold" />

            <div>
                <div className="table-container overflow-x-auto">
                    {/* <table className=" w-[200px] border-collapse divide-y divide-gray-200 border"> */}
                    <table className="min-w-full border-collapse divide-y divide-gray-200 border">
                        <thead className="text bg-gray-100 text-sm">
                        <tr>
                                <th className="font-medium whitespace-nowrap border px-6 py-2 pr-4 pl-4 text-center text-gray-500" style={{ width: '20px' }}>
                                    No.
                                </th>
                                <th className="font-medium whitespace-nowrap border px-6 py-2 text-center text-gray-500" style={{ width: '240px' }}>
                                    Name
                                </th>
                                <th className="whitespace-nowrap border px-6 py-2 pr-5 pl-5 text-center font-medium text-gray-500" style={{ width: '100px' }}>
                                    Time
                                </th>
                                <th className="whitespace-nowrap border px-6 py-1 pr-5 pl-5 text-center font-medium text-gray-500" style={{ width: '100px' }}>
                                    Action Type
                                </th>
                                <th className="whitespace-nowrap border px-6 py-2 text-center font-medium text-gray-500" style={{ width: '740px' }}>
                                    Description
                                </th>                          
                            </tr> 
                            
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredData?.length > 0 ? 
                            (filteredData?.map((activity, index) => (
                                <tr key={activity.id}>
                                    <td className="whitespace-nowrap border px-6 py-2 pl-3 pr-3 text-right text-md">
                                        {index + 1}
                                    </td>
                                    <td
                                        className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-left text-md"
                                        style={{ width: '200px' }}
                                    >
                                        {activity.name}
                                    </td>
                                    <td
                                        className="whitespace-nowrap border px-6 py-2 pl-3 pr-3 text-left text-md"
                                        style={{ width: '100px' }}
                                    >
                                            {new Date(activity.created_at).toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td
                                        className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-left text-md"
                                        style={{ width: '100px' }}
                                    >
                                        {activity.action}
                                    </td>
                                    <td
                                        className="whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-left"
                                        style={{ width: '200px' }}
                                    >
                                        {activity.description}
                                    </td>
                                    
                                </tr>
                            ))) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        Data not found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ActivityLog
