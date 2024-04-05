
import { clearProjectCreateInfoState } from '@/app/store/client/features/project_create/projectCreateInfoSlice'
import {
    clearSESState,
    setSesProjectLeader,
} from '@/app/store/client/features/project_create/projectCreateSesInfoSlice'
import { useGetAllEmployees } from '@/app/store/server/features/employees'
import {
    useCreateProject,
    useUpdateProject,
} from '@/app/store/server/features/projects/mutations'
import { Combobox, Transition } from '@headlessui/react'
import {
    CheckIcon,
    ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import RequireIcon from '../../../../../public/icon/Require.svg'
import { projectLeaderSchema } from '@/app/validation-schemas'
import { useSESProjectCreate } from '@/app/[lang]/hooks/useSESProjectCreate'
import { useInputValidation } from '@/app/[lang]/hooks/useInputValidation'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {parseISO} from 'date-fns'

const SESOrderUpdate = ({ errMsg, projectType, isEdit, id }) => {
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [acceptanceDate, setAcceptanceDate] = useState(null);
    const [paymentDate, setPaymentDate] = useState(null);
    const dispatch = useDispatch()
    const projectCreateSESOrderState = useSelector(
        (state) => state.projectCreateSesInfo,
    )
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(projectLeaderSchema),
    })

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
        dispatch(setSesProjectLeader(leader.emp_cd))
        setProjectLeader(leader)
        setQuery('')
    }

    const {
        handleEstimateNumberChange,
        handleApprovalNumberChange,
        handleOrderNumberChange,
        handleDeliveryDateChange,
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
        handleAcceptanceBillingDateChange,
        handlePaymentDateChange,
      } = useSESProjectCreate();

      const {validateInput} = useInputValidation()

    const router = useRouter()
    const handleCancel = () => {
        router.push('/en/projects/create')
    }

    const handleEditCancle = () => {
        router.push(`/en/projects/${id}`)
    }

    const projectCreateInfoState = useSelector(
        (state) => state.projectCreateInfo,
    )
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
        estimate_cost: Number(projectCreateSESOrderState?.sesOrderAmount),
        ses_project_leader: projectCreateSESOrderState?.sesProjectLeader,
        ses_estimate_number: projectCreateSESOrderState?.sesEstimateNumber,
        ses_approval_number: projectCreateSESOrderState?.sesApprovalNumber,
        ses_order_number: projectCreateSESOrderState?.sesOrderNumber,
        ses_delivery_date: projectCreateSESOrderState?.sesDeliveryDate,
        ses_order_amount: projectCreateSESOrderState?.sesOrderAmount,
        ses_acceptance_billing_date:
            projectCreateSESOrderState?.sesAcceptanceBillingDate,
        ses_payment_date: projectCreateSESOrderState?.sesPaymentDate,
        ses_pm_man_month: projectCreateSESOrderState?.sesPMManMonth,
        ses_pm_average_unit_price: projectCreateSESOrderState?.sesPMUnitPrice,
        ses_pl_man_month: projectCreateSESOrderState?.sesPLManMonth,
        ses_pl_average_unit_price: projectCreateSESOrderState?.sesPLUnitPrice,
        ses_se_man_month: projectCreateSESOrderState?.sesSEManMonth,
        ses_se_average_unit_price: projectCreateSESOrderState?.sesSEUnitPrice,
        ses_pg_man_month: projectCreateSESOrderState?.sesPGManMonth,
        ses_pg_average_unit_price: projectCreateSESOrderState?.sesPGUnitPrice,
        ses_oh_man_month: projectCreateSESOrderState?.sesOHManMonth,
        ses_oh_average_unit_price: projectCreateSESOrderState?.sesOHUnitPrice,
    }

    const handleProjectCreateSuccess = (data) => {
        if (data?.meta?.msg === 'Success') {
            dispatch(clearProjectCreateInfoState())
            dispatch(clearSESState())

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

    const handleProjectUpdateSuccess = (data) => {
        if (data?.meta?.msg === 'Success') {
            dispatch(clearProjectCreateInfoState())
            dispatch(clearSESState())
            router.push('/projects')
            setTimeout(() => {
                toast.success('Successfully updated!')
            }, 3000)
        } else if (Array.isArray(data)) {
            // setErrMsg(true);
        }
    }
    
    const { mutate: updateProject, refetch } = useUpdateProject(
        handleProjectUpdateSuccess, id
    )
    const handleProjectUpdate = async () => {
        await updateProject({ body: newProject, id: id })
        await refetch()
    }

    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const toggleComboBox = () => {
        setIsComboboxOpen(!isComboboxOpen)
    }

    useEffect(() => {
        if(projectCreateSESOrderState?.sesDeliveryDate) {
           const deliveryDate = new Date(projectCreateSESOrderState?.sesDeliveryDate)
           setDeliveryDate(parseISO(deliveryDate.toISOString()))
       }
       if(projectCreateSESOrderState?.sesAcceptanceBillingDate) {
           const acceptanceDate = new Date(projectCreateSESOrderState?.sesAcceptanceBillingDate)
           setAcceptanceDate(parseISO(acceptanceDate.toISOString()))
       }
       if(projectCreateSESOrderState?.sesPaymentDate) {
           const paymentDate = new Date(projectCreateSESOrderState?.sesPaymentDate)
           setPaymentDate(parseISO(paymentDate.toISOString()))
       }
   }, [projectCreateSESOrderState])
   const {formatDate} = useInputValidation();
    useEffect(() => {
        if (filteredLeaders !== undefined) {
            setProjectLeader(
                filteredLeaders !== undefined &&
                    filteredLeaders.filter(
                        (leaders) =>
                            leaders.emp_cd ===
                            projectCreateSESOrderState.sesProjectLeader,
                    )[0],
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredLeaders])

    return (
        <div
            className="mb-20 mt-48 flex flex-row justify-center gap-x-20 rounded-md pb-4 pt-8"
            style={{ border: '1.5px solid #e2e8f0' }}
        >
            <h1 className="text-center text-sm font-medium">
                SES Order Information
            </h1>
            <div className="flex w-80 flex-col">
                <div className="z-10 mb-4 space-y-2">
                    <label htmlFor="title" className="flex gap-2 text-xs">
                        Project Leader
                        <Image
                            src={RequireIcon}
                            className=" justify-center"
                            alt="no image"
                        />
                    </label>
                    <Controller
                        name="projectLeaderName"
                        control={control}
                        defaultValue={''}
                        render={({ field }) => (
                            <Combobox
                                value={projectLeader || ''}
                                onChange={(projectLeader) => {
                                    field.onChange(projectLeader.emp_cd)
                                    handleProjectLeaderChange(projectLeader)
                                }}
                            >
                                <div className="relative mt-1">
                                    <div className="relative w-full cursor-default  rounded-lg  text-left  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                        <Combobox.Input
                                            className="w-full rounded-md border border-gray-300 py-2 pl-2 pr-10 text-xs leading-5 text-gray-900 focus:outline-slate-300 "
                                            style={{ height: '35px' }}
                                            displayValue={(projectLeader) =>
                                                projectLeader?.emp_name ||
                                                projectCreateSESOrderState?.sesProjectLeader
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
                                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredLeaders?.length === 0 &&
                                            query !== '' ? (
                                                <div className="relative cursor-default select-none px-2 py-2 text-gray-700">
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="pm-man-month" className="text-xs">
                        Project Manager (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesPMManMonth}
                        onChange={(e) => handlePMManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pm-man-month"
                        name="pm-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Project Manager (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesPMUnitPrice}
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Project Leader (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesPLManMonth}
                        onChange={(e) => handlePLManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pl-man-month"
                        name="pl-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Project Leader (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesPLUnitPrice}
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Senior Engineer(Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesSEManMonth}
                        onChange={(e) => handleSEManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="se-man-month"
                        name="se-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Senior Engineer(Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesSEUnitPrice}
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Programmer (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesPGManMonth}
                        onChange={(e) => handlePGManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="pg-man-month"
                        name="pg-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Programmer (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesPGUnitPrice}
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        OH/Others (Man-Month)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesOHManMonth}
                        onChange={(e) => handleOHManMonthChange(e.target.value)}
                        onInput={(e) => validateInput(e)}
                        type="number"
                        id="oh-man-month"
                        name="oh-man-month"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        OH/Others (Unit Price)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesOHUnitPrice}
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="contract" className="text-xs">
                        Estimate Cost (Excluding tax)
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesOrderAmount}
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
                    {projectCreateSESOrderState?.sesOrderAmount === '' ||
                        (null && errMsg && (
                            <p className="text-red-500">
                                Please enter man month and unit price.
                            </p>
                        ))}
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="estimate_number" className="text-xs">
                        Estimate Number
                    </label>
                    <input
                        value={
                            '' || projectCreateSESOrderState?.sesEstimateNumber
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="contract" className="text-xs">
                        Approval Number
                    </label>
                    <input
                        value={
                            '' || projectCreateSESOrderState?.sesApprovalNumber
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

                <div className="mb-4 space-y-2">
                    <label htmlFor="contract" className="text-xs">
                        Invoice Number
                    </label>
                    <input
                        value={'' || projectCreateSESOrderState?.sesOrderNumber}
                        onChange={(e) =>
                            handleOrderNumberChange(e.target.value)
                        }
                        type="text"
                        id="contract"
                        name="contract"
                        className="w-full rounded-md border px-2 py-1 text-xs focus:outline-slate-300"
                        style={{ height: '35px' }}
                    />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="delivery_date" className="text-xs">
                        Delivery Date
                    </label>
                    <DatePicker
                                    selected={deliveryDate}
                                    onChange={(date) => {handleDeliveryDateChange(formatDate(date)); setDeliveryDate(date)}}
                                    minDate={new Date()}
                                    className='w-80 rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: true,
                                        }
                                    ]}
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="acceptance_date" className="text-xs">
                        Acceptance/billing date
                    </label>
                    <DatePicker
                                    selected={acceptanceDate}
                                    onChange={(date) => {handleAcceptanceBillingDateChange(formatDate(date)); setAcceptanceDate(date)}}
                                    minDate={new Date()}
                                    className='w-80 rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: true,
                                        }
                                    ]}
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                </div>

                <div className="mb-4 space-y-2">
                    <label htmlFor="payment_date" className="text-xs">
                        Payment Date
                    </label>
                    <DatePicker
                                    selected={paymentDate}
                                    onChange={(date) => {handlePaymentDateChange(formatDate(date)); setPaymentDate(date)}}
                                    minDate={new Date()}
                                    className='w-80 rounded-md border px-2 py-2 text-xs focus:outline-slate-300 z-50'
                                    popperPlacement='bottom-start'
                                    popperModifiers={[
                                        {
                                            name: 'flip',
                                            enabled: true,
                                        }
                                    ]}
                                    dateFormat={'yyyy-MM-dd'}
                                    placeholderText='yyyy-mm-dd'
                                 />
                </div>
                {isEdit ? (
                    <div className="my-4">
                        {projectType === 'ses-order' ? (
                            <div className="mr-8 flex w-2/4 justify-center gap-4">
                                <button
                                    className="rounded-md bg-blue-700 text-xs text-white shadow-md shadow-gray-400"
                                    onClick={handleProjectUpdate}
                                    style={{ height: '30px', width: '70px' }}
                                >
                                    Update
                                </button>
                                <button
                                    className="rounded-md bg-red-700 text-xs text-white shadow-md shadow-gray-400"
                                    onClick={handleEditCancle}
                                    style={{ height: '30px', width: '70px' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            'not ses'
                        )}
                    </div>
                ) : (
                    <div className="my-4">
                        {projectType === 'ses-order' ? (
                            <div className="mr-8 flex w-2/4 justify-center gap-4">
                                <button
                                    className=" rounded-md bg-blue-700 text-xs text-white shadow-md shadow-gray-400"
                                    onClick={handleSubmit(handleProjectCreate)}
                                    style={{ height: '30px', width: '70px' }}
                                >
                                    Create
                                </button>
                                <button
                                    className=" rounded-md bg-red-700 text-xs text-white shadow-md shadow-gray-400"
                                    style={{ height: '30px', width: '70px' }}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            'not ses'
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SESOrderUpdate
