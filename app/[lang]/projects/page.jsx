'use client'

import CustomTable from '@/app/components/table/CustomTable'
import { clearProjectCreateInfoState } from '@/app/store/client/features/project_create/projectCreateInfoSlice'
import { clearJPOrderState } from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'
import { clearMMOrderState } from '@/app/store/client/features/project_create/projectCreateMMOrderSlice'
import { clearSESState } from '@/app/store/client/features/project_create/projectCreateSesInfoSlice'
import { setCurrentURL } from '@/app/store/client/features/url_track/urlTrackSlice'
import { useGetAllProjects } from '@/app/store/server/features/projectList/queries'
import { useDeleteProject } from '@/app/store/server/features/projects/mutations'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Page = () => {
    const dispatch = useDispatch()
    const pathname = usePathname().replace(/^\/en/, '')
    useEffect(() => {
        dispatch(clearProjectCreateInfoState())
        dispatch(clearJPOrderState())
        dispatch(clearMMOrderState())
        dispatch(clearSESState())
        dispatch(setCurrentURL(pathname))
    }, [dispatch, pathname])
    const projectIdState = useSelector(
        (state) => state.customTableCheckboxReturnId,
    )

    const {
        data: projects,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetAllProjects()
    function getProjectProperty(project, sesProp, jpProp, mmProp, isJPMM) {
        if (project?.orders[0]?.project_type?.project_type.includes('SES')) {
            return project?.orders[0]?.[sesProp]
        } else if (
            project?.orders[0]?.project_type?.project_type.includes(
                'Offshore(Japan)',
            )
        ) {
            return project?.orders[0]?.[jpProp]
        } else if (
            project?.orders[0]?.project_type?.project_type.includes(
                'Offshore(Myanmar)',
            )
        ) {
            return project?.orders[0]?.[mmProp]
        } else {
            if (isJPMM) {
                return (
                    Number(project?.orders[0]?.[jpProp]) +
                    Number(project?.orders[0]?.[mmProp])
                )
            } else {
                return project?.orders[0]?.[jpProp]
            }
        }
    }
    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'projectname',
            width: '300',
            align: '80',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customername',
            width: '300',
            align: '80',
        },
        {
            title: 'Project Type',
            dataIndex: 'projecttype',
            width: '200',
            align: '80',
        },
        {
            title: 'Year',
            dataIndex: 'Year',
            width: '100',
            align: '80',
        },
        {
            title: 'Contract Status',
            dataIndex: 'contractstatus',
            width: '160',
            align: '80',
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentstatus',
            width: '160',
            align: '80',
        },
        {
            title: 'Department',
            dataIndex: 'department',
            width: '140',
            align: '80',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            width: '140',
            align: '80',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            width: '140',
            align: '80',
        },
        {
            title: 'Marketing',
            dataIndex: 'marketingName',
            width: '140',
            align: '80',
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            width: '160',
            align: '80',
        },
        {
            title: 'Acceptance Billing Date',
            dataIndex: 'acceptanceDate',
            width: '160',
            align: '80',
        },
        {
            title: 'Payment Date',
            dataIndex: 'paymentDate',
            width: '160',
            align: '80',
        },
        {
            title: 'Contract Number',
            dataIndex: 'contractNumber',
            width: '200',
            align: '80',
        },
        {
            title: 'Estimate Number',
            dataIndex: 'estimateNumber',
            width: '200',
            align: '80',
        },
        {
            title: 'Order Number',
            dataIndex: 'orderNumber',
            width: '160',
            align: '80',
        },
        {
            title: 'Estimate Cost',
            dataIndex: 'estimateCost',
            width: '160',
            align: '80',
        },
    ]

    let projectLists
    if (projects) {
        projectLists = projects?.map((project, index) => ({
            key: project?.id,
            projectname: project?.project_name,
            customername: project?.customer?.customer_name,
            projecttype: project?.orders[0]?.project_type?.project_type,
            Year: project?.year,
            contractstatus: project?.contract_status.includes('contracted')
                ? 'Contracted'
                : 'Waiting',
            paymentstatus:
                project?.payment_status === 'paid' ? 'Already Paid' : 'Unpaid',
            department:
                project?.department?.department_name === 'IT'
                    ? 'Info Tech'
                    : project?.department?.department_name,
            startDate: project?.start_date,
            endDate: project?.end_date,
            marketingName: project?.marketing_name,
            deliveryDate: getProjectProperty(
                project,
                'ses_delivery_date',
                'jp_delivery_date',
                'mm_delivery_date',
            ),
            acceptanceDate: getProjectProperty(
                project,
                'ses_acceptance_billing_date',
                'jp_acceptance_billing_date',
                'mm_acceptance_billing_date',
            ),
            paymentDate: getProjectProperty(
                project,
                'ses_payment_date',
                'jp_payment_date',
                'mm_payment_date',
            ),
            contractNumber: project?.contract_number,
            estimateNumber: getProjectProperty(
                project,
                'ses_estimate_number',
                'jp_estimate_number',
                'mm_estimate_number',
            ),
            orderNumber: getProjectProperty(
                project,
                'ses_order_number',
                'jp_order_number',
                'mm_order_number',
            ),
            estimateCost: getProjectProperty(
                project,
                'ses_order_amount',
                'jp_order_amount',
                'mm_order_amount',
                'jpmm',
            ),
        }))
    }

    const { mutate: deleteProject } = useDeleteProject()
    return (
        <>
            <CustomTable
                columns={columns}
                data={projectLists}
                searchColumns={['projectname', 'customername']}
                checkoutBox={true}
                delete={deleteProject}
                addBtn={true}
                addRouteUrl="/projects/create"
                columnsFilterBtn={true}
                columnsDataFilter={true}
                editRouteUrl={`/projects`}
                isSuccess={isSuccess}
                isError={isError}
                isLoading={isLoading}
            />
        </>
    )
}

export default Page
