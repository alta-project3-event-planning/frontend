/** @format */

import Link from 'next/link';

export default function Sidebar() {
	return (
		<div className='sm:w-1/4 mb-8'>
			<ul className='flex sm:flex-col justify-around py-2 sm:py-0 sm:space-y-4 sm:px-6'>
				<Link href='/profile'>
					<a>Profile</a>
				</Link>
				<Link href='/joined-event'>
					<a>Joined Event</a>
				</Link>
				<Link href='/my-event'>
					<a>My Event</a>
				</Link>
			</ul>
		</div>
	);
}
