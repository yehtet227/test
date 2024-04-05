'use client'

import SearchDropDown from '@/app/components/dropdown/SearchDropDown'
import {
    clearDepartmentCreateInfoState,
    setAllDeptInfo,
    setDeptHead,
    setDeptName,
    setMarketingName,
} from '@/app/store/client/features/department_create/departmentCreateInfoSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllEmployees } from '@/app/store/server/features/departments'
import { useUpdateDepartment } from '@/app/store/server/features/departments/mutations'
import { departmentEditFormSchema } from '@/app/validation-schemas'
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

const MainEditForm = ({ existingDepartment }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(departmentEditFormSchema),
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

    const updateFailToast = () =>
        toast.error('Update failed!', {
            duration: 2000,
        })

    const { data: allEmployees, isError } = useGetAllEmployees()

    const newDepartment = {
        department_name: departmentCreateInfoState?.deptName,
        department_head: departmentCreateInfoState?.deptHead,
        marketing_name: departmentCreateInfoState?.marketingName,
    }

    const {
        mutate: updateDepartment,
        data,
        isError: updateError,
        isSuccess,
    } = useUpdateDepartment()

    const onSubmit = async () => {
        await updateDepartment({
            body: newDepartment,
            id: existingDepartment.id,
        })
    }

    const handleDeptNameChange = (departmentName) => {
        dispatch(setDeptName(departmentName))
    }
    const handleLeaderChange = (leaderId) => {
        dispatch(setDeptHead(leaderId))
    }
    const handleMarketingNameChange = (marketingId) => {
        dispatch(setMarketingName(marketingId))
    }

    useEffect(() => {
        if (!isError) {
            const employeesInfo = allEmployees?.map((employee) => {
                return {
                    id: employee.emp_cd.toString(),
                    name: employee.emp_name,
                }
            })
            setDeptLeaders(employeesInfo)
        }
    }, [isError, allEmployees])

    useEffect(() => {
        if (isSuccess && data !== undefined && data[0] !== 'error message') {
            router.push(`/departments`)
            setTimeout(() => {
                toast.success('Successfully updated!')
            }, 2000)
        }
        if (updateError) {
            updateFailToast()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, updateError])

    useEffect(() => {
        dispatch(clearDepartmentCreateInfoState())
        if (existingDepartment !== undefined) {
            dispatch(
                setAllDeptInfo({
                    deptName: existingDepartment.department_name,
                    deptHead: existingDepartment.department_head,
                    marketingName: existingDepartment.marketing_name,
                }),
            )
            setValue('departmentName', existingDepartment.department_name)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingDepartment])

    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            {updateError && <Toaster />}
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
                        Department Edition
                    </Link>
                </div>
            </div>
            <div
                className="flex h-[510px] flex-col items-center rounded-md p-4 text-xs"
                style={{ border: '1.5px solid #e2e8f0' }}
            >
                <form
                    className="relative top-0 flex w-2/4 flex-col items-center justify-center px-4 "
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h4 className="mb-6 text-sm font-medium">
                        Department Edition
                    </h4>
                    <div className="w-full justify-items-stretch">
                        <div className="z-20 mb-5">
                            <label
                                htmlFor="year"
                                className="mb-1 flex justify-items-start gap-2"
                            >
                                Department Name{' '}
                                <Image
                                    src={RequireIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </label>
                            <div className="justify-items-start">
                                <Controller
                                    name="departmentName"
                                    control={control}
                                    defaultValue={
                                        '' ||
                                        departmentCreateInfoState?.deptName
                                    }
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                field.onChange(e)
                                                handleDeptNameChange(
                                                    e.target.value,
                                                )
                                            }}
                                            value={
                                                '' ||
                                                departmentCreateInfoState?.deptName
                                            }
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

                        <div className="z-40 mb-5">
                            <label
                                htmlFor="year"
                                className="mb-1 flex justify-items-start gap-2"
                            >
                                Leader Name
                                <Image
                                    src={RequireIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </label>
                            <div className="justify-items-start">
                                <Controller
                                    name="department_head"
                                    control={control}
                                    render={({}) => (
                                        <SearchDropDown
                                            options={deptLeaders}
                                            initialValue={
                                                departmentCreateInfoState?.deptHead ===
                                                undefined
                                                    ? ''
                                                    : departmentCreateInfoState?.deptHead
                                            }
                                            onSelect={(option) => {
                                                handleLeaderChange(option.id)
                                            }}
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.department_head &&
                                        errors.department_head.message}
                                </span>
                            </div>
                        </div>

                        <div className="z-28 mb-7">
                            <label
                                htmlFor="year"
                                className="mb-1 flex justify-items-start gap-2"
                            >
                                Marketing Name
                                <Image
                                    src={RequireIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </label>
                            <div className="justify-items-start">
                                <Controller
                                    name="marketing_name"
                                    control={control}
                                    render={({}) => (
                                        <SearchDropDown
                                            options={deptLeaders}
                                            initialValue={
                                                departmentCreateInfoState?.marketingName ===
                                                undefined
                                                    ? ''
                                                    : departmentCreateInfoState?.marketingName
                                            }
                                            onSelect={(option) => {
                                                handleMarketingNameChange(
                                                    option.id,
                                                )
                                            }}
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.marketing_name &&
                                        errors.marketing_name.message}
                                </span>
                            </div>
                        </div>

                        <div className=" mb-2 justify-items-start">
                            <div className="w-1/3"></div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="h-[30px] w-[70px] rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                >
                                    Update
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

export default MainEditForm
