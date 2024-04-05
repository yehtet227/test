'use client'

import { contractStatues } from '@/app/const'
import { paymentStatues } from '@/app/const/paymentStatues'
import {
    clearProjectCreateInfoState,
    setContractNumber,
    setContractStatus,
    setCustomerId,
    setDepartmentId,
    setEndDate,
    setMarketingName,
    setPaymentStatus,
    setProjectName,
    setProjectType,
    setStartDate,
    setUserId,
    setYear,
} from '@/app/store/client/features/project_create/projectCreateInfoSlice'
import { clearJPOrderState, setJpOrderAmount } from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'
import { clearMMOrderState, setMmOrderAmount } from '@/app/store/client/features/project_create/projectCreateMMOrderSlice'
import { clearSESState, setSesOrderAmount } from '@/app/store/client/features/project_create/projectCreateSesInfoSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllCustomers } from '@/app/store/server/features/customers'
import { useGetAllDepartments } from '@/app/store/server/features/departments'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import { useGetAllProjectTypes, useGetAllProjectTypesWithoutSES } from '@/app/store/server/features/project_types'
import {
    useGetAllProjects,
    useGetProjectById,
} from '@/app/store/server/features/projects'
import { useCreateProject } from '@/app/store/server/features/projects/mutations'
import { projectCreateSchema } from '@/app/validation-schemas'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import RequireIcon from '../../../../public/icon/Require.svg'
import Dropdown from '../assign/components/DropDown'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, addDays } from 'date-fns'
import { useInputValidation } from '../../hooks/useInputValidation'
import { useJPProjectCreate } from '../../hooks/useJPProjectCreate'
import { useMMProjectCreate } from '../../hooks/useMMProjectCreate'
import { useSESProjectCreate } from '../../hooks/useSESProjectCreate'



const years = Array.from(
    { length: 4 },
    (_, index) => new Date().getFullYear() + index,
)

