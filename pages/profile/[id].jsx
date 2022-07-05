/** @format */
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { CgProfile } from 'react-icons/cg';

export default function Profile({ params }) {
	const router = useRouter();
	console.log(params);
	return (
		<Layout>
			<div className='w-full flex mt-12'>
				<Sidebar />
				<div className='w-full'>
					<h1 className='font-bold text-xl'>Profile</h1>
					<div className='flex flex-col md:flex-row md:justify-between p-8 space-y-16 md:space-y-0'>
						<div className='flex flex-col items-center space-y-8'>
							<CgProfile className='text-5xl font-bold' />
							<form className='flex flex-col space-y-4'>
								<div className='grid grid-cols-4'>
									<label htmlFor='name' className='sm:text-xl text-end'>
										Name :
									</label>
									<input type='text' name='name' id='name' placeholder='Name' className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' />
								</div>
								<div className='grid grid-cols-4'>
									<label htmlFor='email' className='sm:text-xl text-end'>
										Email :
									</label>
									<input type='text' name='name' id='email' placeholder='Name' className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' />
								</div>
								<div className='grid grid-cols-4'>
									<label htmlFor='password' className='sm:text-xl text-end'>
										Password :
									</label>
									<input type='text' name='name' id='password' placeholder='Name' className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' />
								</div>
								<button className='py-2 bg-sky-400 text-white hover:bg-sky-500'>Save</button>
							</form>
						</div>
						<div className='flex items-center justify-center'>
							<button className='bg-red-500 px-6 py-2 rounded-sm hover:bg-red-600 text-white'>Delete Account</button>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const res = await fetch('https://my-json-server.typicode.com/Maruta45/mockjson/profile');
	const profile = await res.json();

	return {
		props: {
			profile,
		},
	};
}

export async function getStaticPaths() {
	const res = await fetch(`https://my-json-server.typicode.com/Maruta45/mockjson/profile`);
	const profile = await res.json();

	return {
		paths: profile.map((profile) => ({
			params: { id: `${profile.id}` },
		})),
		fallback: false,
	};
}
