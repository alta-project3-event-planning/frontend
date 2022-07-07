/** @format */

import Image from 'next/image';
import moment from 'moment';

export default function CardEvent({ image, name, hosted_by, performers, date, currentTime, location, onClickEvent }) {
	const currTime = moment(currentTime).format('LL');
	const eventTime = moment(date).format('LL');
	const isAfter = moment(eventTime).isAfter(currTime);

	return (
		<div className='flex flex-col'>
			{isAfter ? null : <h1 className='bg-red-500/90 px-4 py-1 w-fit text-white rounded-full ml-auto translate-y-3 translate-x-6 select-none text-xs'>Event End</h1>}
			<div className='bg-white p-4 border hover:shadow-xl cursor-pointer flex flex-col items-center justify-center' onClick={onClickEvent}>
				<Image src={image} alt={name} width={300} height={200} />
				<h3 className='text-2xl font-bold'>{name}</h3>
				<p>
					<span>Hosted by : </span>
					{hosted_by}
				</p>
				<p>
					<span>Performers by : </span>
					{performers}
				</p>
				<p>
					<span>Date : </span>
					{moment(date, 'DD-MM-YYYY').format('dddd')}, {moment(date, 'DD-MM-YYYY').format('DD MMMM YYYY')}
				</p>
				<p>Location : {location}</p>
			</div>
		</div>
	);
}
