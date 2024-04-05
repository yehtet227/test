'use client'

import {
    addAprilMemberType,
    addaprilProject,
    addaprilRole,
    addAugMemberType,
    addaugProject,
    addaugRole,
    addcareerSheetStatus,
    addDecMemberType,
    adddecProject,
    adddecRole,
    addempInfoData,
    addFebMemberType,
    addfebProject,
    addfebRole,
    addJanMemberType,
    addjanProject,
    addjanRole,
    addJulyMemberType,
    addjulyProject,
    addjulyRole,
    addJuneMemberType,
    addjuneProject,
    addjuneRole,
    addMarchMemberType,
    addmarchProject,
    addmarchRole,
    addmarketingCurentSatus,
    addMayMemberType,
    addmayProject,
    addmayRole,
    addNovMemberType,
    addnovProject,
    addnovRole,
    addOctMemberType,
    addoctProject,
    addoctRole,
    addprojectName,
    addSeptMemberType,
    addseptProject,
    addseptRole,
    addYears,
} from '@/app/store/client/features/project_assign/projectAssignDataSlice'
import { setCustomerId } from '@/app/store/client/features/project_create/projectCreateInfoSlice'
import { setJpProjectLeader } from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'
import { setMmProjectLeader } from '@/app/store/client/features/project_create/projectCreateMMOrderSlice'
import { Combobox, Transition } from '@headlessui/react'
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export default function DropDown(props) {
    const dispatch = useDispatch()
    const [selected, setSelected] = useState('')
    const [upIcon, setUpIcon] = useState(false)
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === '' || typeof query !== 'string'
            ? props?.data
            : props?.data?.filter((person) => {
                  const filterName = props?.filterName
                  if (filterName && person[filterName]) {
                      const personValue = person[filterName]
                          .toLowerCase()
                          .replace(/\s+/g, '')
                      const queryValue = query.toLowerCase().replace(/\s+/g, '')
                      return personValue.includes(queryValue)
                  }
                  return false
              })

    const dispatchMap = {
        engineerInfo: addempInfoData,
        projectname: addprojectName,
        marketingCurentSatus: addmarketingCurentSatus,
        careerSheetStatus: addcareerSheetStatus,
        Years: addYears,
        janProject: addjanProject,
        janRole: addjanRole,
        febProject: addfebProject,
        febRole: addfebRole,
        marchProject: addmarchProject,
        marchRole: addmarchRole,
        aprilProject: addaprilProject,
        aprilRole: addaprilRole,
        mayProject: addmayProject,
        mayRole: addmayRole,
        juneProject: addjuneProject,
        juneRole: addjuneRole,
        julyProject: addjulyProject,
        julyRole: addjulyRole,
        augProject: addaugProject,
        augRole: addaugRole,
        septProject: addseptProject,
        septRole: addseptRole,
        octProject: addoctProject,
        octRole: addoctRole,
        novProject: addnovProject,
        novRole: addnovRole,
        decProject: adddecProject,
        decRole: adddecRole,
        janMemberType: addJanMemberType,
        febMemberType: addFebMemberType,
        marchMemberType: addMarchMemberType,
        aprilMemberType: addAprilMemberType,
        mayMemberType: addMayMemberType,
        juneMemberType: addJuneMemberType,
        julyMemberType: addJulyMemberType,
        augustMemberType: addAugMemberType,
        septMemberType: addSeptMemberType,
        octMemberType: addOctMemberType,
        novMemberType: addNovMemberType,
        decMemberType: addDecMemberType,
        customerIdFromProjectCreate: setCustomerId,
        jpProjectLeader: setJpProjectLeader,
        mmProjectLeader: setMmProjectLeader,
    }

    if (selected !== undefined) {
        for (const prop in props) {
            if (props[prop] === 'true' && dispatchMap[prop]) {
                let valueToDispatch = props?.edit ? props?.editData : selected

                if (prop === 'customerIdFromProjectCreate') {
                    valueToDispatch = props?.edit
                        ? props?.editData
                        : selected.id
                } else if (
                    prop === 'jpProjectLeader' ||
                    prop === 'mmProjectLeader'
                ) {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected.emp_name))
                    }
                } else if (prop === 'careerSheetStatus') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'marketingCurentSatus') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'Years') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'engineerInfo') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'janProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'febProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'marchProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'aprilProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'mayProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'juneProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'julyProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'augProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'septProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'octProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'novProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'decProject') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'janRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'febRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'marchRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'aprilRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'mayRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'juneRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'julyRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'augRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'septRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'octRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'novRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'decRole') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'janMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'febMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'marchMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'aprilMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'mayMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'juneMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'julyMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'augustMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'septMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'octMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'novMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else if (prop === 'decMemberType') {
                    if (props?.edit) {
                        dispatch(dispatchMap[prop](props?.editData))
                    } else {
                        dispatch(dispatchMap[prop](selected))
                    }
                } else {
                    dispatch(dispatchMap[prop](selected))
                }

                dispatch(dispatchMap[prop](valueToDispatch))
            }
        }
    }

    useEffect(() => {
        setQuery(props.valueFromState || '')
    }, [props.valueFromState])

    return (
        <div className="z-200 w-full text-xs">
            <Combobox
                value={selected}
                onChange={(newSelected) => {
                    setSelected(newSelected)
                    setUpIcon(false)
                }}
            >
                <div className="relative mt-1">
                    <div className="relative h-[35px] w-full cursor-pointer overflow-hidden rounded-md border border-slate-300 bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
                        <Combobox.Input
                            className="h-[35px] w-full py-2 pl-2 pr-10 leading-5 text-gray-900 outline-none"
                            displayValue={(person) =>
                                person[props?.name] || query
                            }
                            onChange={(event) => {
                                setQuery(event.target.value)
                                if (props?.edit) {
                                    props.setEdit(false)
                                }
                            }}
                        />
                        <Combobox.Button
                            className="absolute inset-y-0 right-0 flex items-center pr-2"
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
                            {filteredPeople?.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredPeople?.map((person, index) => (
                                    <Combobox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-6 pr-4 ${
                                                active
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={person}
                                        onClick={() => {
                                            props.onSelect !== undefined &&
                                                props.onSelect(person)
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
                                                    {person[props?.name]}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-1 ${
                                                            active
                                                                ? 'text-white'
                                                                : 'text-teal-600'
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
