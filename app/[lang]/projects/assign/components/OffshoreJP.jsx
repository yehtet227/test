import DropDown from '@/app/[lang]/engineers-info/assign/components/DropDown'
import {
    setJpAcceptanceBillingDate,
    setJpApprovalNumber,
    setJpAvgUnitPrice,
    setJpDeliveryDate,
    setJpEsitmateNumber,
    setJpManMonth,
    setJpOrderAmount,
    setJpOrderNumber,
    setJpPaymentDate,
    setJpProjectLeader,
} from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Dropdown from './DropDown'

const OffshoreJP = ({ errMsg }) => {
    const dispatch = useDispatch()
    const [edit, setEdit] = useState(false)
    const projectCreateJPOrderState = useSelector(
        (state) => state.projectCreateJPOrderInfo,
    )

    const { data: employees } = useGetAllEmployees()
    const { data: roles } = useGetAllRoles()
    const projectLeaders = employees?.filter(
        (employee) => employee.position === '1',
    )

    const handleProjectLeaderChange = (name) => {
        dispatch(setJpProjectLeader(name))
    }

    const handleEstimateNumberChange = (estimateNumber) => {
        dispatch(setJpEsitmateNumber(estimateNumber))
    }

    const handleApprovalNumberChange = (approvalNumber) => {
        dispatch(setJpApprovalNumber(approvalNumber))
    }

    const handleOrderNumberChange = (orderNumber) => {
        dispatch(setJpOrderNumber(orderNumber))
    }

    const handelDeliveryDateChange = (deliveryDate) => {
        dispatch(setJpDeliveryDate(deliveryDate))
    }

    const handleManMonthChange = (manMonth) => {
        dispatch(setJpManMonth(manMonth))
        dispatch(
            setJpOrderAmount(
                manMonth * projectCreateJPOrderState?.jpAvgUnitPrice,
            ),
        )
    }

    const handleAvgUnitPriceChange = (unitPrice) => {
        dispatch(setJpAvgUnitPrice(unitPrice))
        dispatch(
            setJpOrderAmount(unitPrice * projectCreateJPOrderState?.jpManMonth),
        )
    }

    const handleOrderAmountChange = (amount) => {
        dispatch(setJpOrderAmount(amount))
    }

    const handleAcceptamceDateChange = (acceptanceDate) => {
        dispatch(setJpAcceptanceBillingDate(acceptanceDate))
    }

    const handlePaymentDateChange = (paymentDate) => {
        dispatch(setJpPaymentDate(paymentDate))
    }
    return (
        <div className="mb-8 mt-8 flex flex-row justify-center gap-x-20">
            <h1 className="text-center ">GICJ Order Information</h1>
            <div className="flex w-80 flex-col">
                <div className="mb-4 space-y-2">
                    <label htmlFor="title">Project Leader</label>
                    {/* <DropDown
                                    data={projectLeaders}
                                    filterName="emp_name"
                                    name="emp_name"
                                    jpProjectLeader="true"
                                    setEdit={setEdit}
                                ></DropDown> */}
                    <Dropdown
                        options={projectLeaders}
                        initialValue={null}
                        generateLabel={(option) => option?.emp_name}
                        onSelect={(option) =>
                            handleProjectLeaderChange(option?.emp_name)
                        }
                    ></Dropdown>
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number">Estimate Number</label>
                    <input
                        value={
                            '' || projectCreateJPOrderState?.jpEsitmateNumber
                        }
                        onChange={(e) =>
                            handleEstimateNumberChange(e.target.value)
                        }
                        type="number"
                        id="estimate_number"
                        name="estimate_number"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="contract">Approval Number</label>
                    <input
                        value={
                            '' || projectCreateJPOrderState?.jpApprovalNumber
                        }
                        onChange={(e) =>
                            handleApprovalNumberChange(e.target.value)
                        }
                        type="text"
                        id="contract"
                        name="contract"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="contract">Order Number</label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpOrderNumber}
                        onChange={(e) =>
                            handleOrderNumberChange(e.target.value)
                        }
                        type="text"
                        id="contract"
                        name="contract"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="delivery_date">Delivery Date</label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpDeliveryDate}
                        onChange={(e) =>
                            handelDeliveryDateChange(e.target.value)
                        }
                        type="date"
                        id="delivery_date"
                        name="delivery_date"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="man_month">Man-Month</label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpManMonth}
                        onChange={(e) => handleManMonthChange(e.target.value)}
                        type="number"
                        id="man_month"
                        name="man_month"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="unit_price">Average Unit Price</label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpAvgUnitPrice}
                        onChange={(e) =>
                            handleAvgUnitPriceChange(e.target.value)
                        }
                        type="number"
                        id="unit_price"
                        name="unit_price"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="contract">
                        Order Amount (Excluding tax)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpOrderAmount}
                        onChange={(e) =>
                            handleOrderAmountChange(e.target.value)
                        }
                        type="text"
                        id="contract"
                        name="contract"
                        className="w-full rounded-md border px-2 py-1"
                        disabled
                    />
                    {projectCreateJPOrderState?.jpOrderAmount === '' ||
                    (null && errMsg) ? (
                        <p className="text-red-500">
                            Please enter man month and unit price.
                        </p>
                    ) : (
                        ''
                    )}
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="acceptance_date">
                        Acceptance/billing date
                    </label>
                    <input
                        value={
                            '' ||
                            projectCreateJPOrderState?.jpAcceptanceBillingDate
                        }
                        onChange={(e) =>
                            handleAcceptamceDateChange(e.target.value)
                        }
                        type="date"
                        id="acceptance_date"
                        name="acceptance_date"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="payment_date">Payment Date</label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpPaymentDate}
                        onChange={(e) =>
                            handlePaymentDateChange(e.target.value)
                        }
                        type="date"
                        id="payment_date"
                        name="payment_date"
                        className="w-full rounded-md border px-2 py-1"
                    />
                </div>
            </div>
        </div>
    )
}

export default OffshoreJP
