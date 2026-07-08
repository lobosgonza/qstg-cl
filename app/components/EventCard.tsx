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

		// Tiempo
		fecha_inicio: string;
		fecha_fin: string;
		texto_fechas: string;
		hora: string;
		es_multifecha: boolean;
		categoria_id?: number;
		categoria?: string; // Nombre de la categoría en texto plano para la UI
	};
	slugLocal: string;
}

export default function EventCard({ evento, slugLocal }: EventoProps) {
	const urlDetalle = `/eventos/${slugLocal || evento.slug}`;
	const nombreRecinto = (evento.recinto || 'POR CONFIRMAR').split(' - ')[0];

	return (
		/* 📰 CONTENEDOR MÁSTER ENLACE (Asegura h-full estricto) */
		<a
			href={urlDetalle}
			className='group card-brutalista hover:shadow-[8px_8px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 flex flex-col justify-between overflow-hidden h-full cursor-pointer transition-all block text-inherit no-underline'>
			{/* 1. CONTENEDOR DE IMAGEN */}
			<div className='relative aspect-video w-full bg-gray-100 overflow-hidden border-b-2 border-black shrink-0'>
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

				{/* Badge de categoría flotante */}
				<span className='absolute top-3 left-3 tag-categoria pointer-events-none z-10'>{evento.categoria || 'PANORAMA'}</span>
			</div>

			{/* 2. BLOQUE DE INFORMACIÓN */}
			<div className='p-4 flex flex-col justify-between flex-grow bg-white z-10 space-y-4'>
				<div className='space-y-2 flex-grow'>
					{/* Fila superior técnica */}
					<div className='flex items-center justify-between'>
						<p className='text-[12px] font-mono font-black text-red-600 uppercase tracking-widest flex items-center gap-1'>// {evento.texto_fechas}</p>

						<span className='text-[12px] bg-white text-gray-900 font-mono font-black px-2 py-0.5 rounded-none uppercase border-2 border-black tracking-tight shadow-[2px_2px_0px_#000000]'>
							{evento.hora}
						</span>
					</div>

					{/* 🚀 CORREGIDO: min-h-[60px] bloquea el alto de la caja al tamaño exacto de 3 líneas (el peor escenario de caracteres) */}
					<h3 className='font-editorial text-sm font-black text-gray-950 group-hover:text-red-600 uppercase tracking-tight leading-tight line-clamp-3 min-h-[60px] transition-colors duration-150 pt-1'>
						{evento.titulo}
					</h3>
				</div>

				{/* 3. METADATOS TÉCNICOS INFERIORES */}
				<div className='border-t border-gray-200 pt-3 flex items-center justify-between font-mono text-[10px] font-bold text-gray-500 uppercase tracking-tight gap-2 shrink-0'>
					<div className='truncate max-w-[70%]'>
						// {nombreRecinto}{' '}
						<span className='text-red-500 font-black'>
							<br />
							// {evento.ciudad}
						</span>
					</div>

					<div className='flex items-center gap-2 shrink-0 text-gray-400 font-black'>
						<span className='text-gray-400 font-normal group-hover:text-red-600 transition-colors shrink-0'>VER ➜</span>
					</div>
				</div>
			</div>
		</a>
	);
}
