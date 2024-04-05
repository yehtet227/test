'use client'

import ErrorPage from '@/app/components/error/ErrorPage'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllCustomers } from '@/app/store/server/features/customers'
import searchIcon from '@/public/icon/search.svg'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const Page = () => {
    const [customers, setCustomers] = useState([])
    const [allCustomers, setAllCustomers] = useState([])
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    // set table columns
    const columns = [
        {
            name: 'No.',
            index: 'no',
            width: 'w-12',
        },
        {
            name: 'Customer Name',
            index: 'customerName',
            width: 'w-[300px]',
        },
        {
            name: 'Customer Code',
            index: 'customerCode',
            width: 'w-[140px]',
        },
        {
            name: 'Email',
            index: 'email',
            width: 'w-36',
        },
        {
            name: 'Phone No',
            index: 'phNo',
            width: 'w-28',
        },
        {
            name: 'Address',
            index: 'address',
            width: '',
        },
    ]

    // call getAll customers api
    const {
        data: customerData,
        isSuccess,
        isLoading,
        isError,
    } = useGetAllCustomers()

    // search data by input data
    const searchCustomerData = (searchValue) => {
        const searchTerm = searchValue.trim().toLowerCase()
        if (searchTerm !== '') {
            const filtered = allCustomers.filter(
                (record) =>
                    record.customerCode.toLowerCase().includes(searchTerm) ||
                    (record.customerName !== null &&
                        record.customerName
                            .toLowerCase()
                            .includes(searchTerm)) ||
                    (record.address !== null &&
                        record.address
                            .toLowerCase()
                            .replace('\r\n', ' ')
                            .includes(searchTerm)),
            )
            setCustomers(filtered)
        } else {
            setCustomers(allCustomers)
        }
    }

    // set customer data return from api
    useEffect(() => {
        const customersInfo =
            isSuccess &&
            customerData?.map((customer, index) => {
                return {
                    no: index + 1,
                    customerCode: customer.customer_cd,
                    customerName: customer.customer_name,
                    email: customer.email,
                    address: customer.address,
                    phNo: customer.phone,
                }
            })
        setCustomers(customersInfo)
        setAllCustomers(customersInfo)
    }, [customerData, isSuccess])

    return (
        <div className="flex flex-col text-xs">
            {/* Header area */}
            <div className="sticky top-0 z-50 mb-3 flex flex-col justify-between bg-white">
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
                                type="text"
                                placeholder="Search by Customer Name, Customer Code, Address"
                                className="w-full py-2 pl-2 pr-4 focus:outline-none"
                                onChange={(e) => {
                                    searchCustomerData(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                </div>
                <hr />
            </div>

            <div
                className={`no-scrollbar max-h-[89vh] overflow-auto rounded border-t pb-2`}
            >
                {/* Table area */}
                <table className="w-[200px] min-w-full table-auto border-separate border-spacing-0 rounded">
                    <thead>
                        <tr className="h-[43px] text-sm">
                            {columns.map((column, colIndex) => (
                                <th
                                    key={colIndex}
                                    className={`sticky top-0 border-b border-l bg-gray-50 px-4 font-medium text-gray-500
                                        ${
                                            columns[colIndex]?.width
                                        }                                  
                                        ${
                                            colIndex === columns.length - 1 &&
                                            'border-r'
                                        } 
                                      `}
                                >
                                    {column.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan="100%"
                                    className="border-b border-l border-r px-4 py-[10px] text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : null}
                        {isError ? (
                            <tr>
                                <td
                                    colSpan="100%"
                                    className="border-b border-l border-r px-4 py-[10px] text-center"
                                >
                                    Data can not fetch.
                                </td>
                            </tr>
                        ) : null}
                        {isSuccess && customers.length === 0 && (
                            <tr>
                                <td
                                    colSpan="100%"
                                    className="border-b border-l border-r px-4 py-[10px] text-left"
                                >
                                    <p className="text-center">No Data</p>
                                </td>
                            </tr>
                        )}
                        {isSuccess && customers.length > 0
                            ? customers?.map((customer, index) => (
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
                                                      colIndex === 2 ||
                                                      colIndex === 4) &&
                                                  'text-right'
                                              }
                                              ${
                                                  colIndex ===
                                                      columns.length - 1 &&
                                                  'border-r'
                                              }
                                              border-b border-l px-2 py-[10px] text-left`}
                                          >
                                              {customer[column.index]}
                                          </td>
                                      ))}
                                  </tr>
                              ))
                            : null}
                    </tbody>
                </table>
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

export default Page
