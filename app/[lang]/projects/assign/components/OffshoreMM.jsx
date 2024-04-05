import React, { useState } from 'react'
import Dropdown from './DropDown'
import { useDispatch, useSelector } from 'react-redux'
import { setGicjFee, setMmAcceptanceBillingDate, setMmAvgUnitPrice, setMmBilledAmount, setMmDeliveryDate, setMmEsitmateNumber, setMmManMonth, setMmOrderAmount, setMmPaymentDate, setMmProjectLeader } from '@/app/store/client/features/project_create/projectCreateMMOrderSlice'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import { useGetAllRoles } from '@/app/store/server/features/roles'
import DropDown from '@/app/[lang]/engineers-info/assign/components/DropDown'


const personInCharge = [
    {
        name: 'person 1',
    },
    {
        name: 'person 12',
    },
]



const OffshoreMM = ({}) => {
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false)
    const projectCreateMMOrderState = useSelector((state) => state.projectCreateMMOrderInfo);

    
    const { data: employees } = useGetAllEmployees();
    const { data: roles } = useGetAllRoles();
    const projectLeaders = employees?.filter((employee) => employee.position === "1");

    const handleProjectLeaderChange = (leader) => {
        dispatch(setMmProjectLeader(leader))
    }

    const handleMMDeliveryDateChange = (deliveryDate) => {
        dispatch(setMmDeliveryDate(deliveryDate))
    }

    const handleManMonthChange = (manMonth) => {
        dispatch(setMmManMonth(manMonth))
        dispatch(setMmOrderAmount(manMonth * projectCreateMMOrderState?.mmAvgUnitPrice))
    }

    const handleEstimateNumberChange = (estimateNumber) => {
        dispatch(setMmEsitmateNumber(estimateNumber))
    }

    const handleUnitPriceChange = (unitPrice) => {
        dispatch(setMmAvgUnitPrice(unitPrice))
        dispatch(setMmOrderAmount(unitPrice * projectCreateMMOrderState?.mmManMonth))
    }

    const handleGicjFeeChange = (gicjFee) => {
        dispatch(setGicjFee(gicjFee))
    }

    const handleOrderAmountChange = (orderAmount) => {
        dispatch(setMmOrderAmount(orderAmount))
    }

    const handleBilledAmountChange = (amount) => {
        dispatch(setMmBilledAmount(amount))
    }

    const handleAcceptanceDateChange = (acceptanceDate) => {
        dispatch(setMmAcceptanceBillingDate(acceptanceDate))
    }

    const handleMmPaymentDateChange = (paymentDate) => {
        dispatch(setMmPaymentDate(paymentDate))
    }
    return (
        <div className="mb-8 mt-8 flex flex-row justify-center gap-x-20">
            <h1 className="text-center ">GICM Order Information</h1>
            <div className="flex w-80 flex-col">
                <div className="z-10 mb-4 space-y-2 w-full">
                    <label htmlFor="year">Project Leader</label>
                    <Dropdown
                        options={projectLeaders}
                        initialValue={null}
                        generateLabel={(option) =>
                            option?.emp_name
                        }
                        onSelect={(option) =>
                            handleProjectLeaderChange(option?.emp_name)
                        }
                    >

                    </Dropdown>
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number">Estimate Number</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmEsitmateNumber}
                        onChange={(e) => handleEstimateNumberChange(e.target.value)}
                        type="number"
                        id="estimate_number"
                        name="estimate_number"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="delivery_date">Delivery Date</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmDeliveryDate}
                        onChange={(e) => handleMMDeliveryDateChange(e.target.value)}
                        type="date"
                        id="delivery_date"
                        name="delivery_date"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="man_month">Man-Month</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmManMonth}
                        onChange={(e) => handleManMonthChange(e.target.value)}
                        type="number"
                        id="man_month"
                        name="man_month"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="unit_price">Unit Price</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmAvgUnitPrice}
                        onChange={(e) => handleUnitPriceChange(e.target.value)}
                        type="number"
                        id="unit_price"
                        name="unit_price"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>

                <div className="z-40 mb-4 space-y-2 w-full">
                    <label htmlFor="fee">GICJ Fee%</label>
                    <input
                        value={'' || projectCreateMMOrderState?.gicjFee}
                        onChange={(e) => handleGicjFeeChange(e.target.value)}
                        type="number"
                        id="fee"
                        name="fee"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="order_amount">Order Amount (Excluding CT Tax)</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmOrderAmount}
                        type="number"
                        id="order_amount"
                        name="order_amount"
                        className="w-full border px-2 py-1 rounded-md"
                        disabled
                    />
                    {(projectCreateMMOrderState?.mmOrderAmount === "" || null && errMsg)  ? (
                                    <p className="text-red-500">Please enter man month and unit price.</p>
                                ) : ""}
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="billed_amount">Billed Amount (Excluding CT Tax)</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmBilledAmount}
                        onChange={(e) => handleBilledAmountChange(e.target.value)}
                        type="number"
                        id="billed_amount"
                        name="billed_amount"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="acceptance_date">Acceptance/ Billing Date</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmAcceptanceBillingDate}
                        onChange={(e) => handleAcceptanceDateChange(e.target.value)}
                        type="date"
                        id="acceptance_date"
                        name="acceptance_date"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="payment_date">Payment Date</label>
                    <input
                        value={'' || projectCreateMMOrderState?.mmPaymentDate}
                        onChange={(e) => handleMmPaymentDateChange(e.target.value)}
                        type="date"
                        id="payment_date"
                        name="payment_date"
                        className="w-full border px-2 py-1 rounded-md"
                    />
                </div>
            </div>
        </div>
    )
}

export default OffshoreMM
