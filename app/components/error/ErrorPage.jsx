import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import React from 'react'

const ErrorPage = ({ message, status }) => {
    return (
        <div
            className={`relative top-[100px] flex h-full flex-row items-start gap-2 rounded border border-l-2 border-slate-300 border-l-red-500 px-4 py-10 text-xs ${
                message === 'role list' ? 'w-[700px]' : 'w-full'
            }`}
        >
            <ExclamationCircleIcon className="mt-1 h-6 w-6 text-red-500" />
            <div>
                <h5 className="text-black-500 font-bold">
                    Something went wrong! (Status - {status})
                </h5>
                <p>
                    Unfortunately, we cannot show the {message} of this
                    application. Please refresh this page.
                </p>
            </div>
        </div>
    )
}

export default ErrorPage
