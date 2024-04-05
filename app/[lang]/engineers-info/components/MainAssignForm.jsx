'use client'

import Dropdown from '@/app/components/dropdown/Dropdown'
import {
    addCustomerId,
    addEndDate,
    addProjectId,
    addStartDate,
    clearAssignCreateState,
} from '@/app/store/client/features/engineer_assign/assignCreateSlice'
import {
    clearEngineerAssignState,
    updateCompany,
    updateProject,
    updateRole,
} from '@/app/store/client/features/engineer_assign/engineerAssignSlice'
import { toggleModal } from '@/app/store/client/features/modal/modalSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllCustomers } from '@/app/store/server/features/customers'
import { useCreateEngineerAssign } from '@/app/store/server/features/engineer_assign/mutations'
import { useGetAllProjects, useGetProjectsByCustomer } from '@/app/store/server/features/projectList/queries'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import RequireIcon from '../../../../public/icon/Require.svg'
import AssignDataShow from './AssignDataShow'
import ModalComponent from './Modal'
import { engineerAssignSchema, engineerAssignSchemaWithoutCustomer } from '@/app/validation-schemas/engineer-assign'
import 'react-datepicker/dist/react-datepicker.css';
import {parseISO} from 'date-fns'
import DatePicker from 'react-datepicker'
import { useEngineerAssignForm } from '@/app/[lang]/hooks/useEngineerAssignForm'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

