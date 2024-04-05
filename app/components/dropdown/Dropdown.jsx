'use client'

import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react'

function Dropdown({ options, value, generateLabel, onSelect, disabled }) {
    const [selectedOption, setSelectedOption] = useState(null)
    const handleSelect = (option) => {
        setSelectedOption(option)
        onSelect(option)
    }

    useEffect(() => {
        const filterOption =
            options !== undefined &&
            options.filter((opt) => String(opt.id) === String(value))
        setSelectedOption(filterOption[0])
    }, [value, options])

    return (
        <div className="relative w-full text-xs">
            <Listbox as="div" className="rounded-md">
                {({ open }) => (
                    <>
                        <Listbox.Button
                            className={`flex h-[35px] w-full items-center justify-start rounded-md border border-slate-300 bg-white px-2 py-2 ${
                                disabled
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                            }`}
                            disabled={disabled}
                        >
                            {generateLabel(selectedOption)}
                            <ChevronDownIcon
                                className={`ml-auto h-4 w-4 text-right text-gray-500 ${
                                    open ? 'rotate-180 transform' : ''
                                }`}
                            />
                        </Listbox.Button>
                        <Transition
                            as="div"
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            {open && !disabled && (
                                <Listbox.Options className="absolute left-0 max-h-60 w-full overflow-y-auto rounded border border-gray-300 bg-white py-1 text-left shadow-md">
                                    {options?.map((option, index) => (
                                        <Listbox.Option
                                            key={index}
                                            value={option}
                                            onClick={() => handleSelect(option)}
                                            className={({ active }) =>
                                                `block cursor-pointer items-center truncate px-6 py-2 
                                                ${
                                                    active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'text-gray-900'
                                                }
                                                ${
                                                    option === selectedOption
                                                        ? 'font-medium'
                                                        : 'font-normal'
                                                }
                                            `
                                            }
                                        >
                                            {({ active }) => (
                                                <>
                                                    {option ===
                                                    selectedOption ? (
                                                        <span
                                                            className={`absolute left-0 flex items-center pl-1 ${
                                                                active
                                                                    ? 'text-white'
                                                                    : 'text-blue-500'
                                                            }`}
                                                        >
                                                            <CheckIcon
                                                                className="h-4 w-4"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                    {generateLabel(option)}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            )}
                        </Transition>
                    </>
                )}
            </Listbox>
        </div>
    )
}

export default Dropdown
