/** @format */
import { CgProfile } from 'react-icons/cg';
import { GiMusicSpell } from 'react-icons/gi';
import Link from 'next/link';
import { TokenContext } from '../utils/context';
import { useContext } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
	const { token, setToken } = useContext(TokenContext);
	const router = useRouter();
	const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("0");
        router.push('/login')
    }
	return (
		<nav className='px-2 sm:px-16 py-5 flex items-center justify-between'>
			<Link href='/'>
				<a className='sm:hidden'>
					<GiMusicSpell className='text-2xl text-sky-400 mr-4' />
				</a>
			</Link>
			<Link href='/'>
				<a className='italic text-sky-500 text-2xl font-bold hidden sm:flex -skew-y-3'>SOUNDFEST</a>
			</Link>
			<div className='flex items-center space-x-4'>
				<div className='flex'>
					<input type='text' name='search' placeholder='Search...' className='pl-2 py-1 w-2/3 border focus:outline-none rounded-l focus:ring-2 focus:ring-sky-400 focus:border focus:border-sky-400' />
					<input type='text' name='location' placeholder='Location...' className='pl-2 py-1 w-2/3 border focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border focus:border-sky-400' />
					<input type='submit' value={'Search'} className='bg-sky-500 py-1 px-2 text-white cursor-pointer rounded-r' />
				</div>
				{token !== "0" ?(
						<div className='group inline-block relative cursor-pointer text-center'>
							<button className="pl-5">
								<CgProfile className='text-3xl text-sky-500 cursor-pointer' />
							</button>
							<ul className="absolute hidden text-gray-700 pt-1 group-hover:block -right-2/3">
								<li className="text-white">
									<Link href={"/profile"}><div className="bg-sky-500 hover:bg-sky-700 py-2 px-4 block whitespace-no-wrap cursor-pointer rounded-t">Profile</div></Link>
								</li>
								<li className="text-white">
									<div className="bg-sky-500 hover:bg-sky-700 py-2 px-4 block whitespace-no-wrap cursor-pointer rounded-b" onClick={()=>handleLogout()}>LogOut</div>
								</li>
							</ul>
						</div>
					) : (
						<div className='flex gap-4 text-white'>
							<Link href={"/login"}><div className='py-1 px-8 font-bold cursor-pointer rounded bg-sky-500 hover:bg-sky-700'>Login</div></Link>
							<Link href={"/signup"}><div className='py-1 px-8 font-bold cursor-pointer rounded bg-sky-500 hover:bg-sky-700'>Sign Up</div></Link>
						</div>
					)}
			</div>
		</nav>
	);
}
