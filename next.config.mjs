// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: [
//       "bubblev2.s3.us-east-1.amazonaws.com",
//       "talktango.estamart.com",
//       "picsum.photos",
//     ],
//   },
//   {
//         source: '/:path*',
//         has: [{ type: 'host', value: 'granameapp.com' }],
//         protocol: 'http',
//         destination: 'https://granameapp.com/:path*',
//         permanent: true,
//       },
//       {
//         source: '/:path*',
//         has: [{ type: 'host', value: 'www.granameapp.com' }],
//         destination: 'https://granameapp.com/:path*',
//         permanent: true,
//       }
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "bubblev2.s3.us-east-1.amazonaws.com",
      "talktango.estamart.com",
      "picsum.photos",
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "granameapp.com" }],
        protocol: "http",
        destination: "https://granameapp.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.granameapp.com" }],
        destination: "https://granameapp.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: '<https://granameapp.com>; rel="canonical"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
