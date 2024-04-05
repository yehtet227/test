'use client'

import SearchDropDown from '@/app/components/dropdown/SearchDropDown'
import {
    clearDepartmentCreateInfoState,
    setDeptHead,
    setDeptName,
    setMarketingName,
} from '@/app/store/client/features/department_create/departmentCreateInfoSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllEmployees } from '@/app/store/server/features/departments'
import { useCreateDepartment } from '@/app/store/server/features/departments/mutations'
import { departmentCreateFormSchema } from '@/app/validation-schemas'
import RequireIcon from '@/public/icon/Require.svg'
import RightArrow from '@/public/right-arrow.svg'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

const MainForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(departmentCreateFormSchema),
    })
    const [deptLeaders, setDeptLeaders] = useState([])
    const dispatch = useDispatch()
    const router = useRouter()

    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    const departmentCreateInfoState = useSelector(
        (state) => state.departmentCreateInfo,
    )

    // toast for insert fail
    const insertFailToast = () =>
        toast.error('Insert failed!', {
            duration: 2000, // Set the duration to 3000 milliseconds (2 seconds)
        })

    // call get all employee api
    const { data: allEmployees, isError } = useGetAllEmployees()

    // create department object
    const newDepartment = {
        department_name: departmentCreateInfoState?.deptName,
        department_head: departmentCreateInfoState?.deptHead,
        marketing_name: departmentCreateInfoState?.marketingName,
    }

    // call insert api
    const {
        mutate: createDepartment,
        data,
        isSuccess,
        isError: insertError,
    } = useCreateDepartment()

    const onSubmit = () => {
        createDepartment(newDepartment)
    }

    // Set the input data to the State variable.
    const handleDeptNameChange = (departmentName) => {
        dispatch(setDeptName(departmentName))
    }
    const handleLeaderChange = (leaderId) => {
        dispatch(setDeptHead(leaderId))
    }
    const handleMarketingNameChange = (maketingId) => {
        dispatch(setMarketingName(maketingId))
    }

    // set employee data for dropdown
    useEffect(() => {
        if (!isError) {
            const employeesInfo = allEmployees?.map((employee) => {
                const employeeInfo = {
                    id: employee.emp_cd.toString(),
                    name: employee.emp_name,
                }
                return employeeInfo
            })
            setDeptLeaders(employeesInfo)
        }
    }, [isError, allEmployees])

    // show toast message when insert is success
    useEffect(() => {
        if (isSuccess && data !== undefined && data[0] !== 'error message') {
            router.push(`/departments`)
            setTimeout(() => {
                toast.success('Successfully inserted!')
            }, 2000)
        }
        if (insertError) {
            insertFailToast()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, insertError])

    useEffect(() => {
        dispatch(clearDepartmentCreateInfoState())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            {insertError && <Toaster />}
            {/* Header area */}
            <div className="items my-1 mb-3 flex flex-row items-center py-[2px]">
                <div className="cursor-pointer" onClick={toggleSideBar}>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                </div>

                <div className="ml-4 flex items-center gap-2 pl-0 text-sm">
                    <Link href={'/departments'} className="font-medium">
                        Department
                    </Link>

                    <Image
                        src={RightArrow}
                        className=" justify-center"
                        alt="no image"
                    />

                    <Link href="#" className="font-medium">
                        Deparment Creation
                    </Link>
                </div>
            </div>

            {/* Form area */}
            <div
                className="flex h-[510px] flex-col items-center rounded-md p-4 text-xs"
                style={{ border: '1.5px solid #e2e8f0' }}
            >
                <form
                    className="relative top-0 flex w-2/4 flex-col items-center justify-center px-4 "
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {/* Title area */}
                    <h4 className="mb-6 text-sm font-medium">
                        Department Creation
                    </h4>
                    <div className="w-full justify-items-stretch">
                        {/* Department Name area */}
                        <div className="z-20 mb-5">
                            <label
                                htmlFor="year"
                                className="mb-1 flex gap-2 justify-self-start"
                            >
                                Department Name
                                <Image
                                    src={RequireIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </label>
                            <div className="justify-self-start">
                                <Controller
                                    name="departmentName"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            onChange={(e) => {
                                                field.onChange(e)
                                                handleDeptNameChange(
                                                    e.target.value,
                                                )
                                            }}
                                            className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.departmentName &&
                                        errors.departmentName.message}
                                </span>
                            </div>
                        </div>

                        {/* Leader Name area */}
                        <div className="z-40 mb-5">
                            <label
                                htmlFor="year"
                                className="mb-1 flex items-center gap-2"
                            >
                                Leader Name
                                <Image
                                    src={RequireIcon}
                                    className="justify-self-start"
                                    alt="no image"
                                />
                            </label>
                            <div className="justify-self-start">
                                <Controller
                                    name="departmentHead"
                                    control={control}
                                    render={({ field }) => (
                                        <SearchDropDown
                                            initialValue={field.id}
                                            options={deptLeaders}
                                            onSelect={(option) => {
                                                field.onChange(option.id)
                                                handleLeaderChange(option.id)
                                            }}
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.departmentHead &&
                                        errors.departmentHead.message}
                                </span>
                            </div>
                        </div>

                        {/* Marketing name area */}
                        <div className="z-28 mb-7">
                            <label
                                htmlFor="year"
                                className="mb-1 flex gap-2 justify-self-start"
                            >
                                Marketing Name
                                <Image
                                    src={RequireIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </label>
                            <div className="justify-self-start">
                                <Controller
                                    name="marketingName"
                                    control={control}
                                    render={({ field }) => (
                                        <SearchDropDown
                                            initialValue={field.id}
                                            options={deptLeaders}
                                            onSelect={(option) => {
                                                field.onChange(option.id)
                                                handleMarketingNameChange(
                                                    option.id,
                                                )
                                            }}
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.marketingName &&
                                        errors.marketingName.message}
                                </span>
                            </div>
                        </div>

                        {/* Button area */}
                        <div className=" mb-2 flex flex-row justify-self-start">
                            <div className="flex gap-2">
                                <button
                                    className="h-[30px] w-[70px] rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                    type="submit"
                                >
                                    Create
                                </button>

                                <Link href={'/departments'}>
                                    <button
                                        type="button"
                                        className="h-[30px] w-[70px] rounded-md bg-red-700 text-white shadow-md shadow-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MainForm
