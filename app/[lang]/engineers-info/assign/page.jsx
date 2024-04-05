'use client'

import Dropdown from '@/app/[lang]/projects/assign/components/DropDown'
import {
    addjanProject,
    addjanRole,
    clearEmpoyeesAssignState,
} from '@/app/store/client/features/project_assign/projectAssignDataSlice'
import {
    addMonthData,
    updateAssignYear,
    updateCareerSheetLink,
    updateCareerSheetStatus,
    updateEngineerId,
    updateEngineerName,
    updateManHours,
    updateMarketingProject,
    updateMarketingProjectType,
    updateMarketingStatus,
    updateProposalStatus,
    updateUnitPrice,
} from '@/app/store/client/features/project_assign/projectAssignSlice'
import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useCreateEngineerInfoProjectAssign } from '@/app/store/server/features/emp_project_assign/mutations'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import { useGetAllProjectTypes } from '@/app/store/server/features/project_types'
import { useGetAllProjects } from '@/app/store/server/features/projectList/queries'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import { Combobox } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast, Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import RequireIcon from '../../../../public/icon/Require.svg'
import RightArrow from '../../../../public/right-arrow.svg'
import DisclosureFunction from './components/Disclosure'
import DropDown from './components/DropDown'

const schema = yup.object().shape({
    engineerInfo: yup.string().required('Please select a engineer info.'),
    careerSheetUpdateStatus: yup
        .string()
        .required('Please select a careersheet update status.'),
    careerSheetLink: yup.string().required('Please enter career sheet link.'),
    marketingStatus: yup.string().required('Please select a marketing status.'),
    proposalStatus: yup.string().required('Please select a proposal status.'),
    yearId: yup.string().required('Please select a year.'),
    manHour: yup.string().required('Please enter man-hour.'),
    unitPrice: yup.string().required('Please enter unit price.'),
})

const projectTypes = [
    {
        type: 'SES',
    },
    {
        type: 'Offshore(JP)',
    },
    {
        type: 'Offshore(MM)',
    },
    {
        type: 'Offshore(JPMM)',
    },
]

const memberTypes = [
    {
        id: 1,
        member_type: 'M1',
    },
    {
        id: 2,
        member_type: 'M2',
    },
]

const marketingStatusList = [
    {
        id: 1,
        status: 'available',
    },
    {
        id: 0,
        status: 'not available',
    },
]

const careerSheetUpdateList = [
    {
        id: 1,
        status: 'Updated',
    },
    {
        id: 0,
        status: 'Not Updated',
    },
]

const years = []
for (let i = 1; i <= 5; i++) {
    const year = {
        year: `202${i}`,
    }
    years.push(year)
}

const companies = []
for (let i = 1; i <= 5; i++) {
    const company = {
        company: `Company ${i}`,
    }

    companies.push(company)
}

