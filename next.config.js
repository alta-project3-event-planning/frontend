/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['images.unsplash.com', 'source.unsplash.com', 'infinitysport.s3.amazonaws.com', 'www.seekpng.com', 'soundfest.site'],
	},
};

module.exports = nextConfig;
