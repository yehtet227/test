'use client'

import { useRegister } from '@/app/store/server/features/auth'
import { registerFormSchema } from '@/app/validation-schemas'
import RequireIcon from '@/public/icon/Require.svg'
import { EyeIcon } from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, set, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

const RegisterComponent = () => {
    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [employeeId, setEmployeeId] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const router = useRouter()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerFormSchema),
    })
    const handleUserNameChange = (name) => {}
    const handleUserEmailChange = (email) => {}
    const handleEmployeeIdChange = (employeeId) => {}
    const handlePasswordChange = (password) => {}
    const handleConfirmPasswordChange = (confirmPassword) => {}
    
    const handleRegisterSuccess = (data) => {
        if(data?.status) {
            sessionStorage.setItem('tempEmail', userEmail);
            router.push('/register/confirm-email')
        } else {
            toast.error('User Already Exists.')
        }
    }
    const {mutate: register, isSuccess, isError} = useRegister(handleRegisterSuccess);
    const handleRegister = () => {
        const payload = {
            name: userName,
            email: userEmail,
            employee_id: employeeId,
            password: userPassword,
            confirmPassword: confirmPassword
        }
        register(payload)
    }

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible)
    }

    return (
        <div className="no-scrollbar relative flex flex-col items-center justify-center  text-xs">
            <Toaster />
            {/* Register Form Area */}
            <form
                className="absolute top-12 mb-[50px] w-1/3 rounded-lg border border-gray-200 bg-white px-12 py-6 shadow shadow-slate-300 sm:w-2/3 md:w-1/3"
                onSubmit={handleSubmit(handleRegister)}
            >
                <p className="mb-6 text-sm text-center font-bold">Create new account</p>
                <div className="z-20 mb-5 gap-2">
                    <div className="justify-self-start">
                        <Controller
                            name="userName"
                            control={control}
                            defaultValue={''}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleUserNameChange(e.target.value)
                                        setUserName(e.target.value)
                                    }}
                                    placeholder='Name'
                                    className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                />
                            )}
                        />
                        <span className="text-red-600">
                            {errors.userName && errors.userName?.message}
                        </span>
                    </div>
                </div>
                <div className="z-20 mb-5 gap-2">
                    <div className="justify-self-start">
                        <Controller
                            name="userEmail"
                            control={control}
                            defaultValue={''}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleUserEmailChange(e.target.value)
                                        setUserEmail(e.target.value)
                                    }}
                                    placeholder='Email'
                                    className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                />
                            )}
                        />
                        <span className="text-red-600">
                            {errors.userEmail && errors.userEmail?.message}
                        </span>
                    </div>
                </div>
                <div className="z-20 mb-5 gap-2">
                    <div className="justify-self-start">
                        <Controller
                            name="employeeId"
                            control={control}
                            defaultValue={''}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleEmployeeIdChange(e.target.value)
                                        setEmployeeId(e.target.value)
                                    }}
                                    placeholder='Employee ID'
                                    className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                />
                            )}
                        />
                        <span className="text-red-600">
                            {errors.employeeId && errors.employeeId?.message}
                        </span>
                    </div>
                </div>
                <div className="z-20 mb-5 gap-2">
                    <div className="justify-self-start">
                        <Controller
                            name="userPassword"
                            control={control}
                            defaultValue={''}
                            render={({ field }) => (
                            <div className='relative'>
                                <input
                                    {...field}
                                    type={passwordVisible ? 'text' : 'password'}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handlePasswordChange(e.target.value)
                                        setUserPassword(e.target.value)
                                    }}
                                    placeholder='Password'
                                    className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300 pr-6"
                                />
                                <EyeIcon className='w-[15px] h-[15px] text-gray-400 hover:cursor-pointer cursor-pointer absolute top-1/2 right-2 transform -translate-y-1/2'
                                            onClick={handlePasswordVisibility}
                                        /> 
                            </div>
                            )}
                        />
                        <span className="text-red-600">
                            {errors.userPassword &&
                                errors.userPassword?.message}
                        </span>
                    </div>
                </div>
                <div className="z-20 mb-5 gap-2">
                    <div className="justify-self-start">
                        <Controller
                            name="confirmPassword"
                            control={control}
                            defaultValue={''}
                            render={({ field }) => (
                                <div className='relative'>
                                    <input
                                    {...field}
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        handleConfirmPasswordChange(
                                            e.target.value,
                                        )
                                        setConfirmPassword(e.target.value)
                                    }}
                                    placeholder='Confirm Password'
                                    className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                />
                                <EyeIcon className='w-[15px] h-[15px] text-gray-400 hover:cursor-pointer cursor-pointer absolute top-1/2 right-2 transform -translate-y-1/2'
                                            onClick={handleConfirmPasswordVisibility}
                                        /> 
                                </div>
                            )}
                        />
                        <span className="text-red-600">
                            {errors.confirmPassword &&
                                errors.confirmPassword?.message}
                        </span>
                    </div>
                </div>
                <div className="mt-6 flex w-full items-center justify-center">
                    <button
                        className="h-[30px] w-full rounded-md bg-blue-700 font-semibold text-white shadow-md shadow-gray-400"
                        type="submit"
                    >
                        Create
                    </button>
                </div>
                <div className="mt-6 w-full">
                    <span herf="#" className="mt-6 w-full">
                        Already have an account?&nbsp;
                        <Link
                            href={'/'}
                            className="font-semibold text-[#0E2BBF] underline"
                        >
                            sign in
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    )
}

export default RegisterComponent
