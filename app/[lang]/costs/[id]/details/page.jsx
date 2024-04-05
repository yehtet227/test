'use client'

import { toggleCollapsible } from '@/app/store/client/features/sidebar/collapsibleSlice'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import './Cost.css'
import { useGetCostDetailById } from '@/app/store/server/features/costs'
import { useGetAllMemberTypes } from '@/app/store/server/features/member-types'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import Image from 'next/image'
import React, { useEffect } from 'react'
import RightArrow from '../../../../../public/right-arrow.svg'

const CostDetailInfo = ({ params }) => {
    const { data: costDetailData, refetch } = useGetCostDetailById(params.id)
    const { data: roles } = useGetAllRoles()
    const { data: memberTypes } = useGetAllMemberTypes()
    const orderData = costDetailData?.[0]?.orders?.[0]
    const projectData = costDetailData?.[0]?.projects?.[0]
    const costDetail = costDetailData?.[1]
    // const costDetailJapan = costDetailData?.[1]?.Japan?.[0]
    // const costDetailMyanmar = costDetailData?.[1].Myanmar?.[0]
    const dispatch = useDispatch()

    useEffect(() => {
        refetch()
    }, [refetch])

    function getManMonthForMonthAndType(monthName, projectType, role) {
        if (projectData?.months?.includes(monthName)) {
            return orderData?.[
                `${projectTypeKey(projectType)}_${role}_man_month`
            ]
        }
        return ''
    }

    function getUnitPriceByRole(projectType, role) {
        return (
            orderData?.[
                `${projectTypeKey(projectType)}_${role}_average_unit_price`
            ] || ''
        )
    }

    function projectTypeKey(projectType) {
        switch (projectType) {
            case 1:
                return 'ses'
            case 2:
                return 'jp'
            case 3:
                return 'mm'
            case 4:
                return 'jp'
            default:
                return 'mm'
        }
    }

    const location = orderData?.project_type_id === 3 ? 'Myanmar' : 'Japan'

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    const projectDetails = []

    const rolesData = [
        {
            role: 'Project Manager',
            shortForm: 'pm',
        },
        {
            role: 'Project Leader',
            shortForm: 'pl',
        },
        {
            role: 'Senior Engineer',
            shortForm: 'se',
        },
        {
            role: 'Programmer',
            shortForm: 'pg',
        },
        {
            role: 'OH/Other',
            shortForm: 'oh',
        },
    ]

    if (orderData?.project_type_id === 4) {
        const locations = ['Japan', 'Myanmar']

        locations.forEach((location) => {
            rolesData.forEach((role, index) => {
                const workload = {
                    role: role.role,
                    location: location,
                    unitPrice: getUnitPriceByRole(
                        location === 'Japan' ? 2 : 3,
                        role?.shortForm?.toLowerCase(),
                    ),
                }

                months.forEach((month, i) => {
                    workload[month.toLowerCase()] = getManMonthForMonthAndType(
                        month,
                        location === 'Japan' ? 2 : 3,
                        role?.shortForm?.toLowerCase(),
                    )
                })
                projectDetails.push(workload)
            })
        })
    } else {
        rolesData.forEach((role, index) => {
            const workload = {
                role: role.role,
                location,
                unitPrice: getUnitPriceByRole(
                    orderData?.project_type_id,
                    role?.shortForm?.toLowerCase(),
                ),
            }

            months.forEach((month, i) => {
                workload[month.toLowerCase()] = getManMonthForMonthAndType(
                    month,
                    orderData?.project_type_id,
                    role?.shortForm?.toLowerCase(),
                )
            })
            projectDetails.push(workload)
        })
    }

    const monthlyTotalAmount = (month) => {
        let monthlyAmount = ''
        const checkMonth = projectDetails.map(
            (project) => project?.[month] !== '',
        )
        if (checkMonth.some(Boolean)) {
            monthlyAmount = projectDetails
                .map(
                    (project) =>
                        Number(project?.[month]) * Number(project?.unitPrice),
                )
                .reduce((partialSum, a) => partialSum + a, 0)
        }
        return monthlyAmount
    }

    const totalAmount = () => {
        const amount = projectDetails
            .map(
                (project) =>
                    Number(project?.january) * Number(project?.unitPrice) +
                    Number(project?.february) * Number(project?.unitPrice) +
                    Number(project?.march) * Number(project?.unitPrice) +
                    Number(project?.april) * Number(project?.unitPrice) +
                    Number(project?.may) * Number(project?.unitPrice) +
                    Number(project?.june) * Number(project?.unitPrice) +
                    Number(project?.july) * Number(project?.unitPrice) +
                    Number(project?.august) * Number(project?.unitPrice) +
                    Number(project?.september) * Number(project?.unitPrice) +
                    Number(project?.october) * Number(project?.unitPrice) +
                    Number(project?.november) * Number(project?.unitPrice) +
                    Number(project?.december) * Number(project?.unitPrice),
            )
            .reduce((partialSum, a) => partialSum + a, 0)
        return amount
    }

    const roleMap = {}
    roles?.forEach((role) => {
        roleMap[role.id] = role.role_name
    })

    const resultObject = {};

    if (costDetail) {
    Object.keys(costDetail).forEach((location) => {
        costDetail[location].forEach((item) => {
            const { memberType, role, month, man_month } = item;

            if (!resultObject[memberType]) {
                resultObject[memberType] = { memberType, roles: [] };
            }
            if (!resultObject[memberType]) {
                resultObject[memberType] = { memberType, roles: [] };
            }

            const roleName = roleMap[role] || `Role ${role}`;

            const existingRole = resultObject[memberType].roles.find(
                (roleObj) => roleObj.name === roleName && roleObj.location === location
            );

            if (!existingRole) {
                resultObject[memberType].roles.push({
                    name: roleName,
                    man_month,
                    months: [],
                    location,
                    unitPrice: item.unitPrice?.[`${item.role}`],
                });
            }
            

            
            const currentRole = resultObject[memberType].roles.find(
                (roleObj) => roleObj.name === roleName && roleObj.location === location
            );

            currentRole[month.toLowerCase()] = month;
            

            currentRole.months.push({ month });
        });
    });
}
            
    const resultArray = Object.values(resultObject)

    const mapping = {
        1: 'assignOJTWorkload',
        2: 'assignDevWorkload',
        3: 'assignSupportWorkload',
    }

    const workloadArrays = {
        assignOJTWorkload: [],
        assignOJTWorkload: [],
        assignDevWorkload: [],
        assignSupportWorkload: [],
    }

    resultArray?.forEach((project) => {
        const workloadKey = mapping[project.memberType]
        if (workloadKey) {
            const workloadArray = workloadArrays[workloadKey]
            workloadArray.push(...project?.roles)
        }
    })

    console.log('assignSupportWorkload:', workloadArrays.assignSupportWorkload)
    console.log('assignDevWorkload:', workloadArrays.assignDevWorkload)
    console.log('assignOJTWorkload:', workloadArrays.assignOJTWorkload)

    function calculateMonthlyTotalData(workloadArray) {
        const combinedData = {}

        workloadArray?.forEach((item) => {
            item.months.forEach((monthObj) => {
                const month = monthObj.month

                if (!combinedData[month]) {
                    combinedData[month] = {
                        total: 0,
                    }
                }

                const totalForItem = item.man_month * item.unitPrice
                combinedData[month].total += totalForItem
            })
        })

        return combinedData
    }

    const monthlyTotalForDev = calculateMonthlyTotalData(
        workloadArrays.assignDevWorkload,
    )
    const monthlyTotalForSupport = calculateMonthlyTotalData(
        workloadArrays.assignSupportWorkload,
    )
    const monthlyTotalForOJT = calculateMonthlyTotalData(
        workloadArrays.assignOJTWorkload,
    )

    console.log('Combined Data for Support Workload:', monthlyTotalForDev)
    console.log('Combined Data for Dev Workload:', monthlyTotalForSupport)
    console.log('Combined Data for OJT Workload:', monthlyTotalForOJT)

    function costVarianceMonthlyTotal(month) {
        const engageTotal = monthlyTotalAmount(month)
        const devTotal = monthlyTotalForDev?.[month]?.total || 0
        const supportTotal = monthlyTotalForSupport?.[month]?.total || 0
        const ojtTotal = monthlyTotalForOJT?.[month]?.total || 0

        const result = engageTotal - (devTotal + supportTotal + ojtTotal)

        return result !== 0 ? result : ''
    }

    function engagePlusAssignMonthlyTotal(month) {
        const engageTotal = monthlyTotalAmount(month)
        const devTotal = monthlyTotalForDev?.[month]?.total || 0
        const supportTotal = monthlyTotalForSupport?.[month]?.total || 0

        const result = engageTotal - (devTotal + supportTotal)

        return result !== 0 ? result : ''
    }

    function calculateTotalForDev(monthlyTotalForDev) {
        let total = 0
        for (const month of months) {
            total += monthlyTotalForDev?.[month]?.total || 0
        }
        return total
    }

    console.log(
            Number(costVarianceMonthlyTotal('january')) +
            Number(costVarianceMonthlyTotal('february')) +
            Number(costVarianceMonthlyTotal('march')) +
            Number(costVarianceMonthlyTotal('april')) +
            Number(costVarianceMonthlyTotal('may')) +
            Number(costVarianceMonthlyTotal('june')) +
            Number(costVarianceMonthlyTotal('july')) +
            Number(costVarianceMonthlyTotal('august')) +
            Number(costVarianceMonthlyTotal('september')) +
            Number(costVarianceMonthlyTotal('october')) +
            Number(costVarianceMonthlyTotal('november')) +
            Number(costVarianceMonthlyTotal('december')),
    )

    return (
        <div className="mt-2 flex flex-col text-xs" suppressHydrationWarning>
            <div className="sticky top-0 mb-3 flex flex-col justify-between bg-white">
                <div className="items my-1 mb-3 flex flex-row items-center py-[2px] text-sm">
                    <div
                        className="cursor-pointer"
                        onClick={() => dispatch(toggleCollapsible())}
                    >
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    </div>
                    <div className="ml-3 flex items-center gap-2 pl-0 text-sm">
                        <Link href={'/costs'} className="font-medium">
                            Cost
                        </Link>

                        <Image
                            src={RightArrow}
                            className=" justify-center"
                            alt="no image"
                        />

                        <Link href="#" className="font-medium">
                            Cost Details
                        </Link>
                    </div>
                </div>
                <hr />
            </div>
            <hr className="font-bold" />

            <div>
                <div className="table-container overflow-x-auto">
                    <table className="w-[200px] min-w-full border-collapse divide-y divide-gray-200 border">
                        <thead className="text bg-gray-50 text-sm">
                            <tr>
                                <th
                                    colSpan="18"
                                    className="bg-white py-2 pl-2 text-left font-medium text-gray-500"
                                >
                                    Engage Workload
                                </th>
                            </tr>
                            <tr className="h-[50px] bg-gray-50">
                                <th
                                    className="text-based bg-gray-50 whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Type
                                </th>

                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Role
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Location
                                </th>

                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 pr-1 pl-1 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Jan
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-2 pr-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Feb
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Mar
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Apr
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    May
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Jun
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    July
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Aug
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Sept
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Oct
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Nov
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Dec
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Total Members
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Unit Price
                                </th>
                                <th
                                    className="text-based whitespace-nowrap border px-6 py-2 text-center text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Total Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {projectDetails?.map((project, index) => (
                                <tr key={index}>
                                    {index === 0 ? (
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                            style={{ fontSize: '12px' }}
                                        >
                                            Dev
                                        </td>
                                    ) : (
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                            style={{
                                                fontSize: '12px',
                                                visibility: 'hidden',
                                            }}
                                        >
                                            Dev
                                        </td>
                                    )}
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.role}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.location}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.january}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.february}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.march}
                                    </td>

                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.april}
                                    </td>

                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.may}
                                    </td>

                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.june}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.july}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.august}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.september}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.october}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.november}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.december}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {Number(project?.december) +
                                            Number(project?.november) +
                                            Number(project?.april) +
                                            Number(project?.september) +
                                            Number(project?.october) +
                                            Number(project?.july) +
                                            Number(project?.january) +
                                            Number(project?.february) +
                                            Number(project?.march) +
                                            Number(project?.may) +
                                            Number(project?.june) +
                                            Number(project?.august)}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {project?.unitPrice.toLocaleString(
                                            'en-US',
                                        )}
                                    </td>
                                    <td
                                        className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {(
                                            (Number(project?.december) +
                                                Number(project?.november) +
                                                Number(project?.april) +
                                                Number(project?.september) +
                                                Number(project?.october) +
                                                Number(project?.july) +
                                                Number(project?.january) +
                                                Number(project?.february) +
                                                Number(project?.march) +
                                                Number(project?.may) +
                                                Number(project?.june) +
                                                Number(project?.august)) *
                                            Number(project?.unitPrice)
                                        ).toLocaleString('en-US')}
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ border: '2px solid #ccc' }}>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount(
                                        'january',
                                    ).toLocaleString('en-US')}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount(
                                        'february',
                                    ).toLocaleString('en-US')}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount('march').toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount('april').toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount('may').toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount('june').toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount('july').toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount(
                                        'august',
                                    ).toLocaleString('en-US')}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount(
                                        'september',
                                    ).toLocaleString('en-US')}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount(
                                        'october',
                                    ).toLocaleString('en-US')}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount(
                                        'november',
                                    ).toLocaleString('en-US')}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalAmount(
                                        'december',
                                    ).toLocaleString('en-US')}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                    style={{ fontSize: '12px' }}
                                >
                                    {totalAmount().toLocaleString('en-US')}
                                </td>
                            </tr>
                        </tbody>

                        <thead className="bg-gray-100 text-sm">
                            <tr>
                                <th
                                    colSpan="18"
                                    className="bg-white py-2 pl-2 text-left font-medium text-gray-500"
                                >
                                    Assigned Workload
                                </th>
                            </tr>
                            <tr className="h-[50px] bg-gray-50">
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Type
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Role
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Location
                                </th>

                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Jan
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Feb
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Mar
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Apr
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    May
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Jun
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    July
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Aug
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Sept
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Oct
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Nov
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Dec
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Total Members
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Unit Price
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Total Amount
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {workloadArrays?.assignDevWorkload?.map(
                                (project, index) => (
                                    <tr key={index}>
                                        {index === 0 ? (
                                            <td
                                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                                style={{ fontSize: '12px' }}
                                            >
                                                Dev
                                            </td>
                                        ) : (
                                            <td
                                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                                style={{
                                                    fontSize: '12px',
                                                    visibility: 'hidden',
                                                }}
                                            >
                                                Dev
                                            </td>
                                        )}
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.name}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.location}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.january
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.february
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.march
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.april
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.may
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.june
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.july
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.august
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.september
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.october
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.november
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.december
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {Number(project?.man_month) *
                                                Number(project?.months?.length)}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.unitPrice.toLocaleString(
                                                'en-US',
                                            )}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {(
                                                Number(project?.man_month) *
                                                Number(
                                                    project?.months?.length,
                                                ) *
                                                Number(project?.unitPrice)
                                            ).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                ),
                            )}
                            <tr style={{ border: '2px solid #ccc' }}>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.january?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.february?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.march?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.april?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.may?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.june?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.july?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.august?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.september?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.october?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.november?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForDev?.december?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                    style={{ fontSize: '12px' }}
                                >
                                    {[
                                        monthlyTotalForDev?.january?.total,
                                        monthlyTotalForDev?.february?.total,
                                        monthlyTotalForDev?.march?.total,
                                        monthlyTotalForDev?.april?.total,
                                        monthlyTotalForDev?.may?.total,
                                        monthlyTotalForDev?.june?.total,
                                        monthlyTotalForDev?.july?.total,
                                        monthlyTotalForDev?.august?.total,
                                        monthlyTotalForDev?.september?.total,
                                        monthlyTotalForDev?.october?.total,
                                        monthlyTotalForDev?.november?.total,
                                    ]
                                        .filter((value) => !isNaN(value)) // Filter out NaN values
                                        .map((value) => parseFloat(value) || 0) // Convert to numbers with default value 0
                                        .reduce(
                                            (total, value) => total + value,
                                            0,
                                        )
                                        .toLocaleString('en-US')}
                                </td>
                            </tr>
                        </tbody>

                        <tbody className="divide-y divide-gray-100 bg-white">
                            {workloadArrays?.assignSupportWorkload?.map(
                                (project, index) => (
                                    <tr key={index}>
                                        {index === 0 ? (
                                            <td
                                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                                style={{ fontSize: '12px' }}
                                            >
                                                Support
                                            </td>
                                        ) : (
                                            <td
                                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                                style={{
                                                    fontSize: '12px',
                                                    visibility: 'hidden',
                                                }}
                                            >
                                                Support
                                            </td>
                                        )}
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.name}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.location}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.january
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.february
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.march
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.april
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.may
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.june
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.july
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.august
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.september
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.october
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.november
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.december
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {Number(project?.man_month) *
                                                Number(project?.months?.length)}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.unitPrice.toLocaleString(
                                                'en-US',
                                            )}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {(
                                                Number(project?.man_month) *
                                                Number(
                                                    project?.months?.length,
                                                ) *
                                                Number(project?.unitPrice)
                                            ).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                ),
                            )}
                            <tr style={{ border: '2px solid #ccc' }}>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.january?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.february?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.march?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.april?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.may?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.june?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.july?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.august?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.september?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.october?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.november?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForSupport?.december?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                    style={{ fontSize: '12px' }}
                                >
                                    {[
                                        monthlyTotalForSupport?.january?.total,
                                        monthlyTotalForSupport?.february?.total,
                                        monthlyTotalForSupport?.march?.total,
                                        monthlyTotalForSupport?.april?.total,
                                        monthlyTotalForSupport?.may?.total,
                                        monthlyTotalForSupport?.june?.total,
                                        monthlyTotalForSupport?.july?.total,
                                        monthlyTotalForSupport?.august?.total,
                                        monthlyTotalForSupport?.september
                                            ?.total,
                                        monthlyTotalForSupport?.october?.total,
                                        monthlyTotalForSupport?.november?.total,
                                    ]
                                        .filter((value) => !isNaN(value))
                                        .map((value) => parseFloat(value) || 0)
                                        .reduce(
                                            (total, value) => total + value,
                                            0,
                                        )
                                        .toLocaleString('en-US')}
                                </td>
                            </tr>
                        </tbody>

                        <thead className="bg-gray-100 text-sm">
                            <tr>
                                <th
                                    colSpan="18"
                                    className="bg-white py-2 pl-2 text-left font-medium text-gray-500"
                                >
                                    OJT Members
                                </th>
                            </tr>
                            <tr className="h-[50px] bg-gray-50">
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Type
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Role
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Location
                                </th>

                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Jan
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Feb
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Mar
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Apr
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    May
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Jun
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    July
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Aug
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Sept
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Oct
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Nov
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Dec
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Total Members
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Unit Price
                                </th>
                                <th
                                    className="whitespace-nowrap border px-6 py-2 text-center text-base text-gray-500"
                                    style={{ fontSize: '14px' }}
                                >
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {workloadArrays?.assignOJTWorkload?.map(
                                (project, index) => (
                                    <tr key={index}>
                                        {index === 0 ? (
                                            <td
                                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                                style={{ fontSize: '12px' }}
                                            >
                                                OJT/Edu
                                            </td>
                                        ) : (
                                            <td
                                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                                style={{
                                                    fontSize: '12px',
                                                    visibility: 'hidden',
                                                }}
                                            >
                                                OJT/Edu
                                            </td>
                                        )}
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.name}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.location}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.january
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.february
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.march
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.april
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.may
                                                ? project?.man_month
                                                : ''}
                                        </td>

                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.june
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.july
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.august
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.september
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.october
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.november
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.december
                                                ? project?.man_month
                                                : ''}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {Number(project?.man_month) *
                                                Number(project?.months?.length)}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {project?.unitPrice.toLocaleString(
                                                'en-US',
                                            )}
                                        </td>
                                        <td
                                            className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                            style={{ fontSize: '12px' }}
                                        >
                                            {(
                                                Number(project?.man_month) *
                                                Number(
                                                    project?.months?.length,
                                                ) *
                                                Number(project?.unitPrice)
                                            ).toLocaleString('en-US')}
                                        </td>
                                    </tr>
                                ),
                            )}
                            <tr style={{ border: '2px solid #ccc' }}>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.january?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.february?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.march?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.april?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.may?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.june?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.july?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.august?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.september?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.october?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.november?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                    style={{ fontSize: '12px' }}
                                >
                                    {monthlyTotalForOJT?.december?.total.toLocaleString(
                                        'en-US',
                                    )}
                                </td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                    style={{ fontSize: '12px' }}
                                ></td>
                                <td
                                    className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                    style={{ fontSize: '12px' }}
                                >
                                    {[
                                        monthlyTotalForOJT?.january?.total,
                                        monthlyTotalForOJT?.february?.total,
                                        monthlyTotalForOJT?.march?.total,
                                        monthlyTotalForOJT?.april?.total,
                                        monthlyTotalForOJT?.may?.total,
                                        monthlyTotalForOJT?.june?.total,
                                        monthlyTotalForOJT?.july?.total,
                                        monthlyTotalForOJT?.august?.total,
                                        monthlyTotalForOJT?.september?.total,
                                        monthlyTotalForOJT?.october?.total,
                                        monthlyTotalForOJT?.november?.total,
                                    ]
                                        .filter((value) => !isNaN(value))
                                        .map((value) => parseFloat(value) || 0)
                                        .reduce(
                                            (total, value) => total + value,
                                            0,
                                        )
                                        .toLocaleString('en-US')}
                                </td>
                            </tr>
                        </tbody>

                        <tr>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                            <td className="border py-4"></td>
                        </tr>

                        <tr>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                style={{ fontSize: '12px' }}
                            >
                                Labor Cost Variance
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                style={{ fontSize: '12px' }}
                            >
                                Total
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                style={{ fontSize: '12px' }}
                            ></td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'january',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'february',
                                ).toLocaleString('en-US')}
                            </td>

                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'march',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'april',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal('may').toLocaleString(
                                    'en-US',
                                )}
                            </td>

                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'june',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'july',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'august',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'september',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'october',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'november',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {costVarianceMonthlyTotal(
                                    'december',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                style={{ fontSize: '12px' }}
                            ></td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                style={{ fontSize: '12px' }}
                            ></td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                style={{ fontSize: '12px' }}
                            >
                                {(
                                    Number(
                                        costVarianceMonthlyTotal('january'),
                                    ) +
                                    Number(
                                        costVarianceMonthlyTotal('february'),
                                    ) +
                                    Number(costVarianceMonthlyTotal('march')) +
                                    Number(costVarianceMonthlyTotal('april')) +
                                    Number(costVarianceMonthlyTotal('may')) +
                                    Number(costVarianceMonthlyTotal('june')) +
                                    Number(costVarianceMonthlyTotal('july')) +
                                    Number(costVarianceMonthlyTotal('august')) +
                                    Number(
                                        costVarianceMonthlyTotal('september'),
                                    ) +
                                    Number(
                                        costVarianceMonthlyTotal('october'),
                                    ) +
                                    Number(
                                        costVarianceMonthlyTotal('november'),
                                    ) +
                                    Number(costVarianceMonthlyTotal('december'))
                                ).toLocaleString('en-US')}
                            </td>
                        </tr>

                        <tr>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                style={{ fontSize: '12px' }}
                            ></td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left"
                                style={{ fontSize: '12px' }}
                            >
                                w/o OJT Cost
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-left font-bold"
                                style={{ fontSize: '12px' }}
                            ></td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'january',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'february',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'march',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'april',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'may',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'june',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'july',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'august',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'september',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'october',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'november',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            >
                                {engagePlusAssignMonthlyTotal(
                                    'december',
                                ).toLocaleString('en-US')}
                            </td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            ></td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right"
                                style={{ fontSize: '12px' }}
                            ></td>
                            <td
                                className="text-based whitespace-nowrap border px-6 py-2 pl-1 pr-2 text-right font-bold"
                                style={{ fontSize: '12px' }}
                            >
                                {(
                                    Number(
                                        engagePlusAssignMonthlyTotal('january'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal(
                                            'february',
                                        ),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal('march'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal('april'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal('may'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal('june'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal('july'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal('august'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal(
                                            'september',
                                        ),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal('october'),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal(
                                            'november',
                                        ),
                                    ) +
                                    Number(
                                        engagePlusAssignMonthlyTotal(
                                            'december',
                                        ),
                                    )
                                ).toLocaleString('en-US')}
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="table-scroll-filler"></div>
            </div>
        </div>
    )
}

export default CostDetailInfo