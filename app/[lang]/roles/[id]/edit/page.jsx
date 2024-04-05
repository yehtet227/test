'use client'

import { useGetRole } from '@/app/store/server/features/roles'
import { useUpdateRole } from '@/app/store/server/features/roles/mutations'
import { roleFormSchema } from '@/app/validation-schemas'
import RequireIcon from '@/public/icon/Require.svg'
import RightArrow from '@/public/right-arrow.svg'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const Page = ({ params }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(roleFormSchema),
    })

    const { data: roleData, isSuccess } = useGetRole(params.id)
    const router = useRouter()
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    const [role, setRole] = useState({
        role_name: '',
    })

    const updateFailToast = () =>
        toast.error('Update failed!', {
            duration: 1000,
        })

    const {
        mutate: updateRole,
        isError,
        isSuccess: updateSuccess,
        data,
    } = useUpdateRole()

    const handleUpdate = async (updateRoleData) => {
        await updateRole({
            body: { role_name: updateRoleData.role_name },
            id: params.id,
        })
    }

    const handleRoleNameChange = (roleName) => {
        setRole({
            role_name: roleName,
        })
    }

    useEffect(() => {
        if (isSuccess && roleData) {
            setRole({
                role_name: roleData?.role_name,
            })
            setValue('roleName', roleData?.role_name)
        }
    }, [isSuccess, roleData, setValue])

    useEffect(() => {
        if (
            updateSuccess &&
            data !== undefined &&
            data[0] !== 'error message'
        ) {
            router.push(`/roles`)
            setTimeout(() => {
                toast.success('Successfully updated!')
            }, 1000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateSuccess])

    useEffect(() => {
        if (isError) {
            updateFailToast()
        }
    }, [isError])

    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            {isError && <Toaster />}
            {/* Header area */}
            <div className="items my-1 mb-3 flex flex-row items-center py-[2px]">
                <div className="cursor-pointer" onClick={toggleSideBar}>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                </div>

                <div className="ml-4 flex items-center gap-2 pl-0 text-sm">
                    <Link href={'/roles'} className="font-medium">
                        Role
                    </Link>

                    <Image
                        src={RightArrow}
                        className=" justify-center"
                        alt="no image"
                    />

                    <Link href="#" className="font-medium">
                        Role Edition
                    </Link>
                </div>
            </div>
            <div
                style={{ border: '1.5px solid #e2e8f0' }}
                className="row-justify-center flex h-[510px] flex-col items-center rounded-md p-4 text-xs"
            >
                <form
                    className="relative top-0 flex w-2/4 flex-col items-center justify-center px-4"
                    onSubmit={handleSubmit(() => {
                        handleUpdate(role)
                    })}
                >
                    <h4 className="mb-5 text-sm font-medium">Update Role</h4>
                    <div className="w-full justify-items-stretch">
                        <div className="z-20 mb-6 gap-2">
                            <label
                                htmlFor="year"
                                className="mb-1 flex gap-2 justify-self-start"
                            >
                                Role Name
                                <Image
                                    src={RequireIcon}
                                    className=" justify-center"
                                    alt="no image"
                                />
                            </label>
                            <div className="justify-self-start">
                                <Controller
                                    name="roleName"
                                    control={control}
                                    defaultValue={'' || role?.role_name}
                                    render={({ field }) => (
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                field.onChange(e)
                                                handleRoleNameChange(
                                                    e.target.value,
                                                )
                                            }}
                                            value={'' || role?.role_name}
                                            className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.roleName && errors.roleName.message}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-self-start">
                            <div className="flex gap-2">
                                <button
                                    className="h-[30px] w-[70px] rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                    type="submit"
                                >
                                    Update
                                </button>

                                <Link href={'/roles'}>
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

export default Page
