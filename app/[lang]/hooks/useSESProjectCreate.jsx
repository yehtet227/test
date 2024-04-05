import { useDispatch, useSelector } from 'react-redux';
import {
    clearSESState,
    setSesAcceptanceBillingDate,
    setSesApprovalNumber,
    setSesDeliveryDate,
    setSesEstimateNumber,
    setSesOHManMonth,
    setSesOHUnitPrice,
    setSesOrderAmount,
    setSesOrderNumber,
    setSesPaymentDate,
    setSesPGManMonth,
    setSesPGUnitPrice,
    setSesPLManMonth,
    setSesPLUnitPrice,
    setSesPMManMonth,
    setSesPMUnitPrice,
    setSesProjectLeader,
    setSesSEManMonth,
    setSesSEUnitPrice,
} from '@/app/store/client/features/project_create/projectCreateSesInfoSlice';

export const useSESProjectCreate = () => {
    const dispatch = useDispatch();
    const projectCreateSESOrderState = useSelector((state) => state.projectCreateSesInfo);
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
    const handleChange = (setterFunction, key, value) => {
        dispatch(setterFunction(value));
        calculateOrderAmount(key, value);
    };

    const calculateOrderAmount = (key, value) => {
        const newState = { ...projectCreateSESOrderState, [key]: value };
        const monthsBetween = countMonthsInclusive(projectCreateInfoState?.startDate, projectCreateInfoState?.endDate);
        const {
            sesPMManMonth,
            sesPMUnitPrice,
            sesPLManMonth,
            sesPLUnitPrice,
            sesSEManMonth,
            sesSEUnitPrice,
            sesPGManMonth,
            sesPGUnitPrice,
            sesOHManMonth,
            sesOHUnitPrice,
        } = newState;

        const amount =
            sesPMManMonth * sesPMUnitPrice +
            sesPLManMonth * sesPLUnitPrice +
            sesSEManMonth * sesSEUnitPrice +
            sesPGManMonth * sesPGUnitPrice +
            sesOHManMonth * sesOHUnitPrice;

        dispatch(setSesOrderAmount(amount * monthsBetween));
    };

    const calculateSESOrderAmount = (monthsBetween) => {

        const {
            sesPMManMonth,
            sesPMUnitPrice,
            sesPLManMonth,
            sesPLUnitPrice,
            sesSEManMonth,
            sesSEUnitPrice,
            sesPGManMonth,
            sesPGUnitPrice,
            sesOHManMonth,
            sesOHUnitPrice,
        } = projectCreateSESOrderState;

        const amount =
            sesPMManMonth * sesPMUnitPrice +
            sesPLManMonth * sesPLUnitPrice +
            sesSEManMonth * sesSEUnitPrice +
            sesPGManMonth * sesPGUnitPrice +
            sesOHManMonth * sesOHUnitPrice;

        dispatch(setSesOrderAmount(amount * monthsBetween));
    }

    return {
        handleEstimateNumberChange: (estimateNumber) => handleChange(setSesEstimateNumber, 'sesEstimateNumber', estimateNumber),
        handleApprovalNumberChange: (approvalNumber) => handleChange(setSesApprovalNumber, 'sesApprovalNumber', approvalNumber),
        handleOrderNumberChange: (orderNumber) => handleChange(setSesOrderNumber, 'sesOrderNumber', orderNumber),
        handleDeliveryDateChange: (deliveryDate) => handleChange(setSesDeliveryDate, 'sesDeliveryDate', deliveryDate),
        handlePMManMonthChange: (manMonth) => handleChange(setSesPMManMonth, 'sesPMManMonth', manMonth),
        handlePMUnitPriceChange: (unitPrice) => handleChange(setSesPMUnitPrice, 'sesPMUnitPrice', unitPrice),
        handlePLManMonthChange: (manMonth) => handleChange(setSesPLManMonth, 'sesPLManMonth', manMonth),
        handlePLUnitPriceChange: (unitPrice) => handleChange(setSesPLUnitPrice, 'sesPLUnitPrice', unitPrice),
        handleSEManMonthChange: (manMonth) => handleChange(setSesSEManMonth, 'sesSEManMonth', manMonth),
        handleSEUnitPriceChange: (unitPrice) => handleChange(setSesSEUnitPrice, 'sesSEUnitPrice', unitPrice),
        handlePGManMonthChange: (manMonth) => handleChange(setSesPGManMonth, 'sesPGManMonth', manMonth),
        handlePGUnitPriceChange: (unitPrice) => handleChange(setSesPGUnitPrice, 'sesPGUnitPrice', unitPrice),
        handleOHManMonthChange: (manMonth) => handleChange(setSesOHManMonth, 'sesOHManMonth', manMonth),
        handleOHUnitPriceChange: (unitPrice) => handleChange(setSesOHUnitPrice, 'sesOHUnitPrice', unitPrice),
        handleOrderAmountChange: (amount) => handleChange(setSesOrderAmount, 'sesOrderAmount', amount),
        handleAcceptanceBillingDateChange: (acceptanceDate) => handleChange(setSesAcceptanceBillingDate, 'sesAcceptanceBillingDate', acceptanceDate),
        handlePaymentDateChange: (paymentDate) => handleChange(setSesPaymentDate, 'sesPaymentDate', paymentDate),
        calculateSESOrderAmount,
    };
};
