import AppSideBarLayout from '@/app/components/layouts/AppSideBarLayout'
import React from 'react'

const layout = ({children}) => {
  return (
    <AppSideBarLayout>{children}</AppSideBarLayout>
  )
}

export default layout
