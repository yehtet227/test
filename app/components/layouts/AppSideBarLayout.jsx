'use client'

import { Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Company from '../../../public/company.svg'
import Cost from '../../../public/cost.svg'
import Department from '../../../public/department.svg'
import EngineerAssign from '../../../public/engassign.svg'
import EngineerInfo from '../../../public/engineerInfo.svg'
import EngineerList from '../../../public/engineers.svg'
import GIC from '../../../public/gic.svg'
import Home from '../../../public/home.svg'
import Profit from '../../../public/profit.svg'
import Project from '../../../public/projectlogo.svg'
import Role from '../../../public/role.svg'
import Setting from '../../../public/settings.svg'
import './Layouts.css'
import { useEffect, useState } from 'react'
import { ArrowRightOnRectangleIcon, LockClosedIcon } from '@heroicons/react/20/solid'
import { useLogout } from '@/app/store/server/features/auth'


const AppSideBarLayout = ({ children }) => {
    const collapsible = useSelector((state) => state.collapsible.collapsible)
    const pathname = usePathname()
    const [showModal, setShowModal] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkTokenExpiry = () => {
          const tokenData = JSON.parse(sessionStorage.getItem('token'));
          if (tokenData) {
            const { expiryTime } = tokenData;
            if (new Date().getTime() > expiryTime) {
              sessionStorage.removeItem('token');
              window.location.href = '/';
            }
          }
        };
        const intervalId = setInterval(checkTokenExpiry, 1000 * 60 * 30 );
        return () => clearInterval(intervalId);
      }, []);

      const doesTokenExist = sessionStorage.getItem('token');
      if (!doesTokenExist) {
        router.push('/');
      }

    const handleLogoutSuccess = (data) => {
        if(data?.logout) {
            router.push('/')
            sessionStorage.removeItem('token')
        } else {
            toast.error('Logout Failed')
        }
    }
    const {mutate: logout, isSuccess, isError} = useLogout(handleLogoutSuccess);
    const sessionData = JSON.parse(sessionStorage.getItem('token'));
    const handleLogout = () => {
        const payload = {
            email: sessionData?.user?.email
        }
        logout(payload)
    }
    return (
        <main className="flex max-h-screen min-h-screen w-full gap-x-2 overflow-hidden bg-gray-50/10">
                <div
                    className={`h-screen bg-blue-700 py-2 px-4 text-white transition-all duration-500 ease-in-out transform ${
                        collapsible ? 'sidebar-expanded' : 'sidebar-collapsed'
                    }`}
                >
                    <h1 className=" flex items-center gap-2 self-start">
                        <Image src={GIC} className="h-8 w-8" alt="home" />
                        
                            {collapsible && (
                                <span className="text-md">GIC</span>
                            )}
                        
                    </h1>
                    <hr className="mt-2" style={{ color: 'gray' }} />
                    <div>
                        <ul className="flex w-auto flex-col">
                            <Link
                                className={`mt-3 w-full rounded py-1 hover:bg-black ${
                                    pathname === '/en/home'
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/home"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Home}
                                        className="h-6 w-6"
                                        alt="home"
                                    />
                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Home
                                            </span>
                                        )}
                                   
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname.includes('/departments')
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/departments"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Department}
                                        className="h-6 w-6"
                                        alt="company"
                                    />

                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Departments
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname.includes('/roles')
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/roles"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Role}
                                        className="h-6 w-6"
                                        alt="company"
                                    />

                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Roles
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname === '/en/customers'
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/customers"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Company}
                                        className="h-6 w-6"
                                        alt="customer"
                                    />

                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Customers
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname === '/en/engineers'
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/engineers"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={EngineerList}
                                        className="h-6 w-6"
                                        alt="company"
                                    />

                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm ">
                                                Engineers
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname.includes('/projects')
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/projects"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Project}
                                        className="h-6 w-6"
                                        alt="project"
                                    />

                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm ">
                                                Projects
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname === '/en/engineers/assign'
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/engineers/assign"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={EngineerAssign}
                                        className="h-6 w-6"
                                        alt="enginfo"
                                    />

                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Assigns
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname.includes('/engineers-info')
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/engineers-info"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={EngineerInfo}
                                        className="h-6 w-6"
                                        alt="enginfo"
                                    />

                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm ">
                                                Assign Info
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname.includes('/costs')
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/costs"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Cost}
                                        className="h-6 w-6"
                                        alt="enginfo"
                                    />

                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Cost
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname === '/en/cost-summary'
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/cost-summary"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Profit}
                                        className="h-6 w-6"
                                        alt="company"
                                    />

                                   
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Cost Summary
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>

                            <Link
                                className={`mt-3 rounded py-1 hover:bg-black ${
                                    pathname === '/en/activity-log'
                                        ? 'bg-black text-white'
                                        : ''
                                } ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                href="/activity-log"
                                scroll={false}
                            >
                                <div className="flex items-center">
                                    <Image
                                        src={Profit}
                                        className="h-6 w-6"
                                        alt="company"
                                    />

                                   
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Activity Log
                                            </span>
                                        )}
                                    
                                </div>
                            </Link>
                            <div className={`mt-24 rounded py-1 hover:bg-black  ${
                                    collapsible
                                        ? 'flex items-start pl-1'
                                        : 'flex-col items-center justify-center pl-1'
                                }`}
                                onClick={() => setShowModal(!showModal)}
                                >
                                <div className="flex items-center relative">
                                    <Image
                                        src={Setting}
                                        className="h-6 w-6"
                                        alt="home"
                                    />
                                    
                                        {collapsible && (
                                            <span className="ml-2 mt-2 text-sm">
                                                Setting
                                            </span>
                                        )}

                                        {showModal && (
                                                <div className="absolute w-36 bottom-10 gap-y-2 left-10 bg-white p-2 rounded shadow"
                                                >
                                                    <Link href='/en/change-password' style={{zIndex: "1000"}}>
                                                    <button className='text-black gap-2 flex flex-row text-xs justify-center items-center'> 
                                                    <LockClosedIcon className='w-4 h-4'/>
                                                    Change Password</button>
                                                    </Link>
                                                    <button style={{zIndex: "1000"}} className='text-black text-xs gap-2 flex flex-row justify-center items-center'
                                                        onClick={handleLogout}
                                                    >
                                                        <ArrowRightOnRectangleIcon className='w-4 h-4'/>
                                                        Logout</button>
                                                </div>
                                                )}
                                   
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            <div
                className={`scrollbar-hide overflow-y-auto px-4 ${
                    collapsible ? 'w-full' : 'w-full'
                }`}
            >
                {children}
            </div>
        </main>
    )
}

export default AppSideBarLayout
