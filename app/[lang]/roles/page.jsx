'use client'

import ErrorPage from '@/app/components/error/ErrorPage'
import DeleteConfirmModal from '@/app/components/modal/DeleteConfirmModal'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import { useDeleteRole } from '@/app/store/server/features/roles/mutations'
import addIcon from '@/public/icon/add.svg'
import searchIcon from '@/public/icon/search.svg'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const Page = () => {
    const [roles, setRoles] = useState([])
    const [allRoles, setAllRoles] = useState([])
    const [deleteRow, setDeleteRow] = useState({
        id: '',
        name: '',
    })
    const [isOpenModal, setIsOpenModal] = useState(false)
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    //Set table columns
    const columns = [
        {
            name: 'No.',
            index: 'no',
            width: 'w-12',
        },
        {
            name: 'Role',
            index: 'role',
            width: '',
        },
    ]

    const deleteSuccessToast = () =>
        toast.success('Successfully deleted!', {
            duration: 1000,
        })

    const deleteFailToast = () =>
        toast.error('Delete failed!', {
            duration: 1000,
        })

    const { data, isLoading, isError, isSuccess } = useGetAllRoles()

    const {
        mutate: deleteRoleHandler,
        isError: deleteError,
        isSuccess: isDeleted,
    } = useDeleteRole(deleteRow.id)

    const searchRole = (searchValue) => {
        const searchTerm = searchValue.trim().toLowerCase()
        if (searchTerm !== '') {
            const filtered = allRoles.filter((record) =>
                record.role.toLowerCase().includes(searchTerm),
            )
            setRoles(filtered)
        } else {
            setRoles(allRoles)
        }
    }

    useEffect(() => {
        if (data === undefined) {
            return
        }
        const rolesInfo =
            isSuccess &&
            data?.map((r, index) => {
                const role = {
                    no: index + 1,
                    id: r.id,
                    role: r.role_name,
                }
                return role
            })
        setRoles(rolesInfo)
        setAllRoles(rolesInfo)
    }, [data, isSuccess])

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
                                placeholder="Search by Role"
                                className="w-full py-2 pl-2 pr-4 focus:outline-none"
                                onChange={(e) => {
                                    searchRole(e.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div className="w-35">
                        <Link href="/roles/assign">
                            <div className="ml-3">
                                <div>
                                    <button className="inline-flex h-[30px] w-[60px] items-center justify-center gap-1 rounded-md bg-blue-700  py-2 font-medium  text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
                className={`no-scrollbar max-h-[89vh] w-[701px] overflow-auto rounded border-t pb-2`}
            >
                {/* Table area */}
                <table className="w-[700px] table-auto border-separate border-spacing-0 rounded">
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
                                className={`sticky top-0 w-[195px] border-b border-l border-r bg-gray-50 font-medium  text-gray-500
                                   `}
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
                        {isSuccess && roles.length === 0 && (
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
                            roles.length > 0 &&
                            roles.map((item, index) => (
                                <tr key={index} className="border-t">
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`${
                                                colIndex === 0 &&
                                                'w-12 text-right'
                                            } 
                                            border-b border-l bg-white px-2 py-[10px] text-left`}
                                        >
                                            {item[column.index]}
                                        </td>
                                    ))}
                                    <td
                                        className={`w-[201px] whitespace-nowrap border-b border-l border-r py-1 text-center`}
                                    >
                                        <div className="flex h-full items-center justify-center">
                                            <Link
                                                href={{
                                                    pathname: `roles/${item.id}/edit`,
                                                }}
                                            >
                                                <button className="mr-2 h-[28px] w-[70px] rounded bg-blue-700 text-center text-white shadow-md  shadow-gray-400">
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                className="h-[28px] w-[70px] rounded bg-red-700 text-center text-white shadow-md shadow-gray-400"
                                                onClick={() => {
                                                    setIsOpenModal(true)
                                                    setDeleteRow({
                                                        id: item.id,
                                                        name: item.role,
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
            <div>
                {isError && <ErrorPage message={'role list'} status={'500'} />}
            </div>

            {/* call delete confirm modal */}
            {isOpenModal && (
                <DeleteConfirmModal
                    isOpen={isOpenModal}
                    setIsOpen={setIsOpenModal}
                    onDeleteHandler={deleteRoleHandler}
                    isError={deleteError}
                    deleteData={deleteRow}
                />
            )}
        </div>
    )
}

export default Page
