import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev", "192.168.1.56"],
};

export default nextConfig;
