'use client'

import ErrorPage from '@/app/components/error/ErrorPage'
import DeleteConfirmModal from '@/app/components/modal/DeleteConfirmModal'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllDepartments } from '@/app/store/server/features/departments'
import { useDeleteDepartment } from '@/app/store/server/features/departments/mutations'
import addIcon from '@/public/icon/add.svg'
import searchIcon from '@/public/icon/search.svg'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const Page = () => {
    const [departments, setDepartments] = useState([])
    const [allDepartments, setAllDepartments] = useState([])
    const [deleteDept, setDeleteDept] = useState({
        id: '',
        name: '',
    })
    const [isOpenModal, setIsOpenModal] = useState(false)
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
            name: 'Department Name',
            index: 'deptName',
            width: '',
        },
        {
            name: 'Leader Name',
            index: 'leaderName',
            width: 'w-[230px]',
        },
        {
            name: 'Marketing Name',
            index: 'marketingName',
            width: 'w-[230px]',
        },
    ]

    // toast for delete success
    const deleteSuccessToast = () =>
        toast.success('Successfully deleted!', {
            duration: 3000, // Set the duration to 3000 milliseconds (3 seconds)
        })

    // toast for delete fail
    const deleteFailToast = () =>
        toast.error('Delete failed!', {
            duration: 3000, // Set the duration to 3000 milliseconds (3 seconds)
        })

    // call getAll department api
    const { data, isLoading, isError, isSuccess } = useGetAllDepartments()

    // call delete api
    const {
        mutate: deleteDepartment,
        isError: deleteError,
        isSuccess: isDeleted,
    } = useDeleteDepartment(deleteDept.id)

    // search data by input data
    const searchDepartment = (searchValue) => {
        const searchTerm = searchValue.trim().toLowerCase() // Convert the input to lowercase
        if (searchTerm !== '') {
            const filtered = allDepartments.filter((record) =>
                record.deptName.toLowerCase().includes(searchTerm),
            )
            setDepartments(filtered)
        } else {
            setDepartments(allDepartments)
        }
    }

    const deleteDepartmentHandler = () => {
        deleteDepartment()
        const remainDepartment = [...departments]
        setDepartments(
            remainDepartment.filter(
                (department) => department.id !== deleteDept.id,
            ),
        )
    }

    // set data return from getAll api
    useEffect(() => {
        if (data?.length === undefined) {
            return
        }
        const DepartmentsInfo =
            isSuccess &&
            data?.map((dept, index) => {
                const departmentInfo = {
                    no: index + 1,
                    id: dept.id,
                    deptName: dept.department_name,
                    deptHead: dept.department_head,
                    leaderName: dept.leader,
                    marketingName: dept.marketing,
                }
                return departmentInfo
            })
        setAllDepartments(DepartmentsInfo)
        setDepartments(DepartmentsInfo)
    }, [data, isSuccess])

    // close delete confirm box and show toast message
    useEffect(() => {
        if (isDeleted) {
            setIsOpenModal(false)
            deleteSuccessToast()
        }
        if (deleteError) {
            setIsOpenModal(false)
            deleteFailToast()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDeleted, deleteError])

    return (
        <div className="flex flex-col text-xs" suppressHydrationWarning>
            <Toaster />
            {/* Header area */}
            <div className="sticky top-0 mb-3 flex flex-col justify-between bg-white">
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
                                placeholder="Search by Department Name"
                                className="w-full py-2 pl-2 pr-4  focus:outline-none"
                                onChange={(e) => {
                                    searchDepartment(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="w-35">
                        <Link href="/departments/assign">
                            <div className="ml-3">
                                <div>
                                    <button className="inline-flex h-[30px] w-[60px] items-center justify-center gap-1 rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                        <Image
                                            src={addIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                        Add
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <hr />
            </div>

            <div
                className={`no-scrollbar max-h-[89vh] overflow-auto rounded border-t pb-2`}
            >
                {/* Table area */}
                <table className="w-[200px] min-w-full table-auto border-separate border-spacing-0 rounded">
                    <thead className="text-sm">
                        <tr className="h-[43px]">
                            {columns.map((column, colIndex) => (
                                <th
                                    key={colIndex}
                                    className={`sticky top-0 border-b border-l bg-gray-50 px-4
                                    ${columns[colIndex]?.width}
                                    font-medium text-gray-500`}
                                >
                                    {column.name}
                                </th>
                            ))}
                            <th
                                className={`sticky top-0 w-[200px] border-b border-l border-r bg-gray-50
                                    font-medium text-gray-500`}
                            ></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td
                                    colSpan="100%"
                                    className="border-b border-l border-r px-4 py-[10px] text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        )}
                        {isError && (
                            <tr>
                                <td
                                    colSpan="100%"
                                    className="text border-b border-l border-r px-4 py-[10px] text-center"
                                >
                                    Data can not fetch.
                                </td>
                            </tr>
                        )}
                        {isSuccess && departments.length === 0 && (
                            <tr>
                                <td
                                    colSpan="100%"
                                    className="border-b border-l border-r px-4 py-[10px] text-left"
                                >
                                    <p className="text-center">No Data</p>
                                </td>
                            </tr>
                        )}
                        {isSuccess &&
                            departments.length > 0 &&
                            departments.map((item, index) => (
                                <tr key={index} className="border-t">
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`${
                                                colIndex === 0 && 'text-right'
                                            } 
                                            border-b border-l bg-white px-2 py-[10px] text-left`}
                                        >
                                            {item[column.index]}
                                        </td>
                                    ))}
                                    <td
                                        className={`whitespace-nowrap border-b border-l border-r py-1 text-center`}
                                    >
                                        <div className="flex h-full items-center justify-center">
                                            <Link
                                                href={{
                                                    pathname: `departments/${item.id}/edit`,
                                                }}
                                            >
                                                <button className="mr-2 h-[28px] w-[70px] rounded bg-blue-700 text-center text-white shadow-md shadow-gray-400">
                                                    Edit
                                                </button>
                                            </Link>

                                            <button
                                                className="h-[28px] w-[70px] rounded bg-red-700 text-center text-white shadow-md shadow-gray-400"
                                                onClick={() => {
                                                    setIsOpenModal(true)
                                                    setDeleteDept({
                                                        id: item.id,
                                                        name: item.deptName,
                                                    })
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Error area */}
            <div className="flex items-center justify-center">
                {isError && (
                    <ErrorPage message={'department list'} status={'500'} />
                )}
            </div>

            {/* call delete comfirm modal */}
            {isOpenModal && (
                <DeleteConfirmModal
                    isOpen={isOpenModal}
                    setIsOpen={setIsOpenModal}
                    onDeleteHandler={deleteDepartmentHandler}
                    isError={deleteError}
                    deleteData={deleteDept}
                />
            )}
        </div>
    )
}

export default Page
