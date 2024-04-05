'use client'

import { useResetPassword } from '@/app/store/server/features/auth'
import { createPasswordFormSchema } from '@/app/validation-schemas'
import RequireIcon from '@/public/icon/Require.svg'
import { EyeIcon } from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

const CreatePasswordComponent = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const router = useRouter()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(createPasswordFormSchema),
    })
    const userEmailState = useSelector(state => state.email)
    const handleResetPasswordSuccess = (data) => {
        if(data?.passwordUpdated) {
            router.push('/')
        } else {
            toast.error('Password Reset Failed')
        }
    }
    const {mutate: resetPassword, isSuccess, isError} = useResetPassword(handleResetPasswordSuccess);
    const createPassword = () => {
        const payload = {
            email: userEmailState.userEmail,
            password: newPassword,
            confirmPassword: confirmPassword
        }

        resetPassword(payload);
    }

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible)
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center text-xs">
            {/* Create Password Form Area */}
            <div className="relative h-[300px] w-1/3 rounded-lg border border-gray-200 bg-white shadow shadow-slate-300 sm:w-2/3 md:w-1/3">
                <form
                    className="absolute top-10 w-full px-12"
                    onSubmit={handleSubmit(createPassword)}
                >
                    <p className="mb-5 text-sm text-center font-bold">
                        Create your new password
                    </p>
                    <div className="mb-4 gap-2">
                        <div className="justify-self-start">
                            <Controller
                                name="newPassword"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <div className='relative'>
                                        <input
                                        {...field}
                                        type={passwordVisible ? 'text' : 'password'}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setNewPassword(e.target.value)
                                        }}
                                        placeholder='New Password'
                                        className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300 pr-6"
                                    />
                                    <EyeIcon className='w-[15px] h-[15px] text-gray-400 hover:cursor-pointer cursor-pointer absolute top-1/2 right-2 transform -translate-y-1/2'
                                            onClick={handlePasswordVisibility}
                                        /> 
                                    </div>
                                )}
                            />
                            <span className="text-red-600">
                                {errors.newPassword &&
                                    errors.newPassword?.message}
                            </span>
                        </div>
                    </div>
                    <div className="mb-4 gap-2">
                        <div className="justify-self-start">
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <div className='relative'>
                                        <input
                                        {...field}
                                        type={passwordVisible ? 'text' : 'password'}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            setConfirmPassword(e.target.value)
                                        }}
                                        placeholder='Confirm Password'
                                        className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                    />
                                    <EyeIcon className='w-[15px] h-[15px] text-gray-400 hover:cursor-pointer cursor-pointer absolute top-1/2 right-2 transform -translate-y-1/2'
                                            onClick={handlePasswordVisibility}
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
                            Change
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePasswordComponent
