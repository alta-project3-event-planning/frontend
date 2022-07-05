/** @format */

import Head from 'next/head';
import Navbar from './Navbar';

export default function Layout({ headTitle, headDesc, children }) {
	return (
		<div>
			<Head>
				<title>{headTitle}</title>
				<meta name='description' content={headDesc} />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div>
				<Navbar />
				{children}
			</div>
		</div>
	);
}
