/** @format */
import Swal from 'sweetalert2';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
// import { CgProfile } from 'react-icons/cg';
import { FaEdit } from 'react-icons/fa';
import Image from 'next/image';

import Loading from '../components/Loading';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import { TokenContext } from '../utils/context';

export default function Profile() {
	const router = useRouter();

	const { token } = useContext(TokenContext);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState();
	const [profile, setProfile] = useState({});
	const [avatar, setAvatar] = useState('https://www.seekpng.com/png/full/966-9665317_placeholder-image-person-jpg.png');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		getUserProfile();
	}, []);

	const getUserProfile = async () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};

		fetch('https://infinitysport.site/users', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setProfile(data.data);
				setUserId(data.data.id);
				setName(data.data.name);
				setEmail(data.data.email);
				console.log(data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
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
				const requestOptions = {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				};
				fetch(`https://infinitysport.site/users/${userId}`, requestOptions)
					.then((response) => response.json())
					.then((data) => {
						Swal.fire('Deleted!', 'Your Account has been deleted.', 'success');
					})
					.catch((error) => {
						console.log(error);
					});
				// router.push('/login');
			}
		});
	};

	const handleUpdateProfile = () => {
		const body = {
			avatar,
			name,
			email,
			password,
		};
		const requestOptions = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		};

		fetch(`https://infinitysport.site/users/${userId}`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				if (data.code === '200') {
					Swal.fire({
						icon: 'success',
						title: 'Your profile has been updated!',
						showConfirmButton: false,
						timer: 1500,
					});
				} else if (data.code === '400') {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: 'Something went wrong!',
					});
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	if (loading) {
		return <Loading />;
	} else {
		return (
			<Layout headTitle={`Profile - ${profile.name}`} headDesc={'Edit your profile'}>
				<div className='w-full flex flex-col sm:flex-row mt-12'>
					<Sidebar active='profile' />
					<div className='w-full'>
						<h1 className='font-bold text-2xl text-center sm:text-start'>Profile</h1>
						<div className='flex flex-col md:flex-row md:justify-around p-8 space-y-16 md:space-y-0'>
							<div className='flex flex-col items-center space-y-8'>
								<div className='flex'>
									<Image src={avatar} alt='avatar' width={100} height={100} className='rounded-full' />
									<div className='flex items-end ml-2'>
										<input type={'file'} accept={'image/*'} id={'upload_avatar'} className='hidden' onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))} />
										<label htmlFor={'upload_avatar'} className='text-center cursor-pointer'>
											<FaEdit />
										</label>
									</div>
								</div>
								<form className='flex flex-col space-y-4'>
									<div className='grid grid-cols-4'>
										<label htmlFor='name' className='sm:text-xl text-end'>
											Name :
										</label>
										<input type='text' name='name' id='name' value={name} className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' onChange={(e) => setName(e.target.value)} />
									</div>
									<div className='grid grid-cols-4'>
										<label htmlFor='email' className='sm:text-xl text-end'>
											Email :
										</label>
										<input type='email' name='name' id='email' value={email} className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' onChange={(e) => setEmail(e.target.value)} />
									</div>
									<div className='grid grid-cols-4'>
										<label htmlFor='password' className='sm:text-xl text-end'>
											Password :
										</label>
										<input type='password' name='name' id='password' placeholder={'*****'} className='col-span-3 ml-4 pl-2 border focus:outline-none focus:ring-2 focus:ring-sky-400' onChange={(e) => setPassword(e.target.value)} />
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
}
