import { Listbox, Transition } from '@headlessui/react'
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/20/solid'
import React, { Fragment, useEffect, useState } from 'react'

const YearDropdown = (props) => {
    const { showYear, handleYearSelection } = props
    const [upIcon, setUpIcon] = useState(false)
    const [open, setOpen] = useState(false)

    // Initialize selectedYear state with the initial showYear value
    const [selectedYear, setSelectedYear] = useState(
        showYear || new Date().getFullYear(),
    )

    const startYear = 2011;
    const currentYear = new Date().getFullYear()
    const endYear = currentYear + 1;

    const yearsList = Array.from(

        { length: endYear - startYear + 1 },
        (_, index) => endYear - index,
    )

    return (
        <div className="mr-[-14px] w-[100px]">
            <Listbox
                as="div"
                value={selectedYear}
                onChange={handleYearSelection}
            >
                <>
                    <div className="relative w-[70px] text-xs">
                        <Listbox.Button
                            className="inline-flex h-[30px] w-[70px] items-center justify-center rounded-md bg-[#E6E7F3] text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                            onClick={() => setUpIcon(!upIcon)}
                        >
                            <p className="mr-2">{selectedYear}</p>
                            {upIcon ? (
                                <ChevronUpIcon
                                    className="h-4 w-4 text-gray-500"
                                    aria-hidden="true"
                                />
                            ) : (
                                <ChevronDownIcon
                                    className="h-4 w-4 text-gray-500"
                                    aria-hidden="true"
                                />
                            )}
                        </Listbox.Button>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            afterLeave={() => {
                                setOpen(false)
                                setUpIcon(false)
                            }}
                        >
                            <Listbox.Options
                                className={`${
                                    open ? 'block' : 'block'
                                } no-scrollbar absolute z-[1000]  mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                            >
                                {yearsList.map((year) => (
                                    <Listbox.Option
                                        key={year}
                                        value={year}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 text-center hover:bg-blue-500 hover:text-white ${
                                                active
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                    >
                                        {({ selected, active }) => (
                                            <div
                                                onClick={() =>
                                                    setSelectedYear(year)
                                                }
                                            >
                                                <span
                                                    className={`block truncate pl-2 ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {year}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-1 ${
                                                            active
                                                                ? 'bg-blue-500 text-white'
                                                                : 'text-blue-500'
                                                        }`}
                                                    >
                                                        <CheckIcon
                                                            className="h-4 w-4"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            </Listbox>
        </div>
    )
}

export default YearDropdown
