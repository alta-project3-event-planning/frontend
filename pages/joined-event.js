/** @format */

import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';
import { TiPlus } from 'react-icons/ti';

export default function MyEvent() {
	const [loading, setLoading] = useState(true);
	const [myEvents, setMyEvents] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch('https://infinitysport.site/events/participations', requestOptions)
			.then((response) => response.json())
			.then((data) => {
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
				<div className='w-full flex flex-col sm:flex-row mt-12'>
					<Sidebar active="joined-event"/>
					<div>
						<Link href="/createevent"><div className="bg-sky-500 hover:bg-sky-700 text-white text-4xl p-3 absolute bottom-[7%] right-[3%] block whitespace-no-wrap cursor-pointer rounded-full"><TiPlus /></div></Link>
						{myEvents.map((item) => {
							return (
								<div className='grid grid-cols-1 sm:grid-cols-5 gap-5' key={item.id_event}>
									<div className='flex justify-center items-center'>Image</div>
									<div className='col-span-3 flex flex-col justify-center items-center sm:items-start'>
										<h1 className='text-2xl font-bold'>{item.name}</h1>
										<p>
											<span className='text-slate-400'>Performers </span>
											{item.hostedby}
										</p>
										<p>
											{moment(item.date, 'DD-MM-YYYY').format('dddd')}, {moment(item.date, 'DD-MM-YYYY').format('DD MMMM YYYY')}
										</p>
										<div className='mt-4 flex flex-col items-center sm:items-start'>
											<h1 className='text-slate-400'>About this event</h1>
											<p>{item.details}</p>
										</div>
									</div>
									<div className='flex flex-col justify-center items-center space-y-4'>
										<button className='bg-red-500 hover:bg-red-600 text-white py-2 w-36' onClick={() => handleCancel(item.id_event)}>
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
