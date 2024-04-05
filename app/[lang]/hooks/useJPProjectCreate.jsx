import { useDispatch, useSelector } from 'react-redux'
import {
    clearJPOrderState,
    setJpAcceptanceBillingDate,
    setJpApprovalNumber,
    setJpAvgUnitPrice,
    setJpDeliveryDate,
    setJpEsitmateNumber,
    setJpManMonth,
    setJpOHManMonth,
    setJpOHUnitPrice,
    setJpOrderAmount,
    setJpOrderNumber,
    setJpPaymentDate,
    setJpPGManMonth,
    setJpPGUnitPrice,
    setJpPLManMonth,
    setJpPLUnitPrice,
    setJpPMManMonth,
    setJpPMUnitPrice,
    setJpProjectLeader,
    setJpSEManMonth,
    setJpSEUnitPrice,
} from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'


export const useJPProjectCreate = () => {
    const dispatch = useDispatch();
    const projectCreateJPOrderState = useSelector((state) => state.projectCreateJPOrderInfo);
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
        const newState = {...projectCreateJPOrderState, [key]: value};
        const monthsBetween = countMonthsInclusive(projectCreateInfoState?.startDate, projectCreateInfoState?.endDate);
        const {
            jpPMManMonth,
            jpPMUnitPrice,
            jpPLManMonth,
            jpPLUnitPrice,
            jpSEManMonth,
            jpSEUnitPrice,
            jpPGManMonth,
            jpPGUnitPrice,
            jpOHManMonth,
            jpOHUnitPrice,
        } = newState;
    
        const amount =
            (jpPMManMonth * jpPMUnitPrice) +
            (jpPLManMonth * jpPLUnitPrice) +
            (jpSEManMonth * jpSEUnitPrice) +
            (jpPGManMonth * jpPGUnitPrice) +
            (jpOHManMonth * jpOHUnitPrice);
    
        dispatch(setJpOrderAmount(amount * monthsBetween));
    };
    
    const handleChange = (setterFunction, key, value) => {
        dispatch(setterFunction(value));
        calculateOrderAmount(key, value);
    }

    const calculateJPOrderAmount = (monthsBetween) => {
        const {
            jpPMManMonth,
            jpPMUnitPrice,
            jpPLManMonth,
            jpPLUnitPrice,
            jpSEManMonth,
            jpSEUnitPrice,
            jpPGManMonth,
            jpPGUnitPrice,
            jpOHManMonth,
            jpOHUnitPrice,
        } = projectCreateJPOrderState;

        const amount =
            (jpPMManMonth * jpPMUnitPrice) +
            (jpPLManMonth * jpPLUnitPrice) +
            (jpSEManMonth * jpSEUnitPrice) +
            (jpPGManMonth * jpPGUnitPrice) +
            (jpOHManMonth * jpOHUnitPrice);

        dispatch(setJpOrderAmount(amount * monthsBetween));
    }

    return {
        handleEstimateNumberChange: (estimateNumber) => handleChange(setJpEsitmateNumber,'jpEsitmateNumber', estimateNumber),
        handleApprovalNumberChange: (approvalNumber) => handleChange(setJpApprovalNumber, 'jpApprovalNumber', approvalNumber),
        handleOrderNumberChange: (orderNumber) => handleChange(setJpOrderNumber, 'jpOrderNumber', orderNumber),
        handelDeliveryDateChange: (deliveryDate) => handleChange(setJpDeliveryDate,'jpDeliveryDate', deliveryDate),
        handlePMManMonthChange: (manMonth) => handleChange(setJpPMManMonth, 'jpPMManMonth', manMonth),
        handlePMUnitPriceChange: (unitPrice) => handleChange(setJpPMUnitPrice, 'jpPMUnitPrice', unitPrice),
        handlePLManMonthChange: (manMonth) => handleChange(setJpPLManMonth,'jpPLManMonth', manMonth),
        handlePLUnitPriceChange: (unitPrice) => handleChange(setJpPLUnitPrice, 'jpPLUnitPrice', unitPrice),
        handleSEManMonthChange: (manMonth) => handleChange(setJpSEManMonth, 'jpSEManMonth', manMonth),
        handleSEUnitPriceChange: (unitPrice) => handleChange(setJpSEUnitPrice, 'jpSEUnitPrice', unitPrice),
        handlePGManMonthChange: (manMonth) => handleChange(setJpPGManMonth, 'jpPGManMonth', manMonth),
        handlePGUnitPriceChange: (unitPrice) => handleChange(setJpPGUnitPrice, 'jpPGUnitPrice', unitPrice),
        handleOHManMonthChange: (manMonth) => handleChange(setJpOHManMonth,'jpOHManMonth', manMonth),
        handleOHUnitPriceChange: (unitPrice) => handleChange(setJpOHUnitPrice, 'jpOHUnitPrice', unitPrice),
        handleOrderAmountChange: (amount) => handleChange(setJpOrderAmount, 'jpOrderAmount', amount),
        handleAcceptamceDateChange: (acceptanceDate) => handleChange(setJpAcceptanceBillingDate, 'jpAcceptanceBillingDate', acceptanceDate),
        handlePaymentDateChange: (paymentDate) => handleChange(setJpPaymentDate,'jpPaymentDate', paymentDate),
        calculateJPOrderAmount
    };
}