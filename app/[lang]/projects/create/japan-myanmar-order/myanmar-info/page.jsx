'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'
import MyanmarOrder from '../../components/CreateOffshoreMM'

const Page = () => {
    const dispatch = useDispatch()
    const toggleSideBar = () => {
        dispatch(toggleCollapsible())
    }
    const pathname = usePathname()
    const segments = pathname.split('/')
    const projectType = segments[segments.length - 1]

    return (
        <div className="mb-6 space-y-0">
            <div className="sticky top-0 z-40 flex w-full flex-col gap-4 bg-white py-[13px]">
                <div className="flex flex-row items-center gap-4">
                    <div className="cursor-pointer" onClick={toggleSideBar}>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                        <div className="mb-0.5 h-1 w-5 bg-gray-600"></div>
                    </div>

                    {projectType === 'myanmar-order' ? (
                        <h3>
                            <Link href={'/en/projects'}>Project</Link> &gt;{' '}
                            <Link href={'/en/projects/create'}>
                                Project Creation
                            </Link>{' '}
                            &gt; GICM Information
                        </h3>
                    ) : (
                        <h3>
                            <Link href={'/en/projects'}>Project</Link> &gt;{' '}
                            <Link href={'/en/projects/create'}>
                                Project Creation
                            </Link>{' '}
                            &gt;{' '}
                            <Link
                                href={'/en/projects/create/japan-myanmar-order'}
                            >
                                GICJ Order Information
                            </Link>{' '}
                            &gt; GICM Order Information
                        </h3>
                    )}
                </div>
            </div>
            <MyanmarOrder projectType={'japan-myanmar-order'} />
        </div>
    )
}

export default Page