const MainForm = () => {
    const [selectedProject, setSelectedProject] = useState()
    const [clearSelected, setClearSelected] = useState(false)
    const [errMsg, setErrMsg] = useState(false)
    const [edit, setEdit] = useState(false)
    const [paymentStatus, setPaymentStatus2] = useState(null)
    const [paymentQuery, setPaymentQuery] = useState('')
    const [contractStatus, setContractStatus2] = useState(null)
    const [contractQuery, setContractQuery] = useState('')
    const [projectType, setProjectType2] = useState(null)
    const [projectTypeQuery, setProjectTypeQuery] = useState('')
    const [department, setDepartment] = useState(null)
    const [departmentQuery, setDepartmentQuery] = useState('')
    const [marketingName, setMarketingName2] = useState(null)
    const [marketingNameQuery, setMarketingNameQuery] = useState('')
    const [selected, setSelected] = useState(years[0])
    const [contractStartDate, setContractStartDate] = useState('')
    const [contractEndDate, setContractEndDate] = useState('')
    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const toggleComboBox = () => {
        setIsComboboxOpen(!isComboboxOpen)
    }
    const [isCompanyComboBox, setIsCompanyComboBox] = useState(false)
    const toggleCompanyComboBox = () => {
        setIsCompanyComboBox(!isCompanyComboBox)
    }
    const [isDepartmentComboBox, setIsDepartmentComboBox] = useState(false)
    const toggleDepartmentComboBox = () => {
        setIsDepartmentComboBox(!isDepartmentComboBox)
    }
    const [isMarketingComboBox, setIsMarketingComboBox] = useState(false)
    const toggleMarketingComboBox = () => {
        setIsMarketingComboBox(!isMarketingComboBox)
    }
    const [isProjectTypeComboBox, setIsProjectTypeComboBox] = useState(false)
    const toggleProjectTypeComboBox = () => {
        setIsProjectTypeComboBox(!isProjectTypeComboBox)
    }
    const [query, setQuery] = useState('')
    const filteredYears = years.filter((year) =>
        year.toString().includes(query.toLowerCase()),
    )
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(projectCreateSchema),
    })
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    const projectCreateInfoState = useSelector(
        (state) => state.projectCreateInfo,
    )
    const projectCreateJpOrderState = useSelector(
        (state) => state.projectCreateJPOrderInfo,
    )
    const projectCreateMMOrderState = useSelector(
        (state) => state.projectCreateMMOrderInfo,
    )

    const projectCreateSESOrderState = useSelector((state) => state.projectCreateSesInfo)
    useEffect(() => {
        if(projectCreateInfoState?.projectType) {
            setSelectedProject(projectCreateInfoState?.projectType.project_type)
        }
        dispatch(setYear(years[0]))
    }, [dispatch, projectCreateInfoState?.projectType])
    const { data: companies } = useGetAllCustomers()
    const { data: employees } = useGetAllEmployees()

    const [companyQuery, setCompanyQuery] = useState('')
    const [company, setCompany] = useState(null)
    const filteredCompanies =
        companyQuery === ''
            ? companies
            : companies?.filter((company) =>
                  company?.customer_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, '')),
              )
    const filteredPaymentStatues =
        paymentQuery === ''
            ? paymentStatues
            : paymentStatues?.filter((payment) =>
                  payment?.status
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(paymentQuery.toLowerCase().replace(/\s+/g, '')),
              )
    const filteredContractStatues =
        contractQuery === ''
            ? contractStatues
            : contractStatues?.filter((contract) =>
                  contract?.type
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(
                          contractQuery.toLowerCase().replace(/\s+/g, ''),
                      ),
              )

    const { data: departments } = useGetAllDepartments()
    const { data: projectTypes } = useGetAllProjectTypesWithoutSES()
    

    const filteredDepartments =
        departmentQuery === ''
            ? departments
            : departments?.filter((department) =>
                  department?.department_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(
                          departmentQuery.toLowerCase().replace(/\s+/g, ''),
                      ),
              )

    const filteredMarketingNames =
        marketingNameQuery === ''
            ? employees
            : employees?.filter((employee) =>
                  employee?.emp_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(
                          marketingNameQuery.toLowerCase().replace(/\s+/g, ''),
                      ),
              )

    const filteredProjecTypes =
        projectTypeQuery === ''
            ? projectTypes
            : projectTypes?.filter((projectType) =>
                  projectType?.project_type
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(
                          projectTypeQuery.toLowerCase().replace(/\s+/g, ''),
                      ),
              )

    const sesProject =
        projectCreateInfoState?.projectType.project_type === 'SES(Offshore)'
    const jpProject =
        projectCreateInfoState?.projectType.project_type === 'Offshore(Japan)'
    const mmProject =
        projectCreateInfoState?.projectType.project_type === 'Offshore(Myanmar)'
    const jpMMProject =
        projectCreateInfoState?.projectType.project_type ===
            'Offshore(Japan/Myanmar)' ||
        projectCreateInfoState?.projectType.project_type ===
            'Offshore(Japan+Myanmar)'
    const router = useRouter()

    const handleCompanyChange = (company) => {
        setCompany(company)
        dispatch(setCustomerId(company))
    }

    const handleYearChange = (year) => {
        dispatch(setYear(year))
        setSelected(year)
    }
    const handleProjectNameChange = (name) => {
        dispatch(setProjectName(name))
    }

    const handleContractNumberChange = (contractNumber) => {
        dispatch(setContractNumber(contractNumber))
    }

    const handleCustomerIdChange = (customerId) => {
        dispatch(setCustomerId(customerId))
    }

    const handlePaymentStatusChange = (paymentStatus) => {
        setPaymentStatus2(paymentStatus)
        dispatch(setPaymentStatus(paymentStatus))
    }

    const handleDepartmentIdChange = (departmentId) => {
        dispatch(setDepartmentId(departmentId))
    }

    const handleMarketingNameChange = (marketingName) => {
        dispatch(setMarketingName(marketingName))
    }
    const {formatDate, countMonthsInclusive} = useInputValidation();
    const  {calculateJPOrderAmount} = useJPProjectCreate();
    const {calculateMMOrderAmount } = useMMProjectCreate();
    const {calculateSESOrderAmount} = useSESProjectCreate()
    const handleStartDateChange = (startDate) => {
        if(startDate !== null) {
            dispatch(setStartDate(formatDate(startDate)));
            const months = countMonthsInclusive(startDate, projectCreateInfoState?.endDate);
            console.log(months)
            if (projectCreateInfoState?.projectType?.project_type?.includes('SES')) {
                calculateSESOrderAmount(months)
            } else if (projectCreateInfoState?.projectType?.project_type?.includes('Offshore(Japan)')) {
                calculateJPOrderAmount(months)
            } else if (projectCreateInfoState?.projectType?.project_type?.includes('Offshore(Myanmar)')) {
                calculateMMOrderAmount(months)
            } else {
                calculateJPOrderAmount(months)
                calculateMMOrderAmount(months)
            }
        } else {
            dispatch(setStartDate(''))
        }
    }

    function dateToYMD(end_date) {
        var ed = new Date(end_date)
        var d = ed.getDate()
        var m = ed.getMonth() + 1
        var y = ed.getFullYear()
        return (
            '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d)
        )
    }

    const handleEndDateChange = (endDate) => {
        if(endDate !== null) {
            dispatch(setEndDate(formatDate(endDate)))
            const months = countMonthsInclusive(projectCreateInfoState?.startDate, endDate);
            console.log(months)
            if (projectCreateInfoState?.projectType?.project_type?.includes('SES')) {
                calculateSESOrderAmount(months)
            } else if (projectCreateInfoState?.projectType?.project_type?.includes('Offshore(Japan)')) {
                calculateJPOrderAmount(months)
            } else if (projectCreateInfoState?.projectType?.project_type?.includes('Offshore(Myanmar)')) {
                calculateMMOrderAmount(months)
            } else {
                calculateJPOrderAmount(months)
                calculateMMOrderAmount(months)
            }
        } else {
            dispatch(setEndDate(''))
        }
    }

    const handleContractStatusChange = (status) => {
        setContractStatus2(status)
        dispatch(setContractStatus(status))
    }

    const handleUserIdChange = (userId) => {
        dispatch(setUserId(userId))
    }

    const handleProjectTypeIdChange = (projectType) => {
        dispatch(setProjectType(projectType))
        setSelectedProject(projectType?.project_type)
    }

    const handleProjectChoose = (project) => {
        setSelectedProject(project.project_type)
        handleProjectTypeIdChange(project)
    }

    const handleCancel = () => {
        dispatch(clearProjectCreateInfoState())
        dispatch(clearJPOrderState())
        dispatch(clearMMOrderState())
        setClearSelected(true)
        setSelectedProject(null)
        router.push('/projects')
    }

    const handleClearSelected = () => {
        setClearSelected(false)
    }

    const goToSES = () => {
        if (Object.keys(errors).length === 0) {
            router.push('/en/projects/create/ses-order')
        }
    }

    const goToJP = () => {
        if (Object.keys(errors).length === 0) {
            router.push('/en/projects/create/japan-order')
        }
    }

    const goToMM = () => {
        if (Object.keys(errors).length === 0) {
            router.push('/en/projects/create/myanmar-order')
        }
    }

    const goToJPMM = () => {
        if (Object.keys(errors).length === 0) {
            router.push('/en/projects/create/japan-myanmar-order')
        }
    }
    let parsedStartDate;
    if(projectCreateInfoState?.startDate) {
        parsedStartDate = parseISO(projectCreateInfoState?.startDate)
        if(parsedStartDate < new Date()) {
            parsedStartDate = ""
        }
    }
    let parsedEndDate;
    if(projectCreateInfoState?.endDate) {
        parsedEndDate = parseISO(projectCreateInfoState?.endDate)
        if(parsedEndDate < new Date()) {
            parsedEndDate = ""
        }
    }

    let minEndDate; 
    if(projectCreateInfoState?.startDate) {
        if(parsedStartDate < new Date()) {
            minEndDate = new Date()
            minEndDate = addDays(minEndDate, 1)
        } else {
            minEndDate = addDays(parsedStartDate, 1)
        }
    }

    return (
        <div className="mb-4 flex flex-col">
            <div
                className="sticky top-0 flex w-full flex-col gap-2 bg-white py-[13.3px]"
                style={{ zIndex: 1000 }}
            >
                <div className="flex flex-row items-center gap-4">
                    <div className="cursor-pointer" onClick={toggleSideBar}>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    </div>

                    <h3 className="text-sm font-medium">
                        <Link href={'/en/projects'}>Project</Link> &gt; Project
                        Creation
                    </h3>
                </div>
            </div>

            <div
                className="mb-2 flex flex-col justify-center rounded-md px-4 py-8"
                style={{ border: '1.5px solid #e2e8f0' }}
            >
                <h1 className="text-center text-sm font-medium">
                    Project Creation
                </h1>

                <div className="mt-6 flex w-full flex-col self-center">
                    <div className="flex flex-row justify-center gap-x-24">
                        <div className="ml-5 flex w-[700px] flex-col">
                            <div className='flex flex-row gap-x-4'>
                            <div className="mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '110'}}>
                                <label
                                    htmlFor="year"
                                    className="flex gap-2 text-xs"
                                >
                                    Year
                                </label>
                                <Combobox
                                    value={selected}
                                    onChange={(year) => handleYearChange(year)}
                                >
                                    <div className="relative mt-1 border-gray-300">
                                        <div className="relative w-full cursor-default  rounded-lg border-gray-300 text-left focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                            <Combobox.Input
                                                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs leading-5 text-gray-900 focus:outline-slate-300 "
                                                style={{ height: '35px' }}
                                                value={
                                                    selected ||
                                                    projectCreateInfoState?.year
                                                }
                                                onChange={(event) =>
                                                    setQuery(event.target.value)
                                                }
                                            />
                                            <Combobox.Button
                                                className="absolute inset-y-0 right-0 flex items-center border-gray-300 pr-2"
                                                style={{ height: '35px' }}
                                                onClick={toggleComboBox}
                                            >
                                                <ChevronDownIcon
                                                    className={`h-4 w-4 text-gray-500 ${
                                                        isComboboxOpen
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
                                                setQuery('')
                                                setIsComboboxOpen(false)
                                            }}
                                        >
                                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {filteredYears.length === 0 &&
                                                query !== '' ? (
                                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                        Nothing found.
                                                    </div>
                                                ) : (
                                                    filteredYears.map(
                                                        (year) => (
                                                            <Combobox.Option
                                                                key={year}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-6 pr-4 text-xs ${
                                                                        active
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'text-gray-900'
                                                                    }`
                                                                }
                                                                value={year}
                                                            >
                                                                {({
                                                                    selected,
                                                                    active,
                                                                }) => (
                                                                    <>
                                                                        {selected ? (
                                                                            <span
                                                                                className={`absolute left-0 flex items-center pl-1 text-blue-500 ${
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
                                                                                year
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
                                {(projectCreateInfoState?.year === '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-xs text-red-500">
                                        Please select a year
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="z-50 mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '90'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Customer Name{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <Controller
                                    name="company"
                                    control={control}
                                    defaultValue={
                                        projectCreateInfoState?.customerId?.customer_name
                                            || ''
                                    }
                                    render={({ field }) => (
                                        <Combobox
                                            value={field.value}
                                            onChange={(selectedCompany) => {
                                                field.onChange(selectedCompany)
                                                const dispatchCompany = companies.find(company => company.customer_name === selectedCompany);
                                                handleCompanyChange(
                                                    dispatchCompany,
                                                )
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
                                                            projectCreateInfoState
                                                                ?.customerId
                                                                ?.customer_name
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
                                    )}
                                />
                                {errors.company && (
                                    <p className="text-xs text-red-500">
                                        {'Please select a company.'}
                                    </p>
                                )}

                                {(projectCreateInfoState?.customerId === '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select a customer
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>
                            </div>

                            <div className='flex flex-row gap-x-4'>
                            <div className="mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '90'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Project Type{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <Controller
                                    name="projectType"
                                    control={control}
                                    defaultValue={
                                        projectCreateInfoState?.projectType
                                            ?.project_type || ''
                                    }
                                    render={({ field }) => (
                                        
                                        <Dropdown
                                            options={projectTypes}
                                            initialValue={projectCreateInfoState?.projectType
                                                ?.project_type}
                                            generateLabel={(projectType) =>
                                                projectType?.project_type
                                            }
                                            onSelect={(projectType) => {
                                                field.onChange(projectType?.project_type)
                                                handleProjectTypeIdChange(
                                                    projectType
                                                )
                                            }}
                                            clearSelected={clearSelected}
                                            onClearSelected={
                                                handleClearSelected
                                            }
                                        />
                                    )}
                                />
                                {errors.projectType && (
                                    <p className="text-xs text-red-500">
                                        {errors.projectType.message}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4 w-full space-y-2">
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Project Name
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <Controller
                                    name="title"
                                    control={control}
                                    defaultValue={projectCreateInfoState?.projectName || ''}
                                    render={({ field }) => (
                                        <>
                                            <input
                                                value={
                                                    projectCreateInfoState?.projectName ||
                                                    ''
                                                }
                                                type="text"
                                                id="title"
                                                className="h-35 w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                                                style={{ height: '35px' }}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleProjectNameChange(
                                                        e.target.value,
                                                    )
                                                }}
                                            />
                                            {errors.title && (
                                                <p className="text-xs text-red-500">
                                                    {errors.title.message}
                                                </p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            </div>

                            <div className='flex flex-row gap-x-4'>
                            <div className="z-30 mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '80'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Department{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <Controller
                                    name="departmentId"
                                    control={control}
                                    defaultValue={
                                        projectCreateInfoState?.departmentId
                                            ?.department_name || ''
                                    }
                                    render={({ field }) => (
                                        <Dropdown
                                            options={filteredDepartments}
                                            initialValue={projectCreateInfoState
                                                ?.departmentId
                                                ?.department_name}
                                            generateLabel={(department) =>
                                                department?.department_name
                                            }
                                            onSelect={(department) => {
                                                field.onChange(department?.department_name)
                                                handleDepartmentIdChange(
                                                    department,
                                                )
                                            }}
                                            clearSelected={clearSelected}
                                            onClearSelected={
                                                handleClearSelected
                                            }
                                        />
                                       
                                    )}
                                />
                                {errors.departmentId && (
                                    <p className="text-xs text-red-500">
                                        {'Please select a department.'}
                                    </p>
                                )}
                            </div>

                            <div className="z-20  w-full space-y-2 text-xs"style={{position: 'relative', zIndex: '80'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 "
                                >
                                    Marketing{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <Controller
                                    name="marketingName"
                                    control={control}
                                    defaultValue={
                                        projectCreateInfoState?.marketingName ||
                                        ''
                                    }
                                    render={({ field }) => (
                                        <Combobox
                                            value={field.value}
                                            onChange={(employeeName) => {
                                                field.onChange(
                                                    employeeName,
                                                )
                                                handleMarketingNameChange(
                                                    employeeName,
                                                )
                                            }}
                                        >
                                            <div className="relative mt-1">
                                                <div className="relative w-full cursor-default rounded-lg text-left focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                                    <Combobox.Input
                                                        className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs  leading-5 text-gray-900 focus:outline-slate-300 "
                                                        style={{
                                                            height: '35px',
                                                        }}
                                                        displayValue={(
                                                            employee,
                                                        ) =>
                                                            employee?.emp_name ||
                                                            projectCreateInfoState?.marketingName
                                                        }
                                                        onChange={(event) =>
                                                            setMarketingNameQuery(
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
                                                            toggleMarketingComboBox
                                                        }
                                                    >
                                                        <ChevronDownIcon
                                                            className={`h-4 w-4 text-gray-500 ${
                                                                isMarketingComboBox
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
                                                        setMarketingNameQuery(
                                                            '',
                                                        )
                                                        setIsMarketingComboBox(
                                                            false,
                                                        )
                                                    }}
                                                >
                                                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {filteredMarketingNames?.length ===
                                                            0 &&
                                                        marketingNameQuery !==
                                                            '' ? (
                                                            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                                Nothing found.
                                                            </div>
                                                        ) : (
                                                            filteredMarketingNames?.map(
                                                                (
                                                                    employee,
                                                                    index,
                                                                ) => (
                                                                    <Combobox.Option
                                                                        key={
                                                                            index
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
                                                                            employee?.emp_name
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
                                                                                                ? 'text-white '
                                                                                                : 'text-blue-500'
                                                                                        }`}
                                                                                    >
                                                                                        <CheckIcon
                                                                                            className="h-4 w-4 text-white"
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
                                                                                        employee?.emp_name 
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
                                    )}
                                />
                                {errors.marketingName && (
                                    <p className="text-xs text-red-500">
                                        {errors.marketingName.message}
                                    </p>
                                )}
                            </div>  
                            </div>

                            <div className='flex flex-row gap-x-4 mb-4'>
                            <div className="z-10 w-full space-y-2 " style={{position: 'relative', zIndex: '70'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Contract Status{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <Controller
                                    name="contractStatus"
                                    control={control}
                                    defaultValue={
                                        projectCreateInfoState?.contractStatus ===
                                        0
                                            ? 'Waiting'
                                            : projectCreateInfoState?.contractStatus ===
                                              1
                                            ? 'Contracted'
                                            : ''
                                    }
                                    render={({ field }) => (
                                        <Dropdown
                                            options={contractStatues}
                                            initialValue={projectCreateInfoState?.contractStatus ===
                                                0
                                                    ? 'Waiting'
                                                    : projectCreateInfoState?.contractStatus ===
                                                      1
                                                    ? 'Contracted'
                                                    : ''}
                                            generateLabel={(option) =>
                                                option?.type
                                            }
                                            onSelect={(option) => {
                                                field.onChange(option.type)
                                                handleContractStatusChange(
                                                    option.id,
                                                )
                                            }}
                                            clearSelected={clearSelected}
                                            onClearSelected={
                                                handleClearSelected
                                            }
                                        />
                                    )}
                                />
                                {errors.contractStatus && (
                                    <p className="text-xs text-red-500">
                                        {'Please a contract status.'}
                                    </p>
                                )}
                            </div>
                            <div className=" w-full ">
                                <label htmlFor="contract" className="text-xs">
                                    Contract Number
                                </label>
                                <input
                                    value={
                                        '' ||
                                        projectCreateInfoState?.contractNumber
                                    }
                                    onChange={(e) =>
                                        handleContractNumberChange(
                                            e.target.value,
                                        )
                                    }
                                    type="text"
                                    id="contract"
                                    name="contract"
                                    className="w-full h-35 rounded-md border px-2 text-xs focus:outline-slate-300"
                                    style={{ height: '35px' }}
                                />
                                {(projectCreateInfoState?.contractNumber ===
                                    '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please enter contract number
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>
                            </div>

                            <div className='flex flex-row gap-x-4'>
                            <div className="mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '60'}}>
                                <label htmlFor="start_date" className="text-xs">
                                    Contract Start Date
                                </label>
                                <div className="relative">
                                <DatePicker
                                    selected={contractStartDate || parsedStartDate}
                                    onChange={(date) => {handleStartDateChange(date); setContractStartDate(date)}}
                                    minDate={new Date()}
                                    className='w-[340px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50 border-gray-300'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: false,
                                        },
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                altAxis: true,
                                                tether: false,
                                                rootBoundary: 'viewport',
                                            },
                                        },
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 10],
                                            },
                                        }
                                    ]}
                                    popperClassName='absolute'
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                                </div>
                            </div>

                            <div className="mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '20'}}>
                                <label htmlFor="end_date" className="text-xs">
                                    Contract End Date
                                </label>
                                <div className="relative">
                                <DatePicker
                                    selected={contractEndDate || parsedEndDate}
                                    onChange={(date) => {handleEndDateChange(date); setContractEndDate(date)}}
                                    minDate={minEndDate || new Date()}
                                    className='w-[340px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50 border-gray-300'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: false,
                                        },
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                altAxis: true,
                                                tether: false,
                                                rootBoundary: 'viewport',
                                            },
                                        },
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 10],
                                            },
                                        }
                                    ]}
                                    popperClassName='absolute'
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                                </div>
                            </div>
                            </div>

                            <div className='flex flex-row gap-x-4'>
                            <div className="z-40 mb-6 w-full space-y-2" style={{position: 'relative', zIndex: '40'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Payment Status{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <Controller
                                    name="paymentStatus"
                                    control={control}
                                    defaultValue={
                                        projectCreateInfoState?.paymentStatus ===
                                        0
                                            ? 'Waiting'
                                            : projectCreateInfoState?.paymentStatus ===
                                              1
                                            ? 'Paid'
                                            : ''
                                    }
                                    render={({ field }) => (
                                        <Dropdown
                                            options={paymentStatues}
                                            initialValue={projectCreateInfoState?.paymentStatus ===
                                                0
                                                    ? 'Waiting'
                                                    : projectCreateInfoState?.paymentStatus ===
                                                      1
                                                    ? 'Paid'
                                                    : ''}
                                            generateLabel={(option) =>
                                                option?.status
                                            }
                                            onSelect={(option) => {
                                                field.onChange(option.status)
                                                handlePaymentStatusChange(
                                                    option.id,
                                                )
                                            }}
                                            clearSelected={clearSelected}
                                            onClearSelected={
                                                handleClearSelected
                                            }
                                        />
                                    )}
                                />
                                {errors.paymentStatus && (
                                    <p className="text-xs text-red-500">
                                        {'Please select a payment status'}
                                    </p>
                                )}
                            </div>
                            <div className='w-full'></div>
                            </div>

                            <div className="flex flex-row  gap-x-2">
                                <div className="mr-32 flex w-full justify-start gap-4">
                                    {selectedProject && selectedProject?.includes('SES') ? (
                                        <>
                                            <button
                                                className="w-full rounded-md bg-blue-700 text-center text-xs text-white shadow-md shadow-gray-400"
                                                style={{ height: '30px', width: '70px' }}
                                                onClick={handleSubmit(goToSES)}
                                            >
                                                Next
                                            </button>
                                        </>
                                    ) : selectedProject?.includes('Offshore(Japan)') ? (
                                        <>
                                            <button
                                                className="w-full rounded-md bg-blue-700 text-xs text-white shadow-md shadow-gray-400"
                                                style={{ height: '30px', width: '70px' }}
                                                onClick={handleSubmit(goToJP)}
                                            >
                                                Next
                                            </button>
                                        </>
                                    ) : selectedProject?.includes('Offshore(Myanmar)') ? (
                                        <>
                                            <button
                                                className="w-full rounded-md bg-blue-700 text-xs text-white shadow-md shadow-gray-400"
                                                style={{ height: '30px', width: '70px' }}
                                                onClick={handleSubmit(goToMM)}
                                            >
                                                Next
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="w-full rounded-md bg-blue-700 text-xs text-white shadow-md shadow-gray-400"
                                                style={{ height: '30px', width: '70px' }}
                                                onClick={handleSubmit(goToJPMM)}
                                            >
                                                Next
                                            </button>
                                        </>
                                    )}

                                    <button
                                        className="shadow-gray-40 w-full rounded-md bg-red-700 text-xs text-white  shadow-md"
                                        onClick={handleCancel}
                                        style={{ height: '30px', width: '70px' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainForm
