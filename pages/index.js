/** @format */
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import CardEvent from '../components/CardEvent';

export default function Home({ events }) {
	const router = useRouter();
	return (
		<Layout headTitle={'Sound Fest'} headDesc={'Sound Festive'}>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:p-8'>
				{events.map((item) => {
					return <CardEvent key={item.id} image={item.event.image} name={item.event.name} hosted_by={item.event.hosted_by} date={item.event.date} location={item.event.location} onClickEvent={() => router.push(`event/${item.id}`)} />;
				})}
			</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const res = await fetch('https://my-json-server.typicode.com/Maruta45/mockjson/events');
	const events = await res.json();

	return {
		props: {
			events,
		},
	};
}
