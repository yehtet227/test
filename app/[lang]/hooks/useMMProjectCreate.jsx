import { useDispatch, useSelector } from 'react-redux';
import {
    clearMMOrderState,
    setGicjFee,
    setMmAcceptanceBillingDate,
    setMmApprovalNumber,
    setMmAvgUnitPrice,
    setMmBilledAmount,
    setMmDeliveryDate,
    setMmEsitmateNumber,
    setMmManMonth,
    setMmOHManMonth,
    setMmOHUnitPrice,
    setMmOrderAmount,
    setMmOrderNumber,
    setMmPaymentDate,
    setMmPGManMonth,
    setMmPGUnitPrice,
    setMmPLManMonth,
    setMmPLUnitPrice,
    setMmPMManMonth,
    setMmPMUnitPrice,
    setMmProjectLeader,
    setMmSEManMonth,
    setMmSEUnitPrice,
} from '@/app/store/client/features/project_create/projectCreateMMOrderSlice';

export const useMMProjectCreate = () => {
    const dispatch = useDispatch();
    const projectCreateMMOrderState = useSelector((state) => state.projectCreateMMOrderInfo);
    const projectCreateInfoState = useSelector((state) => state.projectCreateInfo);
    function countMonthsInclusive(startDate, endDate) {
        if(!startDate || !endDate) return 1;
        const start = new Date(startDate);
        const end = new Date(endDate);
      
        const startYear = start.getFullYear();
        const startMonth = start.getMonth();
        const endYear = end.getFullYear();
        const endMonth = end.getMonth();
      
        const monthsBetween = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
      
        return monthsBetween;
      }
    const calculateOrderAmount = (key, value) => {
        const newState = { ...projectCreateMMOrderState, [key]: value };
        const monthsBetween = countMonthsInclusive(projectCreateInfoState?.startDate, projectCreateInfoState?.endDate);
        const {
            mmPMManMonth,
            mmPMUnitPrice,
            mmPLManMonth,
            mmPLUnitPrice,
            mmSEManMonth,
            mmSEUnitPrice,
            mmPGManMonth,
            mmPGUnitPrice,
            mmOHManMonth,
            mmOHUnitPrice,
        } = newState;

        const amount =
            mmPMManMonth * mmPMUnitPrice +
            mmPLManMonth * mmPLUnitPrice +
            mmSEManMonth * mmSEUnitPrice +
            mmPGManMonth * mmPGUnitPrice +
            mmOHManMonth * mmOHUnitPrice;

        dispatch(setMmOrderAmount(amount * monthsBetween));
    };

    const handleChange = (setterFunction, key, value) => {
        dispatch(setterFunction(value));
        calculateOrderAmount(key, value);
    };

    const calculateMMOrderAmount = (monthsBetween) => {
        const {
            mmPMManMonth,
            mmPMUnitPrice,
            mmPLManMonth,
            mmPLUnitPrice,
            mmSEManMonth,
            mmSEUnitPrice,
            mmPGManMonth,
            mmPGUnitPrice,
            mmOHManMonth,
            mmOHUnitPrice,
        } = projectCreateMMOrderState;

        const amount =
            mmPMManMonth * mmPMUnitPrice +
            mmPLManMonth * mmPLUnitPrice +
            mmSEManMonth * mmSEUnitPrice +
            mmPGManMonth * mmPGUnitPrice +
            mmOHManMonth * mmOHUnitPrice;

        dispatch(setMmOrderAmount(amount * monthsBetween));
    }

    return {
        handlePMManMonthChange: (manMonth) => handleChange(setMmPMManMonth, 'mmPMManMonth', manMonth),
        handlePMUnitPriceChange: (unitPrice) => handleChange(setMmPMUnitPrice, 'mmPMUnitPrice', unitPrice),
        handlePLManMonthChange: (manMonth) => handleChange(setMmPLManMonth, 'mmPLManMonth', manMonth),
        handlePLUnitPriceChange: (unitPrice) => handleChange(setMmPLUnitPrice, 'mmPLUnitPrice', unitPrice),
        handleSEManMonthChange: (manMonth) => handleChange(setMmSEManMonth, 'mmSEManMonth', manMonth),
        handleSEUnitPriceChange: (unitPrice) => handleChange(setMmSEUnitPrice, 'mmSEUnitPrice', unitPrice),
        handlePGManMonthChange: (manMonth) => handleChange(setMmPGManMonth, 'mmPGManMonth', manMonth),
        handlePGUnitPriceChange: (unitPrice) => handleChange(setMmPGUnitPrice, 'mmPGUnitPrice', unitPrice),
        handleOHManMonthChange: (manMonth) => handleChange(setMmOHManMonth, 'mmOHManMonth', manMonth),
        handleOHUnitPriceChange: (unitPrice) => handleChange(setMmOHUnitPrice, 'mmOHUnitPrice', unitPrice),
        handleMMDeliveryDateChange: (deliveryDate) => handleChange(setMmDeliveryDate, 'mmDeliveryDate', deliveryDate),
        handleEstimateNumberChange: (estimateNumber) => handleChange(setMmEsitmateNumber, 'mmEsitmateNumber', estimateNumber),
        handleApprovalNumberChange: (approvalNumber) => handleChange(setMmApprovalNumber, 'mmApprovalNumber', approvalNumber),
        handleGicjFeeChange: (gicjFee) => handleChange(setGicjFee, 'gicjFee', gicjFee),
        handleOrderAmountChange: (orderAmount) => handleChange(setMmOrderAmount, 'mmOrderAmount', orderAmount),
        handleOrderNumberChange: (orderNumber) => handleChange(setMmOrderNumber, 'mmOrderNumber', orderNumber),
        handleBilledAmountChange: (amount) => handleChange(setMmBilledAmount, 'mmBilledAmount', amount),
        handleAcceptanceDateChange: (acceptanceDate) => handleChange(setMmAcceptanceBillingDate, 'mmAcceptanceBillingDate', acceptanceDate),
        handleMmPaymentDateChange: (paymentDate) => handleChange(setMmPaymentDate, 'mmPaymentDate', paymentDate),
        calculateMMOrderAmount
    };
};
