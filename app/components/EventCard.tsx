import React from 'react';

interface EventoProps {
	evento: {
		id?: number;
		titulo: string;
		slug: string;
		ticketera: string;
		url_ticket: string;
		url_imagen: string;
		url_banner: string;

		// Ubicación
		recinto: string;
		ciudad: string;
		region: string;

		// Tiempo (Nuevos campos para festivales y orden cronológico)
		fecha_inicio: string;
		fecha_fin: string;
		texto_fechas: string; // Reemplaza a 'Día Texto'
		hora: string;
		es_multifecha: boolean;
		categoria_id?: number;
	};
	slugLocal: string;
}

export default function EventCard({ evento, slugLocal }: EventoProps) {
	// Actualizado para usar las nuevas propiedades en minúsculas
	const urlDetalle = `/eventos/${slugLocal || evento.slug}`;
	const nombreRecinto = (evento.recinto || 'POR CONFIRMAR').split(' - ')[0];

	return (
		/* 📰 CONTENEDOR MÁSTER */
		<div className='group card-brutalista hover:shadow-[8px_8px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 flex flex-col justify-between overflow-hidden h-full'>
			{/* 1. CONTENEDOR DE IMAGEN */}
			<div className='relative aspect-video w-full bg-gray-100 overflow-hidden border-b-2 border-black'>
				<a href={urlDetalle} className='block w-full h-full cursor-pointer'>
					<img
						src={evento.url_imagen || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000'}
						alt={evento.titulo}
						className='w-full h-full object-cover object-center filter contrast-125 group-hover:filter-none group-hover:scale-102 transition-all duration-500 opacity-95 block'
						loading='lazy'
						referrerPolicy='no-referrer'
					/>

					{/* Capa de escaneo/revelado al pasar el mouse */}
					<div className='absolute inset-0 bg-black/0 group-hover:bg-red-600/10 flex items-center justify-center transition-all duration-300'>
						<span className='text-white bg-black font-mono font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 px-3 py-1.5 border border-white shadow-[2px_2px_0px_#000]'>
							VER FICHA ➜
						</span>
					</div>
				</a>

				{/* Badge de ticketera superior izquierda temporalmente para control visual */}
				<span className='absolute top-3 left-3 tag-categoria pointer-events-none z-10'>{evento.ticketera || 'SCL'}</span>
			</div>

			{/* 2. BLOQUE DE INFORMACIÓN */}
			<div className='p-4 flex flex-col justify-between flex-grow bg-white z-10 space-y-4'>
				<div className='space-y-2'>
					{/* Fila superior técnica */}
					<div className='flex items-center justify-between'>
						<p className='text-[10px] font-mono font-black text-red-600 uppercase tracking-widest flex items-center gap-1'>FECHA // {evento.texto_fechas}</p>

						<span className='bg-white text-gray-900 text-[8px] font-mono font-black px-2 py-0.5 rounded-none uppercase border-2 border-black tracking-tight shadow-[2px_2px_0px_#000000]'>
							{evento.ticketera}
						</span>
					</div>

					{/* El título con tu fuente editorial 'Syne' */}
					<h3 className='font-editorial text-sm font-black text-gray-950 uppercase tracking-tight leading-tight line-clamp-2 min-h-[40px]'>
						<a href={urlDetalle} className='hover:text-red-600 transition-colors duration-150 block'>
							{evento.titulo}
						</a>
					</h3>
				</div>

				{/* 3. METADATOS TÉCNICOS INFERIORES */}
				<div className='border-t border-gray-200 pt-3 flex items-center justify-between font-mono text-[10px] font-bold text-gray-500 uppercase tracking-tight gap-2'>
					<div className='truncate max-w-[70%]'>
						REF // {nombreRecinto} <span className='text-red-500 font-black'>// {evento.ciudad || 'SCL'}</span>
					</div>

					<div className='flex items-center gap-2 shrink-0 text-gray-400 font-black'>
						{evento.es_multifecha ? (
							<span className='text-red-600 bg-red-50 px-1.5 py-0.5 border border-red-200 text-[9px] font-mono'>FEST</span>
						) : (
							evento.hora && <span className='text-gray-600'>{evento.hora}</span>
						)}
						<span className='text-gray-400 font-normal group-hover:text-red-600 transition-colors shrink-0'>VER ➜</span>
					</div>
				</div>
			</div>
		</div>
	);
}
