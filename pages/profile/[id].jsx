/** @format */
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';

import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';

export default function Profile() {
	const router = useRouter();
	const [profile, setProfile] = useState({});
	const [Name, setName] = useState('');
	const [Email, setEmail] = useState('');
	const [Password, setPassword] = useState('');

	useEffect(() => {
		getUserProfile();
	}, []);

	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const getUserProfile = async () => {
		const { id } = router.query;
		const res = await fetch(`https://my-json-server.typicode.com/Maruta45/mockjson/profile/${id}`, requestOptions);
		const data = await res.json();
		setProfile(data.user);
	};

	const handleDeleteAccount = () => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire('Deleted!', 'Your Account has been deleted.', 'success');
			}
		});
	};

	const handleUpdateProfile = () => {
		Swal.fire({
			icon: 'success',
			title: 'Your profile has been updated!',
			showConfirmButton: false,
			timer: 1500,
		});
	};

	return (
		<Layout>
			<div className='w-full flex mt-12'>
				<Sidebar />
				<div className='w-full'>
					<h1 className='font-bold text-xl'>Profile</h1>
					<div className='flex flex-col md:flex-row md:justify-around p-8 space-y-16 md:space-y-0'>
						<div className='flex flex-col items-center space-y-8'>
							<CgProfile className='text-5xl font-bold' />
							<form className='flex flex-col space-y-4'>
								<div className='grid grid-cols-4'>
									<label htmlFor='name' className='sm:text-xl text-end'>
										Name :
									</label>
									<input type='text' name='name' id='name' placeholder={profile.name} className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' onChange={(e) => setName(e.target.value)} />
								</div>
								<div className='grid grid-cols-4'>
									<label htmlFor='email' className='sm:text-xl text-end'>
										Email :
									</label>
									<input type='text' name='name' id='email' placeholder={profile.email} className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' onChange={(e) => setEmail(e.target.value)} />
								</div>
								<div className='grid grid-cols-4'>
									<label htmlFor='password' className='sm:text-xl text-end'>
										Password :
									</label>
									<input type='text' name='name' id='password' placeholder={profile.password} className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' onChange={(e) => setPassword(e.target.value)} />
								</div>
							</form>
							<button className='py-2 px-16 bg-sky-400 text-white hover:bg-sky-500' onClick={() => handleUpdateProfile()}>
								Save
							</button>
						</div>
						<div className='flex items-center justify-center'>
							<button className='bg-red-500 px-6 py-2 rounded-sm hover:bg-red-600 text-white' onClick={() => handleDeleteAccount()}>
								Delete Account
							</button>
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
