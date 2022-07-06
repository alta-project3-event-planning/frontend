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

		fetch('https://infinitysport.site/events', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setCurrentTime(data.currentTime);
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
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:p-8'>
					{dataEvents.map((item) => {
						return (
							<CardEvent
								key={item.id_event}
								name={item.name}
								hosted_by={item.hostedby}
								performers={item.performers}
								image={item.image_url}
								date={item.date}
								location={item.location}
								id_event={item.id_event}
								onClickEvent={() => router.push(`detail/${item.id_event}`)}
							/>
						);
					})}
				</div>
			</Layout>
		);
	}
}

export async function getServerSideProps() {
	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const response = await fetch('https://virtserver.swaggerhub.com/Alfin7007/soundfest/1.0.0/events', requestOptions);
	const data = await response.json();

	return {
		props: {
			data,
		},
	};
}
