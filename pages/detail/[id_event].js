/** @format */
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { RiSendPlaneFill } from 'react-icons/ri';
import dynamic from 'next/dynamic';

import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import Swal from 'sweetalert2';

export default function DetailEvent() {
	const router = useRouter();
	const { id_event } = router.query;
	const [loading, setLoading] = useState(true);
	const [position, setPosition] = useState([-7.96662, 112.632629]);
	const [event, setEvent] = useState([]);
	const [comment, setComment] = useState([]);
	const [comment_text, setCommentText] = useState('');
	const [participant, setParticipant] = useState([]);

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

	const getDetail = async () => {
		const requestConfig = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await fetch(`https://virtserver.swaggerhub.com/Alfin7007/soundfest/1.0.0/events/${id_event}`, requestConfig)
			.then((response) => response.json())
			.then((data) => {
				setEvent(data.data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const getComments = async () => {
		const { id_event } = router.query;
		const requestConfig = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await fetch(`https://virtserver.swaggerhub.com/Alfin7007/soundfest/1.0.0/events/comments/${id_event}`, requestConfig)
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
			},
		};

		await fetch('https://virtserver.swaggerhub.com/Alfin7007/soundfest/1.0.0/events/participations', requestConfig)
			.then((response) => response.json())
			.then((data) => {
				setParticipant(data.data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => setLoading(false));
	};

	const postComment = async () => {
		const { id_event } = router.query;
		const requestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id_event,
				comment: comment_text,
			}),
		};

		await fetch('https://virtserver.swaggerhub.com/Alfin7007/soundfest/1.0.0/events/comments', requestConfig)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setComment(data.data);
				getComments();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const joinEvent = async () => {
		const { id_event } = router.query;
		const requestConfig = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id_event,
			}),
		};

		await fetch('https://virtserver.swaggerhub.com/Alfin7007/soundfest/1.0.0/events/participations', requestConfig)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				Swal.fire({
					title: 'Success',
					text: 'You have joined this event',
					icon: 'success',
				});
			})
			.catch((error) => {
				console.log(error);
				Swal.fire({
					title: 'Failed',
					text: 'You have already joined this event',
					icon: 'error',
				});
			});
	};

	useEffect(() => {
		getDetail();
	}, []);

	useEffect(() => {
		getComments();
	}, []);

	useEffect(() => {
		getParticipant();
	}, []);

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
									<Map position={position} setPosition={setPosition} />
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
												<div key={item.id_participant} className='flex flex-col items-center justify-center'>
													<CgProfile />
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
													<div className='bg-slate-200 hover:bg-slate-300 p-4 space-y-4 rounded-md' key={item.id_comment}>
														<p className='font-bold text-xs sm:text-base'>{item.comment}</p>
														<p className='text-xs sm:text-base'>{item.name}</p>
													</div>
												);
											})}
										</div>
									</div>
									<div className='grid grid-cols-12'>
										<div className='flex items-center'>
											<CgProfile className='ml-auto mr-4 text-2xl' />
										</div>
										<textarea name='comment' placeholder='Write your comment' className='col-span-10 border border-slate-300 p-4 resize-none focus:outline-none focus:border-sky-500' onChange={(e) => setCommentText(e.target.value)} />
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
							<div className='flex justify-center'>Image</div>
							<div className='flex justify-between'>
								<h1 className='text-xl font-bold'>{event.name}</h1>
								<p>
									{moment(event.date, 'DD-MM-YYYY').format('dddd')}, {moment(event.date, 'DD-MM-YYYY').format('DD MMMM YYYY')}
								</p>
							</div>
							<h1>
								<span className='text-slate-400'>Performers : </span>
								{event.hostedby}
							</h1>
							<h1>
								<span className='text-slate-400'>Location : </span> {event.city}
							</h1>
							<button className='bg-sky-500 hover:bg-sky-600 text-white py-2 w-full rounded-md' onClick={() => joinEvent()}>
								Join
							</button>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}
