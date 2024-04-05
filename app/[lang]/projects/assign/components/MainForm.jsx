'use client'

import DropDown from '@/app/[lang]/engineers-info/assign/components/DropDown'
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
import { clearJPOrderState } from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'
import { clearMMOrderState } from '@/app/store/client/features/project_create/projectCreateMMOrderSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllCustomers } from '@/app/store/server/features/customers'
import { useGetAllDepartments } from '@/app/store/server/features/departments'
import { useGetAllProjectTypes } from '@/app/store/server/features/project_types'
import {
    useGetAllProjects,
    useGetProjectById,
} from '@/app/store/server/features/projects'
import { useCreateProject } from '@/app/store/server/features/projects/mutations'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import Dropdown from './DropDown'
import OffshoreJP from './OffshoreJP'
import OffshoreMM from './OffshoreMM'

const years = [
    {
        year: '2018',
    },
    {
        year: '2019',
    },
    {
        year: '2020',
    },
    {
        year: '2021',
    },
    {
        year: '2022',
    },
    {
        year: '2023',
    },
    {
        year: '2024',
    },
    {
        year: '2025',
    },
]

const paymentStatus = [
    {
        status: 'Paid',
        id: 1,
    },
    {
        status: 'Waiting',
        id: 0,
    },
]

const contractStatus = [
    {
        type: 'Waiting',
        id: 0,
    },
    {
        type: 'Contracted',
        id: 1,
    },
]

