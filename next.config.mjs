/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "image.pollinations.ai",
                pathname: "/**",
                protocol: "https",
                port: "",
            }
        ]
    }
};

export default nextConfig;