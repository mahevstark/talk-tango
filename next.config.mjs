/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "bubblev2.s3.us-east-1.amazonaws.com",
      "talktango.estamart.com",
      "picsum.photos",
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.granameapp.com" }],
        destination: "https://granameapp.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
