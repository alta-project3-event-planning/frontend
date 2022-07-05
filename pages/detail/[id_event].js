/** @format */
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { RiSendPlaneFill } from 'react-icons/ri';

import Layout from '../../components/Layout';
import Loading from '../../components/Loading';

export default function DetailEvent() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [event, setEvent] = useState();

	useEffect(() => {
		getDetail();
	}, []);

	const getDetail = () => {
		const { id_event } = router.query;
		const requestConfig = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		fetch(`https://virtserver.swaggerhub.com/Alfin7007/soundfest/1.0.0/events/${id_event}`, requestConfig)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setEvent(data.data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	if (loading) {
		return <Loading />;
	} else {
		return (
			<Layout headTitle={'Event'} headDesc={'Details of event'}>
				<div className='mx-12'>
					<div className='grid grid-cols-6'>
						<div className='col-span-4'>
							<div>
								<h1 className='text-2xl font-bold'>About this event</h1>
								<p>{event.details}</p>
							</div>
							<div className='space-y-6'>
								<div className='flex justify-between'>
									<h1 className='text-xl font-bold'>Participant</h1>
									<p className='text-slate-400'>4 Participant</p>
								</div>
								<div>
									<div className='flex text-2xl space-x-6'>
										<CgProfile />
										<CgProfile />
										<CgProfile />
										<CgProfile />
									</div>
								</div>
								<div className='space-y-4'>
									<h1 className='text-xl font-bold'>Comment</h1>
									<div className='space-y-2 py-2 h-52 overflow-y-auto'>
										<div className='bg-slate-100 p-4'>
											<p className='font-bold'>Comment 1</p>
											<p>User 1</p>
										</div>
										<div className='bg-slate-100 p-4'>
											<p className='font-bold'>Comment 2</p>
											<p>User 2</p>
										</div>
										<div className='bg-slate-100 p-4'>
											<p className='font-bold'>Comment 3</p>
											<p>User 3</p>
										</div>
									</div>
								</div>
								<div className='grid grid-cols-12'>
									<div className='flex items-center'>
										<CgProfile className='ml-auto mr-4 text-2xl' />
									</div>
									<textarea name='comment' placeholder='Write your comment' className='col-span-10 border border-slate-300 p-4 resize-none focus:outline-none focus:border-sky-500' />
									<div className='flex items-center'>
										<RiSendPlaneFill className='text-sky-500 text-2xl ml-4 cursor-pointer' />
									</div>
								</div>
							</div>
						</div>
						<div className='p-4 col-span-2'>
							<div>Image</div>
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
							<button className='bg-sky-500 hover:bg-sky-600 text-white py-2 w-full rounded-md'>Join</button>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}
