/** @format */

import Lottie from 'lottie-react';

import LoadingAnimation from '../assets/animations/5853-play-music.json';

export default function Loading() {
	return (
		<div className='w-full h-screen'>
			<Lottie autoPlay loop={true} animationData={LoadingAnimation} className='w-full h-full' />
		</div>
	);
}
