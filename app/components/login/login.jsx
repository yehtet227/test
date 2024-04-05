'use client'

import { setUserEmail } from '@/app/store/client/features/email/email'
import { useLogin } from '@/app/store/server/features/auth'
import { loginFormSchema } from '@/app/validation-schemas'
import RequireIcon from '@/public/icon/Require.svg'
import { EyeIcon } from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const LoginComponent = () => {
    const [userEmail, setEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginFormSchema),
    })

    const queryParams = useSearchParams();
    const verificationSuccess = queryParams.get('verification')


    const handleUserEmailChange = (userId) => {}

    const handleUserPasswordChange = (password) => {}
    const handleLoginSuccess = (data) => {
        if(data?.token) {
            dispatch(setUserEmail(data?.user?.email))
            router.push('/home')
        } else {
            toast.error(data?.message)
        }
    }
    const {mutate: login, isSuccess, isError} = useLogin(handleLoginSuccess);
    const handleLogin = () => {
        const payload = {
            email: userEmail,
            password: userPassword
        }
        login(payload)
    }

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center text-xs">
            <Toaster />
            {verificationSuccess && 
            <div className='w-2/3 mb-3 h-auto rounded-lg border border-gray-200 bg-green bg-green-300 shadow shadow-slate-300 sm:w-2/3 md:w-1/3'>
                <p className='mb-text-sm text-center font-bold p-3'>You have successfully verified your email. Now you can log in to your account.</p>
            </div>
            }
            {/* Login Form Area */}
            <div className="relative h-[350px] w-1/3 rounded-lg border border-gray-200 bg-white shadow shadow-slate-300 sm:w-2/3 md:w-1/3">
                <form
                    className="absolute top-10 w-full px-12"
                    onSubmit={handleSubmit(handleLogin)}
                >
                    <p className="mb-5 text-sm text-center font-bold">
                        Sign in to your account
                    </p>
                    <div className="mb-4 gap-2"> 
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
                                            handleUserEmailChange(
                                                e.target.value,
                                            )
                                            setEmail(e.target.value)
                                        }}
                                        className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                        placeholder='Email or ID'
                                    />
                                )}
                            />
                            <span className="text-red-600">
                                {errors.userEmail && errors.userEmail?.message}
                            </span>
                        </div>
                    </div>
                    <div className="mb-4 gap-2">
                        <div className="justify-self-start">
                            <Controller
                                name="userPassword"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <div className="relative">
                                        <input
                                            {...field}
                                            type={passwordVisible ? 'text' : 'password'}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                handleUserPasswordChange(
                                                    e.target.value,
                                                )
                                                setUserPassword(
                                                    e.target.value,
                                                )
                                            }}
                                            className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300 pr-6"
                                            placeholder='Password'
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
                    <div className="mt-6 w-full">
                        <Link
                            href={'/reset'}
                            className="mt-6 w-full font-semibold text-[#0E2BBF] underline"
                        >
                            Forgot Password
                        </Link>
                    </div>
                    <div className="mt-6 flex w-full items-center justify-center">
                        <button
                            className="h-[30px] w-full rounded-md bg-blue-700 font-semibold text-white shadow-md shadow-gray-400"
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                    <div className="mt-6 w-full">
                        <span className="mt-6 w-full">
                            If you don&apos;t have account,&nbsp;
                            <Link
                                href={'/register'}
                                className="font-semibold text-[#0E2BBF] underline"
                            >
                                sign up here
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginComponent
