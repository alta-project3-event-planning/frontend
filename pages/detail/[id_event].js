/** @format */
import moment from 'moment';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { RiSendPlaneFill } from 'react-icons/ri';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import Image from 'next/image';

import { TokenContext } from '../../utils/context';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';

export default function DetailEvent() {
	const { token } = useContext(TokenContext);
	const router = useRouter();
	const { id_event } = router.query;
	const [loading, setLoading] = useState(true);
	const [position, setPosition] = useState([-7.96662, 112.632629]);
	const [event, setEvent] = useState([]);
	const [currentTime, setCurrentTime] = useState('');
	const [dateEvent, setDateEvent] = useState('');
	const [comment, setComment] = useState([]);
	const [comment_text, setCommentText] = useState('');
	const [participant, setParticipant] = useState([]);
	const [profile, setProfile] = useState({});
	const [join, setJoin] = useState(false);
	const isAfter = moment(dateEvent).isAfter(currentTime);

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
				console.log(data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	const getDetail = async () => {
		const requestConfig = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await fetch(`https://infinitysport.site/events/${id_event}`, requestConfig)
			.then((response) => response.json())
			.then((data) => {
				setPosition(data.data.location.split(','))
				setEvent(data.data);
				setCurrentTime(moment(data.data.currenttime).format('LL'));
				setDateEvent(moment(data.data.date).format('LL'));
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const getComments = async () => {
		const requestConfig = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		};

		await fetch(`https://infinitysport.site/events/comments/${id_event}`, requestConfig)
			.then((response) => response.json())
			.then((data) => {
				setComment(data.data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	const getParticipant = async () => {
		const requestConfig = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};

		await fetch(`https://infinitysport.site/events/${id_event}`, requestConfig)
			.then((response) => response.json())
			.then((data) => {
				console.log(data.data.participant);
				setParticipant(data.data.participant);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	const postComment = async () => {
		const requestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				id_event: +id_event,
				comment: comment_text,
			}),
		};

		await fetch('https://infinitysport.site/events/comments', requestConfig)
			.then((response) => response.json())
			.then((data) => {
				data.code === '200' && getComments();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const joinEvent = async () => {
		setLoading(true);
		const requestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				id_event: +id_event,
			}),
		};

		await fetch('https://infinitysport.site/events/participations', requestConfig)
			.then((response) => response.json())
			.then((data) => {
				if (data.code === '200') {
					setJoin(true);
					Swal.fire({
						title: 'Success',
						text: `${data.message}`,
						icon: 'success',
					});
				} else if (data.code === '400') {
					Swal.fire({
						title: 'Failed',
						text: `${data.message}`,
						icon: 'error',
					});
				}
			})
			.catch((error) => {
				console.log(error);
				Swal.fire({
					title: 'Failed',
					text: 'You have already joined this event',
					icon: 'error',
				});
			})
			.finally(() => getParticipant());
	};

	const cancelJoin = async () => {
		setLoading(true);
		const requestOptions = {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};

		await fetch(`https://infinitysport.site/events/participations/${id_event}`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				if (data.code == '200') {
					setJoin(false);
					Swal.fire({
						title: 'Success',
						text: `${data.message}`,
						icon: 'success',
					});
				} else if (data.code == '400') {
					Swal.fire({
						title: 'Failed',
						text: `${data.message}`,
						icon: 'error',
					});
				}
			})
			.catch((error) => {
				Swal.fire({
					title: 'Failed',
					text: 'Something went wrong',
					icon: 'error',
				});
			})
			.finally(() => getParticipant());
	};

	useEffect(() => {
		getUserProfile();
	}, []);
	
	useEffect(() => {
		getDetail();
	}, []);

	useEffect(() => {
		getComments();
	}, []);

	useEffect(() => {
		getParticipant();
	}, []);

	if (token !== "0") {
		if (loading) {
			return <Loading />;
		} else {
			return (
				<Layout headTitle={'Event'} headDesc={'Details of event'}>
					<div className='mx-6 my-12 sm:mx-12'>
						<div className='grid grid-cols-6 gap-6 md:gap-0'>
							<div className='col-span-6 md:col-span-4 space-y-4'>
								<div className='space-y-6'>
									<div className='space-y-2'>
										<h1 className='text-2xl font-bold'>About this event</h1>
										<p>{event.details}</p>
									</div>
									<div>
										<Map position={position} />
									</div>
								</div>
								<div className='space-y-6'>
									<div className='flex justify-between'>
										<h1 className='text-xl font-bold'>Participant</h1>
										<p className='text-slate-400'>{participant.length} Participant</p>
									</div>
									<div>
										<div className='flex text-2xl space-x-6'>
											{participant.map((item) => {
												return (
													<div key={item.id} className='flex flex-col items-center justify-center'>
														<img src={item.url} alt={item.name} width={'55px'} height={'55px'} className='rounded-full' />
														<p className='text-base'>{item.name}</p>
													</div>
												);
											})}
										</div>
									</div>
									<div className='bg-slate-100 px-4 py-8'>
										<div className='space-y-4'>
											<h1 className='text-xl font-bold'>Comment</h1>
											<div className='space-y-2 py-2 h-52 overflow-y-auto'>
												{comment.map((item) => {
													return (
														<div className='bg-slate-200 hover:bg-slate-300 p-4 space-y-4 rounded-md flex items-center space-x-4' key={item.id_comment}>
															<div className='flex items-center justify-center'>
																<img src={item.avatar} alt={item.name} width={'55px'} height={'55px'} className='rounded-full' />
															</div>
															<div>
																<p className='font-bold text-xs sm:text-base'>{item.comment}</p>
																<p className='text-xs sm:text-base'>{item.name}</p>
															</div>
														</div>
													);
												})}
											</div>
										</div>
										<div className='flex justify-around'>
											<div className='flex items-center mr-4'>
												<img src={profile.url} alt={profile.name} width={'55px'} height={'55px'} className='rounded-full' />
											</div>
											<textarea name='comment' placeholder='Write your comment' className='border border-slate-300 p-4 resize-none focus:outline-none focus:border-sky-500 w-full' onChange={(e) => setCommentText(e.target.value)} />
											<div className='flex items-center'>
												<button onClick={() => postComment()}>
													<RiSendPlaneFill className='text-sky-500 text-2xl ml-4 cursor-pointer' />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='md:p-4 col-span-6 md:col-span-2 row-start-1 md:row-start-auto space-y-4'>
								{isAfter ? null : <h1 className='bg-red-500/90 px-4 py-1 w-fit text-white rounded-full ml-auto translate-y-3 translate-x-6 select-none text-xs'>Event End</h1>}
								<div className='flex justify-center'>
									<img src={event.image_url} width={200} height={200} alt={event.name} />
								</div>
								<div className='flex justify-between'>
									<h1 className='text-xl font-bold'>{event.name}</h1>
									<p>
										{moment(event.date, 'DD-MM-YYYY').format('dddd')}, {moment(event.date).format('DD MMMM YYYY')}
									</p>
								</div>
								<h1>
									<span className='text-slate-400'>HostedBy : </span>
									{event.hostedby}
								</h1>
								<h1>
									<span className='text-slate-400'>Performers : </span>
									{event.performers}
								</h1>
								<h1>
									<span className='text-slate-400'>Location : </span> {event.city}
								</h1>
								<button disabled={isAfter ? false : true} className={`bg-sky-500 hover:bg-sky-600 text-white py-2 w-full rounded-md ${isAfter ? 'cursor-pointer' : 'cursor-not-allowed bg-slate-400 hover:bg-slate-400 text-slate-200'} ${join ? 'hidden' : 'block'}`} onClick={() => joinEvent()}>
									Join
								</button>
								<button className={`bg-red-500 hover:bg-red-600 text-white py-2 w-full rounded-md ${join ? 'block' : 'hidden'}`} onClick={() => cancelJoin()}>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</Layout>
			);
		}
	} else {
		router.push('/login')
	}
}
