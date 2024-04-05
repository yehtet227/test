'use client'

import CustomTable from '@/app/components/table/CustomTable'
import { columns } from '@/app/const/engineer-info'
import { useGetAllEngineerInfoProjectAssignWithYear } from '@/app/store/server/features/emp_project_assign'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const EngineerInfoComponent = () => {
    const year = useSelector((state) => state.customTable)
    const { data, isLoading, isSuccess, isError, refetch } =
        useGetAllEngineerInfoProjectAssignWithYear(year?.year)
    useEffect(() => {
        refetch()
    }, [refetch])

    let engineerInfo
    if (data !== undefined) {
        engineerInfo = data?.EngineerAssignData?.map((item, index) => ({
            key: item?.id,
            Name: `${
                item?.employeeGroup?.employee_name
                    ? item?.employeeGroup?.employee_name
                    : ''
            }`,
            EmployeeNumber: `${item?.employeeGroup?.employee_code}`,
            CurrentStatus: `${
                item.currentAssign.current_status.charAt(0).toUpperCase() +
                item.currentAssign.current_status.slice(1)
            }`,
            MarketingStatus: `${
                item?.marketing_status
                    ? item.marketing_status.charAt(0).toUpperCase() +
                      item.marketing_status.slice(1)
                    : ''
            }`,
            ProposalStatus: `${
                item.proposal_status ? item.proposal_status : ''
            }`,

            Project: item?.currentAssign?.current_project
                ? item?.currentAssign?.current_project
                      .split(',')
                      .map((month, index, array) => (
                          <span key={index}>
                              {month.trim()}
                              {index !== array.length - 1 && (
                                  <>
                                      <br />
                                      <hr className="mb-2 ml-[-9px] mr-[-9px] mt-2" />
                                  </>
                              )}
                          </span>
                      ))
                : null,
            ProjectType: item?.currentAssign?.current_projectType
                ? item?.currentAssign?.current_projectType
                      .split(',')
                      .map((month, index, array) => (
                          <span key={index}>
                              {month.trim()}
                              {index !== array.length - 1 && (
                                  <>
                                      <br />
                                      <hr className="mb-2 ml-[-9px] mr-[-9px] mt-2" />
                                  </>
                              )}
                          </span>
                      ))
                : null,
            ManMonth: item?.currentAssign?.current_man_month
                ? item.currentAssign.current_man_month
                      .split(',')
                      .map((month, index, array) => (
                          <span key={index}>
                              {month.trim()}
                              {index !== array.length - 1 && (
                                  <>
                                      <br />
                                      <hr className="mb-2 ml-[-9px] mr-[-9px] mt-2" />
                                  </>
                              )}
                          </span>
                      ))
                : null,
            Location: `${
                item?.employeeGroup?.location
                    ? item?.employeeGroup?.location
                    : ''
            }`,
            Department: `${
                item?.currentAssign?.department
                    ? item?.currentAssign?.department
                    : ''
            }`,
            CareerSheetStatus: `${
                item?.careersheet_status && item?.careersheet_status === 1
                    ? 'Updated'
                    : 'Not Updated'
            }`,

            January: item?.january?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),

            February: item?.february?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            March: item?.march?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            April: item?.april?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            May: item?.may?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            June: item?.june?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            July: item?.july?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            August: item?.august?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            September: item?.september?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            October: item?.october?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            November: item?.november?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            December: item?.december?.map((project, index, array) => (
                <>
                    {project.project_name}
                    {index !== array.length - 1 && <br />}
                </>
            )),
            Year: item?.year && item?.year,
        }))
    }
    return (
        <>
            <CustomTable
                isLoading={isLoading}
                columns={columns}
                data={engineerInfo}
                searchColumns={['Name', 'EmployeeNumber']}
                placeholder="Search by Name and Project"
                editBtn={true}
                yearBtn={true}
                columnsFilterBtn={true}
                columnsDataFilter={true}
                columnsDataFilterhiddenName={['Name', 'Employee Number']}
                editRouteUrl={`/engineers-info/assign`}
                isSuccess={isSuccess}
                isError={isError}
            />
        </>
    )
}

export default EngineerInfoComponent
