'use client';

import React from 'react';
import Link from 'next/link';

export default function CtaDifusion() {
	return (
		/* Contenedor con ancho máximo integrado al grid máster */
		<div className='max-w-7xl mx-auto  pt-12  w-full'>
			<div className='bg-black text-white p-6 sm:p-10 border-2 border-black rounded-none shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group'>
				{/* Textos del Manifiesto de Carga */}
				<div className='space-y-2 max-w-xl'>
					<span className='w-max bg-red-600 text-white text-[9px] font-mono font-black px-2 py-0.5 uppercase tracking-widest border border-red-600 block shadow-[2px_2px_0px_#000]'>
						DIFUSIÓN AUTOMATIZADA // ABIERTA
					</span>
					<h3 className='font-editorial text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-white'>¿Falta algún panorama en el archivo?</h3>
					<p className='text-[11px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed font-mono'>
						Si eres productor, artista o gestionas un recinto en Chile, inyecta los datos directos al registro. Saltamos los filtros corporativos y subimos el show a la cartelera.
					</p>
				</div>

				{/* El Botón de Acción Sólido */}
				<Link
					href='/contacto'
					className='w-full md:w-auto text-center bg-red-600 text-white hover:bg-white hover:text-black font-mono font-black text-xs sm:text-sm px-8 py-4.5 rounded-none uppercase tracking-widest border-2 border-red-600 shadow-[4px_4px_0px_#000000] md:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-100 block shrink-0'>
					// PUBLICAR PANORAMA ✚
				</Link>
			</div>
		</div>
	);
}
