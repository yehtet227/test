import { Combobox, Transition } from '@headlessui/react'
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'

export default function SearchDropDown({ options, onSelect, initialValue }) {
    const [selected, setSelected] = useState({
        id: '',
        name: '',
    })
    const [upIcon, setUpIcon] = useState(false)
    const [query, setQuery] = useState('')

    const filteredOptions =
        query === ''
            ? options
            : options.filter((option) =>
                  option.name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, '')),
              )

    useEffect(() => {
        const initialFilteredOption =
            initialValue &&
            options &&
            options?.filter(
                (opt) => opt.id?.toString() === initialValue?.toString(),
            )
        if (initialFilteredOption !== undefined) {
            if (initialFilteredOption[0] !== undefined) {
                setSelected(initialFilteredOption[0])
            }
        }
    }, [initialValue, options])

    return (
        <div className="z-200 w-full">
            <Combobox value={selected}>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-pointer overflow-hidden  bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
                        <Combobox.Input
                            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 leading-5 text-gray-900 focus:outline-slate-300"
                            style={{ height: '35px' }}
                            displayValue={(option) => option?.name}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button
                            className="absolute inset-y-0 right-0 flex items-center border-gray-300 pr-2"
                            style={{ height: '35px' }}
                            onClick={() => setUpIcon(true)}
                        >
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
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => {
                            setQuery('')
                            setUpIcon(false)
                        }}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {filteredOptions?.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredOptions?.map((option) => (
                                    <Combobox.Option
                                        key={option.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-6 pr-4 ${
                                                active
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={option}
                                        onClick={() => {
                                            setSelected(option)
                                            onSelect(option)
                                            setUpIcon(false)
                                        }}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {option.name}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-1 ${
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
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    )
}
