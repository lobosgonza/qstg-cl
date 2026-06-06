import React from 'react';

interface EventoProps {
	evento: {
		Título: string;
		Slug: string;
		Ticketera: string;
		Categoría: string;
		'Link Compra': string;
		'Imagen URL': string;
		'Banner URL': string;

		// 📍 Ubicación
		Recinto: string;
		Ciudad: string;
		Región: string;

		// 📅 Tiempo
		'Fecha Filtro': string;
		'Día Texto': string;
		Hora: string;
		'Es Multifecha': boolean;
	};
	slugLocal: string;
}

export default function EventCard({ evento, slugLocal }: EventoProps) {
	const urlDetalle = `/eventos/${slugLocal}`;

	return (
		<div className='group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between'>
			{/* Contenedor de Imagen con Efecto de Capa Transparente */}
			<div className='relative aspect-video w-full bg-gray-100 overflow-hidden'>
				<a href={urlDetalle} className='block w-full h-full cursor-pointer'>
					<img
						src={evento['Imagen URL'] || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000'}
						alt={evento['Título']}
						className='w-full h-full object-cover object-center opacity-90 block group-hover:scale-105 transition-transform duration-500'
						loading='lazy'
						referrerPolicy='no-referrer'
					/>

					{/* 🌟 NUEVO EFECTO: Sin cuadro rojo. Capa oscura elegante con desenfoque de fondo en el hover */}
					<div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 backdrop-blur-0 group-hover:backdrop-blur-[3px] flex items-center justify-center transition-all duration-300'>
						<span className='text-white font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 border-b-2 border-white pb-1'>
							Ver Detalles →
						</span>
					</div>
				</a>

				{/* Categoría flotando arriba a la izquierda */}
				<span className='absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider pointer-events-none z-10'>
					{evento['Categoría']}
				</span>
			</div>

			{/* Bloque de Información Inferior */}
			<div className='p-4 flex flex-col justify-between flex-grow h-40 bg-white z-10'>
				<div className='space-y-1.5'>
					{/* Fila de la ticketera */}
					<div className='flex items-center justify-end h-4'>
						<span
							className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase border tracking-wide shadow-sm shrink-0 ${
								evento.Ticketera === 'PuntoTicket'
									? 'border-sky-200 bg-sky-50 text-sky-600'
									: evento.Ticketera === 'Ticketmaster'
										? 'border-blue-200 bg-blue-50 text-blue-600'
										: evento.Ticketera === 'TicketJusto'
											? 'border-amber-200 bg-amber-50 text-amber-600'
											: 'border-gray-200 bg-gray-50 text-gray-600'
							}`}>
							{evento.Ticketera}
						</span>
					</div>

					{/* El título como enlace directo con hover rojo */}
					<h3 className='text-sm font-black text-gray-950 leading-snug min-h-[40px] line-clamp-2'>
						<a href={urlDetalle} className='hover:text-red-600 transition-colors duration-200 block'>
							{evento['Título']}
						</a>
					</h3>

					{/* Datos de Fecha y Hora */}
					<div className='space-y-0.5 text-xs text-gray-700 font-medium pt-0.5'>
						<div className='flex items-center gap-1.5'>
							<span>📅</span>
							<span className='truncate'>{evento['Día Texto']}</span>
							{evento['Es Multifecha'] && <span className='text-[8px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-black uppercase shrink-0 tracking-wide'>Festival</span>}
						</div>
						{evento.Hora && (
							<div className='flex items-center gap-1.5 text-gray-500 text-[11px]'>
								<span>🕒</span>
								<span>{evento.Hora} hrs</span>
							</div>
						)}
					</div>

					{/* Ubicación */}
					<p className='text-[10px] font-bold text-gray-400 uppercase truncate pt-1'>
						📍 {evento.Recinto} <span className='text-red-500 font-black'>- {evento.Ciudad}</span>
					</p>
				</div>
			</div>
		</div>
	);
}
