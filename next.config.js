/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/en',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
