'use client'

import { useGetDepartmentById } from '@/app/store/server/features/departments'
import React, { useEffect } from 'react'
import MainEditForm from './components/MainEditForm'

const Page = ({ params }) => {
    const {
        data: department,
        refetch,
        isLoading,
    } = useGetDepartmentById(params.id)

    useEffect(() => {
        refetch()
    }, [refetch])

    return (
        <div>
            <MainEditForm
                existingDepartment={department}
                isLoading={isLoading}
            />
        </div>
    )
}

export default Page
