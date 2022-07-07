/** @format */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CardEvent from '../components/CardEvent';
import Layout from '../components/Layout';
import Loading from '../components/Loading';

export default function Home() {
	const router = useRouter();
	const [currentTime, setCurrentTime] = useState('');
	const [dataEvents, setDataEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		};

		fetch('https://infinitysport.site/events?page=1', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setCurrentTime(data.currenttime);
				setDataEvents(data.data);
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
			<Layout headTitle={'Sound Fest'} headDesc={'Sound Festive'}>
				<div className='flex flex-col h-full justify-between'>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-2 px-6 sm:p-8'>
						{dataEvents.map((item) => {
							return (
								<CardEvent
									key={item.id_event}
									name={item.name}
									hosted_by={item.hostedby}
									performers={item.performers}
									image={item.image_url}
									date={item.date}
									location={item.city}
									id_event={item.id_event}
									currentTime={currentTime}
									onClickEvent={() => router.push(`detail/${item.id_event}`)}
								/>
							);
						})}
					</div>
				</div>
			</Layout>
		);
	}
}