const MainAssignForm = () => {
    const [assignStartDate, setAssignStartDate] = useState('')
    const [assignEndDate, setAssignEndDate] = useState('')
    const [companyQuery, setCompanyQuery] = useState('')
    const [projectQuery, setProjectQuery] = useState('')
    const [isCompanyComboBox, setIsCompanyComboBox] = useState(false)
    const [isProjectComboBox, setIsProjectComboBox] = useState(false)
    const [projectsByCustomers, setProjectsByCustomers] = useState(null)
    const [projectRelatedCustomer, setProjectRelatedCustomer] = useState(null)
    const [isCustomerChosen, setIsCustomerChosen] = useState(false)
    const dispatch = useDispatch()
    const engineerAssignState = useSelector((state) => state.engineerAssign)
    const assignCreateData = useSelector((state) => state.assignCreate)

    let isModalOpen = useSelector((state) => state.modalOpen.isOpen)
    const customer_id = engineerAssignState?.company
    const project_id = engineerAssignState?.project
    const start_date = engineerAssignState?.roleData?.startDate
    const end_date = engineerAssignState?.roleData?.endDate
    const handleCompanyChange = (selectedCompany) => {
        dispatch(updateCompany(selectedCompany))
        dispatch(addCustomerId(selectedCompany.id))
    }
    const {
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(projectRelatedCustomer ? engineerAssignSchemaWithoutCustomer : engineerAssignSchema),
    })
    const {handleProjectChange, handleEndDateChange, handleStartDateChange} = useEngineerAssignForm()

    const toggleCompanyComboBox = () => {
        setIsCompanyComboBox(!isCompanyComboBox)
    }
    
    const toggleProjectComboBox = () => {
        setIsProjectComboBox(!isProjectComboBox)
    }
 
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    const toggleModalBox = () => {
        dispatch(toggleModal())
        dispatch(updateRole(''))
    }

    const { data: projects, isLoading, isError, error } = useGetAllProjects()
    const { data: companies } = useGetAllCustomers()
    const { data: roles } = useGetAllRoles()
    const { fetchProjectsByCustomer } = useGetProjectsByCustomer()

    let filteredProjects;
    if(projectsByCustomers) {
        filteredProjects =
        projectQuery === ''
            ? projectsByCustomers
            : projectsByCustomers?.filter((project) => 
                  project?.project_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(projectQuery.toLowerCase().replace(/\s+/g, '')),
              )
              
    } else {
        filteredProjects =
        projectQuery === ''
            ? projects
            : projects?.filter((project) => 
                  project?.project_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(projectQuery.toLowerCase().replace(/\s+/g, '')),
              )
    }
    

    const filteredCompanies =
        companyQuery === ''
            ? companies
            : companies?.filter((company) =>
                  company?.customer_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(companyQuery.toLowerCase().replace(/\s+/g, '')),
              )

    const addedEngineerList = Object.values(
        engineerAssignState.roleData,
    ).reduce((engineerListAccumulator, roleData) => {
        if (roleData && roleData.engineerList) {
            engineerListAccumulator.push(...roleData.engineerList)
        }
        return engineerListAccumulator
    }, [])

    const renderAssignData = () => {
        if (
            engineerAssignState.roleData !== null &&
            addedEngineerList?.length > 0
        ) {
            const roles = engineerAssignState.roleData
            return (
                <div className="mb-1 flex flex-col justify-around">
                    {Object.keys(roles).map((roleKey) => {
                        const role = roles[roleKey]
                        const employeeList = role.engineerList
                        const roleInfo = {
                            role: `${roleKey}`,
                            numberOfHours: role.numberOfHours,
                            pricePerEngineer: role.pricePerEngineer,
                        }

                        if (employeeList?.length > 0) {
                            return (
                                <AssignDataShow
                                    key={roleKey}
                                    employeeList={employeeList}
                                    role={roleInfo.role}
                                    numberOfHours={roleInfo.numberOfHours}
                                    pricePerEngineer={roleInfo.pricePerEngineer}
                                />
                            )
                        }
                        return null
                    })}
                </div>
            )
        }
    }

    const { mutate: createEngineerInfoProjectAssign, isSuccess } =
        useCreateEngineerAssign()

    const handleReset = () => {
        reset()
    }
    const handleCreate = () => {
        createEngineerInfoProjectAssign(assignCreateData)
        dispatch(clearAssignCreateState())
        dispatch(clearEngineerAssignState())
        handleReset()
        setAssignStartDate('')
        setAssignEndDate('')
    }

    const handleCancel = () => {
        dispatch(clearAssignCreateState())
        dispatch(clearEngineerAssignState())
        handleReset()
        setAssignStartDate('')
        setAssignEndDate('')
    }

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearAssignCreateState())
            dispatch(clearEngineerAssignState())
        }
    }, [dispatch, isSuccess])
    function formatDate(inputDateString) {
        const inputDate = new Date(inputDateString);
      
        const year = inputDate.getFullYear();
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
        const day = inputDate.getDate().toString().padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }
      const minDate = assignStartDate ? new Date(assignStartDate.getTime() + 24 * 60 * 60 * 1000) : new Date();
    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            <Toaster />
            <div className="items mb-3 flex flex-row items-center pt-[7px]">
                <div className="cursor-pointer" onClick={toggleSideBar}>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                </div>
            </div>

            <div
                className="flex flex-col items-center rounded-md p-4 "
                style={{ border: '1.5px solid #e2e8f0', marginTop: '2px' }}
            >
                <h4 className="mb-6 text-sm font-medium">
                    Assigning Employees to Projects
                </h4>
                <div className="flex w-[685px] flex-col">
                    <div className='flex flex-row gap-4'>
                    <div className="z-20 mb-5 w-full flex flex-col items-start justify-between gap-2">
                        <label
                            htmlFor="year"
                            className=" flex items-center justify-center gap-2"
                        >
                            Customer{' '}
                            <Image
                                src={RequireIcon}
                                className=" justify-center"
                                alt="no image"
                            />
                        </label>
                        <div className="w-full">
                            <Controller
                                name="companyId"
                                control={control}
                                defaultValue={
                                   assignCreateData?.customer_id || ''
                                }
                                render={({ field }) => (
                                    <>
                                        <Combobox
                                            value={field.value}
                                            onChange={async (selectedCompany) => {
                                                field.onChange(selectedCompany)
                                                const dispatchCompany = companies.find(company => company.customer_name === selectedCompany);
                                                handleCompanyChange(
                                                    dispatchCompany,
                                                )
                                                setIsCustomerChosen(true);
                                                const currProjects = await fetchProjectsByCustomer(dispatchCompany.id)
                                                setProjectsByCustomers(currProjects)
                                            }}
                                        >
                                            <div className="relative mt-1">
                                                <div className="relative w-full cursor-default  rounded-lg  text-left  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                                    <Combobox.Input
                                                        className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs leading-5 text-gray-900 focus:outline-slate-300 "
                                                        style={{
                                                            height: '35px',
                                                        }}
                                                        displayValue={(
                                                            company,
                                                        ) =>
                                                            company?.customer_name ||
                                                            engineerAssignState?.company?.customer_name
                                                        }
                                                        onChange={(event) =>
                                                            setCompanyQuery(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                    <Combobox.Button
                                                        className="absolute inset-y-0 right-0 flex items-center border-gray-300 pr-2"
                                                        style={{
                                                            height: '35px',
                                                        }}
                                                        onClick={
                                                            toggleCompanyComboBox
                                                        }
                                                    >
                                                        <ChevronDownIcon
                                                            className={`h-4 w-4 text-gray-500 ${
                                                                isCompanyComboBox
                                                                    ? 'rotate-180 transform'
                                                                    : ''
                                                            }`}
                                                            aria-hidden="true"
                                                        />
                                                    </Combobox.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                    afterLeave={() => {
                                                        setCompanyQuery('')
                                                        setIsCompanyComboBox(
                                                            false,
                                                        )
                                                    }}
                                                >
                                                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {filteredCompanies?.length ===
                                                            0 &&
                                                        companyQuery !== '' ? (
                                                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                                Nothing found.
                                                            </div>
                                                        ) : (
                                                            filteredCompanies?.map(
                                                                (
                                                                    company,
                                                                    index,
                                                                ) => (
                                                                    <Combobox.Option
                                                                        key={
                                                                            company?.customer_name
                                                                        }
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            `relative cursor-default select-none py-2 pl-6 pr-4 text-xs ${
                                                                                active
                                                                                    ? 'bg-blue-500 text-white'
                                                                                    : 'text-gray-900'
                                                                            }`
                                                                        }
                                                                        value={
                                                                            company?.customer_name
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                            active,
                                                                        }) => (
                                                                            <>
                                                                                {selected ? (
                                                                                    <span
                                                                                        className={`absolute left-0 flex items-center pl-1  ${
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
                                                                                <span
                                                                                    className={`block truncate ${
                                                                                        selected
                                                                                            ? 'font-medium'
                                                                                            : 'font-normal'
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        company?.customer_name
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </Combobox.Option>
                                                                ),
                                                            )
                                                        )}
                                                    </Combobox.Options>
                                                </Transition>
                                            </div>
                                        </Combobox>
                                        {errors.companyId && (
                                            <p className="mt-1 text-red-500">
                                                {errors.companyId.message}
                                            </p>
                                        )}
                                    </>
                                )}
                                rules={{
                                    required: 'Please select a company.',
                                }}
                            />
                        </div>
                    </div>
                    <div className="z-10 mb-5 w-full flex flex-col items-start justify-between gap-2">
                        <label
                            htmlFor="year"
                            className=" flex items-center justify-center gap-2"
                        >
                            Project
                            <Image
                                src={RequireIcon}
                                className=" justify-center"
                                alt="no image"
                            />
                        </label>
                        <div className="w-full">
                            <Controller
                                name="projectId"
                                control={control}
                                defaultValue={assignCreateData.project_id || ''}
                                render={({ field }) => (
                                    <>
                                       <Combobox
                                            value={field.value}
                                            onChange={(selectedProject) => {
                                                console.log(selectedProject)
                                                field.onChange(selectedProject)
                                                const dispatchProject = projects.find(project => project.project_name === selectedProject);
                                                handleProjectChange(
                                                    dispatchProject,
                                                )
                                            
                                                if(isCustomerChosen === false) {
                                                    setProjectRelatedCustomer(dispatchProject?.customer?.customer_name)
                                                    handleCompanyChange(dispatchProject?.customer)
                                                }
                                                
                                            }}
                                        >
                                            <div className="relative mt-1">
                                                <div className="relative w-full cursor-default  rounded-lg  text-left  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                                    <Combobox.Input
                                                        className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs leading-5 text-gray-900 focus:outline-slate-300 "
                                                        style={{
                                                            height: '35px',
                                                        }}
                                                        displayValue={(
                                                            project,
                                                        ) =>
                                                            project?.project_name ||
                                                            engineerAssignState?.project?.project_name
                                                        }
                                                        onChange={(event) =>
                                                            setProjectQuery(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                    <Combobox.Button
                                                        className="absolute inset-y-0 right-0 flex items-center border-gray-300 pr-2"
                                                        style={{
                                                            height: '35px',
                                                        }}
                                                        onClick={
                                                            toggleProjectComboBox
                                                        }
                                                    >
                                                        <ChevronDownIcon
                                                            className={`h-4 w-4 text-gray-500 ${
                                                                isProjectComboBox
                                                                    ? 'rotate-180 transform'
                                                                    : ''
                                                            }`}
                                                            aria-hidden="true"
                                                        />
                                                    </Combobox.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                    afterLeave={() => {
                                                        setProjectQuery('')
                                                        setIsProjectComboBox(
                                                            false,
                                                        )
                                                    }}
                                                >
                                                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {!filteredProjects &&
                                                        companyQuery !== '' ? (
                                                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                                Nothing found.
                                                            </div>
                                                        ) : (
                                                            filteredProjects?.map(
                                                                (
                                                                    project,
                                                                    index,
                                                                ) => (
                                                                    <Combobox.Option
                                                                        key={
                                                                            project?.project_name
                                                                        }
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            `relative cursor-default select-none py-2 pl-6 pr-4 text-xs ${
                                                                                active
                                                                                    ? 'bg-blue-500 text-white'
                                                                                    : 'text-gray-900'
                                                                            }`
                                                                        }
                                                                        value={
                                                                            project?.project_name
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                            active,
                                                                        }) => (
                                                                            <>
                                                                                {selected ? (
                                                                                    <span
                                                                                        className={`absolute left-0 flex items-center pl-1  ${
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
                                                                                <span
                                                                                    className={`block truncate ${
                                                                                        selected
                                                                                            ? 'font-medium'
                                                                                            : 'font-normal'
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        project?.project_name
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </Combobox.Option>
                                                                ),
                                                            )
                                                        )}
                                                    </Combobox.Options>
                                                </Transition>
                                            </div>
                                        </Combobox>
                                        {errors.projectId && (
                                            <p className="mt-1 text-red-500">
                                                {errors.projectId.message}
                                            </p>
                                        )}
                                    </>
                                )}
                                rules={{
                                    required: 'Please select a project.',
                                }}
                            />
                        </div>
                    </div>
                    </div>
                    <div className='flex flex-row gap-4'>
                    <div className="mb-5 flex flex-col items-start justify-between gap-2">
                        <label
                            htmlFor="start_date"
                            className=" flex items-center justify-center gap-2"
                        >
                            Start Date{' '}
                            <Image
                                src={RequireIcon}
                                className=" justify-center"
                                alt="no image"
                            />
                        </label>
                        <div className="w-full">
                            <Controller
                                name="startDate"
                                control={control}
                                defaultValue={assignCreateData.start_date || ''}
                                render={({ field }) => (
                                    <>
                                        <DatePicker
                                    selected={assignStartDate}
                                    onChange={(date) => {handleStartDateChange(formatDate(date)); setAssignStartDate(date); field.onChange(date)}}
                                    minDate={new Date()}
                                    maxDate={assignEndDate}
                                    className='w-[335px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: false,
                                        }
                                    ]}
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                                        {errors.startDate && (
                                            <p className="text-red-500">
                                                {'Please select a start date.'}
                                            </p>
                                        )}
                                    </>
                                )}
                                rules={{
                                    required: 'Please select a start date.',
                                }}
                            />
                        </div>
                    </div>
                    <div className="mb-5 flex flex-col items-start justify-between gap-2">
                        <label
                            htmlFor="end_data"
                            className=" flex items-center justify-center gap-2"
                        >
                            End Date
                            <Image
                                src={RequireIcon}
                                className=" justify-center"
                                alt="no image"
                            />
                        </label>
                        <div className="w-full">
                            <Controller
                                name="endDate"
                                control={control}
                                defaultValue={assignCreateData.end_date || ''}
                                render={({ field }) => (
                                    <>
                                        <DatePicker
                                            selected={assignEndDate}
                                            onChange={(date) => {handleEndDateChange(formatDate(date)); setAssignEndDate(date); field.onChange(date)}}
                                            minDate={minDate}
                                            className='w-[335px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                                            popperPlacement='bottom-start'
                                            popperModifiers={[
                                                {
                                                    name: 'flip',
                                                    enabled: false,
                                                }
                                            ]}
                                            dateFormat={'yyyy-MM-dd'}
                                            placeholderText='yyyy-mm-dd'
                                        />
                                        {errors.endDate && (
                                            <p className="text-red-500">
                                                {'Please select an end date.'}
                                            </p>
                                        )}
                                    </>
                                )}
                                rules={{
                                    required: 'Please select an end date.',
                                }}
                            />
                        </div>
                    </div>
                    </div>
                </div>
                    <div className="flex flex-row w-[685px] gap-2">
                        <div className="flex w-full">
                        {renderAssignData()}
                        </div>
                    </div>
                <div className="flex w-[685px] flex-col">
                <div className="mb-5 flex flex-row items-start justify-between gap-2 pl-2">
                        <div
                            className="z-1 mb-2 flex w-2/3 flex-row items-start gap-2 underline"
                            onClick={toggleModalBox}
                        >
                            <a href="#" className="font-medium text-blue-500">
                                Add Member
                            </a>
                        </div>
                        {isModalOpen && <ModalComponent />}
                    </div>

                    <div className="mb-2 ml-0 flex flex-row items-start justify-start gap-2">
                        <div>
                            {assignCreateData?.projectEmployees?.length ===
                            0 ? (
                                <button
                                    className={
                                        'mr-2 h-[30px] w-[70px] cursor-not-allowed rounded-md bg-blue-700 text-xs text-white shadow-md shadow-gray-400'
                                    }
                                >
                                    Assign
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit(handleCreate)}
                                    className={
                                        ' mr-2 h-[30px] w-[70px] rounded-md bg-blue-700 text-xs text-white shadow-md shadow-gray-400'
                                    }
                                >
                                    Assign
                                </button>
                            )}

                            <button
                                className="h-[30px] w-[70px] rounded-md bg-red-700 text-white shadow-md shadow-gray-400"
                                onClick={handleCancel}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                
                </div>
                   
            </div>
        </div>
    )
}

export default MainAssignForm
