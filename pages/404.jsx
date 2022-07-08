/** @format */
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import NotFoundAnimation from '../assets/animations/76706-404-error-page.json';

export default function Custom404() {
	const router = useRouter();

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<div className='flex justify-center'>
				<Lottie autoPlay loop={true} animationData={NotFoundAnimation} className='w-1/2' />
			</div>
			<h1 className='sm:text-xl cursor-pointer hover:underline' onClick={() => router.push('/')}>
				Back to Homepage
			</h1>
		</div>
	);
}
