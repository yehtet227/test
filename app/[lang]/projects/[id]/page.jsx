'use client'

import DropDown from '@/app/[lang]/engineers-info/assign/components/DropDown'
import { contractStatues, projectTypes } from '@/app/const'
import { paymentStatues } from '@/app/const/paymentStatues'
import {
    clearProjectCreateInfoState,
    setAllProjectInfo,
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
import {
    clearJPOrderState,
    setAllJPOrderInfo,
} from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'
import {
    clearMMOrderState,
    setAllMMOrderInfo,
} from '@/app/store/client/features/project_create/projectCreateMMOrderSlice'
import { setAllSESOrderInfo } from '@/app/store/client/features/project_create/projectCreateSesInfoSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { setCurrentURL } from '@/app/store/client/features/url_track/urlTrackSlice'
import { useGetAllCustomers } from '@/app/store/server/features/customers'
import { useGetAllDepartments } from '@/app/store/server/features/departments'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import { useGetAllProjectTypes } from '@/app/store/server/features/project_types'
import {
    useGetAllProjects,
    useGetProjectById,
} from '@/app/store/server/features/projects'
import { useCreateProject } from '@/app/store/server/features/projects/mutations'
import { Combobox, Transition } from '@headlessui/react'
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import RequireIcon from '../../../../public/icon/Require.svg'
import Dropdown from '../assign/components/DropDown'
import 'react-datepicker/dist/react-datepicker.css';
import {parseISO, addDays} from 'date-fns'
import { useInputValidation } from '../../hooks/useInputValidation'
import { useJPProjectCreate } from '../../hooks/useJPProjectCreate'
import { useMMProjectCreate } from '../../hooks/useMMProjectCreate'
import { useSESProjectCreate } from '../../hooks/useSESProjectCreate'


const years = Array.from(
    { length: 4 },
    (_, index) => new Date().getFullYear() + index,
)

const MainForm = ({ params }) => {
    const [selectedProject, setSelectedProject] = useState(null)
    const [clearSelected, setClearSelected] = useState(false)
    const [errMsg, setErrMsg] = useState(false)
    const [edit, setEdit] = useState(false)
    const [selected, setSelected] = useState(years[0])
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
    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const [contractStartDate, setContractStartDate] = useState('')
    const [contractEndDate, setContractEndDate] = useState('')
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
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    const projectCreateInfoState = useSelector(
        (state) => state.projectCreateInfo,
    )
    
    const { data: project, refetch } = useGetProjectById(params.id)
    const router = useRouter()
    useEffect(() => {
        refetch()
    }, [refetch])
    useEffect(() => {
        dispatch(
            setAllProjectInfo({
                year: project?.[0].project.year,
                projectName: project?.[0].project.project_name,
                contractNumber: project?.[0].project.contract_number,
                customerId: project?.[0].project?.customer,
                paymentStatus:
                    project?.[0].project.payment_status === 'paid' ? 1 : 0,
                departmentId: project?.[0].project?.department,
                marketingName: project?.[0].project?.marketing_name,
                startDate: project?.[0].project.start_date,
                endDate: project?.[0].project.end_date,
                userId: project?.[0].project.user_id,
                contractStatus:
                    project?.[0].project.contract_status === 'contracted'
                        ? 1
                        : 0,
                projectType: project?.[0].project_type,
            }),
        )
        dispatch(
            setAllJPOrderInfo({
                jpProjectLeader: project?.[0].jp_project_leader,
                jpEsitmateNumber: project?.[0].jp_estimate_number,
                jpApprovalNumber: project?.[0].jp_approval_number,
                jpOrderNumber: project?.[0].jp_order_number,
                jpDeliveryDate: project?.[0].jp_delivery_date,
                jpManMonth: project?.[0].jp_man_month,
                jpAvgUnitPrice: project?.[0].jp_average_unit_price,
                jpPMManMonth: project?.[0].jp_pm_man_month,
                jpPMUnitPrice: project?.[0].jp_pm_average_unit_price,
                jpPLManMonth: project?.[0].jp_pl_man_month,
                jpPLUnitPrice: project?.[0].jp_pl_average_unit_price,
                jpSEManMonth: project?.[0].jp_se_man_month,
                jpSEUnitPrice: project?.[0].jp_se_average_unit_price,
                jpPGManMonth: project?.[0].jp_pg_man_month,
                jpPGUnitPrice: project?.[0].jp_pg_average_unit_price,
                jpOHManMonth: project?.[0].jp_oh_man_month,
                jpOHUnitPrice: project?.[0].jp_oh_average_unit_price,
                jpOrderAmount: project?.[0].jp_order_amount,
                jpAcceptanceBillingDate:
                    project?.[0].jp_acceptance_billing_date,
                jpPaymentDate: project?.[0].jp_payment_date,
            }),
        )
        dispatch(
            setAllMMOrderInfo({
                mmProjectLeader: project?.[0].mm_project_leader,
                mmEsitmateNumber: project?.[0].mm_estimate_number,
                mmApprovalNumber: project?.[0].mm_approval_number,
                mmOrderNumber: project?.[0].mm_order_number,
                mmDeliveryDate: project?.[0].mm_delivery_date,
                mmManMonth: project?.[0].mm_man_month,
                mmAvgUnitPrice: project?.[0].mm_average_unit_price,
                mmPMManMonth: project?.[0].mm_pm_man_month,
                mmPMUnitPrice: project?.[0].mm_pm_average_unit_price,
                mmPLManMonth: project?.[0].mm_pl_man_month,
                mmPLUnitPrice: project?.[0].mm_pl_average_unit_price,
                mmSEManMonth: project?.[0].mm_se_man_month,
                mmSEUnitPrice: project?.[0].mm_se_average_unit_price,
                mmPGManMonth: project?.[0].mm_pg_man_month,
                mmPGUnitPrice: project?.[0].mm_pg_average_unit_price,
                mmOHManMonth: project?.[0].mm_oh_man_month,
                mmOHUnitPrice: project?.[0].mm_oh_average_unit_price,
                mmOrderAmount: project?.[0].mm_order_amount,
                mmAcceptanceBillingDate:
                    project?.[0].mm_acceptance_billing_date,
                mmPaymentDate: project?.[0].mm_payment_date,
            }),
        )

        dispatch(
            setAllSESOrderInfo({
                sesProjectLeader: project?.[0].ses_project_leader,
                sesEstimateNumber: project?.[0].ses_estimate_number,
                sesApprovalNumber: project?.[0].ses_approval_number,
                sesOrderNumber: project?.[0].ses_order_number,
                sesDeliveryDate: project?.[0].ses_delivery_date,
                sesManMonth: project?.[0].ses_man_month,
                sesAvgUnitPrice: project?.[0].ses_average_unit_price,
                sesPMManMonth: project?.[0].ses_pm_man_month,
                sesPMUnitPrice: project?.[0].ses_pm_average_unit_price,
                sesPLManMonth: project?.[0].ses_pl_man_month,
                sesPLUnitPrice: project?.[0].ses_pl_average_unit_price,
                sesSEManMonth: project?.[0].ses_se_man_month,
                sesSEUnitPrice: project?.[0].ses_se_average_unit_price,
                sesPGManMonth: project?.[0].ses_pg_man_month,
                sesPGUnitPrice: project?.[0].ses_pg_average_unit_price,
                sesOHManMonth: project?.[0].ses_oh_man_month,
                sesOHUnitPrice: project?.[0].ses_oh_average_unit_price,
                sesOrderAmount: project?.[0].ses_order_amount,
                sesAcceptanceBillingDate:
                    project?.[0].ses_acceptance_billing_date,
                sesPaymentDate: project?.[0].ses_payment_date,
            }),
        )
        
        if(project) {
            if(project?.[0].project.start_date) {
                const startDate = new Date(project?.[0].project.start_date)
                setContractStartDate(parseISO(startDate?.toISOString()))
            }
            if(project?.[0].project.end_date) {
                const endDate = new Date(project?.[0].project.end_date)
                setContractEndDate(parseISO(endDate?.toISOString()))
            }
        }
        
        setSelectedProject(project?.[0].project_type?.project_type)
        dispatch(setYear(project?.[0].project?.year))
        setSelected(project?.[0].project?.year)
    }, [dispatch, project])
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

    const { data: departments } = useGetAllDepartments()

    const filteredDepartments =
        departmentQuery === ''
            ? departments
            : departments?.filter((department) =>
                  department?.department_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(
                          departmentQuery?.toLowerCase().replace(/\s+/g, ''),
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
                          marketingNameQuery?.toLowerCase().replace(/\s+/g, ''),
                      ),
              )

    const handleCompanyChange = (company) => {
        setCompany(company?.customer_name)
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
        setMarketingName2(marketingName)
    }

    const {formatDate, countMonthsInclusive} = useInputValidation();
    const  {calculateJPOrderAmount} = useJPProjectCreate();
    const {calculateMMOrderAmount } = useMMProjectCreate();
    const {calculateSESOrderAmount} = useSESProjectCreate()

    const handleStartDateChange = (startDate) => {
        if(startDate !== null) {
            dispatch(setStartDate(formatDate(startDate)))
            const months = countMonthsInclusive(startDate, projectCreateInfoState?.endDate);
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
    const minDate = contractStartDate ? new Date(contractStartDate.getTime() + 24 * 60 * 60 * 1000) : new Date();
    const handleEndDateChange = (endDate) => {
        if(endDate !== null) {
            dispatch(setEndDate(formatDate(endDate)))
            const months = countMonthsInclusive(projectCreateInfoState?.startDate, endDate);
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
        dispatch(setContractStatus(status))
    }

    const handleUserIdChange = (userId) => {
        dispatch(setUserId(userId))
    }

    const handleProjectTypeIdChange = (projectType) => {
        dispatch(setProjectType(projectType))
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

    const pathname = usePathname().replace(/^\/en/, '')
    useEffect(() => {
        dispatch(setCurrentURL(pathname))
    }, [dispatch, pathname])

    const urlTrackState = useSelector((state) => state.urlTrack)
    const previousURL = urlTrackState?.previousURL

    let parsedStartDate;
    if(projectCreateInfoState?.startDate) {
        parsedStartDate = parseISO(projectCreateInfoState?.startDate)
    }
    let parsedEndDate;
    if(projectCreateInfoState?.endDate) {
        parsedEndDate = parseISO(projectCreateInfoState?.endDate)
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
        <div className="flex w-full flex-col text-xs">
            <div
                className="sticky top-0 flex w-full flex-col gap-2 bg-white py-[10px]"
                style={{ zIndex: 1000 }}
            >
                <div className="flex flex-row items-center gap-4 py-1 text-sm font-medium">
                    <div className="cursor-pointer" onClick={toggleSideBar}>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    </div>

                    {previousURL === '/projects/current' ? (
                        <h3>
                            <Link href={'/en/projects/current'}>Projects</Link>{' '}
                            &gt; Project Edit
                        </h3>
                    ) : (
                        <h3>
                            <Link href={'/en/projects'}>Projects</Link> &gt;
                            Project Edit
                        </h3>
                    )}
                </div>
            </div>

            <div
                className="mb-6 flex flex-col w-full justify-center rounded-md px-4 py-8"
                style={{ border: '1.5px solid #e2e8f0' }}
            >
                <h1 className="text-center text-sm font-medium">
                    Project Edit
                </h1>

                <div className="mt-6 flex w-full flex-col self-center">
                    <div className="flex flex-row justify-center gap-x-24">
                        <div className="ml-5 flex w-[700px] flex-col">
                            <div className='flex flex-row gap-x-4'>
                            <div className="z-50 mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '110'}}>
                                <label htmlFor="year" className="flex text-xs">
                                    Year
                                </label>
                                <Combobox
                                    value={selected}
                                    onChange={(year) => handleYearChange(year)}
                                >
                                    <div className="relative mt-1 border-gray-300">
                                        <div className="relative w-full cursor-default  rounded-lg border-gray-300 text-left focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300">
                                            <Combobox.Input
                                                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs leading-5 text-gray-900 focus:outline-slate-300 "
                                                value={
                                                
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
                                
                            </div>
                            <div className="z-50 mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '110'}}>
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

                                <Combobox
                                    value={company}
                                    onChange={(companyName) =>{
                                        const dispatchCompany = companies.find(company => company.customer_name === companyName);
                                        handleCompanyChange(dispatchCompany)
                                    } 
                                    }
                                >
                                    <div className="relative mt-1">
                                        <div className="relative w-full cursor-default  rounded-lg  text-left  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                            <Combobox.Input
                                                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs leading-5 text-gray-900 focus:outline-slate-300 "
                                                displayValue={(company) =>
                                                    company?.customer_name ||
                                                    projectCreateInfoState
                                                        ?.customerId
                                                        ?.customer_name
                                                }
                                                onChange={(event) =>
                                                    setCompanyQuery(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <Combobox.Button
                                                className="absolute inset-y-0 right-0 flex items-center border-gray-300 pr-2"
                                                style={{ height: '35px' }}
                                                onClick={toggleCompanyComboBox}
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
                                                setIsCompanyComboBox(false)
                                            }}
                                        >
                                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {filteredCompanies?.length ===
                                                    0 && companyQuery !== '' ? (
                                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                        Nothing found.
                                                    </div>
                                                ) : (
                                                    filteredCompanies?.map(
                                                        (company, index) => (
                                                            <Combobox.Option
                                                                key={index}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-6 pr-4 text-xs ${
                                                                        active
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'text-gray-900'
                                                                    }`
                                                                }
                                                                value={company?.customer_name}
                                                            >
                                                                {({
                                                                    selected,
                                                                    active,
                                                                }) => (
                                                                    <>
                                                                        <span
                                                                            className={`block truncate ${
                                                                                selected
                                                                                    ? 'font-medium'
                                                                                    : 'font-normal'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                company.customer_name
                                                                            }
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
                                                        ),
                                                    )
                                                )}
                                            </Combobox.Options>
                                        </Transition>
                                    </div>
                                </Combobox>
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
                             <div className="mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '80'}}>
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
                                <Dropdown
                                    options={projectTypes}
                                    initialValue={
                                        projectCreateInfoState?.projectType
                                            ?.project_type
                                    }
                                    generateLabel={(option) =>
                                        option?.project_type
                                    }
                                    onSelect={(option) =>
                                        handleProjectChoose(option)
                                    }
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
                                    disabled={true}
                                />
                                {projectCreateInfoState?.projectType === null &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select a project type
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>
                             <div className="mb-4 w-full space-y-2">
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Project Name{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>
                                <input
                                    value={
                                        projectCreateInfoState?.projectName || ''
                                    }
                                    onChange={(e) =>
                                        handleProjectNameChange(e.target.value)
                                    }
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                                    style={{ height: '35px' }}
                                />
                                {projectCreateInfoState?.projectName === '' ||
                                null ? (
                                    <p className="text-xs text-red-500">
                                        Please enter project name.
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>
                             </div>       
                            
                            <div className='flex flex-row gap-x-4'>
                            <div className="z-30 mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '70'}}>
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

                                <Dropdown
                                            options={filteredDepartments}
                                            initialValue={projectCreateInfoState
                                                ?.departmentId
                                                ?.department_name}
                                            generateLabel={(department) =>
                                                department?.department_name
                                            }
                                            onSelect={(department) => {
                                                handleDepartmentIdChange(
                                                    department,
                                                )
                                            }}
                                            clearSelected={clearSelected}
                                            onClearSelected={
                                                handleClearSelected
                                            }
                                            isEdit={true}
                                        />
                                {(projectCreateInfoState?.departmentId === '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select a department
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="z-20 mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '70'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2 text-xs"
                                >
                                    Marketing{' '}
                                    <Image
                                        src={RequireIcon}
                                        className=" justify-center"
                                        alt="no image"
                                    />
                                </label>

                                <Combobox
                                    value={marketingName}
                                    onChange={(employee) => {
                                        handleMarketingNameChange(
                                            employee,
                                        )
                                    }}
                                >
                                    <div className="relative mt-1">
                                        <div className="relative w-full cursor-default  rounded-lg  text-left  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                            <Combobox.Input
                                                className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs leading-5 text-gray-900 focus:outline-slate-300 "
                                                style={{ height: '35px' }}
                                                displayValue={(employee) =>
                                                    employee?.emp_name ||
                                                    projectCreateInfoState?.marketingName
                                                }
                                                onChange={(event) =>
                                                    setMarketingNameQuery(
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <Combobox.Button
                                                className="absolute inset-y-0 right-0 flex items-center border-gray-300 pr-2"
                                                style={{ height: '35px' }}
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
                                                setMarketingNameQuery('')
                                                setIsMarketingComboBox(false)
                                            }}
                                        >
                                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                {filteredMarketingNames?.length ===
                                                    0 &&
                                                marketingNameQuery !== '' ? (
                                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                        Nothing found.
                                                    </div>
                                                ) : (
                                                    filteredMarketingNames?.map(
                                                        (employee, index) => (
                                                            <Combobox.Option
                                                                key={index}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    `relative cursor-default select-none py-2 pl-6 pr-4  ${
                                                                        active
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'text-gray-900'
                                                                    }`
                                                                }
                                                                value={employee?.emp_name}
                                                            >
                                                                {({
                                                                    selected,
                                                                    active,
                                                                }) => (
                                                                    <>
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
                                                                        {selected ? (
                                                                            <span
                                                                                className={`absolute inset-y-0 left-0 flex items-center pl-1 text-xs ${
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
                                                        ),
                                                    )
                                                )}
                                            </Combobox.Options>
                                        </Transition>
                                    </div>
                                </Combobox>
                                {(projectCreateInfoState?.marketingName ===
                                    '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select a marketing name
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>
                            </div>

                            <div className="flex flex-row gap-x-4">
                            <div className="z-10 mb-4 w-full " style={{position: 'relative', zIndex: '60'}}>
                                <label
                                    htmlFor="title"
                                    className=" flex items-center gap-2"
                                >
                                    Contract Status{' '}
                                    <p className="mt-2 text-red-700">*</p>
                                </label>

                                <Dropdown
                                    options={contractStatues}
                                    initialValue={
                                        projectCreateInfoState?.contractStatus ===
                                        0
                                            ? 'Waiting'
                                            : projectCreateInfoState?.contractStatus ===
                                              1
                                            ? 'Contracted'
                                            : ''
                                    }
                                    generateLabel={(option) => option?.type}
                                    onSelect={(option) => {
                                        handleContractStatusChange(option.id)
                                    }}
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
                                    isEdit={true}
                                />
                                
                            </div>
                            <div className="mb-4 w-full space-y-2">
                                <label htmlFor="contract" className="text-xs">
                                    Contract Number
                                </label>
                                <input
                                    value={
                                        projectCreateInfoState?.contractNumber || ''
                                    }
                                    onChange={(e) =>
                                        handleContractNumberChange(
                                            e.target.value,
                                        )
                                    }
                                    type="text"
                                    id="contract"
                                    name="contract"
                                    className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
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

                            <div className="flex flex-row gap-x-4">
                            <div className="mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '50'}}>
                                <label htmlFor="start_date" className="text-xs">
                                    Contract Start Date
                                </label>
                                <div className="relative">
                                <DatePicker
                                    selected={contractStartDate || parsedStartDate}
                                    onChange={(date) => {handleStartDateChange(date); setContractStartDate(date)}}
                                    minDate={new Date()}
                                    className='w-[340px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
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

                            <div className="mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '40'}}>
                                <label htmlFor="end_date" className="text-xs">
                                    Contract End Date
                                </label>
                                <div className="relative">
                                <DatePicker
                                    selected={contractEndDate || parsedEndDate}
                                    onChange={(date) => {handleEndDateChange(date); setContractEndDate(date)}}
                                    minDate={minEndDate || new Date()}
                                    className='w-[340px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
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

                            <div className="flex flex-row gap-x-4">
                            <div className="z-40 mb-4 w-full space-y-2" style={{position: 'relative', zIndex: '30'}}>
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
                                <Dropdown
                                    options={paymentStatues}
                                    initialValue={
                                        projectCreateInfoState?.paymentStatus ===
                                        0
                                            ? 'Waiting'
                                            : projectCreateInfoState?.paymentStatus ===
                                              1
                                            ? 'Paid'
                                            : ''
                                    }
                                    generateLabel={(option) => option?.status}
                                    onSelect={(option) => {
                                        handlePaymentStatusChange(option.id)
                                    }}
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
                                    isEdit={true}
                                />
                               
                            </div>
                            <div className="w-full"></div>
                            </div>
                            
                            <div className="flex flex-row  gap-x-2 mt-4">
                                <div className="mr-32  flex w-full justify-start gap-4">
                                    {selectedProject && selectedProject?.includes('SES') ? (
                                        <>
                                            <Link
                                                href={`/en/projects/${params.id}/ses-order`}
                                            >
                                                <button
                                                    className=" shadow-gray-40 rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                                    style={{
                                                        height: '30px',
                                                        width: '70px',
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </Link>
                                        </>
                                    ) : selectedProject?.includes('Offshore(Japan)') ? (
                                        <>
                                            <Link
                                                href={`/en/projects/${params.id}/japan-order`}
                                            >
                                                <button
                                                    className=" shadow-gray-40 rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                                    style={{
                                                        height: '30px',
                                                        width: '70px',
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </Link>
                                        </>
                                    ) : selectedProject?.includes('Offshore(Myanmar)') ? (
                                        <>
                                            <Link
                                                href={`/en/projects/${params.id}/myanmar-order`}
                                            >
                                                <button
                                                    className=" shadow-gray-40 rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                                    style={{
                                                        height: '30px',
                                                        width: '70px',
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={`/en/projects/${params.id}/japan-myanmar-order`}
                                            >
                                                <button
                                                    className=" shadow-gray-40 rounded-md bg-blue-700 text-white shadow-md shadow-gray-400"
                                                    style={{
                                                        height: '30px',
                                                        width: '70px',
                                                    }}
                                                >
                                                    Next
                                                </button>
                                            </Link>
                                        </>
                                    )}

                                    <button
                                        className="  shadow-gray-40 rounded-md bg-red-700 text-white shadow-md shadow-gray-400"
                                        style={{ height: '30px', width: '70px' }}
                                        onClick={handleCancel}
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
