'use client'

import { setUserEmail } from '@/app/store/client/features/email/email'
import { useSendEmail } from '@/app/store/server/features/auth'
import { resetFormSchema } from '@/app/validation-schemas'
import RequireIcon from '@/public/icon/Require.svg'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const ForgotPasswordComponent = () => {
    const [email, setEmail] = useState('')
    const router = useRouter()
    const dispatch = useDispatch()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetFormSchema),
    })

    const handleUserEmailChange = (email) => {
        dispatch(setUserEmail(email))
    }
    const handleResetSuccess = (data) => {
        if (data?.mailSent) {
            router.push('/confirm-email')
        } else {
            toast.error('User does not exist')
        }
    }
    const {mutate: sendEmail, isSuccess, isError} = useSendEmail(handleResetSuccess);
    const reset = async () => {
        const payload = {
            email: email,
        }
        sendEmail(payload)
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center text-xs">
            <Toaster />
            {/* Forgot Password Form Area */}
            <div className="relative h-[250px] w-1/3 rounded-lg border border-gray-200 bg-white shadow shadow-slate-300 sm:w-2/3 md:w-1/3">
                <form
                    className="absolute top-10 w-full px-12"
                    onSubmit={handleSubmit(reset)}
                >
                    <p className="mb-4">
                        Please enter the email to reset your password.
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
                    <div className='mb-4 flex justify-center'>
                        <Link
                            href={'/'}
                            className="font-semibold text-center text-gray-600 underline"
                        >
                            Back to sign in
                        </Link>
                    </div>
                    <div className="mt-6 flex w-full items-center justify-center">
                        <button
                            className="h-[30px] w-full rounded-md bg-blue-700 font-semibold text-white shadow-md shadow-gray-400"
                            type="submit"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPasswordComponent
