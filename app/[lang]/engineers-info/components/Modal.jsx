'use client'

import { addprojectEmployees } from '@/app/store/client/features/engineer_assign/assignCreateSlice'
import {
    updateEndDate,
    updateEngineerList,
    updateNumberOfHours,
    updatePricePerEngineer,
    updateRole,
    updateRoleId,
    updateStartDate,
} from '@/app/store/client/features/engineer_assign/engineerAssignSlice'
import { toggleModal } from '@/app/store/client/features/modal/modalSlice'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import { useGetAllMemberTypes } from '@/app/store/server/features/member-types'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import { Dialog, Transition } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import RequireIcon from '../../../../public/icon/Require.svg'
import Dropdown from '../../projects/assign/components/DropDown'


const employeeList = []

for (let i = 1; i <= 5; i++) {
    const pm = {
        role: 'Project Manager',
        name: `PM${i}`,
        id: `PM00${i}`,
    }
    employeeList.push(pm)
}

for (let i = 1; i <= 10; i++) {
    const developer = {
        role: 'Developer',
        name: `Developer${i}`,
        id: `DEV00${i}`,
    }
    employeeList.push(developer)
}

function restrictToTwoDecimalPlaces(event) {
    const input = event.target
    let value = input.value

    // Remove any non-numeric and non-decimal characters except the first decimal point
    value = value.replace(/[^0-9.]+/g, '').replace(/^(\d*\.\d*).*$/, '$1')

    // Ensure that there is at most 1 decimal point and at most 2 decimal places
    const parts = value.split('.')
    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2)
    }
    value = parts.length === 2 ? parts.join('.') : parts[0]

    // Update the input value
    input.value = value
}

const ModalComponent = () => {
    const handleRoleChange = (selectedRole) => {
        setSelectedRole(selectedRole)
        setRole(selectedRole?.id)
        const roleName = selectedRole?.role_name
        const roleid = selectedRole?.id
        dispatch(updateRole(roleName))
        dispatch(updateRoleId(roleid))
    }
    const selectedRoleId = useSelector((state) => state.engineerAssign.roleid)
    const dispatch = useDispatch()
    const [memberType, setMemberType] = useState('')
    const [role, setRole] = useState('')
    const [hour, setHour] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    const [helpingManMonth, setHelpingManMonth] = useState('')
    const [helpingUnitPrice, setHelpingUnitPrice] = useState('')
    const [employee, setEmployee] = useState([])
    const [selectedRole, setSelectedRole] = useState(null)
    const [searchInput, setSearchInput] = useState('')
    const [selectedPeople, setSelectedPeople] = useState([])
    const [projectEmployees, setprojectEmployees] = useState([])
    const engineerAssignState = useSelector((state) => state.engineerAssign)
    const isOpen = useSelector((state) => state.modalOpen.isOpen)
    const [filteredEmployees, setFilteredEmployees] = useState([])
    const { data: memberTypes } = useGetAllMemberTypes()
    const addedEngineerList = Object.values(engineerAssignState.roleData)
        .filter((roleData) => roleData && roleData.engineerList)
        .map((roleData) => roleData.engineerList)
        .flat()

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value)
    }
    const rolesInState = engineerAssignState.roleData
    const roleControl = engineerAssignState.role
    function checkRoleEquality(obj, role) {
        for (const key in obj) {
            if (key === role) {
                return true
            }
        }
        return false
    }
    
    const roleCheckResult = checkRoleEquality(rolesInState, roleControl)
    let schema = yup.object().shape({
        role: yup.string().required('Please select a role.'),
        memberType: yup.string().required('Please select member type.'),
        
      });
    
      if (!roleCheckResult) {
        schema = schema.shape({
          manMonth: yup.number().required('Please enter man-month'),
          unitPrice: yup.number().required('Please enter unit price'),
        });
      }
      
    const {
        handleSubmit,
        control,
        formState: { errors },
        setError
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            unitPrice: '',
            manMonth: '',
        }
    })
    const toggleSelectPerson = (person) => {
        setSelectedPeople((prevSelectedPeople) =>
            prevSelectedPeople.includes(person)
                ? prevSelectedPeople.filter((p) => p !== person)
                : [...prevSelectedPeople, person],
        )
        setEmployee((prevEmployee) =>
            prevEmployee.includes(person)
                ? prevEmployee.filter((p) => p !== person)
                : [...prevEmployee, person?.emp_cd],
        )
    }

    const handleMemberTypeChange = (event) => {
        setMemberType(event)
    }
    const handleHourChange = (value) => {
        setHour(value)
        setHelpingManMonth(value)
    }

    const handlePriceChange = (value) => {
        setUnitPrice(value)
        setHelpingUnitPrice(value)
    }
   
    const handleStartDateChange = (event) => {
        dispatch(updateStartDate(event.target.value))
    }

    const handleEndDateChange = (event) => {
        dispatch(updateEndDate(event.target.value))
    }

    const toggleModalClose = () => {
        dispatch(toggleModal())
        setMemberType('')
    }

    const { data, isError, isSuccess } = useGetAllRoles()
    const { data: employees } = useGetAllEmployees()
    if (data !== undefined && !isError && isSuccess) {
        var rolesData = data?.map(function (item) {
            return item
        })
    }

    if (employees !== undefined) {
        var employeesAllData = employees?.map(function (item) {
            return item
        })
    }

    useEffect(() => {
        if (!searchInput) {
            setFilteredEmployees(employees)
        } else {
            const lowerCaseQuery = searchInput.toLowerCase()
            const searchedData = employees.filter((employee) => {
                return (
                    employee.emp_name?.toLowerCase().includes(lowerCaseQuery) ||
                    employee.emp_cd?.toLowerCase().includes(lowerCaseQuery)
                )
            })
            setFilteredEmployees(searchedData)
        }
    }, [employees, searchInput])
    
    
    useEffect(() => {
        const roleCheckResult = checkRoleEquality(rolesInState, roleControl)

        if (roleCheckResult && rolesInState[roleControl]) {
            setHour(rolesInState[roleControl].numberOfHours)
            setUnitPrice(rolesInState[roleControl].pricePerEngineer)
        } else {
           setHour(helpingManMonth)
           setUnitPrice(helpingUnitPrice)
        }
    }, [rolesInState, roleControl, helpingManMonth, helpingUnitPrice])
    const handleButtonClick = () => {
        dispatch(toggleModal())
        setMemberType('')
        if (!roleCheckResult) {
            dispatch(updateNumberOfHours(hour))
            dispatch(updatePricePerEngineer(unitPrice))
        }
        dispatch(updateEngineerList(selectedPeople))

        const newProjectEmployee = {
            member_type: memberType?.member_type_id,
            role: role,
            man_month: hour,
            unit_price: unitPrice,
            employeesId: employee,
        }
        setprojectEmployees([newProjectEmployee])
        dispatch(addprojectEmployees(newProjectEmployee))
    }
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 w-full overflow-y-auto"
                onClose={toggleModalClose}
            >
                <div className="flex w-full min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center text-xs sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-75"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-75"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 opacity-75" />
                    </Transition.Child>

                    <span
                        className="hidden sm:inline-block sm:h-screen sm:align-middle"
                        aria-hidden="true"
                    ></span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <div className="bg-white w-full px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="mt-4 w-full">
                                    <div className='flex flex-row gap-3 w-full '>
                                        <div
                                            className="mb-4 w-full"
                                            style={{
                                                position: 'relative',
                                                zIndex: 200,
                                            }}
                                        >
                                            <label htmlFor="memberType">
                                                Member Type
                                            </label>
                                            <div className="w-full">
                                                <Controller
                                                    name="memberType"
                                                    control={control}
                                                    defaultValue={''}
                                                    render={({ field }) => (
                                                        <div>
                                                            <Dropdown
                                                                options={
                                                                    memberTypes
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                generateLabel={(
                                                                    option,
                                                                ) =>
                                                                    option?.member_type
                                                                }
                                                                onSelect={(
                                                                    option,
                                                                ) => {
                                                                    field.onChange(
                                                                        option?.member_type_id,
                                                                    )
                                                                    handleMemberTypeChange(
                                                                        option,
                                                                    )
                                                                }}
                                                            />
                                                            {errors.memberType && (
                                                                <p className="text-red-500">
                                                                    {
                                                                        errors
                                                                            .memberType
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                    rules={{
                                                        required:
                                                            'Please select member type.',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div
                                            className="mb-4 w-full"
                                            style={{
                                                position: 'relative',
                                                zIndex: 100,
                                            }}
                                        >
                                            <label htmlFor="role">Role</label>
                                            <div className="w-full">
                                                <Controller
                                                    name="role"
                                                    control={control}
                                                    defaultValue={'' || role}
                                                    render={({ field }) => (
                                                        <div>
                                                            <Dropdown
                                                                options={
                                                                    rolesData
                                                                }
                                                                value={
                                                                    field.value
                                                                }
                                                                generateLabel={(
                                                                    option,
                                                                ) =>
                                                                    option?.role_name
                                                                }
                                                                onSelect={(
                                                                    option,
                                                                ) => {
                                                                    field.onChange(
                                                                        option.id,
                                                                    )
                                                                    handleRoleChange(
                                                                        option,
                                                                    )
                                                                }}
                                                            />
                                                            {errors.role && (
                                                                <p className="text-red-500">
                                                                    {
                                                                        errors
                                                                            .role
                                                                            .message
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                    rules={{
                                                        required:
                                                            'Please select a role.',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {roleCheckResult ? (
                                        <div className='flex flex-row gap-3 w-full'>
                                        <div className=" w-full">
                                        <label
                                            htmlFor="time"
                                            className="flex gap-2"
                                        >
                                            Man-Month
                                            
                                        </label>
                                        <input
                                            disabled={roleCheckResult}
                                            type="number"
                                            onInput={(e) => {
                                                const value = e.target.value
                                                const regex =
                                                    /^[0-9]+(\.[0-9]{0,2})?$/
                                                if (!regex.test(value)) {
                                                    e.target.value =
                                                        value.slice(0, -1)
                                                }
                                            }}
                                            placeholder=""
                                            className="h-[35px] w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                        />
                                    </div>
                                <div className=" w-full">
                                    <label
                                        htmlFor="price"
                                        className=" flex gap-2"
                                    >
                                        Unit Price
                                        
                                    </label>
                                    <input
                                        disabled={roleCheckResult}
                                        type="number"
                                        onInput={(e) => {
                                            const value = e.target.value
                                            const regex =
                                                /^[0-9]+(\.[0-9]{0,2})?$/
                                            if (!regex.test(value)) {
                                                e.target.value =
                                                    value.slice(0, -1)
                                            }
                                        }}
                                        placeholder=""
                                        className="h-[35px] w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                    />
                                </div>
                                        </div>
                                    ) : (
                                        <div className='flex flex-row gap-3 w-full'>
                                        <div className=" w-full">
                                            <label
                                                htmlFor="time"
                                                className="flex gap-2"
                                            >
                                                Man-Month
                                                <Image src={RequireIcon} className="justify-center" alt="no image" />
                                            </label>
                                            
                                            <Controller
                                            name="manMonth"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <div className="mb-4">
                                                
                                                <input
                                                    onBlur={() => {
                                                        if (!roleCheckResult) {
                                                            trigger('manMonth'); 
                                                        }
                                                    }}
                                                    onInput={(e) => {
                                                        const value = e.target.value
                                                        const regex =
                                                            /^[0-9]+(\.[0-9]{0,2})?$/
                                                        if (!regex.test(value)) {
                                                            e.target.value =
                                                                value.slice(0, -1)
                                                        }
                                                        handleHourChange(e.target.value)
                                                    }}
                                                    {...field}
                                                    type="number"
                                                    placeholder=""
                                                    className={`h-[35px] w-full rounded-md border ${
                                                    fieldState.error ? 'border-red-500' : 'border-slate-300'
                                                    } px-3 py-2 focus:outline-slate-300`}
                                                />
                                                {errors.manMonth && (
                                                    <p className="text-red-500">{'Please enter man month'}</p>
                                                )}
                                                </div>
                                            )}
                                            />
                                        </div>
                                    <div className=" w-full">
                                        <label
                                            htmlFor="price"
                                            className=" flex gap-2"
                                        >
                                            Unit Price
                                            <Image
                                                src={RequireIcon}
                                                className=" justify-center"
                                                alt="no image"
                                            />
                                        </label>
                                        <Controller
                                            name="unitPrice"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <div className="mb-4">
                                                
                                                <input
                                                   onBlur={() => {
                                                    if (!roleCheckResult) {
                                                        trigger('unitPrice'); 
                                                    }
                                                }}
                                                    onInput={(e) => {
                                                        const value = e.target.value
                                                        const regex =
                                                            /^[0-9]+(\.[0-9]{0,2})?$/
                                                        if (!regex.test(value)) {
                                                            e.target.value =
                                                                value.slice(0, -1)
                                                        }
                                                        handlePriceChange(e.target.value)
                                                    }}
                                                    {...field}
                                                    type="number"
                                                    placeholder=""
                                                    className={`h-[35px] w-full rounded-md border ${
                                                    fieldState.error ? 'border-red-500' : 'border-slate-300'
                                                    } px-3 py-2 focus:outline-slate-300`}
                                                />
                                                {errors.unitPrice && (
                                                    <p className="text-red-500">{'Please enter unit price.'}</p>
                                                )}
                                                </div>
                                            )}
                                            />
                                    </div>
                                        </div>
                                    )}

                                    <div className="mb-2 flex w-auto flex-col">
                                        <div className="flex w-full flex-row gap-8">
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchInput}
                                                onChange={
                                                    handleSearchInputChange
                                                }
                                                className="h-[35px] w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-1 max-h-48 overflow-y-auto rounded-md border border-slate-300 px-2 py-3">
                                        {filteredEmployees
                                            ?.filter(
                                                (employee) =>
                                                    !addedEngineerList.some(
                                                        (addedEngineer) =>
                                                            addedEngineer.emp_name ===
                                                            employee.emp_name,
                                                    ),
                                            )
                                            ?.map((employee, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between gap-4 px-2"
                                                >
                                                    <div className="mb-2 flex w-4/6 items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPeople?.includes(
                                                                employee,
                                                            )}
                                                            className="mr-4 h-4 w-4 rounded-sm border-slate-300 bg-gray-100 text-blue-700 ring-offset-2  focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-blue-800"
                                                            onChange={() =>
                                                                toggleSelectPerson(
                                                                    employee,
                                                                )
                                                            }
                                                        />

                                                        <label
                                                            htmlFor={
                                                                employee.id
                                                            }
                                                        >
                                                            {employee?.emp_name}{' '}
                                                        </label>
                                                    </div>
                                                    <div className="flex w-2/6 justify-start">
                                                        <label
                                                            htmlFor=""
                                                            className="text-left"
                                                        >
                                                            {employee?.emp_cd}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>

                                    <div className="mt-4 flex justify-center">
                                        <div>
                                            <button
                                                onClick={handleSubmit(
                                                    handleButtonClick
                                                )}
                                                className="mr-2 h-[30px] w-[70px] rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                            >
                                                Assign
                                            </button>
                                            <button
                                                onClick={toggleModalClose}
                                                className="h-[30px] w-[70px] rounded-md bg-red-700 text-white shadow-md shadow-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalComponent
