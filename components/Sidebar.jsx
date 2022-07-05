/** @format */

import Link from 'next/link';

export default function Sidebar() {
	return (
		<div className='w-1/4'>
			<ul className='flex flex-col space-y-4 sm:px-6'>
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
