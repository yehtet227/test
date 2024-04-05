'use client'

import './globals.css'
import AppSideBarLayout from '@/app/components/layouts/AppSideBarLayout'
import { persistor, store } from '@/app/store/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import { Inter } from 'next/font/google'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 10 * (60 * 1000), // 10 mins
            cacheTime: 15 * (60 * 1000), // 15 mins
        },
    },
})
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <QueryClientProvider client={queryClient}>
                    <Provider store={store}>
                        {process.env.NODE_ENV === 'development' && (
                            <ReactQueryDevtools initialIsOpen={false} />
                        )}
                        <ReactQueryStreamedHydration>
                            <PersistGate loading={null} persistor={persistor}>
                                {children}
                            </PersistGate>
                        </ReactQueryStreamedHydration>
                    </Provider>
                </QueryClientProvider>
            </body>
        </html>
    )
}
