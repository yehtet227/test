import React from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useDispatch } from 'react-redux'
import { removeEmployee } from '@/app/store/client/features/engineer_assign/engineerAssignSlice'
import { removeEmployeeData } from '@/app/store/client/features/engineer_assign/assignCreateSlice'


const AssignDataShow = ({employeeList,role, numberOfHours, pricePerEngineer}) => {
    const dispatch = useDispatch()
  return (
    <div className='flex flex-col w-full'>
        <div className='mb-2'> 
            <h3 className="text-sm font-bold">{role}</h3>
            <hr />
        </div>
        <div className='flex flex-row gap-12 justify-between'>
                    <div className="flex flex-col w-[150px] ">
                       
                        <h5 className="text-sm">
                            Man-hours - {numberOfHours}
                        </h5>
                        <h5 className="text-sm">
                            Unit Price - {pricePerEngineer}
                        </h5>
                    </div>
                    <div className="max-h-48 w-[480px] overflow-y-auto mb-2 ">
                        <ol>
                            {employeeList.map(
                                (emp, index = 0) => (
                                    <li className='text-sm border w-full flex flex-row border-gray-300 px-4 py-1 rounded-sm' key={emp.id}>
                                       <div className='w-full'> {index + 1}. {emp.emp_name}</div> 
                                       <div className='w-full flex justify-end items-end'>
                                            <XMarkIcon 
                                                style={{width: '20px', height: '20px'}}
                                                onClick={() => {
                                                    dispatch(removeEmployee({role: role, id: emp?.id}))
                                                    dispatch(removeEmployeeData({id: emp?.emp_cd}))
                                                }}
                                            />
                                        </div>
                                    </li>
                                ),
                            )}
                        </ol>
                    </div>
                    </div>
    </div>
  )
}

export default AssignDataShow
