/** @format */

import { useEffect, useState, useMemo, useContext } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import Swal from 'sweetalert2';
import { TokenContext } from '../../utils/context';

const Updateevent = () => {
	const router = useRouter();
	const { eventId } = router.query;
	const { token } = useContext(TokenContext);

	const Map = useMemo(
		() =>
			dynamic(
				() => import('../../components/Map'), // replace '@components/map' with your component's location
				{
					loading: () => <p>A map is loading</p>,
					ssr: false, // This line is important. It's what prevents server-side render
				}
			),
		[position]
	);

	const [poster, setPoster] = useState('');
	const [srcPoster, setSrcPoster] = useState('');
	const [name, setName] = useState('');
	const [host, setHost] = useState('');
	const [performers, setPerformers] = useState('');
	const [date, setDate] = useState('');
	const [detail, setDetail] = useState('');
	const [location, setLocation] = useState('Malang');
	const [position, setPosition] = useState([-7.96662, 112.632629]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getEvent();
	}, []);

	const getEvent = async () => {
		const { eventId } = router.query;
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};

		await fetch(`https://infinitysport.site/events/${eventId || '1'}`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				const { code, message, data } = result;
				if (code === '200') {
					const dateEvent = new Date(data.date);
					dateEvent.setMinutes(dateEvent.getMinutes() - dateEvent.getTimezoneOffset());

					setPoster(data.image_url);
					setSrcPoster(data.image_url);
					setName(data.name);
					setHost(data.hostedby);
					setPerformers(data.performers);
					setDate(dateEvent.toISOString().slice(0, 16));
					setDetail(data.details);
					setLocation(data.city);
					setPosition(data.location.split(','));
				} else if (code === '400') {
					Swal.fire({
						icon: 'error',
						title: message,
					});
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const putEvent = () => {
		const formData = new FormData();
		formData.append('file', poster);
		formData.append('name', name);
		formData.append('performers', performers);
		formData.append('hostedby', host);
		formData.append('date', date);
		formData.append('city', location);
		formData.append('location', position.join());
		formData.append('details', detail);

		var requestOptions = {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		};
		fetch(`https://infinitysport.site/events/${eventId}`, requestOptions)
			.then((response) => response.json())
			.then((result) => {
				const { code, message } = result;
				if (code == 200) {
					Swal.fire({
						icon: 'success',
						title: message,
					}).then((result) => {
						if (result.isConfirmed) {
							router.push('/my-event');
						}
					});
				} else if (code == 400) {
					Swal.fire({
						icon: 'error',
						title: message,
					});
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleChange = (e, type) => {
		let val = e.target.value;
		switch (type) {
			case 'poster':
				setPoster(e.target.files[0]);
				setSrcPoster(URL.createObjectURL(e.target.files[0]));
				break;
			case 'name':
				setName(val);
				break;
			case 'host':
				setHost(val);
				break;
			case 'performers':
				setPerformers(val);
				break;
			case 'date':
				setDate(val);
				break;
			case 'detail':
				setDetail(val);
				break;
			case 'location':
				setLocation(val);
				break;
			default:
				break;
		}
	};

	const handleSubmit = () => {
		let passed = 0;

		poster !== '' && passed++;
		name !== '' && passed++;
		host !== '' && passed++;
		performers !== '' && passed++;
		date !== '' && passed++;
		detail !== '' && passed++;
		location !== '' && passed++;
		position !== '' && passed++;

		if (passed === 8) {
			setLoading(true);
			putEvent();
		} else {
			Swal.fire({
				icon: 'error',
				title: 'All Field Must Be Filled',
			});
		}
	};

	if (token !== '0') {
		if (loading) {
			return <Loading />;
		} else {
			return (
				<Layout headTitle={'Edit Event'} headDesc={'edit event'}>
					<div className='flex my-12'>
						<Sidebar active='my-event' />
						<div className='w-full p-2'>
							<p className='font-bold text-xl mb-4'>Update Event</p>
							<div className='pr-20'>
								<div className='flex flex-row my-2 items-center'>
									<label className='basis-1/6'>Poster</label>
									<div className='basis-5/6 '>
										<div className='flex items-end border-[0.1rem] rounded p-2 w-full gap-2'>
											{poster !== '' && <img src={srcPoster} alt='this is image' className='w-48' />}
											<input type={'file'} onChange={(e) => handleChange(e, 'poster')}></input>
										</div>
									</div>
								</div>
								<div className='flex flex-row my-2 items-center'>
									<label className='basis-1/6'>Name</label>
									<div className='basis-5/6'>
										<input type={'text'} value={name} onChange={(e) => handleChange(e, 'name')} className='border-[0.1rem] rounded p-2 w-full' placeholder='Name'></input>
									</div>
								</div>
								<div className='flex flex-row my-2 items-center'>
									<label className='basis-1/6'>Host</label>
									<div className='basis-5/6'>
										<input type={'text'} value={host} onChange={(e) => handleChange(e, 'host')} className='border-[0.1rem] rounded p-2 w-full' placeholder='Host'></input>
									</div>
								</div>
								<div className='flex flex-row my-2 items-center'>
									<label className='basis-1/6'>Performers</label>
									<div className='basis-5/6'>
										<input type={'text'} value={performers} onChange={(e) => handleChange(e, 'performers')} className='border-[0.1rem] rounded p-2 w-full' placeholder='Performers'></input>
									</div>
								</div>
								<div className='flex flex-row my-2 items-center'>
									<label className='basis-1/6'>Date</label>
									<div className='basis-5/6'>
										<input type='datetime-local' value={date} onChange={(e) => handleChange(e, 'date')} className='border-[0.1rem] rounded p-2 w-full' placeholder='Date'></input>
									</div>
								</div>
								<div className='flex flex-row my-2 items-center'>
									<label className='basis-1/6'>Detail</label>
									<div className='basis-5/6'>
										<textarea type={'text'} value={detail} onChange={(e) => handleChange(e, 'detail')} className='border-[0.1rem] rounded p-2 w-full' placeholder='Detail'></textarea>
									</div>
								</div>
								<div className='flex flex-row my-2 items-center'>
									<label className='basis-1/6'>Location</label>
									<div className='basis-5/6'>
										<input type={'text'} value={location} onChange={(e) => handleChange(e, 'location')} className='border-[0.1rem] rounded p-2 w-full' placeholder='Location'></input>
									</div>
								</div>
								<div className='flex flex-row my-2 items-center'>
									<Map position={position} setPosition={setPosition} />
								</div>
								<div className='flex flex-row my-2 items-center justify-end text-sm gap-2'>
									<b>Lat</b>
									{position[0]}
									<b>Lng.</b> {position[1]}
								</div>
								<div className='flex flex-row my-5 mb-10 items-center justify-end'>
									<button className='font-bold py-2 px-20 bg-sky-500 hover:bg-sky-700 text-white rounded' onClick={() => handleSubmit()}>
										Save Change
									</button>
								</div>
							</div>
						</div>
					</div>
				</Layout>
			);
		}
	} else {
		router.push('/login');
	}
};
export default Updateevent;
