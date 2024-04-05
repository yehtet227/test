'use client'

import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import React, { Fragment } from 'react'
import Warnning from '../../../public/warnning.svg'

const DeleteConfirmModal = ({
    isOpen,
    setIsOpen,
    onDeleteHandler,
    isError,
    deleteData,
}) => {
    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center">
                <button
                    type="button"
                    onClick={openModal}
                    className="rounded-md bg-black bg-opacity-20 px-4 py-2 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    Open dialog
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 my-5 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                                style={{
                                    background: '#FAFAFA',
                                }}
                            >
                                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl border border-2 border-gray-400 bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        <div className="flex items-center justify-center">
                                            <Image
                                                src={Warnning}
                                                className="h-[34px] w-[35px] justify-center"
                                                alt="no image"
                                            />
                                        </div>
                                    </Dialog.Title>
                                    <div className="my-7 flex items-center justify-center text-xs">
                                        <p
                                            className="font-medium leading-6 text-gray-900"
                                            id="modal-title"
                                        >
                                            Are you sure to delete{' '}
                                            {deleteData.name}.
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 text-xs">
                                        <button
                                            onClick={onDeleteHandler}
                                            type="button"
                                            className="h-[30px] w-[70px] rounded-md bg-red-600 font-normal text-white shadow-md shadow-gray-400 "
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false)
                                            }}
                                            type="button"
                                            className="h-[30px] w-[70px] rounded-md bg-yellow-500 font-normal text-white shadow-md shadow-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default DeleteConfirmModal
