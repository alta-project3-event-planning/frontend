/** @format */

import Link from 'next/link';

export default function Sidebar({active}) {
	return (
		<div className='sm:w-1/4 mb-8'>
			<ul className='flex sm:flex-col justify-around py-2 sm:py-0 sm:space-y-4 sm:px-6'>
				<Link href='/profile'>
					<a className={active==='profile' ? 'font-bold border-sky-500 -ml-4 pl-4 border-l-4' : 'hover:font-bold hover:border-sky-500 hover:-ml-4 hover:pl-4 hover:border-l-4'}>Profile</a>
				</Link>
				<Link href='/joined-event'>
					<a className={active==='joined-event' ? 'font-bold border-sky-500 -ml-4 pl-4 border-l-4' : 'hover:font-bold hover:border-sky-500 hover:-ml-4 hover:pl-4 hover:border-l-4'}>Joined Event</a>
				</Link>
				<Link href='/my-event'>
					<a className={active==='my-event' ? 'font-bold border-sky-500 -ml-4 pl-4 border-l-4' : 'hover:font-bold hover:border-sky-500 hover:-ml-4 hover:pl-4 hover:border-l-4'}>My Event</a>
				</Link>
			</ul>
		</div>
	);
}
