import { addJanProjectType } from '@/app/store/client/features/engineerInof-project_assign/projectAssignCreateSlice'
import { useGetEngineerInfoProjectById } from '@/app/store/server/features/emp_project_assign'
import { useGetAllProjects } from '@/app/store/server/features/projects'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import EditDropDown from './EditDown'

const schema = yup.object().shape({
    careerSheetLink: yup.string().required('Please enter career sheet link.'),
    proposalStatus: yup.string().required('Please select a proposal status.'),
    manHour: yup.string().required('Please enter man-hour.'),
    unitPrice: yup.string().required('Please enter unit price.'),
})
const DynamicComponent = (props) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
    })
    const dispatch = useDispatch()
    const { data: projects } = useGetAllProjects()
    const janprojectList = projects?.map((project) => ({
        id: project?.id,
        name: project?.project_name,
    }))
    const [janprojectupIcon, setjanprojectUpIcon] = useState(false)
    const customTable = useSelector((state) => state.customTable)
    const { data, isLoading, refetch } = useGetEngineerInfoProjectById(
        props?.params?.id,
        customTable?.year,
        customTable?.empcode,
    )
    const janData = data?.data[0]?.january
    const defalutjanproject = [
        { id: janData?.project_id, name: janData?.project_name },
    ]
    const [janprojectselected, setjanprojectSelected] = useState(
        defalutjanproject[0],
    )
    const handlejanprojectChange = (newValue) => {
        dispatch(addJanProjectType(newValue)); 
        setjanprojectSelected(newValue)
        setjanprojectUpIcon(false)
    }
    useEffect(() => {
        setjanprojectSelected(defalutjanproject[0])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={`${props?.index !== 0 && 'mt-10'} text-xs`}>
            <h1 className="mb-5 w-1/3 text-[12px] font-medium">
                {'Add Project Information' + ' ' + props?.index}
            </h1>
            <div className="mb-4 flex">
                <div className="relative z-auto mb-2">
                    <label>Project Type</label>
                    <div
                        className="mr-3 mt-2 w-[300px]"
                        style={{
                            position: 'relative',
                            zIndex: 127,
                        }}
                    >
                        <EditDropDown
                            people={janprojectList}
                            upIcon={janprojectupIcon}
                            setUpIcon={setjanprojectUpIcon}
                            selected={janprojectselected}
                            handleChange={handlejanprojectChange}
                        />
                    </div>
                </div>
                <div className="relative z-auto mb-2">
                    <label>Customer</label>
                    <div
                        className="mt-2 w-[300px]"
                        style={{
                            position: 'relative',
                            zIndex: 125,
                        }}
                    >
                        <EditDropDown
                        // people={janroleList}
                        // upIcon={janroleupIcon}
                        // setUpIcon={setjanroleUpIcon}
                        // selected={janroleselected}
                        // handleChange={handlejanroleChange}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-4 flex">
                <div className="relative z-auto mb-2">
                    <label>Project</label>
                    <div
                        className="mr-3 mt-2 w-[300px]"
                        style={{
                            position: 'relative',
                            zIndex: 126,
                        }}
                    >
                        <EditDropDown
                        // people={janprojectList}
                        // upIcon={janprojectupIcon}
                        // setUpIcon={setjanprojectUpIcon}
                        // selected={janprojectselected}
                        // handleChange={handlejanprojectChange}
                        />
                    </div>
                </div>
                <div className="relative z-auto mb-2">
                    <label>Role</label>
                    <div
                        className="mt-2 w-[300px]"
                        style={{
                            position: 'relative',
                            zIndex: 125,
                        }}
                    >
                        <EditDropDown
                        // people={janroleList}
                        // upIcon={janroleupIcon}
                        // setUpIcon={setjanroleUpIcon}
                        // selected={janroleselected}
                        // handleChange={handlejanroleChange}
                        />
                    </div>
                </div>
            </div>
            <div className="z-10 mb-4 flex flex-row  justify-between gap-2">
                <div className="flex">
                    <div className="mr-3 w-[300px]">
                        <label>Man-Hours</label>

                        <Controller
                            name="manHour"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    // value={manHour}
                                    // onChange={(e) => {
                                    //     field.onChange(e)
                                    //     setManHour(e.target.value)
                                    // }}
                                    type="number"
                                    className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                />
                            )}
                        />
                        {/* <span className=" text-red-600">
                            {errors.manHour && errors.manHour.message}
                        </span> */}
                    </div>

                    <div className="w-[300px]">
                        <label className="flex gap-2">Unit Price</label>
                        <Controller
                            name="unitPrice"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    // value={unitPrice}
                                    // onChange={(e) => {
                                    //     field.onChange(e)
                                    //     setUnitPrice(e.target.value)
                                    // }}
                                    type="number"
                                    className="mt-2 h-[35px] w-full rounded-md border border-slate-300 px-[12px] py-1 focus:outline-slate-300"
                                />
                            )}
                        />
                        {/* <span className=" text-red-600">
                            {errors.unitPrice && errors.unitPrice.message}
                        </span> */}
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="relative z-auto mb-2 mr-3 w-[300px]">
                    <label>Member Type</label>
                    <div
                        className="mt-2 w-full"
                        style={{
                            position: 'relative',
                            zIndex: 124,
                        }}
                    >
                        <EditDropDown
                        // people={memberTypeList}
                        // upIcon={janmembertypeupIcon}
                        // setUpIcon={setjanmembertypeUpIcon}
                        // selected={janmembertypeselected}
                        // handleChange={handlejanmembertypeChange}
                        />
                    </div>
                </div>
                {props?.index !== 0 && (
                    <button
                        onClick={props?.onRemove}
                        className="mt-4 inline-flex w-[100px] items-center justify-center rounded-md bg-red-700 py-2 font-medium text-white shadow-md shadow-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    )
}

export default DynamicComponent