const ProjectAssignForm = () => {
    const [projectAssignError, setProjectAssignError] = useState({
        engineerInfo: '',
        careerSheetStatus: '',
        careerSheetLink: '',
        marketingStatus: '',
        proposalStatus: '',
        unitPrice: '',
        manHour: '',
        year: '',
        monthlyProjectName: '',
        monthlyProjectRole: '',
    })
    const dispatch = useDispatch()
    const [edit, setEdit] = useState(false)
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const projectAssignState = useSelector((state) => state.projectAssign)
    const projectAssignDataState = useSelector(
        (state) => state.projectAssignData,
    )
    const { data: projects, isLoading, isError } = useGetAllProjects()
    const { data: roles } = useGetAllRoles()
    const { data: employees } = useGetAllEmployees()
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredEmployees, setFilteredEmployees] = useState([])
    const [proposal, setProposal] = useState('')
    const [careerSheetLink, setCareerSheetLink] = useState('')
    const [manHour, setManHour] = useState('')
    const [unitPrice, setUnitPrice] = useState('')
    useEffect(() => {
        const filteredEmployees = employees?.filter(
            (employee) =>
                employee.emp_name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                employee.emp_cd
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        )
        setFilteredEmployees(filteredEmployees)
    }, [employees, searchQuery])

    const handleSelect = (employee) => {
        setSelectedEmployee(employee)
        dispatch(updateEngineerName(employee.emp_name))
        dispatch(updateEngineerId(employee.emp_cd))
        setSearchQuery('')
    }

    const handleProjectChange = (project) => {
        dispatch(updateMarketingProject(project))
    }

    const handleProjectTypeChange = (projectType) => {
        dispatch(updateMarketingProjectType(projectType))
    }

    const handleMarketingStatusChange = (status) => {
        dispatch(updateMarketingStatus(status))
    }

    const handleProposalStatusChange = (status) => {
        setProposal(status)
        dispatch(updateProposalStatus(status))
    }

    const handleCareerSheetStatusChange = (status) => {
        dispatch(updateCareerSheetStatus(status))
    }

    const handleCareerSheetLinkChange = (link) => {
        setCareerSheetLink(link)
        dispatch(updateCareerSheetLink(link))
    }

    const handleManHourChange = (hour) => {
        setManHour(hour)
        dispatch(updateManHours(hour))
    }

    const handleUnitPriceChange = (unitPrice) => {
        setUnitPrice(unitPrice)
        dispatch(updateUnitPrice(unitPrice))
    }

    const handleYearChange = (year) => {
        dispatch(updateAssignYear(year))
    }

    const handleMonthDataChange = (monthData) => {
        dispatch(addMonthData(monthData))
    }
    const router = useRouter()
    const newEmpProjectAssign = {
        employee_code: projectAssignDataState?.empInfoData?.emp_cd,
        year: projectAssignDataState?.Years?.year,
        marketing_status: projectAssignDataState?.marketingCurentSatus?.status,
        careersheet_status: projectAssignDataState?.careerSheetStatus?.id,
        proposal_status: proposal,
        careersheet_link: careerSheetLink,
        man_month: manHour,
        unit_price: unitPrice,
        january: [
            {
                role:
                    projectAssignDataState?.janRole?.id !== undefined
                        ? projectAssignDataState?.janRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.janProject?.id !== undefined
                        ? projectAssignDataState?.janProject?.id
                        : null,
            },
        ],
        february: [
            {
                role:
                    projectAssignDataState?.febRole?.id !== undefined
                        ? projectAssignDataState?.febRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.febProject?.id !== undefined
                        ? projectAssignDataState?.febRole?.id
                        : null,
            },
        ],
        april: [
            {
                role:
                    projectAssignDataState?.aprilRole?.id !== undefined
                        ? projectAssignDataState?.aprilRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.aprilProject?.id !== undefined
                        ? projectAssignDataState?.aprilProject?.id
                        : null,
            },
        ],
        may: [
            {
                role:
                    projectAssignDataState?.mayRole?.id !== undefined
                        ? projectAssignDataState?.mayRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.mayProject?.id !== undefined
                        ? projectAssignDataState?.mayProject?.id
                        : null,
            },
        ],
        june: [
            {
                role:
                    projectAssignDataState?.juneRole?.id !== undefined
                        ? projectAssignDataState?.juneRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.juneProject?.id !== undefined
                        ? projectAssignDataState?.juneProject?.id
                        : null,
            },
        ],
        july: [
            {
                role:
                    projectAssignDataState?.julyRole?.id !== undefined
                        ? projectAssignDataState?.julyRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.julyProject?.id !== undefined
                        ? projectAssignDataState?.julyProject?.id
                        : null,
            },
        ],
        august: [
            {
                role:
                    projectAssignDataState?.augRole?.id !== undefined
                        ? projectAssignDataState?.augRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.augProject?.id !== undefined
                        ? projectAssignDataState?.augProject?.id
                        : null,
            },
        ],
        september: [
            {
                role:
                    projectAssignDataState?.septRole?.id !== undefined
                        ? projectAssignDataState?.septRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.septProject?.id !== undefined
                        ? projectAssignDataState?.septProject?.id
                        : null,
            },
        ],
        march: [
            {
                role:
                    projectAssignDataState?.marchRole?.id !== undefined
                        ? projectAssignDataState?.marchRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.marchProject?.id !== undefined
                        ? projectAssignDataState?.marchProject?.id
                        : null,
            },
        ],
        october: [
            {
                role:
                    projectAssignDataState?.octRole?.id !== undefined
                        ? projectAssignDataState?.octRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.octProject?.id !== undefined
                        ? projectAssignDataState?.octProject?.id
                        : null,
            },
        ],
        november: [
            {
                role:
                    projectAssignDataState?.novRole?.id !== undefined
                        ? projectAssignDataState?.novRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.novProject?.id !== undefined
                        ? projectAssignDataState?.novProject?.id
                        : null,
            },
        ],
        december: [
            {
                role:
                    projectAssignDataState?.decRole?.id !== undefined
                        ? projectAssignDataState?.decRole?.id
                        : null,
                project_id:
                    projectAssignDataState?.decProject?.id !== undefined
                        ? projectAssignDataState?.decProject?.id
                        : null,
            },
        ],
    }

    const showToast = (msg) =>
        toast.error(msg, {
            duration: 2000,
        })
    const { mutate: createEmpProjectAssign } =
        useCreateEngineerInfoProjectAssign()

    const handleCreate = () => {
        const monthlyProjectNameFilled =
            newEmpProjectAssign.january[0].project_id === null &&
            newEmpProjectAssign.february[0].project_id === null &&
            newEmpProjectAssign.march[0].project_id === null &&
            newEmpProjectAssign.april[0].project_id === null &&
            newEmpProjectAssign.may[0].project_id === null &&
            newEmpProjectAssign.june[0].project_id === null &&
            newEmpProjectAssign.july[0].project_id === null &&
            newEmpProjectAssign.august[0].project_id === null &&
            newEmpProjectAssign.september[0].project_id === null &&
            newEmpProjectAssign.october[0].project_id === null &&
            newEmpProjectAssign.november[0].project_id === null &&
            newEmpProjectAssign.december[0].project_id === null
        const monthlyProjectRoleFilled =
            newEmpProjectAssign.january[0].role === null &&
            newEmpProjectAssign.february[0].role === null &&
            newEmpProjectAssign.march[0].role === null &&
            newEmpProjectAssign.april[0].role === null &&
            newEmpProjectAssign.may[0].role === null &&
            newEmpProjectAssign.june[0].role === null &&
            newEmpProjectAssign.july[0].role === null &&
            newEmpProjectAssign.august[0].role === null &&
            newEmpProjectAssign.september[0].role === null &&
            newEmpProjectAssign.october[0].role === null &&
            newEmpProjectAssign.november[0].role === null &&
            newEmpProjectAssign.december[0].role === null

        if (monthlyProjectNameFilled && monthlyProjectRoleFilled) {
            showToast('Please select  project and role')
        } else if (monthlyProjectNameFilled) {
            showToast('Please select a project.')
        } else if (monthlyProjectRoleFilled) {
            showToast('Please select a role.')
        }

        if (!monthlyProjectNameFilled && !monthlyProjectRoleFilled) {
            createEmpProjectAssign(newEmpProjectAssign)
            dispatch(clearEmpoyeesAssignState())
            router.push('/engineers-info')
        }
    }
    const handleCancel = () => {
        router.push('/engineers-info')
    }

    return (
        <div className="flex w-full flex-col text-xs" suppressHydrationWarning>
            <Toaster />
            <div className="sticky top-0 z-40 flex flex-col gap-2 bg-white py-[14px]">
                <div className="flex gap-2 text-sm">
                    <div className="flex flex-row items-center">
                        <div className="cursor-pointer" onClick={toggleSideBar}>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                            <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        </div>
                    </div>
                    <div className="ml-5 flex items-center gap-2 pl-0">
                        <Link href={'/engineers-info'} className="font-medium">
                            Engineer Info
                        </Link>

                        <Image
                            src={RightArrow}
                            className=" justify-center"
                            alt="no image"
                        />

                        <Link href="#" className="font-medium">
                            Project Assign
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <form
                    onSubmit={handleSubmit(handleCreate)}
                    className="z-20 mb-3 flex w-full flex-col items-center rounded-md"
                    style={{ border: '1.5px solid #e2e8f0' }}
                >
                    <h4 className="mt-4 text-sm font-medium">Project Assign</h4>
                    <div className="mt-6 flex w-2/3 flex-col px-6 pb-5">
                        <div className="relative z-auto mb-4 flex flex-row items-center justify-between">
                            <label className="w-1/3 text-sm font-medium">
                                Engineer Info
                            </label>
                            <div className="w-[350px]" style={{ zIndex: '20' }}>
                                <Controller
                                    name="engineerInfo"
                                    control={control}
                                    render={({ field }) => (
                                        <DropDown
                                            onSelect={(option) => {
                                                field.onChange(option.emp_cd)
                                            }}
                                            data={employees}
                                            filterName="emp_name"
                                            name="emp_name"
                                            engineerInfo="true"
                                        />
                                    )}
                                />
                                <span className="text-red-600">
                                    {errors.engineerInfo &&
                                        errors.engineerInfo.message}
                                </span>
                            </div>
                        </div>

                        <div className="relative z-auto mb-7 flex flex-row items-center justify-between">
                            <div className="w-1/3"></div>
                            <div className="flex w-[350px] gap-2">
                                <div className="w-1/2">
                                    <label className="flex gap-2">
                                        Name
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <input
                                        defaultValue={
                                            (projectAssignDataState !==
                                                undefined &&
                                                projectAssignDataState
                                                    ?.empInfoData?.emp_name) ||
                                            ''
                                        }
                                        type="text"
                                        readOnly
                                        disabled
                                        placeholder=""
                                        className="h-[35px] w-full cursor-default rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                    />
                                </div>

                                <div className="w-1/2">
                                    <label className="flex gap-2">
                                        Employee Number{' '}
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <input
                                        defaultValue={
                                            (projectAssignDataState !==
                                                undefined &&
                                                projectAssignDataState
                                                    ?.empInfoData?.emp_cd) ||
                                            ''
                                        }
                                        type="text"
                                        readOnly
                                        disabled
                                        placeholder=""
                                        className="h-[35px] w-full cursor-default rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="mb-5 font-bold" />

                        <div className="z-auto mb-5  flex flex-row  justify-between gap-2">
                            <h1 className="w-1/3 text-sm font-medium">
                                Marketing Info
                            </h1>
                            <div className="flex w-[350px] flex-col">
                                <div className="relative z-auto mb-2">
                                    <label className="flex gap-2">
                                        Careersheet update Status
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <div className="relative z-auto w-full">
                                        <Controller
                                            name="careerSheetUpdateStatus"
                                            control={control}
                                            render={({ field }) => (
                                                <DropDown
                                                    onSelect={(option) => {
                                                        field.onChange(
                                                            option.id,
                                                        )
                                                    }}
                                                    data={careerSheetUpdateList}
                                                    filterName="status"
                                                    name="status"
                                                    careerSheetStatus="true"
                                                />
                                            )}
                                        />
                                        <span className="text-red-600">
                                            {errors.careerSheetUpdateStatus &&
                                                errors.careerSheetUpdateStatus
                                                    .message}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="flex gap-2">
                                        Careersheet Link
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <Controller
                                        name="careerSheetLink"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleCareerSheetLinkChange(
                                                        e.target.value,
                                                    )
                                                }}
                                                type="text"
                                                className="w-full rounded-md border border-slate-300 px-[12px] py-1 outline-slate-300"
                                            />
                                        )}
                                    />
                                    <span className="text-red-600">
                                        {errors.careerSheetLink &&
                                            errors.careerSheetLink.message}
                                    </span>
                                </div>

                                <div className="relative z-auto mt-5">
                                    <label className="flex gap-2">
                                        Marketing Status
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <div className="relative z-10 w-full">
                                        <Controller
                                            name="marketingStatus"
                                            control={control}
                                            render={({ field }) => (
                                                <DropDown
                                                    onSelect={(option) => {
                                                        field.onChange(
                                                            option.status,
                                                        )
                                                    }}
                                                    data={marketingStatusList}
                                                    filterName="status"
                                                    name="status"
                                                    marketingCurentSatus="true"
                                                    setEdit={setEdit}
                                                />
                                            )}
                                        />
                                        <span className="text-red-600">
                                            {errors.marketingStatus &&
                                                errors.marketingStatus.message}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="flex gap-2">
                                        Proposal Status
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <Controller
                                        name="proposalStatus"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleProposalStatusChange(
                                                        e.target.value,
                                                    )
                                                }}
                                                type="text"
                                                className="w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                            />
                                        )}
                                    />
                                    <span className="text-red-600">
                                        {errors.proposalStatus &&
                                            errors.proposalStatus.message}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <hr className="mb-5 font-bold" />

                        <div className="z-10 mb-2 flex flex-row  justify-between gap-2">
                            <h1 className="w-1/3 text-sm font-medium">
                                Assign Info
                            </h1>
                            <div className="flex w-[350px] flex-col">
                                <div className="relative z-auto mb-2">
                                    <label className="flex gap-2">
                                        Years
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <div
                                        className="w-full"
                                        style={{
                                            position: 'relative',
                                            zIndex: 100,
                                        }}
                                    >
                                        <Controller
                                            name="yearId"
                                            control={control}
                                            render={({ field }) => (
                                                <DropDown
                                                    data={years}
                                                    filterName="year"
                                                    name="year"
                                                    Years="true"
                                                    setEdit={setEdit}
                                                    onSelect={(option) => {
                                                        field.onChange(
                                                            option.year,
                                                        )
                                                    }}
                                                />
                                            )}
                                        />
                                        <span className="text-red-600">
                                            {errors.yearId &&
                                                errors.yearId.message}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="flex gap-2">
                                        Man-Hours
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </label>
                                    <Controller
                                        name="manHour"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleManHourChange(
                                                        e.target.value,
                                                    )
                                                }}
                                                type="number"
                                                className="h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 outline-slate-300"
                                            />
                                        )}
                                    />
                                    <span className="text-red-600">
                                        {errors.manHour &&
                                            errors.manHour.message}
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <label className="flex gap-2">
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
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    handleUnitPriceChange(
                                                        e.target.value,
                                                    )
                                                }}
                                                type="number"
                                                className="h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 outline-slate-300"
                                            />
                                        )}
                                    />
                                    <span className="text-red-600">
                                        {errors.unitPrice &&
                                            errors.unitPrice.message}
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <div className="mb-3 flex gap-2">
                                        Assign project monthly
                                        <Image
                                            src={RequireIcon}
                                            className=" justify-center"
                                            alt="no image"
                                        />
                                    </div>
                                    <DisclosureFunction
                                        disclosureName="January"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label className="flex gap-2">
                                                        Project Name
                                                    </label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 115,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            janProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 114,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            janRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            janMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="February"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 113,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            febProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 112,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            febRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative  mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            febMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="March"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 111,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            marchProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            marchRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            marchMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="April"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 109,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            aprilProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 108,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            aprilRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            aprilMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="May"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full "
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 107,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            mayProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 106,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            mayRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            mayMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="June"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 105,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            juneProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 104,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            juneRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            juneMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="July"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 103,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            julyProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 102,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            julyRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            julyMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="August"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 101,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            augProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 100,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            augRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            augustMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="September"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 99,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            septProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 98,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            septRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            septMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="October"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 97,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            octProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 96,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            octRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            octMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="November"
                                        disclosurePanel={
                                            <>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 95,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            novProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 94,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            novRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            novMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="December"
                                        disclosurePanel={
                                            <>
                                                <div className="mb-2 text-xs">
                                                    <label>Project Name</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 93,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={projects}
                                                            filterName="project_name"
                                                            name="project_name"
                                                            decProject="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative z-auto mb-2 text-xs">
                                                    <label>Role</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 92,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={roles}
                                                            filterName="role_name"
                                                            name="role_name"
                                                            decRole="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative mb-2 text-xs">
                                                    <label>Member Type</label>
                                                    <div
                                                        className="w-full"
                                                        style={{
                                                            position:
                                                                'relative',
                                                            zIndex: 110,
                                                        }}
                                                    >
                                                        <DropDown
                                                            data={memberTypes}
                                                            filterName="member_type"
                                                            name="member_type"
                                                            decMemberType="true"
                                                            setEdit={setEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-row items-center justify-between gap-2">
                            <div className="w-1/3"></div>
                            <div className="w-[350px]">
                                <button
                                    type="submit"
                                    className="mr-2 h-[30px] w-[70px] rounded-md bg-blue-700  text-white shadow-md shadow-gray-400"
                                >
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="h-[30px] w-[70px] rounded-md bg-red-700  text-white shadow-md shadow-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectAssignForm
