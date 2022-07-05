/** @format */
import { CgProfile } from 'react-icons/cg';
import { GiMusicSpell } from 'react-icons/gi';
import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className='px-2 sm:px-6 py-2 flex items-center justify-between'>
			<Link href='/'>
				<a className='sm:hidden'>
					<GiMusicSpell className='text-2xl text-sky-400 mr-4' />
				</a>
			</Link>
			<Link href='/'>
				<a className='italic text-sky-400 text-2xl font-bold hidden sm:flex'>SOUNDFEST</a>
			</Link>
			<div className='flex items-center space-x-4'>
				<div>
					<input type='text' name='search' placeholder='Search...' className='pl-2 py-1 w-2/3 border focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border focus:border-sky-400' />
					<input type='submit' value={'Search'} className='bg-sky-400 py-1 px-2 text-white cursor-pointer' />
				</div>
				<CgProfile className='text-3xl text-sky-400 cursor-pointer' />
			</div>
		</nav>
	);
}
