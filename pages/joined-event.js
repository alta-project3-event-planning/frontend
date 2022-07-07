/** @format */

import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import { TokenContext } from '../utils/context';

export default function MyEvent() {
	const {token} = useContext(TokenContext)
	const [loading, setLoading] = useState(true);
	const [currTime, setCurrTime] = useState()
	const [myEvents, setMyEvents] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const requestOptions = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		};

		fetch('https://infinitysport.site/events/participations', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setCurrTime(data.currenttime)
				setMyEvents(data.data);
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setLoading(false);
			});
	};

    const deleteParticipant = (id_event) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(`https://infinitysport.site/events/participations/${id_event}`, requestOptions)
            .then((response) => response.json())
            .then(() => {
                Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
            })
            .catch(() => {
                Swal.fire('Error!', 'Something went wrong.', 'error');
            }).finally(() => {
                fetchData();
            })
    }

	const handleCancel = (id_event) => {
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
				deleteParticipant(id_event)
			}
		});
	};

	if (loading) {
		return <Loading />;
	} else {
		return (
			<Layout headTitle={'My Events'} headDesc={'List of my events'}>
				<div className='w-full flex flex-col sm:flex-row my-12'>
					<Sidebar active='joined-event' />
					<div className='flex flex-col gap-12 pb-12 w-[100vw]'>
						{myEvents.map((item) => {
							return (
								<div className='grid grid-cols-1 sm:grid-cols-5 gap-5' key={item.id_event}>
									<div className='flex justify-center items-center'><img src={item.image_url} alt="image" /></div>
									<div className='col-span-3 flex flex-col justify-center items-center sm:items-start'>
										<div className='flex justify-between w-full'>
											<h1 className='text-2xl font-bold'>{item.name}</h1>
											{item.date < currTime && (<div className='bg-white border-red-500 border-2 rotate-6 self-end p-1 rounded-sm font-bold px-9 text-red-500'>Event End</div>)}
										</div>
										<p>
											<span className='text-slate-400'>Hosted By </span>
											{item.hostedby}
										</p>
										<p>
											<span className='text-slate-400'>Performers </span>
											{item.performers}
										</p>
										<p>
											<span className='text-slate-400'>Location </span>
											{item.city}
										</p>
										<p>
											{moment(item.date, 'DD-MM-YYYY').format('dddd')}, {moment(item.date).format('DD MMMM YYYY')}
										</p>
										<div className='mt-4 flex flex-col items-center sm:items-start'>
											<h1 className='text-slate-400'>About this event</h1>
											<p>{item.details.split('\n').map((item, key) => { return <span key={key}>{item}<br/></span>})}</p>
										</div>
									</div>
									<div className='flex flex-col justify-center items-center space-y-4'>
										<button className='bg-sky-500 hover:bg-sky-600 text-white py-2 w-36' onClick={() => router.push(`/editevent/${item.id_event}`)}>
											Edit Event
										</button>
										<button className='bg-red-500 hover:bg-red-600 text-white py-2 w-36' onClick={() => handleDelete(item.id_event)}>
											Remove Event
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Layout>
		);
	}
}
