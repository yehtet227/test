'use client'

import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useCreateRole } from '@/app/store/server/features/roles/mutations'
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

const Page = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(roleFormSchema),
    })
    const router = useRouter()
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    const [role, setRole] = useState({
        role_name: '',
    })

    const insertFailToast = () =>
        toast.error('Insert failed!', {
            duration: 1000,
        })

    const { mutate: createRole, isError, isSuccess, data } = useCreateRole()

    const handleRoleNameChange = (roleName) => {
        setRole({
            role_name: roleName,
        })
    }

    useEffect(() => {
        if (isSuccess && data !== undefined && data[0] !== 'error message') {
            router.push(`/roles`)
            setTimeout(() => {
                toast.success('Successfully inserted!')
            }, 1000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            insertFailToast()
        }
    }, [isError])

    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            {isError && <Toaster />}
            {/* Header area */}
            <div className="items my-1 mb-3 flex flex-row items-center py-[2px] text-sm">
                <div className="cursor-pointer" onClick={toggleSideBar}>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                </div>

                <div className="ml-4 flex items-center gap-2 pl-0">
                    <Link href={'/roles'} className="font-medium">
                        Role
                    </Link>

                    <Image
                        src={RightArrow}
                        className=" justify-center"
                        alt="no image"
                    />

                    <Link href="#" className="font-medium">
                        Role Creation
                    </Link>
                </div>
            </div>

            <div
                style={{ border: '1.5px solid #e2e8f0' }}
                className="row-justify-center flex h-[510px] flex-col items-center rounded-md p-4 text-xs"
            >
                <form
                    className="relative top-0 flex w-2/4 flex-col items-center justify-center px-4 "
                    onSubmit={handleSubmit(() => {
                        createRole(role)
                    })}
                >
                    <h4 className="mb-6 text-sm font-medium">Role Creation</h4>
                    <div className="w-full justify-items-stretch">
                        <div className="z-20 mb-6 gap-2">
                            <label
                                htmlFor="year"
                                className="mb-1 flex gap-2 justify-self-start"
                            >
                                Role Name
                                <Image src={RequireIcon} alt="no image" />
                            </label>
                            <div className="justify-self-start">
                                <Controller
                                    name="roleName"
                                    control={control}
                                    defaultValue={''}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            onChange={(e) => {
                                                field.onChange(e)
                                                handleRoleNameChange(
                                                    e.target.value,
                                                )
                                            }}
                                            className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.roleName &&
                                        errors.roleName?.message}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-self-start">
                            <div className="flex gap-2">
                                <button
                                    className="h-[30px] w-[70px] rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                    type="submit"
                                >
                                    Create
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
