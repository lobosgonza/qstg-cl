import React from 'react';

interface MainBannerProps {
	evento: {
		titulo: string;
		slug: string;
		ticketera: string;
		url_ticket: string;
		url_imagen: string;
		url_banner: string;
		recinto: string;
		ciudad: string;
		texto_fechas: string;
		hora: string;
		resumen_seo: string;
	};
}

export default function MainBanner({ evento }: MainBannerProps) {
	// Si la base de datos aún no se ha descargado de forma asíncrona, evitamos la rotura del render
	if (!evento) return null;

	// Limpieza brutalista del recinto para que se vea estético en imprenta
	const nombreRecinto = (evento.recinto || 'POR CONFIRMAR').split(' - ')[0];

	return (
		<div className='relative w-full bg-black text-white border-b-4 border-black overflow-hidden aspect-[21/9] min-h-[380px] flex items-end p-6 sm:p-12'>
			{/* 1. IMAGEN DE FONDO DESTACADA */}
			<img
				src={evento.url_banner || evento.url_imagen || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000'}
				alt={evento.titulo}
				className='absolute inset-0 w-full h-full object-cover object-center opacity-55 filter contrast-125 brightness-75 block'
				loading='eager' // Forzamos carga inmediata por ser el elemento principal (LCP)
				referrerPolicy='no-referrer'
			/>

			{/* Capa de contraste brutalista oscura */}
			<div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none' />

			{/* 2. BLOQUE COGNITIVO DEL HIGHLIGHT */}
			<div className='relative z-10 max-w-4xl space-y-4 uppercase tracking-tight'>
				<span className='bg-yellow-400 text-black text-[9px] font-mono font-black px-2.5 py-1 uppercase tracking-widest border border-black shadow-[2px_2px_0px_#000]'>
					// DESTACADO
				</span>

				<h1 className='font-editorial text-2xl sm:text-5xl font-black leading-none uppercase tracking-tighter max-w-3xl drop-shadow-md text-white'>{evento.titulo}</h1>

				<p className='text-[11px] sm:text-xs font-mono font-bold max-w-2xl text-gray-300 normal-case italic leading-relaxed'>
					{evento.resumen_seo || 'Sin descripción resumida disponible para este bloque.'}
				</p>

				{/* Metadatos técnicos de imprenta */}
				<div className='flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono font-black text-gray-300 pt-2 border-t border-white/20 w-max max-w-full uppercase'>
					<div>
						// LOCAL: <span className='text-white'>{nombreRecinto}</span>
					</div>
					<div>
						// CIUDAD: <span className='text-yellow-400'>{evento.ciudad || 'SCL'}</span>
					</div>
					<div>
						// FECHA: <span className='text-white'>{evento.texto_fechas}</span>
					</div>
					{evento.hora && (
						<div>
							// HORA: <span className='text-white'>{evento.hora} HRS</span>
						</div>
					)}
				</div>

				{/* Botón de compra de entradas */}
				<div className='pt-4'>
					<a
						href={evento.url_ticket}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-block bg-white text-black hover:bg-red-600 hover:text-white font-mono font-black text-xs px-6 py-3.5 uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000000] transition-all duration-100 cursor-pointer'>
						ADQUIRIR ACCESOS EN {evento.ticketera} ➜
					</a>
				</div>
			</div>
		</div>
	);
}
