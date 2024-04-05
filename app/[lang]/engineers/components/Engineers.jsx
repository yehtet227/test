'use client'

import ErrorPage from '@/app/components/error/ErrorPage'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import FilterIcon from '@/public/icon/filterIcon.svg'
import searchIcon from '@/public/icon/search.svg'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const Engineers = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredAndSearchedEmployees, setFilteredAndSearchedEmployees] =
        useState([])
    const dispatch = useDispatch()
    const [rowFilterData, setRowFilterData] = useState([])
    const [rowFilterValue, setRowFilterValue] = useState([])

    const {
        data: employees,
        isError,
        isLoading,
        isSuccess,
    } = useGetAllEmployees()

    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    const columns = [
        {
            name: 'No.',
            index: 'no',
            width: 'w-14',
        },
        {
            name: 'Employee Number',
            index: 'employeeNumber',
            width: 'w-[170px]',
        },
        {
            name: 'Name',
            index: 'name',
            width: 'w-[270px]',
        },
        {
            name: 'Location',
            index: 'location',
            width: 'w-36',
        },
        {
            name: 'Email',
            index: 'email',
            width: '',
        },
    ]

    const filterLocationData = (employeeData) => {
        const filterData = employeeData.map((employee) => employee.location)
        setRowFilterData([...new Set(filterData)])
    }

    useEffect(() => {
        const employeesInfo =
            employees &&
            employees?.map((employee, index) => {
                const employeeInfo = {
                    no: index + 1,
                    employeeNumber: employee.emp_cd,
                    name: employee.emp_name,
                    location: employee.location,
                    emial: employee.emp_email,
                }
                return employeeInfo
            })
        if (!searchQuery) {
            if (rowFilterValue.length !== 0) {
                const filterLocation = employeesInfo.filter((employee) =>
                    rowFilterValue.includes(employee.location),
                )
                setFilteredAndSearchedEmployees(filterLocation)
            } else {
                setFilteredAndSearchedEmployees(employeesInfo)
            }
        } else {
            const lowerCaseQuery = searchQuery.trim().toLowerCase()
            const searchedData =
                employeesInfo &&
                employeesInfo?.filter((employee) => {
                    return (
                        employee.name?.toLowerCase().includes(lowerCaseQuery) ||
                        employee.employeeNumber
                            ?.toLowerCase()
                            .includes(lowerCaseQuery)
                    )
                })
            if (rowFilterValue.length !== 0) {
                const filterLocation = searchedData.filter((employee) =>
                    rowFilterValue.includes(employee.location),
                )
                setFilteredAndSearchedEmployees(filterLocation)
            } else {
                setFilteredAndSearchedEmployees(searchedData)
            }
        }
        if (employees !== undefined) {
            filterLocationData(employeesInfo)
        }
    }, [employees, searchQuery, rowFilterValue])

    return (
        <div className="flex flex-col text-xs">
            {/* Header area */}
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
                                <Image
                                    src={searchIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </div>
                            <input
                                className="w-full py-2 pl-2 pr-4 focus:outline-none"
                                type="text"
                                placeholder="Search by Employee Number, Name, Location"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setRowFilterValue([])
                                }}
                            />
                        </div>
                    </div>
                </div>
                <hr />
            </div>
            <div
                className={`no-scrollbar max-h-[89vh] ${
                    filteredAndSearchedEmployees?.length >= 10 &&
                    'overflow-x-auto'
                } rounded border-t pb-2`}
            >
                {/* <div className="rounded border-b border-l border-r"> */}
                {/* Table area */}
                <table className="w-[200px] min-w-full table-fixed border-separate border-spacing-0 rounded">
                    <thead className="sticky top-0 z-10 text-sm">
                        <tr className="h-[43px] text-sm">
                            {columns.map((column, colIndex) => (
                                <th
                                    key={colIndex}
                                    className={`sticky top-0 border-b border-l bg-gray-50 px-4 text-center font-medium
                                        text-gray-500
                                        ${columns[colIndex]?.width}
                                        ${
                                            colIndex === columns.length - 1 &&
                                            'border-r'
                                        }  
                                    `}
                                >
                                    {column.name}
                                    <div className="z-1000 absolute bottom-0 right-4 cursor-pointer">
                                        {colIndex === 3 && (
                                            <Menu
                                                as="div"
                                                className="text-left"
                                            >
                                                <div>
                                                    <Menu.Button className="w-full select-none text-sm font-medium text-white focus:outline-none">
                                                        {rowFilterValue.length >
                                                        0 ? (
                                                            <>
                                                                <Image
                                                                    src={
                                                                        FilterIcon
                                                                    }
                                                                    alt="no image"
                                                                    className="relative"
                                                                />
                                                                <span className="absolute left-2 top-[-1px] h-[6px] w-[6px] rounded-lg bg-red-500"></span>
                                                            </>
                                                        ) : (
                                                            <Image
                                                                src={FilterIcon}
                                                                alt="no image"
                                                            />
                                                        )}
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    className="z-100"
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 mt-2 max-h-80 w-auto origin-top-right divide-y divide-gray-100 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <div className="py-1">
                                                            <div className="select-none overflow-x-auto whitespace-nowrap px-3">
                                                                <div className="max-h-160 overflow-y-auto px-1">
                                                                    {rowFilterData?.map(
                                                                        (
                                                                            rowfilteritem,
                                                                            index,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="py-1"
                                                                            >
                                                                                <label className="flex cursor-pointer items-center space-x-2">
                                                                                    <input
                                                                                        checked={rowFilterValue.includes(
                                                                                            rowfilteritem,
                                                                                        )}
                                                                                        onChange={() => {
                                                                                            const updatedValues =
                                                                                                [
                                                                                                    ...rowFilterValue,
                                                                                                ]
                                                                                            if (
                                                                                                updatedValues.includes(
                                                                                                    rowfilteritem,
                                                                                                )
                                                                                            ) {
                                                                                                const index =
                                                                                                    updatedValues.indexOf(
                                                                                                        rowfilteritem,
                                                                                                    )
                                                                                                if (
                                                                                                    index !==
                                                                                                    -1
                                                                                                ) {
                                                                                                    updatedValues.splice(
                                                                                                        index,
                                                                                                        1,
                                                                                                    )
                                                                                                }
                                                                                            } else {
                                                                                                updatedValues.push(
                                                                                                    rowfilteritem,
                                                                                                )
                                                                                            }
                                                                                            setRowFilterValue(
                                                                                                updatedValues,
                                                                                            )
                                                                                        }}
                                                                                        type="checkbox"
                                                                                        className="text-blue-500 focus:ring-blue-200"
                                                                                    />
                                                                                    <span className="text-sm">
                                                                                        {
                                                                                            rowfilteritem
                                                                                        }
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="w-full border-b border-l border-r px-4 py-[10px] text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : null}

                        {isError ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="border-b border-l border-r px-4 py-[10px] text-center"
                                >
                                    Data can not fetch.
                                </td>
                            </tr>
                        ) : null}

                        {isSuccess
                            ? filteredAndSearchedEmployees?.map(
                                  (employee, index) => (
                                      <tr
                                          key={index}
                                          className={`border-t bg-white font-normal `}
                                      >
                                          {columns.map((column, colIndex) => (
                                              <td
                                                  key={colIndex}
                                                  className={`
                                              ${
                                                  (colIndex === 0 ||
                                                      colIndex === 1) &&
                                                  'text-right'
                                              }
    
                                              ${
                                                  colIndex ===
                                                      columns.length - 1 &&
                                                  'border-r'
                                              } 
                                             border-b border-l px-2 py-[10px] text-left`}
                                              >
                                                  {employee[column.index]}
                                              </td>
                                          ))}
                                      </tr>
                                  ),
                              )
                            : null}

                        {filteredAndSearchedEmployees?.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="w-full border-b border-l border-r px-4 py-[10px] text-center"
                                >
                                    <p>No Data</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* </div> */}
            </div>

            {/* Error area */}
            <div className="flex items-center justify-center">
                {isError && (
                    <ErrorPage message={'customer list'} status={'500'} />
                )}
            </div>
        </div>
    )
}

export default Engineers
