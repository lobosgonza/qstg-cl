import React from 'react';

interface EventoProps {
	evento: {
		Título: string;
		'Lugar/Recinto': string;
		Categoría: string;
		'Fecha Evento': string;
		'Link Compra': string;
		'Imagen URL': string;
		Ticketera: string; // 🌟 1. SOLUCIÓN AL ERROR: Le avisamos a TypeScript que existe este campo
	};
	slugLocal: string;
}

export default function EventCard({ evento, slugLocal }: EventoProps) {
	return (
		<div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between'>
			{/* Contenedor de Imagen (Ahora completamente clicleable) */}
			<div className='relative aspect-video w-full bg-gray-100 group'>
				<a href={`/eventos/${slugLocal}`} className='block w-full h-full cursor-pointer overflow-hidden'>
					<img
						src={evento['Imagen URL'] || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000'}
						alt={evento['Título']}
						/* 🌟 CLASES CLAVE: w-full h-full object-cover object-center */
						className='w-full h-full object-cover object-center opacity-90 block'
						loading='lazy'
						referrerPolicy='no-referrer'
					/>
				</a>

				{/* Mantenemos la categoría flotando arriba, fuera del enlace para que no estorbe */}
				<span className='absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider pointer-events-none'>
					{evento['Categoría']}
				</span>
			</div>

			{/* Textos y Datos */}
			<div className='p-4 flex flex-col justify-between flex-grow h-48'>
				<div>
					{/* Fila del Recinto + Procedencia */}
					<div className='flex items-center justify-between gap-2 mb-1'>
						<p className='text-[11px] font-bold text-gray-400 uppercase truncate'>📍 {evento['Lugar/Recinto']}</p>

						{/* Etiqueta dinámica de procedencia con colores pro según la marca */}
						<span
							className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase border tracking-wide shadow-sm shrink-0 ${
								evento.Ticketera === 'PuntoTicket' ? 'border-sky-200 bg-sky-50 text-sky-600' : 'border-blue-200 bg-blue-50 text-blue-600'
							}`}>
							{evento.Ticketera}
						</span>
					</div>

					<h3 className='text-base font-bold text-gray-900 line-clamp-2 leading-snug'>{evento['Título']}</h3>
				</div>

				<div>
					{/* Fecha */}
					<div className='flex items-center text-xs text-gray-600 mb-3'>
						<span className='mr-1'>📅</span>
						<span className='truncate font-medium'>{evento['Fecha Evento']}</span>
					</div>

					{/* Botón Ver Detalles */}
					<a
						href={`/eventos/${slugLocal}`}
						className='block w-full text-center bg-gray-950 text-white font-bold py-2 rounded-lg text-xs hover:bg-red-600 transition-colors duration-200'>
						Ver Detalles
					</a>
				</div>
			</div>
		</div>
	);
}
