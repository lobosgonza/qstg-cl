'use client';

import React from 'react';
import Link from 'next/link';

export default function MainBanner({ evento }: { evento: any }) {
	if (!evento) return null;

	const titulo = evento['Título'] || 'CONCIERTO DESTACADO';
	const imagen = evento['Banner URL'] || evento['Imagen URL'] || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000';
	const recinto = evento['Recinto'] || 'POR CONFIRMAR';
	const fechaTexto = evento['Día Texto'] || 'PRÓXIMAMENTE';
	const categoria = evento['Categoría'] || 'DESTACADO';
	const slug = evento['Slug'] || '#';

	return (
		/* 📰 CONTENEDOR MAESTRO REFORZADO */
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 select-none'>
			{/* 🎨 ESTRUCTURA ADAPTATIVA DE ALTO IMPACTO: Mantiene la sombra externa fija */}
			<div className='bg-white border-7 border-black rounded-none shadow-[6px_6px_0px_#000000] grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[360px] transition-shadow duration-300 '>
				{/* 📱 BLOQUE IMAGEN: Aislado con z-0 y overflow estricto para proteger la sombra trasera */}
				<div className='order-first md:order-last md:col-span-5 relative bg-black min-h-[260px] sm:min-h-[300px] md:min-h-full border-b-4 md:border-b-0 md:border-l-4 border-black group overflow-hidden z-0 rounded-none ring-4 ring-inset ring-white'>
					<img
						src={imagen}
						alt={titulo}
						/* Usamos transformaciones puras aceleradas por hardware para que no afecten el layout exterior */
						className='absolute inset-0 w-full h-full object-cover object-center filter contrast-125 brightness-95 transform transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform'
						loading='eager'
					/>

					{/* Sello técnico de esquina inferior */}
					<span className='absolute bottom-3 left-3 bg-white text-gray-950 font-mono font-black text-[9px] px-2 py-0.5 uppercase border border-black shadow-[2px_2px_0px_#000] z-10'>
						PRENSA_IMG // SPONSOR_ID_{evento.Hora ? 'OK' : 'RAW'}
					</span>
				</div>

				{/* 📝 BLOQUE TEXTO EDITORIAL */}
				<div className='md:col-span-7 p-5 sm:p-8 flex flex-col justify-between space-y-6 bg-white relative z-10'>
					{/* Detalles del Título e Identificadores */}
					<div className='space-y-3'>
						<div className='flex items-center gap-2 flex-wrap'>
							<span className='w-max bg-black text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase tracking-widest border shadow-[2px_2px_0px_#000]'>
								_DESTACADO // {categoria}
							</span>
						</div>

						{/* Título Masivo */}
						<h2 className='font-editorial text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none pt-1 break-words'>{titulo}</h2>
					</div>

					{/* Ficha técnica inferior y botón de acción masivo */}
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t-4 border-black font-mono w-full relative z-20'>
						{/* Metadatos limpios */}
						<div className='text-[11px] sm:text-xs font-bold text-gray-900 uppercase tracking-tight space-y-1 bg-gray-50 p-2 sm:p-3 border-2 border-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,0.1)] w-full sm:w-auto'>
							<p className='flex items-center gap-1'>
								<span className='text-red-600 font-black'>CRONOGRAMA //</span> {fechaTexto} {evento.Hora ? `// ${evento.Hora} HRS` : ''}
							</p>
							<p className='flex items-center gap-1'>
								<span className='text-red-600 font-black'>EMPLAZAMIENTO //</span> {recinto.split(' - ')[0]} // {evento.Ciudad || 'SCL'}
							</p>
						</div>

						{/* Botón de Acción Masivo */}
						<Link
							href={`/eventos/${slug}`}
							className='w-full sm:w-auto text-center bg-red-600  text-white hover:bg-black  hover:text-white font-black text-xs px-8 py-4 rounded-none uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 shrink-0 block hover:-translate-x-1 hover:-translate-y-1'>
							ACCEDER A LA FICHA ➜
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
