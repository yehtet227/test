'use client'

import { useConfirmCode } from '@/app/store/server/features/auth'
import { confirmEmailFormSchema } from '@/app/validation-schemas'
import RequireIcon from '@/public/icon/Require.svg'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

const ConfirmEmailComponent = () => {
    const [code, setConfirmCode] = useState('')
    const router = useRouter()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(confirmEmailFormSchema),
    })

    const handleCodeChange = (code) => {}
    const handelCheckCodeSuccess = (data) => {
        if (data?.codeMatched) {
            router.push('/create-password')
        } else {
            toast.error('Invalid Code')
        }
    }
    const {mutate: confirmCode, isSuccess, isError} = useConfirmCode(handelCheckCodeSuccess);
    const userEmail = useSelector(state => state.email)
    const confirmEmail = () => {
        const payload = {
            email: userEmail.userEmail,
            code: code
        }
        confirmCode(payload)
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center text-xs">
            <Toaster />
            {/* Confirm Email Form Area */}
            <div className="relative h-[300px] w-1/3 rounded-lg border border-gray-200 bg-white shadow shadow-slate-300 sm:w-2/3 md:w-1/3">
                <form
                    className="absolute top-10 w-full px-12"
                    onSubmit={handleSubmit(confirmEmail)}
                >
                    <p className="mb-5 text-sm text-center font-bold">Confirmation Code</p>
                    <p className="mb-4">
                        Conifirmation code was sent to your email. Please check
                        the email and enter the confirmation code.
                    </p>
                    <div className="mb-4 gap-2">
                        <div className="justify-self-start">
                            <Controller
                                name="confirmCode"
                                control={control}
                                defaultValue={''}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        onChange={(e) => {
                                            field.onChange(e)
                                            handleCodeChange(e.target.value)
                                            setConfirmCode(e.target.value)
                                        }}
                                        onKeyDown={(evt) => {
                                            let regex = /[0-9]|\./
                                            if (!regex.test(evt?.key) && evt.key !== 'Backspace' && evt.key !== 'Delete') {
                                                evt.preventDefault()
                                            }
                                        }}
                                        placeholder='Enter confirmation code'
                                        className="h-[35px] w-full rounded-md border border-slate-300 px-2 py-1 pb-1 focus:outline-slate-300"
                                    />
                                )}
                            />
                            <span className="text-red-600">
                                {errors.confirmCode &&
                                    errors.confirmCode?.message}
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex w-full items-center justify-center">
                        <button
                            className="h-[30px] w-full rounded-md bg-blue-700 font-semibold text-white shadow-md shadow-gray-400"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ConfirmEmailComponent