const MainForm = () => {
    const [selectedProject, setSelectedProject] = useState(null)
    const [clearSelected, setClearSelected] = useState(false)
    const [errMsg, setErrMsg] = useState(false)
    const [edit, setEdit] = useState(false)
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
    useEffect(() => {
        dispatch(clearProjectCreateInfoState())
        dispatch(clearJPOrderState())
        dispatch(clearMMOrderState())
    }, [dispatch])
    const { data: companies } = useGetAllCustomers()
    const { data: departments } = useGetAllDepartments()
    const { data: projectTypes } = useGetAllProjectTypes()
    const { data: projects } = useGetAllProjects()

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

    const newProject = {
        year: projectCreateInfoState?.year,
        project_name: projectCreateInfoState?.projectName,
        contract_number: projectCreateInfoState?.contractNumber,
        customer_id: projectCreateInfoState?.customerId,
        payment_status: projectCreateInfoState?.paymentStatus,
        department_id: projectCreateInfoState?.departmentId,
        marketing_name: projectCreateInfoState?.marketingName,
        start_date: projectCreateInfoState?.startDate,
        end_date: projectCreateInfoState?.endDate,
        contract_status: projectCreateInfoState?.contractStatus,
        user_id: '',
        project_type_id: projectCreateInfoState?.projectType.id,
        cost:
            sesProject || jpProject || jpMMProject
                ? projectCreateJpOrderState.jpOrderAmount
                : projectCreateMMOrderState.mmOrderAmount,
        ses_project_leader: sesProject
            ? projectCreateJpOrderState.jpProjectLeader
            : '',
        ses_estimate_number: sesProject
            ? projectCreateJpOrderState.jpEsitmateNumber
            : '',
        ses_approval_number: sesProject
            ? projectCreateJpOrderState.jpApprovalNumber
            : '',
        ses_order_number: sesProject
            ? projectCreateJpOrderState.jpOrderNumber
            : '',
        ses_delivery_date: sesProject
            ? projectCreateJpOrderState.jpDeliveryDate
            : '',
        ses_man_month: sesProject ? projectCreateJpOrderState.jpManMonth : '',
        ses_average_unit_price: sesProject
            ? projectCreateJpOrderState.jpAvgUnitPrice
            : '',
        ses_order_amount: sesProject
            ? projectCreateJpOrderState.jpOrderAmount
            : '',
        ses_acceptance_billing_date: sesProject
            ? projectCreateJpOrderState.jpAcceptanceBillingDate
            : '',
        ses_payment_date: sesProject
            ? projectCreateJpOrderState.jpPaymentDate
            : '',
        jp_project_leader:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpProjectLeader
                : '',
        jp_estimate_number:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpEsitmateNumber
                : '',
        jp_approval_number:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpApprovalNumber
                : '',
        jp_order_number:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpOrderNumber
                : '',
        jp_delivery_date:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpDeliveryDate
                : '',
        jp_man_month:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpManMonth
                : '',
        jp_average_unit_price:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpAvgUnitPrice
                : '',
        jp_order_amount:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpOrderAmount
                : '',
        jp_acceptance_billing_date:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpAcceptanceBillingDate
                : '',
        jp_payment_date:
            jpProject || jpMMProject
                ? projectCreateJpOrderState.jpPaymentDate
                : '',
        mm_project_leader:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmProjectLeader
                : '',
        mm_estimate_number:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmEsitmateNumber
                : '',
        mm_delivery_date:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmDeliveryDate
                : '',
        mm_man_month:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmManMonth
                : '',
        mm_unit_price:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmAvgUnitPrice
                : '',
        mm_gicj_fee:
            mmProject || jpMMProject ? projectCreateMMOrderState.gicjFee : '',
        mm_order_amount:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmOrderAmount
                : '',
        mm_billing_amount:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmBilledAmount
                : '',
        mm_acceptance_billing_date:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmAcceptanceBillingDate
                : '',
        mm_payment_date:
            mmProject || jpMMProject
                ? projectCreateMMOrderState.mmPaymentDate
                : '',
    }
    const router = useRouter()
    const handleProjectCreateSuccess = (data) => {
        if (data?.meta?.msg === 'Success') {
            dispatch(clearProjectCreateInfoState())
            dispatch(clearJPOrderState())
            dispatch(clearMMOrderState())
            router.push('/projects')
            setTimeout(() => {
                toast.success('Successfully inserted!')
            }, 3000)
        } else if (Array.isArray(data)) {
            setErrMsg(true)
        }
    }

    const { mutate: createProject } = useCreateProject(
        handleProjectCreateSuccess,
    )
    const handleProjectCreate = () => {
        createProject(newProject)
    }

    const handleYearChange = (year) => {
        dispatch(setYear(year))
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
        dispatch(setPaymentStatus(paymentStatus))
    }

    const handleDepartmentIdChange = (departmentId) => {
        dispatch(setDepartmentId(departmentId))
    }

    const handleMarketingNameChange = (marketingName) => {
        dispatch(setMarketingName(marketingName))
    }

    const handleStartDateChange = (startDate) => {
        dispatch(setStartDate(startDate))
    }

    const handleEndDateChange = (endDate) => {
        dispatch(setEndDate(endDate))
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
    const renderProjectComponent = () => {
        if (
            selectedProject?.includes('SES(Offshore)') ||
            selectedProject?.includes('Offshore(Japan)')
        ) {
            return (
                <>
                    <hr />
                    <OffshoreJP errMsg={errMsg} />
                </>
            )
        } else if (selectedProject?.includes('Offshore(Myanmar)')) {
            return (
                <>
                    <hr />
                    <OffshoreMM errMsg={errMsg} />
                </>
            )
        } else if (
            selectedProject?.includes('Offshore(Japan/Myanmar)') ||
            selectedProject?.includes('Offshore(Japan+Myanmar')
        ) {
            return (
                <>
                    <hr />
                    <OffshoreJP errMsg={errMsg} />
                    <hr />
                    <OffshoreMM errMsg={errMsg} />
                </>
            )
        } else {
            return null
        }
    }
    return (
        <div>
            <div className="mb-4 flex flex-col gap-2">
                <div className="flex flex-row items-center gap-4">
                    <div className="cursor-pointer" onClick={toggleSideBar}>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    </div>

                    <h3>
                        <Link href={'/en/projects'}>Project</Link> &gt; Project
                        Creation
                    </h3>
                </div>

                <hr />
            </div>

            <div className="mb-8 flex flex-col justify-center rounded-md border-b border-l border-r border-t border-slate-900 p-4">
                <h1 className="text-center">Project Creation</h1>

                <div className="mb-8 mt-8 flex w-2/3 flex-col self-center pb-4">
                    <div className="flex flex-row justify-center gap-x-24">
                        <h1 className="text-center ">Project Information</h1>
                        <div className="ml-5 flex w-80 flex-col">
                            <div className="z-50 mb-4 w-full space-y-2">
                                <label htmlFor="year">Year</label>
                                <Dropdown
                                    options={years}
                                    initialValue={
                                        '' || projectCreateInfoState?.year
                                    }
                                    generateLabel={(option) => option?.year}
                                    onSelect={(option) => {
                                        handleYearChange(option.year)
                                    }}
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
                                />
                                {(projectCreateInfoState?.year === '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select a year
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="mb-4 space-y-2">
                                <label htmlFor="title" className="mb-2">
                                    Project Name
                                </label>
                                <input
                                    value={
                                        '' ||
                                        projectCreateInfoState?.projectName
                                    }
                                    onChange={(e) =>
                                        handleProjectNameChange(e.target.value)
                                    }
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full rounded-md border px-2 py-1"
                                />
                                {(projectCreateInfoState?.projectName === '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please enter project name.
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="mb-4 space-y-2">
                                <label htmlFor="contract">
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
                                    className="w-full rounded-md border px-2 py-1"
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

                            <div className="z-40 mb-4 w-full space-y-2">
                                <label htmlFor="company">Company Name</label>
                                <DropDown
                                    data={companies}
                                    filterName="customer_name"
                                    name="customer_name"
                                    customerIdFromProjectCreate="true"
                                    setEdit={setEdit}
                                ></DropDown>
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

                            <div className="z-30 mb-4 w-full space-y-2">
                                <label htmlFor="status">Payment Status</label>
                                <Dropdown
                                    options={paymentStatus}
                                    initialValue={null}
                                    generateLabel={(option) => option?.status}
                                    onSelect={(option) => {
                                        handlePaymentStatusChange(option.id)
                                    }}
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
                                />
                                {(projectCreateInfoState?.paymentStatus ===
                                    '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select a payment status
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="z-20 mb-4 w-full space-y-2">
                                <label htmlFor="team">Department</label>
                                <Dropdown
                                    options={departments}
                                    initialValue={null}
                                    generateLabel={(option) =>
                                        option?.department_name
                                    }
                                    onSelect={(option) => {
                                        handleDepartmentIdChange(option.id)
                                    }}
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
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

                            <div className="z-10 mb-4 w-full space-y-2">
                                <label htmlFor="team">Marketing</label>
                                <Dropdown
                                    options={projects}
                                    initialValue={null}
                                    generateLabel={(option) =>
                                        option?.marketing_name
                                    }
                                    onSelect={(option) => {
                                        handleMarketingNameChange(
                                            option?.marketing_name,
                                        )
                                    }}
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
                                />
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

                            <div className="mb-4 space-y-2">
                                <label htmlFor="start_date">
                                    Contract Start Date
                                </label>
                                <input
                                    value={
                                        '' || projectCreateInfoState?.startDate
                                    }
                                    onChange={(e) =>
                                        handleStartDateChange(e.target.value)
                                    }
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    className="w-full rounded-md border px-2 py-1"
                                />
                                {(projectCreateInfoState?.startDate === '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select start date
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="mb-4 space-y-2">
                                <label htmlFor="end_date">
                                    Contract End Date
                                </label>
                                <input
                                    value={
                                        '' || projectCreateInfoState?.endDate
                                    }
                                    onChange={(e) =>
                                        handleEndDateChange(e.target.value)
                                    }
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    className="w-full rounded-md border px-2 py-1"
                                />
                                {(projectCreateInfoState?.endDate === '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select end date
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="z-30 mb-4 w-full space-y-2">
                                <label htmlFor="team">Contract Status</label>
                                <Dropdown
                                    options={contractStatus}
                                    initialValue={null}
                                    generateLabel={(option) => option?.type}
                                    onSelect={(option) => {
                                        handleContractStatusChange(option.id)
                                    }}
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
                                />
                                {(projectCreateInfoState?.contractStatus ===
                                    '' ||
                                    null) &&
                                errMsg ? (
                                    <p className="text-red-500">
                                        Please select a contract status
                                    </p>
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="z-20 mb-8 w-full space-y-2">
                                <label htmlFor="team">
                                    Project Type(SES/Offshore)
                                </label>
                                <Dropdown
                                    options={projectTypes}
                                    initialValue={null}
                                    generateLabel={(option) =>
                                        option?.project_type
                                    }
                                    onSelect={(option) =>
                                        handleProjectChoose(option)
                                    }
                                    clearSelected={clearSelected}
                                    onClearSelected={handleClearSelected}
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
                        </div>
                    </div>
                    {renderProjectComponent()}
                </div>

                <div className="flex flex-row justify-center ">
                    <div className="w-1/4"></div>
                    <div className="mr-8 flex w-80 justify-center gap-12">
                        <button
                            className="w-2/4 rounded-md bg-green-600 p-2 text-white"
                            onClick={handleProjectCreate}
                        >
                            Create
                        </button>
                        <button
                            className="w-2/4 rounded-md bg-red-600 p-2 text-white"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainForm
