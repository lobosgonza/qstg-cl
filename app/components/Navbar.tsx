'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
	return (
		/* 📰 CABECERA DE REVISTA: Fondo sólido, borde de tinta negra de 2px y fijado superior */
		<header className='sticky top-0 z-50 bg-white border-b-2 border-black px-4 py-3.5'>
			<div className='max-w-7xl mx-auto flex justify-between items-center'>
				{/* LOGO CON FUENTE EDITORIAL PESADA */}
				<Link href='/' className='font-editorial text-2xl font-black tracking-tighter text-gray-950 uppercase italic group cursor-pointer select-none'>
					QSTG<span className='text-red-600 transition-colors group-hover:text-black'>.CL</span>
				</Link>

				{/* ENLACES CENTRALES ESTILO MENÚ DE PRENSA */}
				<nav className='hidden md:flex items-center gap-8 font-mono'>
					<Link href='/' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-wider transition-colors'>
						INICIO
					</Link>
					{/* 🚀 Vinculada tu nueva cartelera global */}
					<Link href='/todos-los-eventos' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-wider transition-colors'>
						TODOS LOS EVENTOS
					</Link>
					<Link href='/contacto' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-wider transition-colors'>
						SUGERIR SHOW
					</Link>
				</nav>

				{/* BOTÓN DE ACCIÓN CON ESQUINAS RECTAS Y SOMBRA EN BLOQUE */}
				<div className='flex items-center gap-4 font-mono'>
					{/* Indicador técnico en vez de bandera */}
					<span className='text-[10px] bg-black text-white px-2.5 py-1 rounded-none font-bold uppercase tracking-widest max-sm:hidden border border-black'>REG // SCL</span>

					<Link
						href='/contacto'
						className='bg-white text-gray-950 hover:bg-red-600 hover:text-white text-[10px] font-black px-4 py-2.5 rounded-none uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#000000] transition-all duration-100'>
						PUBLICAR EVENTO ➜
					</Link>
				</div>
			</div>
		</header>
	);
}
