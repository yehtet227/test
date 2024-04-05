'use client'

import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import { useGetAllCustomers } from '@/app/store/server/features/customers'
import { useGetEngineerInfoProjectById } from '@/app/store/server/features/emp_project_assign'
import { useEditEngineerInfoProjectAssign } from '@/app/store/server/features/emp_project_assign/mutations'
import { useGetAllMemberTypes } from '@/app/store/server/features/member-types'
import { useGetAllProjectTypes } from '@/app/store/server/features/project_types'
import { useGetAllProjects } from '@/app/store/server/features/projectList/queries'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import AddIcon from '@/public/icon/addIcon.svg'
import RequireIcon from '@/public/icon/Require.svg'
import RightArrow from '@/public/right-arrow.svg'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import DisclosureFunction from '../components/Disclosure'
import EditDropDown from '../components/EditDown'

const schema = yup.object().shape({
    careerSheetLink: yup.string().required('Please enter career sheet link.'),
    proposalStatus: yup.string().required('Please select a proposal status.'),
    // manHour: yup.string().required('Please enter man-hour.'),
    // unitPrice: yup.string().required('Please enter unit price.'),
})

const years = []
for (let i = 1; i <= 5; i++) {
    const year = {
        name: `202${i}`,
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

const ProjectAssignEditForm = ({ params }) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    const customTable = useSelector((state) => state.customTable)
    const { data: memberTypes } = useGetAllMemberTypes()
    const { data: projects } = useGetAllProjects()
    const { data: roles } = useGetAllRoles()
    const { data: customers } = useGetAllCustomers()
    const { data: projectsType } = useGetAllProjectTypes()
    const { data, isLoading } = useGetEngineerInfoProjectById(
        params.id,
        customTable?.year,
        customTable?.empcode,
    )
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    })

    const engineerInfoData = data?.data[0]

    const careersheetLink = data?.data[0]?.careersheet_link

    const proposalStatus = data?.data[0]?.proposal_status
    const yearsdata = data?.data[0]?.year
    const janData = data?.data[0]?.january
    const febData = data?.data[0]?.february
    const marData = data?.data[0]?.march
    const aprilData = data?.data[0]?.april
    const mayData = data?.data[0]?.may
    const juneData = data?.data[0]?.june
    const julyData = data?.data[0]?.july
    const augData = data?.data[0]?.august
    const septData = data?.data[0]?.september
    const octData = data?.data[0]?.october
    const novData = data?.data[0]?.november
    const decData = data?.data[0]?.december

    const defaultengineerInfo = [
        {
            id: engineerInfoData?.id,
            name: engineerInfoData?.employeeGroup?.employee_name,
            employee_number: engineerInfoData?.employeeGroup?.employee_code,
        },
    ]

    const defaultyear = [{ id: 1, name: yearsdata }]
    const [proposal, setProposal] = useState(proposalStatus)
    const [careerSheetLink, setCareerSheetLink] = useState(careersheetLink)
    const engineername = defaultengineerInfo[0]?.name
    const engineerNumber = defaultengineerInfo[0]?.employee_number
    const careerSheetUpdateList = [
        {
            id: 1,
            name: 'Updated',
        },
        {
            id: 0,
            name: 'Not Updated',
        },
    ]

    const marketingStatusList = [
        {
            id: 1,
            name: 'available',
        },
        {
            id: 0,
            name: 'not available',
        },
    ]

    const projectList = projects?.map((project) => ({
        id: project?.id,
        name: project?.project_name,
    }))
    const projectType = projectsType?.map((projectType) => ({
        id: projectType?.id,
        name: projectType?.project_type,
    }))
    const customerList = customers?.map((customer) => ({
        id: customer?.customer_cd,
        name: customer?.customer_name,
    }))
    const memberTypeList = memberTypes?.map((memberType) => ({
        id: memberType?.member_type_id,
        name: memberType?.member_type,
    }))
    const roleList = roles?.map((role) => ({
        id: role?.id,
        name: role?.role_name,
    }))

    const [careerSheetStatusselected, setcareerSheetStatusSelected] = useState()
    const [marketingStatusselected, setmarketingStatusSelected] = useState()

    const [careerSheetStatusupIcon, setcareerSheetStatusUpIcon] =
        useState(false)
    const [marketingStatusupIcon, setmarketingStatusUpIcon] = useState(false)

    const [janroleupIcon, setjanroleUpIcon] = useState(false)

    const [janmembertypeupIcon, setjanmembertypeUpIcon] = useState(false)
    const [janprojectupIcon, setjanprojectUpIcon] = useState(false)
    const handlecareerSheetStatusChange = (newValue) => {
        setcareerSheetStatusSelected(newValue)
        setcareerSheetStatusUpIcon(false)
    }

    const handlemarketingStatusChange = (newValue) => {
        setmarketingStatusSelected(newValue)
        setmarketingStatusUpIcon(false)
    }

    // 12 moths method start
    const initialFormFields = {
        project_type: undefined,
        customer_id: undefined,
        project_id: undefined,
        role: undefined,
        man_month: undefined,
        unit_price: undefined,
        member_type: undefined,
        selectedCustomerStatus: false,
        selectedProjectStatus: false,
    }
    const initialFormFieldState = () => [{ ...initialFormFields }]
    const [januaryformFields, setJanuaryFormFields] = useState(
        initialFormFieldState(),
    )
    const [februaryformFields, setFebruaryFormFields] = useState(
        initialFormFieldState(),
    )
    const [marchformFields, setMarchFormFields] = useState(
        initialFormFieldState(),
    )
    const [aprilformFields, setAprilFormFields] = useState(
        initialFormFieldState(),
    )
    const [mayformFields, setMayFormFields] = useState(initialFormFieldState())
    const [juneformFields, setJuneFormFields] = useState(
        initialFormFieldState(),
    )
    const [julyformFields, setJulyFormFields] = useState(
        initialFormFieldState(),
    )
    const [augustformFields, setAugustFormFields] = useState(
        initialFormFieldState(),
    )
    const [septemberformFields, setSeptemberFormFields] = useState(
        initialFormFieldState(),
    )
    const [octoberformFields, setOctoberFormFields] = useState(
        initialFormFieldState(),
    )
    const [novemberformFields, setNovemberFormFields] = useState(
        initialFormFieldState(),
    )
    const [decemberformFields, setDecemberFormFields] = useState(
        initialFormFieldState(),
    )
    useEffect(() => {
        setProposal(proposalStatus)
        setCareerSheetLink(careersheetLink)
        setValue('careerSheetLink', careersheetLink)
        setValue('proposalStatus', proposalStatus)
    }, [proposalStatus, careersheetLink, setValue])
    useEffect(() => {
        const careersheetUpdateStatus = data?.data[0]?.careersheet_status
        const marketingStatus = data?.data[0]?.marketing_status
        const defaultcareerSheetStatus = [
            careersheetUpdateStatus === 1
                ? { id: 1, name: 'Updated' }
                : { id: 0, name: 'Not Updated' },
        ]
        const defaultmarketingStatus = [
            marketingStatus === 'not available'
                ? { id: 0, name: 'not available' }
                : { id: 1, name: 'available' },
        ]
        setcareerSheetStatusSelected(defaultcareerSheetStatus[0])
        setmarketingStatusSelected(defaultmarketingStatus[0])
    }, [data])
    useEffect(() => {
        const januaryData = data?.data?.[0]?.january
        const shouldUpdateJanuaryFields = januaryData && januaryData.length > 0

        if (shouldUpdateJanuaryFields) {
            const januaryInitialFields = januaryData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setJanuaryFormFields(januaryInitialFields)
        }
    }, [data])

    useEffect(() => {
        const februaryData = data?.data?.[0]?.february
        const shouldUpdateFebruaryFields =
            februaryData && februaryData.length > 0

        if (shouldUpdateFebruaryFields) {
            const februaryInitialFields = februaryData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setFebruaryFormFields(februaryInitialFields)
        }
    }, [data])
    useEffect(() => {
        const marchData = data?.data?.[0]?.march
        const shouldUpdateMarchFields = marchData && marchData.length > 0

        if (shouldUpdateMarchFields) {
            const marchInitialFields = marchData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setMarchFormFields(marchInitialFields)
        }
    }, [data])
    useEffect(() => {
        const aprilData = data?.data?.[0]?.april
        const shouldUpdateAprilFields = aprilData && aprilData.length > 0

        if (shouldUpdateAprilFields) {
            const aprilInitialFields = aprilData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setAprilFormFields(aprilInitialFields)
        }
    }, [data])
    useEffect(() => {
        const mayData = data?.data?.[0]?.may
        const shouldUpdateMayFields = mayData && mayData.length > 0

        if (shouldUpdateMayFields) {
            const mayInitialFields = mayData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setMayFormFields(mayInitialFields)
        }
    }, [data])
    useEffect(() => {
        const juneData = data?.data?.[0]?.february
        const shouldUpdateJuneFields = juneData && juneData.length > 0

        if (shouldUpdateJuneFields) {
            const juneInitialFields = juneData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setJuneFormFields(juneInitialFields)
        }
    }, [data])
    useEffect(() => {
        const julyData = data?.data?.[0]?.february
        const shouldUpdateJulyFields = julyData && julyData.length > 0

        if (shouldUpdateJulyFields) {
            const julyInitialFields = julyData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setJulyFormFields(julyInitialFields)
        }
    }, [data])
    useEffect(() => {
        const augustData = data?.data?.[0]?.august
        const shouldUpdateAugustFields = augustData && augustData.length > 0

        if (shouldUpdateAugustFields) {
            const augustInitialFields = augustData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setAugustFormFields(augustInitialFields)
        }
    }, [data])
    useEffect(() => {
        const septemberData = data?.data?.[0]?.september
        const shouldUpdateSeptemberFields =
            septemberData && septemberData.length > 0

        if (shouldUpdateSeptemberFields) {
            const septemberInitialFields = septemberData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setSeptemberFormFields(septemberInitialFields)
        }
    }, [data])
    useEffect(() => {
        const octoberData = data?.data?.[0]?.october
        const shouldUpdateOctoberFields = octoberData && octoberData.length > 0

        if (shouldUpdateOctoberFields) {
            const octoberInitialFields = octoberData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setOctoberFormFields(octoberInitialFields)
        }
    }, [data])
    useEffect(() => {
        const novemberData = data?.data?.[0]?.november
        const shouldUpdateNovemberFields =
            novemberData && novemberData.length > 0

        if (shouldUpdateNovemberFields) {
            const novemberInitialFields = novemberData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setNovemberFormFields(novemberInitialFields)
        }
    }, [data])
    useEffect(() => {
        const decemberData = data?.data?.[0]?.december
        const shouldUpdateDecemberFields =
            decemberData && decemberData.length > 0

        if (shouldUpdateDecemberFields) {
            const decemberInitialFields = decemberData.map((item) => ({
                project_type: {
                    id: item.project_type_id,
                    name: item.project_type,
                },
                customer_id: { id: item.customer_id, name: item.customer_name },
                project_id: { id: item.project_id, name: item.project_name },
                role: { id: item.role_id, name: item.role },
                man_month: item.man_month,
                unit_price: item.unit_price,
                member_type: {
                    id: item.member_type_id,
                    name: item.member_type,
                },
            }))
            setDecemberFormFields(decemberInitialFields)
        }
    }, [data])

    // addfields start

    const addFields = (formFields, setFormFields) => {
        const object = {
            project_type: undefined,
            customer_id: undefined,
            project_id: undefined,
            role: undefined,
            man_month: undefined,
            unit_price: undefined,
            member_type: undefined,
        }

        setFormFields([...formFields, object])
    }

    const januaryaddFields = () => {
        addFields(januaryformFields, setJanuaryFormFields)
    }

    const februaryaddFields = () => {
        addFields(februaryformFields, setFebruaryFormFields)
    }

    const marchaddFields = () => {
        addFields(marchformFields, setMarchFormFields)
    }

    const apriladdFields = () => {
        addFields(aprilformFields, setAprilFormFields)
    }

    const mayaddFields = () => {
        addFields(mayformFields, setMayFormFields)
    }

    const juneaddFields = () => {
        addFields(juneformFields, setJuneFormFields)
    }

    const julyaddFields = () => {
        addFields(julyformFields, setJulyFormFields)
    }

    const augustaddFields = () => {
        addFields(augustformFields, setAugustFormFields)
    }

    const septemberaddFields = () => {
        addFields(septemberformFields, setSeptemberFormFields)
    }

    const octoberaddFields = () => {
        addFields(octoberformFields, setOctoberFormFields)
    }

    const novemberaddFields = () => {
        addFields(novemberformFields, setNovemberFormFields)
    }

    const decemberaddFields = () => {
        addFields(decemberformFields, setDecemberFormFields)
    }

    // addfields end

    // removeFields start

    const removeFields = (formFields, setFormFields, index) => {
        const updatedFields = formFields.filter((_, i) => i !== index)
        setFormFields(updatedFields)
    }

    const januaryremoveFields = (index) => {
        removeFields(januaryformFields, setJanuaryFormFields, index)
    }

    const februaryremoveFields = (index) => {
        removeFields(februaryformFields, setFebruaryFormFields, index)
    }

    const marchremoveFields = (index) => {
        removeFields(marchformFields, setMarchFormFields, index)
    }

    const aprilremoveFields = (index) => {
        removeFields(aprilformFields, setAprilFormFields, index)
    }

    const mayremoveFields = (index) => {
        removeFields(mayformFields, setMayFormFields, index)
    }

    const juneremoveFields = (index) => {
        removeFields(juneformFields, setJuneFormFields, index)
    }

    const julyremoveFields = (index) => {
        removeFields(julyformFields, setJulyFormFields, index)
    }

    const augustremoveFields = (index) => {
        removeFields(augustformFields, setAugustFormFields, index)
    }

    const septemberremoveFields = (index) => {
        removeFields(septemberformFields, setSeptemberFormFields, index)
    }

    const octoberremoveFields = (index) => {
        removeFields(octoberformFields, setOctoberFormFields, index)
    }

    const novemberremoveFields = (index) => {
        removeFields(novemberformFields, setNovemberFormFields, index)
    }

    const decemberremoveFields = (index) => {
        removeFields(decemberformFields, setDecemberFormFields, index)
    }

    // removeFields end

    // handleProject Assign Start
    const handleProjectChange = (event, index, formFields, setFormFields) => {
        const { name, value } = event.target
        const updatedFields = [...formFields]
        updatedFields[index][name] = value
        setFormFields(updatedFields)
    }
    const [selectedCustomer, setSelectedCustomer] = useState()
    const [selectedProject, setSelectedProject] = useState()
    const handleJanuaryProjectChange = (event, index) => {
        handleProjectChange(
            event,
            index,
            januaryformFields,
            setJanuaryFormFields,
        )
    }

    const handleFebruaryProjectChange = (event, index) => {
        handleProjectChange(
            event,
            index,
            februaryformFields,
            setFebruaryFormFields,
        )
    }

    const handleMarchProjectChange = (event, index) => {
        handleProjectChange(event, index, marchformFields, setMarchFormFields)
    }

    const handleAprilProjectChange = (event, index) => {
        handleProjectChange(event, index, aprilformFields, setAprilFormFields)
    }

    const handleMayProjectChange = (event, index) => {
        handleProjectChange(event, index, mayformFields, setMayFormFields)
    }

    const handleJuneProjectChange = (event, index) => {
        handleProjectChange(event, index, juneformFields, setJuneFormFields)
    }

    const handleJulyProjectChange = (event, index) => {
        handleProjectChange(event, index, julyformFields, setJulyFormFields)
    }

    const handleAugustProjectChange = (event, index) => {
        handleProjectChange(event, index, augustformFields, setAugustFormFields)
    }

    const handleSeptemberProjectChange = (event, index) => {
        handleProjectChange(
            event,
            index,
            septemberformFields,
            setSeptemberFormFields,
        )
    }

    const handleOctoberProjectChange = (event, index) => {
        handleProjectChange(
            event,
            index,
            octoberformFields,
            setOctoberFormFields,
        )
    }

    const handleNovemberProjectChange = (event, index) => {
        handleProjectChange(
            event,
            index,
            novemberformFields,
            setNovemberFormFields,
        )
    }

    const handleDecemberProjectChange = (event, index) => {
        handleProjectChange(
            event,
            index,
            decemberformFields,
            setDecemberFormFields,
        )
    }
    // handleProject Assign End

    // filteredProjects and filteredCustomers Start
    const filteredProjects = projects?.filter(
        (project) => project.customer.customer_name === selectedCustomer,
    )
    const filteredCustomers = projects?.filter(
        (project) => project.project_name === selectedProject,
    )
    const filteredProjectList = filteredProjects?.map((project) => ({
        id: project?.id,
        name: project?.project_name,
    }))
    const filteredCustomerList = {
        id: filteredCustomers
            ? filteredCustomers[0]?.customer?.customer_cd
            : undefined,
        name: filteredCustomers
            ? filteredCustomers[0]?.customer?.customer_name
            : undefined,
    }
    // filteredProjects and filteredCustomers End

    // 12 months assign start
    const assigns = (fields) => {
        return fields?.map((field) => ({
            ...field,
            project_type: field?.project_type?.id,
            customer_id:
                field?.selectedProjectStatus && !field?.selectedCustomerStatus
                    ? filteredCustomerList?.id
                    : field?.customer_id?.id,
            project_id: field?.project_type?.name === 'SES' ? null : field?.project_id?.id,
            member_type: field?.project_type?.name === 'SES' ? null : field?.member_type?.id,
            role: field?.role?.id,
            man_month: field?.man_month ? field?.man_month : undefined,
            unit_price: field?.unit_price ? field?.unit_price : undefined,
        }))
    }

    const januaryAssign = assigns(januaryformFields)
    const februaryAssign = assigns(februaryformFields)
    const marchAssign = assigns(marchformFields)
    const aprilAssign = assigns(aprilformFields)
    const mayAssign = assigns(mayformFields)
    const juneAssign = assigns(juneformFields)
    const julyAssign = assigns(julyformFields)
    const augustAssign = assigns(augustformFields)
    const septemberAssign = assigns(septemberformFields)
    const octoberAssign = assigns(octoberformFields)
    const novemberAssign = assigns(novemberformFields)
    const decemberAssign = assigns(decemberformFields)

    // 12 months assign end

    // Extracts the properties except 'selectedCustomerStatus' and 'selectedProjectStatus' from each object start
    const newJanuaryAssign = januaryAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newFebruaryAssign = februaryAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newMarchAssign = marchAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newAprilAssign = aprilAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newMayAssign = mayAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newJuneAssign = juneAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newJulyAssign = julyAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newAugustAssign = augustAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newSeptemberAssign = septemberAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newOctoberAssign = octoberAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newNovemberAssign = novemberAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    const newDecemberAssign = decemberAssign?.map(
        ({ selectedCustomerStatus, selectedProjectStatus, ...rest }) => rest,
    )
    // Extracts the properties except 'selectedCustomerStatus' and 'selectedProjectStatus' from each object end

    const router = useRouter()

    const januaryAssignEmpty =
        newJanuaryAssign.length === 1 &&
        Object.values(newJanuaryAssign[0]).every((val) => val === undefined)
            ? []
            : newJanuaryAssign

    const februaryAssignEmpty =
        newFebruaryAssign.length === 1 &&
        Object.values(newFebruaryAssign[0]).every((val) => val === undefined)
            ? []
            : newFebruaryAssign

    const marchAssignEmpty =
        newMarchAssign.length === 1 &&
        Object.values(newMarchAssign[0]).every((val) => val === undefined)
            ? []
            : newMarchAssign
    const aprilAssignEmpty =
        newAprilAssign.length === 1 &&
        Object.values(newAprilAssign[0]).every((val) => val === undefined)
            ? []
            : newAprilAssign
    const mayAssignEmpty =
        newMayAssign.length === 1 &&
        Object.values(newMayAssign[0]).every((val) => val === undefined)
            ? []
            : newMayAssign
    const juneAssignEmpty =
        newJuneAssign.length === 1 &&
        Object.values(newJuneAssign[0]).every((val) => val === undefined)
            ? []
            : newJuneAssign
    const julyAssignEmpty =
        newJulyAssign.length === 1 &&
        Object.values(newJulyAssign[0]).every((val) => val === undefined)
            ? []
            : newJulyAssign
    const augustAssignEmpty =
        newAugustAssign.length === 1 &&
        Object.values(newAugustAssign[0]).every((val) => val === undefined)
            ? []
            : newAugustAssign
    const septemberAssignEmpty =
        newSeptemberAssign.length === 1 &&
        Object.values(newSeptemberAssign[0]).every((val) => val === undefined)
            ? []
            : newSeptemberAssign
    const octoberAssignEmpty =
        newOctoberAssign.length === 1 &&
        Object.values(newOctoberAssign[0]).every((val) => val === undefined)
            ? []
            : newOctoberAssign
    const novemberAssignEmpty =
        newNovemberAssign.length === 1 &&
        Object.values(newNovemberAssign[0]).every((val) => val === undefined)
            ? []
            : newNovemberAssign
    const decemberAssignEmpty =
        newDecemberAssign.length === 1 &&
        Object.values(newDecemberAssign[0]).every((val) => val === undefined)
            ? []
            : newDecemberAssign
    const januaryFormEmpty =
        januaryformFields.length === 1 &&
        Object.values(januaryformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const februaryFormEmpty =
        februaryformFields.length === 1 &&
        Object.values(februaryformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const marchFormEmpty =
        marchformFields.length === 1 &&
        Object.values(marchformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const aprilFormEmpty =
        aprilformFields.length === 1 &&
        Object.values(aprilformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const mayFormEmpty =
        mayformFields.length === 1 &&
        Object.values(mayformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const juneFormEmpty =
        juneformFields.length === 1 &&
        Object.values(juneformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const julyFormEmpty =
        julyformFields.length === 1 &&
        Object.values(julyformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const augustFormEmpty =
        augustformFields.length === 1 &&
        Object.values(augustformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const septemberFormEmpty =
        septemberformFields.length === 1 &&
        Object.values(septemberformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const octoberFormEmpty =
        octoberformFields.length === 1 &&
        Object.values(octoberformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const novemberFormEmpty =
        novemberformFields.length === 1 &&
        Object.values(novemberformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const decemberFormEmpty =
        decemberformFields.length === 1 &&
        Object.values(decemberformFields[0]).every((field) =>
            field && typeof field === 'object'
                ? Object.values(field).every(
                      (val) => val === undefined || val === null,
                  )
                : field === undefined || field === null,
        )
    const newEmpProjectAssign = {
        employee_code: defaultengineerInfo[0]?.employee_number,
        year: defaultyear[0]?.name,
        marketing_status: marketingStatusselected?.name,
        careersheet_status: careerSheetStatusselected?.id,
        proposal_status: proposal,
        careersheet_link: careerSheetLink,
        update_flag: engineerInfoData?.update_flag,
        user_id: null,
        january: januaryFormEmpty ? [] : januaryAssignEmpty,
        february: februaryFormEmpty ? [] : februaryAssignEmpty,
        march: marchFormEmpty ? [] : marchAssignEmpty,
        april: aprilFormEmpty ? [] : aprilAssignEmpty,
        may: mayFormEmpty ? [] : mayAssignEmpty,
        june: juneFormEmpty ? [] : juneAssignEmpty,
        july: julyFormEmpty ? [] : julyAssignEmpty,
        august: augustFormEmpty ? [] : augustAssignEmpty,
        september: septemberFormEmpty ? [] : septemberAssignEmpty,
        october: octoberFormEmpty ? [] : octoberAssignEmpty,
        november: novemberFormEmpty ? [] : novemberAssignEmpty,
        december: decemberFormEmpty ? [] : decemberAssignEmpty,
    }

    const handleSuccess = (data) => {
        if (data?.status === 200) {
            router.push('/engineers-info')
            return toast.success(data?.meta?.msg)
        } else {
            return toast.error(data?.meta?.msg)
        }
    }
    const { mutate: updateEmpProjectAssign, refetch } =
        useEditEngineerInfoProjectAssign(handleSuccess)

    const handleCreate = async () => {
        try {
            setLoading(true) // Set loading state before the API call
            await updateEmpProjectAssign({
                body: newEmpProjectAssign,
                id: params.id,
            })
            await refetch()
            setLoading(false) // Set loading state to false after the API call is complete
        } catch (error) {
            setLoading(false) // Ensure loading state is set to false in case of an error
            // Handle error appropriately
        }
    }

    const handleCancel = () => {
        router.push('/engineers-info')
    }

    return (
        <>
            {isLoading ? (
                <>
                    <div className="flex h-full items-center justify-center">
                        <div>
                            <div
                                className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status"
                            >
                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex w-full flex-col text-xs">
                        <div className="sticky top-0 z-[10000] flex flex-col gap-2 bg-white py-[14px]">
                            <div className="flex gap-2  text-sm">
                                <div className="flex flex-row items-center">
                                    <div
                                        className="cursor-pointer"
                                        onClick={toggleSideBar}
                                    >
                                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                                    </div>
                                </div>
                                <div className="ml-5 flex items-center gap-2 pl-0">
                                    <Link
                                        href={'/engineers-info'}
                                        className="font-medium"
                                    >
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
                        <div className="flex-1 overflow-x-auto">
                            <div
                                className="mb-3 flex w-full flex-col items-center rounded-md"
                                style={{ border: '1.5px solid #e2e8f0' }}
                            >
                                <h4 className="mt-4 text-sm font-medium">
                                    Project Assign For 12 Months
                                </h4>
                                <div className="mt-6 flex flex-col pb-5">
                                    <div className="relative z-auto mb-4 flex flex-row justify-between gap-2">
                                        <div
                                            className=""
                                            style={{ zIndex: '20' }}
                                        >
                                            <div className="flex w-full flex-col gap-2">
                                                <div className="mb-4 w-[300px]">
                                                    <label>Year</label>

                                                    <input
                                                        value={
                                                            engineerInfoData?.year
                                                        }
                                                        type="text"
                                                        readOnly
                                                        disabled
                                                        className="mt-2 h-[35px] w-full cursor-default rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                                    />
                                                </div>
                                                <div className="mb-4 flex">
                                                    <div className="mr-3 w-[300px]">
                                                        <label>Name</label>
                                                        <input
                                                            value={engineername}
                                                            type="text"
                                                            readOnly
                                                            disabled
                                                            className="mt-2 h-[35px] w-full cursor-default rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                                        />
                                                    </div>

                                                    <div className="w-[300px]">
                                                        <label>
                                                            Employee Number
                                                        </label>
                                                        <input
                                                            value={
                                                                engineerNumber
                                                            }
                                                            type="text"
                                                            readOnly
                                                            disabled
                                                            className="mt-2 h-[35px] w-full cursor-default rounded-md border border-slate-300 px-3 py-2 focus:outline-slate-300"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4 flex">
                                                    <div className="relative z-auto mb-2">
                                                        <label className="flex gap-2">
                                                            Careersheet update
                                                            Status
                                                            <Image
                                                                src={
                                                                    RequireIcon
                                                                }
                                                                className=" justify-center"
                                                                alt="no image"
                                                            />
                                                        </label>
                                                        <div className="relative z-[1] mr-3 mt-2 w-[300px]">
                                                            <EditDropDown
                                                                people={
                                                                    careerSheetUpdateList
                                                                }
                                                                upIcon={
                                                                    careerSheetStatusupIcon
                                                                }
                                                                setUpIcon={
                                                                    setcareerSheetStatusUpIcon
                                                                }
                                                                selected={
                                                                    careerSheetStatusselected
                                                                }
                                                                handleChange={
                                                                    handlecareerSheetStatusChange
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="relative z-auto">
                                                        <label className="flex gap-2">
                                                            Marketing Status
                                                            <Image
                                                                src={
                                                                    RequireIcon
                                                                }
                                                                className=" justify-center"
                                                                alt="no image"
                                                            />
                                                        </label>
                                                        <div className="z-2 relative mt-2 w-[300px]">
                                                            <EditDropDown
                                                                people={
                                                                    marketingStatusList
                                                                }
                                                                upIcon={
                                                                    marketingStatusupIcon
                                                                }
                                                                setUpIcon={
                                                                    setmarketingStatusUpIcon
                                                                }
                                                                selected={
                                                                    marketingStatusselected
                                                                }
                                                                handleChange={
                                                                    handlemarketingStatusChange
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <div>
                                                        <label className="flex gap-2">
                                                            Careersheet Link
                                                            <Image
                                                                src={
                                                                    RequireIcon
                                                                }
                                                                className=" justify-center"
                                                                alt="no image"
                                                            />
                                                        </label>
                                                        <Controller
                                                            name="careerSheetLink"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <textarea
                                                                    {...field}
                                                                    value={
                                                                        careerSheetLink
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        field.onChange(
                                                                            e,
                                                                        )
                                                                        setCareerSheetLink(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }}
                                                                    type="text"
                                                                    className="mr-3 mt-2 h-[55px] w-[300px] rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                />
                                                            )}
                                                        />
                                                        <span className=" text-red-600">
                                                            {errors.careerSheetLink &&
                                                                errors
                                                                    .careerSheetLink
                                                                    .message}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <label className="flex gap-2">
                                                            Proposal Status
                                                            <Image
                                                                src={
                                                                    RequireIcon
                                                                }
                                                                className=" justify-center"
                                                                alt="no image"
                                                            />
                                                        </label>

                                                        <Controller
                                                            name="proposalStatus"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <textarea
                                                                    {...field}
                                                                    value={
                                                                        proposal
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        field.onChange(
                                                                            e,
                                                                        )
                                                                        setProposal(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }}
                                                                    type="text"
                                                                    className="mt-2 h-[55px] w-[300px] rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                />
                                                            )}
                                                        />
                                                        <span className=" text-red-600">
                                                            {errors.proposalStatus &&
                                                                errors
                                                                    .proposalStatus
                                                                    .message}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="mb-5 font-bold" />
                                    <h1 className="mb-5 w-1/3 text-sm font-medium">
                                        Assign Info
                                    </h1>
                                    <DisclosureFunction
                                        disclosureName="January"
                                        editData={
                                            janData?.project_name ||
                                            janData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {januaryformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJanuaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleJanuaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...januaryformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setJanuaryFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleJanuaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...januaryformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setJanuaryFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJanuaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleJanuaryProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleJanuaryProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJanuaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    januaryremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={januaryaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="February"
                                        editData={
                                            febData?.project_name ||
                                            febData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {februaryformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleFebruaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleFebruaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...februaryformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setFebruaryFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleFebruaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...februaryformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setFebruaryFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleFebruaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleFebruaryProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleFebruaryProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleFebruaryProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    februaryremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={februaryaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="March"
                                        editData={
                                            marData?.project_name ||
                                            marData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {marchformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleMarchProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleMarchProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...marchformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setMarchFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleMarchProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...marchformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setMarchFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleMarchProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleMarchProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleMarchProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleMarchProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    marchremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={marchaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="April"
                                        editData={
                                            aprilData?.project_name ||
                                            aprilData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {aprilformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleAprilProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleAprilProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...aprilformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setAprilFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleAprilProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...aprilformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setAprilFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleAprilProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleAprilProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleAprilProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleAprilProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    aprilremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={apriladdFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="May"
                                        editData={
                                            mayData?.project_name ||
                                            mayData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {mayformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleMayProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleMayProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...mayformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setMayFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleMayProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...mayformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setMayFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleMayProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleMayProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleMayProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleMayProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    mayremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={mayaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="June"
                                        editData={
                                            juneData?.project_name ||
                                            juneData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {juneformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJuneProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleJuneProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...juneformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setJuneFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleJuneProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...juneformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setJuneFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJuneProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleJuneProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleJuneProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJuneProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    juneremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={juneaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="July"
                                        editData={
                                            julyData?.project_name ||
                                            julyData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {julyformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJulyProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleJulyProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...julyformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setJulyFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleJulyProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...julyformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setJulyFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJulyProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleJulyProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleJulyProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleJulyProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    julyremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={julyaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="August"
                                        editData={
                                            augData?.project_name ||
                                            augData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {augustformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleAugustProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleAugustProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...augustformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setAugustFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleAugustProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...augustformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setAugustFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleAugustProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleAugustProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleAugustProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    sselected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleAugustProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    augustremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={augustaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="September"
                                        editData={
                                            septData?.project_name ||
                                            septData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {septemberformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleSeptemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleSeptemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...septemberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setSeptemberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleSeptemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...septemberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setSeptemberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleSeptemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleSeptemberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleSeptemberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleSeptemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    septemberremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={septemberaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="October"
                                        editData={
                                            octData?.project_name ||
                                            octData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {octoberformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleOctoberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleOctoberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...octoberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setOctoberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleOctoberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...octoberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setOctoberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleOctoberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleOctoberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleOctoberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleOctoberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    octoberremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={octoberaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="November"
                                        editData={
                                            novData?.project_name ||
                                            novData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {novemberformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleNovemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleNovemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...novemberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setNovemberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleNovemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...novemberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setNovemberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleNovemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleNovemberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleNovemberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleNovemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    novemberremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={novemberaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />
                                    <DisclosureFunction
                                        disclosureName="December"
                                        editData={
                                            decData?.project_name ||
                                            decData?.role
                                        }
                                        disclosurePanel={
                                            <>
                                                {decemberformFields?.map(
                                                    (form, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <div className=" text-xs">
                                                                    <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                                                                        Add
                                                                        Project
                                                                        Information
                                                                    </h1>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 141,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        projectType
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.project_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleDecemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Customer
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 126,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    people={
                                                                                        customerList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form?.selectedProjectStatus
                                                                                            ? filteredCustomerList
                                                                                            : form.customer_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleDecemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'customer_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...decemberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = false
                                                                                        setDecemberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedCustomer(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-4 flex">
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Project
                                                                            </label>
                                                                            <div
                                                                                className="mr-3 mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 140,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        form?.selectedCustomerStatus &&
                                                                                        !form?.selectedProjectStatus
                                                                                            ? filteredProjectList
                                                                                            : projectList
                                                                                    }
                                                                                    upIcon={
                                                                                        janprojectupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanprojectUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' ||
                                                                                        form?.selectedCustomerStatus
                                                                                            ? {}
                                                                                            : form.project_id
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) => {
                                                                                        handleDecemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'project_id',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                        // Update the status after handling the change
                                                                                        const updatedForm =
                                                                                            [
                                                                                                ...decemberformFields,
                                                                                            ]
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedProjectStatus = true
                                                                                        updatedForm[
                                                                                            index
                                                                                        ].selectedCustomerStatus = false
                                                                                        setDecemberFormFields(
                                                                                            updatedForm,
                                                                                        )
                                                                                        setSelectedProject(
                                                                                            newValue?.name,
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative z-auto mb-2">
                                                                            <label>
                                                                                Role
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-[300px]"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 125,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        roleList
                                                                                    }
                                                                                    upIcon={
                                                                                        janroleupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanroleUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form.role
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleDecemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'role',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                                                                        <div className="flex">
                                                                            <div className="mr-3 w-[300px]">
                                                                                <label>
                                                                                    Man
                                                                                    Month
                                                                                </label>

                                                                                <Controller
                                                                                    name="man_month"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.man_month
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleDecemberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.manHour &&
                                                                                        errors
                                                                                            .manHour
                                                                                            .message}
                                                                                </span>
                                                                            </div>

                                                                            <div className="w-[300px]">
                                                                                <label className="flex gap-2">
                                                                                    Unit
                                                                                    Price
                                                                                    <Image
                                                                                        src={
                                                                                            RequireIcon
                                                                                        }
                                                                                        className=" justify-center"
                                                                                        alt="no image"
                                                                                    />
                                                                                </label>
                                                                                <Controller
                                                                                    name="unit_price"
                                                                                    control={
                                                                                        control
                                                                                    }
                                                                                    render={({
                                                                                        field,
                                                                                    }) => (
                                                                                        <input
                                                                                            disabled={
                                                                                                form?.project_type ===
                                                                                                    undefined ||
                                                                                                form
                                                                                                    ?.project_type
                                                                                                    ?.id ===
                                                                                                    undefined ||
                                                                                                (null &&
                                                                                                    true)
                                                                                            }
                                                                                            {...field}
                                                                                            value={
                                                                                                form.unit_price
                                                                                            }
                                                                                            onChange={(
                                                                                                event,
                                                                                            ) =>
                                                                                                handleDecemberProjectChange(
                                                                                                    event,
                                                                                                    index,
                                                                                                )
                                                                                            }
                                                                                            type="number"
                                                                                            className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                <span className=" text-red-600">
                                                                                    {errors.unitPrice &&
                                                                                        errors
                                                                                            .unitPrice
                                                                                            .message}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <div className="relative z-auto mb-2 mr-3 w-[300px]">
                                                                            <label>
                                                                                Member
                                                                                Type
                                                                            </label>
                                                                            <div
                                                                                className="mt-2 w-full"
                                                                                style={{
                                                                                    position:
                                                                                        'relative',
                                                                                    zIndex: 130,
                                                                                }}
                                                                            >
                                                                                <EditDropDown
                                                                                    disabled={
                                                                                        form?.project_type ===
                                                                                            undefined ||
                                                                                        form
                                                                                            ?.project_type
                                                                                            ?.id ===
                                                                                            undefined ||
                                                                                        (null &&
                                                                                            true) ||
                                                                                        (form
                                                                                            ?.project_type
                                                                                            ?.name ===
                                                                                            'SES' &&
                                                                                            true)
                                                                                    }
                                                                                    people={
                                                                                        memberTypeList
                                                                                    }
                                                                                    upIcon={
                                                                                        janmembertypeupIcon
                                                                                    }
                                                                                    setUpIcon={
                                                                                        setjanmembertypeUpIcon
                                                                                    }
                                                                                    selected={
                                                                                        form
                                                                                        ?.project_type
                                                                                        ?.name ===
                                                                                        'SES' ? {}:
                                                                                        form.member_type
                                                                                    }
                                                                                    handleChange={(
                                                                                        newValue,
                                                                                    ) =>
                                                                                        handleDecemberProjectChange(
                                                                                            {
                                                                                                target: {
                                                                                                    name: 'member_type',
                                                                                                    value: newValue,
                                                                                                },
                                                                                            },
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {index !==
                                                                            0 && (
                                                                            <button
                                                                                className="mt-3 inline-flex h-[30px] w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                                                onClick={() =>
                                                                                    decemberremoveFields(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    },
                                                )}
                                                <button
                                                    onClick={decemberaddFields}
                                                    className="mt-2 inline-flex h-[30px] w-[115px] items-center justify-center rounded-md bg-blue-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                                >
                                                    <Image
                                                        src={AddIcon}
                                                        className=" mr-1 w-2"
                                                        alt="no image"
                                                    />
                                                    Add Project
                                                </button>
                                            </>
                                        }
                                    />

                                    <div className="mt-4">
                                        <div className="w-1/3"></div>
                                        <div className="flex items-center">
                                            {loading ? (
                                                <button
                                                    type="button"
                                                    className="mr-2 h-[30px] flex items-center justify-center w-[70px] rounded-md bg-blue-800 text-white shadow-md shadow-gray-400"
                                                >
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        fill="currentColor"
                                                        className="mr-2 animate-spin"
                                                        viewBox="0 0 1792 1792"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                                                    </svg>
                                                    Add
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmit(
                                                        handleCreate,
                                                    )}
                                                    className="mr-2 h-[30px] w-[70px] rounded-md bg-blue-800 text-white shadow-md shadow-gray-400"
                                                >
                                                    Add
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="h-[30px] w-[70px] rounded-md bg-red-600 text-white shadow-md shadow-gray-400"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ProjectAssignEditForm
