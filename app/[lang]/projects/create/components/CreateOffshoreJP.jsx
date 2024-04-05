import { useInputValidation } from '@/app/[lang]/hooks/useInputValidation'
import { useJPProjectCreate } from '@/app/[lang]/hooks/useJPProjectCreate'
import { clearProjectCreateInfoState } from '@/app/store/client/features/project_create/projectCreateInfoSlice'
import {
    clearJPOrderState,
    setJpProjectLeader,
} from '@/app/store/client/features/project_create/projectCreateJPOrderSlice'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import { useCreateProject } from '@/app/store/server/features/projects/mutations'
import { projectLeaderSchema } from '@/app/validation-schemas'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import RequireIcon from '../../../../../public/icon/Require.svg'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';

const JapanOrder = ({ errMsg, projectType, isEdit, id }) => {
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [acceptanceDate, setAcceptanceDate] = useState(null);
    const [paymentDate, setPaymentDate] = useState(null);
    const dispatch = useDispatch()
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(projectLeaderSchema),
    })
    const [edit, setEdit] = useState(false)
    const projectCreateJPOrderState = useSelector(
        (state) => state.projectCreateJPOrderInfo,
    )
    const projectCreateInfoState = useSelector(
        (state) => state.projectCreateInfo,
    )
    const router = useRouter()

    const { data: employees } = useGetAllEmployees()
    const projectLeaders = employees?.filter(
        (employee) => employee.position === '1',
    )
    const [query, setQuery] = useState('')
    const [projectLeader, setProjectLeader] = useState(null)
    const filteredLeaders =
        query === ''
            ? projectLeaders
            : projectLeaders?.filter((person) =>
                  person.emp_name
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, '')),
              )
    const handleProjectLeaderChange = (leader) => {
        dispatch(setJpProjectLeader(leader.emp_cd))
        setProjectLeader(leader)
        setQuery('')
    }

    const {
        handleEstimateNumberChange,
        handleApprovalNumberChange,
        handleOrderNumberChange,
        handelDeliveryDateChange,
        handlePMManMonthChange,
        handlePMUnitPriceChange,
        handlePLManMonthChange,
        handlePLUnitPriceChange,
        handleSEManMonthChange,
        handleSEUnitPriceChange,
        handlePGManMonthChange,
        handlePGUnitPriceChange,
        handleOHManMonthChange,
        handleOHUnitPriceChange,
        handleOrderAmountChange,
        handleAcceptamceDateChange,
        handlePaymentDateChange,
    } = useJPProjectCreate()

    const { validateInput } = useInputValidation()

    const newProject = {
        year: projectCreateInfoState?.year,
        project_name: projectCreateInfoState?.projectName,
        contract_number: projectCreateInfoState?.contractNumber,
        customer_id: projectCreateInfoState?.customerId?.id,
        payment_status: projectCreateInfoState?.paymentStatus,
        department_id: projectCreateInfoState?.departmentId?.id,
        marketing_name: projectCreateInfoState?.marketingName,
        start_date: projectCreateInfoState?.startDate,
        end_date: projectCreateInfoState?.endDate,
        contract_status: projectCreateInfoState?.contractStatus,
        user_id: '',
        project_type_id: projectCreateInfoState?.projectType.id,
        estimate_cost: Number(projectCreateJPOrderState?.jpOrderAmount),
        jp_project_leader: projectCreateJPOrderState?.jpProjectLeader,
        jp_estimate_number: projectCreateJPOrderState?.jpEsitmateNumber,
        jp_approval_number: projectCreateJPOrderState?.jpApprovalNumber,
        jp_order_number: projectCreateJPOrderState?.jpOrderNumber,
        jp_delivery_date: projectCreateJPOrderState?.jpDeliveryDate,
        jp_order_amount: projectCreateJPOrderState?.jpOrderAmount,
        jp_acceptance_billing_date:
            projectCreateJPOrderState?.jpAcceptanceBillingDate,
        jp_payment_date: projectCreateJPOrderState?.jpPaymentDate,
        jp_pm_man_month: projectCreateJPOrderState?.jpPMManMonth,
        jp_pm_average_unit_price: projectCreateJPOrderState?.jpPMUnitPrice,
        jp_pl_man_month: projectCreateJPOrderState?.jpPLManMonth,
        jp_pl_average_unit_price: projectCreateJPOrderState?.jpPLUnitPrice,
        jp_se_man_month: projectCreateJPOrderState?.jpSEManMonth,
        jp_se_average_unit_price: projectCreateJPOrderState?.jpSEUnitPrice,
        jp_pg_man_month: projectCreateJPOrderState?.jpPGManMonth,
        jp_pg_average_unit_price: projectCreateJPOrderState?.jpPGUnitPrice,
        jp_oh_man_month: projectCreateJPOrderState?.jpOHManMonth,
        jp_oh_average_unit_price: projectCreateJPOrderState?.jpOHUnitPrice,
    }

    const handleProjectCreateSuccess = (data) => {
        if (data?.meta?.msg === 'Success') {
            dispatch(clearProjectCreateInfoState())
            dispatch(clearJPOrderState())

            router.push('/projects')
            setTimeout(() => {
                toast.success('Successfully inserted!')
            }, 3000)
        } else if (Array.isArray(data)) {
        }
    }

    const { mutate: createProject } = useCreateProject(
        handleProjectCreateSuccess,
    )
    const handleProjectCreate = () => {
        createProject(newProject)
    }

    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const toggleComboBox = () => {
        setIsComboboxOpen(!isComboboxOpen)
    }
    useEffect(() => {
        if (filteredLeaders !== undefined) {
            setProjectLeader(
                filteredLeaders !== undefined &&
                    filteredLeaders.filter(
                        (leaders) =>
                            leaders.emp_cd ===
                            projectCreateJPOrderState?.jpProjectLeader,
                    )[0],
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredLeaders])
    
    const {formatDate} = useInputValidation();

      const goToMM = () => {
        if (Object.keys(errors).length === 0) {
            router.push('/en/projects/create/japan-myanmar-order/myanmar-info')
        }
    }

    let parsedDeliveryDate;
    if(projectCreateJPOrderState?.jpDeliveryDate) {
        parsedDeliveryDate = parseISO((new Date(projectCreateJPOrderState?.jpDeliveryDate)).toISOString())
        if(parsedDeliveryDate < new Date()) {
            parsedDeliveryDate = ''
        }
    }
    let parsedAcceptanceDate;
    if(projectCreateJPOrderState?.jpAcceptanceBillingDate) {
        parsedAcceptanceDate = parseISO((new Date(projectCreateJPOrderState?.jpAcceptanceBillingDate)).toISOString())
        if(parsedAcceptanceDate < new Date()) {
            parsedAcceptanceDate = ''
        }
    }
    let parsedPaymentDate;;
    if(projectCreateJPOrderState?.jpPaymentDate) {
        parsedPaymentDate = parseISO((new Date(projectCreateJPOrderState?.jpPaymentDate)).toISOString())
        if(parsedPaymentDate < new Date()) {
            parsedPaymentDate = ''
        }
    }
    return (
        <div
            className="mb-8 mt-12 flex flex-col justify-center gap-x-20 rounded-md pb-4 pt-8"
            style={{ border: '1.5px solid #e2e8f0' }}
        >
            <h1 className="text-center text-sm font-medium">
                Project Creation
            </h1>
            <div className="mt-6 flex w-full flex-col self-center">
            <div className="flex flex-row justify-center gap-x-24">
                <div className="ml-5 flex w-[700px] flex-col">
                <div className='flex flex-row gap-x-4'>
                    <div className='flex flex-row justify-start'>
                    <h1 className="text-center text-sm font-medium">
                        GICJ Order Information
                    </h1>
                    </div>
                </div>
                <div className='flex  flex-row gap-x-4'>
                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="pm-man-month" className="text-xs">
                        Project Manager (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpPMManMonth}
                        onChange={(e) => handlePMManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pm-man-month"
                        name="pm-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Project Manager (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpPMUnitPrice}
                        onChange={(e) =>
                            handlePMUnitPriceChange(e.target.value)
                        }
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pm-unit-price"
                        name="pm-unit-price"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>
                </div>

                <div className='flex flex-row gap-x-4'>
                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Project Leader (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpPLManMonth}
                        onChange={(e) => handlePLManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pl-man-month"
                        name="pl-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Project Leader (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpPLUnitPrice}
                        onChange={(e) =>
                            handlePLUnitPriceChange(e.target.value)
                        }
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pl-unit-price"
                        name="pl-unit-price"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>
                </div>

                <div className='flex flex-row gap-x-4'>
                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Senior Engineer(Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpSEManMonth}
                        onChange={(e) => handleSEManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="se-man-month"
                        name="se-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Senior Engineer(Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpSEUnitPrice}
                        onChange={(e) =>
                            handleSEUnitPriceChange(e.target.value)
                        }
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="se-unit-price"
                        name="se-unit-price"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>
                </div>

                <div className='flex flex-row gap-x-4'>
                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Programmer (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpPGManMonth}
                        onChange={(e) => handlePGManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pg-man-month"
                        name="pg-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Programmer (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpPGUnitPrice}
                        onChange={(e) =>
                            handlePGUnitPriceChange(e.target.value)
                        }
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pg-unit-price"
                        name="pg-unit-price"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>
                </div>

                <div className='flex flex-row gap-x-4'>
                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        OH/Others (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpOHManMonth}
                        onChange={(e) => handleOHManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="oh-man-month"
                        name="oh-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        OH/Others (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpOHUnitPrice}
                        onChange={(e) =>
                            handleOHUnitPriceChange(e.target.value)
                        }
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="oh-unit-price"
                        name="oh-unit-price"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>
                </div>

                <div className='flex  flex-row gap-x-4'>
                <div className="z-10 w-full mb-4 space-y-2">
                    <label htmlFor="title" className="flex gap-2 text-xs">
                        Project Manager/Project Leader
                        <Image
                            src={RequireIcon}
                            className=" justify-center"
                            alt="no image"
                        />
                    </label>
                    <Controller
                        name="projectLeaderName"
                        control={control}
                        defaultValue={projectCreateJPOrderState?.jpProjectLeader || ''}
                        render={({ field }) => (
                            <Combobox
                                value={projectLeader || ''}
                                onChange={(projectLeader) => {
                                    field.onChange(projectLeader.emp_name)
                                    handleProjectLeaderChange(projectLeader)
                                }}
                            >
                                <div className="relative mt-1">
                                    <div className="relative w-full cursor-default  rounded-lg  text-left  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                        <Combobox.Input
                                            className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-xs  leading-5 text-gray-900 focus:outline-slate-300 "
                                            style={{ height: '35px' }}
                                            displayValue={(projectLeader) =>
                                                projectLeader?.emp_name
                                            }
                                            onChange={(event) =>
                                                setQuery(event.target.value)
                                            }
                                        />
                                        <Combobox.Button
                                            className="absolute inset-y-0 right-0 flex items-center border-gray-300 pr-2"
                                            style={{ height: '35px' }}
                                            onClick={toggleComboBox}
                                        >
                                            <ChevronDownIcon
                                                className={`h-4 w-4 text-gray-500 ${
                                                    isComboboxOpen
                                                        ? 'rotate-180 transform'
                                                        : ''
                                                }`}
                                                aria-hidden="true"
                                            />
                                        </Combobox.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                        afterLeave={() => {
                                            setQuery('')
                                            setIsComboboxOpen(false)
                                        }}
                                    >
                                        <Combobox.Options className="absolute mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredLeaders?.length === 0 &&
                                            query !== '' ? (
                                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                                    Nothing found.
                                                </div>
                                            ) : (
                                                filteredLeaders?.map(
                                                    (person, index) => (
                                                        <Combobox.Option
                                                            key={index}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                `relative cursor-default select-none py-2 pl-6 pr-4 text-xs ${
                                                                    active
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'text-gray-900'
                                                                }`
                                                            }
                                                            value={person}
                                                        >
                                                            {({
                                                                selected,
                                                                active,
                                                            }) => (
                                                                <>
                                                                    <span
                                                                        className={`block truncate ${
                                                                            selected
                                                                                ? 'font-medium'
                                                                                : 'font-normal'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            person.emp_name
                                                                        }
                                                                    </span>
                                                                    {selected ? (
                                                                        <span
                                                                            className={`absolute inset-y-0 left-0 flex items-center pl-1 ${
                                                                                active
                                                                                    ? 'text-white'
                                                                                    : 'text-blue-600'
                                                                            }`}
                                                                        >
                                                                            <CheckIcon
                                                                                className="h-4 w-4"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Combobox.Option>
                                                    ),
                                                )
                                            )}
                                        </Combobox.Options>
                                    </Transition>
                                </div>
                            </Combobox>
                        )}
                    />
                    {errors.projectLeaderName && (
                        <p className="text-xs text-red-500">
                            {errors.projectLeaderName.message}
                        </p>
                    )}
                </div>
                <div className="mb-4 w-full  ">
                    <label htmlFor="contract" className="text-xs pb-4">
                        Estimate Cost (Excluding tax)
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpOrderAmount}
                        onChange={(e) =>
                            handleOrderAmountChange(e.target.value)
                        }
                        type="text"
                        id="contract"
                        name="contract"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        disabled
                        style={{ height: '35px' }}
                    />
                    {projectCreateJPOrderState?.jpOrderAmount === '' ||
                        (null && errMsg && (
                            <p className="text-red-500">
                                Please enter man month and unit price.
                            </p>
                        ))}
                </div>
                </div>

                <div className=' flex flex-row gap-x-4'>
                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Estimate Number
                    </label>
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
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="contract" className="text-xs">
                        Approval Number
                    </label>
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
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>
                </div>

                <div className='flex flex-row gap-x-4'>
                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="contract" className="text-xs">
                        Invoice Number
                    </label>
                    <input
                        value={'' || projectCreateJPOrderState?.jpOrderNumber}
                        onChange={(e) =>
                            handleOrderNumberChange(e.target.value)
                        }
                        type="text"
                        id="contract"
                        name="contract"
                        className="w-[340px] rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 w-full space-y-2">
                    <label htmlFor="delivery_date" className="text-xs">
                        Delivery Date
                    </label>
                    <div className='relative'>
                    <DatePicker
                                    selected={deliveryDate || parsedDeliveryDate}
                                    onChange={(date) => {handelDeliveryDateChange(formatDate(date)); setDeliveryDate(date)}}
                                    minDate={new Date()}
                                    className='w-[340px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: true,
                                        },
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                altAxis: true,
                                                tether: false,
                                                rootBoundary: 'viewport',
                                            },
                                        },
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 10],
                                            },
                                        }
                                    ]}
                                    popperClassName='absolute'
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                    </div>
                </div>
                </div>

                <div className='flex flex-row gap-x-4 '>
                <div className="mb-4  space-y-2" style={{position: 'relative', zIndex: '60'}}>
                    <label htmlFor="acceptance_date" className="text-xs">
                        Acceptance/billing date
                    </label>
                    <div className='relative'>
                    <DatePicker
                                    selected={acceptanceDate || parsedAcceptanceDate}
                                    onChange={(date) => {handleAcceptamceDateChange(formatDate(date)); setAcceptanceDate(date)}}
                                    minDate={new Date()}
                                    className='w-[340px] rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: true,
                                        },
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                altAxis: true,
                                                tether: false,
                                                rootBoundary: 'viewport',
                                            },
                                        },
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 10],
                                            },
                                        }
                                    ]}
                                    popperClassName='absolute'
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                    </div>
                </div>

                <div className="mb-4 w-full space-y-2 relative">
                    <label htmlFor="payment_date" className="text-xs">
                        Payment Date
                    </label>
                    <div className='relative'>
                    <DatePicker
                                    selected={paymentDate || parsedPaymentDate}
                                    onChange={(date) => {handlePaymentDateChange(formatDate(date)); setPaymentDate(date)}}
                                    minDate={new Date()}
                                    className='w-[340px] rounded-md border px-2 py-2 text-xs relative focus:outline-slate-300 z-50'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: true,
                                        },
                                        {
                                            name: 'preventOverflow',
                                            options: {
                                                altAxis: true,
                                                tether: false,
                                                rootBoundary: 'viewport',
                                            },
                                        },
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 10],
                                            },
                                        }
                                    ]}
                                    popperClassName='absolute'
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                    </div>
                </div>
                </div>

                <div className='flex flex-row gap-x-4'>
                <div className="mt-4">
                        {projectType === 'japan-order' ? (
                            <div className="mr-8 flex w-full justify-start gap-4">
                                <button
                                    className=" rounded-md bg-blue-700 text-xs text-white shadow-md  shadow-gray-400"
                                    onClick={handleSubmit(handleProjectCreate)}
                                    style={{ height: '30px', width: '70px' }}
                                >
                                    Create
                                </button>
                                <Link href={'/en/projects/create'}>
                                    <button
                                        className=" rounded-md bg-red-700 text-xs text-white shadow-md  shadow-gray-400"
                                        style={{
                                            height: '30px',
                                            width: '70px',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="mr-8 flex w-full justify-start gap-4">
                                <Link
                                    href={`/en/projects/create/japan-myanmar-order/myanmar-info`}
                                >
                                    <button
                                        className=" rounded-md bg-blue-700 text-center text-xs text-white  shadow-md shadow-gray-400"
                                        style={{
                                            height: '30px',
                                            width: '70px',
                                        }}
                                        onClick={handleSubmit(goToMM)}
                                    >
                                        Next
                                    </button>
                                </Link>
                                <Link href={'/en/projects/create'}>
                                    <button
                                        className=" rounded-md bg-red-700 text-xs text-white shadow-md shadow-gray-400"
                                        style={{
                                            height: '30px',
                                            width: '70px',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                   
                </div>
            </div>
                
            </div>
        </div>
    )
}

export default JapanOrder
