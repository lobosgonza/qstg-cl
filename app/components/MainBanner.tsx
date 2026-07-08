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
		/* 🚀 OPTIMIZADO: Ajustamos paddings fluidos (p-4 en mobile, p-6 en sm, p-12 en md) y alturas proporcionales para evitar recortes */
		<div className='relative w-full bg-black text-white border-b-4 border-black overflow-hidden flex items-end min-h-[420px] sm:min-h-[460px] md:min-h-[380px] p-4 sm:p-6 md:p-12'>
			{/* 1. IMAGEN DE FONDO DESTACADA */}
			<img
				src={evento.url_banner || evento.url_imagen || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000'}
				alt={evento.titulo}
				className='absolute inset-0 w-full h-full object-cover object-center opacity-55 filter contrast-125 brightness-75 block'
				loading='eager' // Forzamos carga inmediata por ser el elemento principal (LCP)
				referrerPolicy='no-referrer'
			/>

			{/* Capa de contraste brutalista oscura */}
			<div className='absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none' />

			{/* 2. BLOQUE COGNITIVO DEL HIGHLIGHT */}
			<div className='relative z-10 max-w-4xl space-y-3 sm:space-y-4 uppercase tracking-tight w-full'>
				<span className='w-max bg-yellow-400 text-black text-[9px] font-mono font-black px-2.5 py-1 uppercase tracking-widest border border-black shadow-[2px_2px_0px_#000] block'>
					// DESTACADO
				</span>

				{/* 🚀 CORREGIDO: text-xl escalando a text-5xl, leading-tight para evitar colisiones de texto y break-words anti-overflow */}
				<h1 className='font-editorial text-xl xs:text-2xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-none uppercase tracking-tighter max-w-3xl drop-shadow-md text-white break-words'>
					{evento.titulo}
				</h1>

				{/* Bajada de descripción con tamaño compacto en teléfonos para no competir en altura */}
				<p className='text-[10px] sm:text-xs font-mono font-bold max-w-2xl text-gray-300 normal-case italic leading-relaxed line-clamp-3 sm:line-clamp-none'>
					{evento.resumen_seo || 'Sin descripción resumida disponible para este bloque.'}
				</p>

				{/* Metadatos técnicos de imprenta fluidos */}
				<div className='flex flex-wrap gap-x-4 gap-y-1.5 sm:gap-x-6 sm:gap-y-2 text-[9px] sm:text-[10px] font-mono font-black text-gray-300 pt-2 border-t border-white/20 w-max max-w-full uppercase'>
					<div>
						// LOCAL: <span className='text-yellow-400'>{nombreRecinto}</span>
					</div>
					<div>
						// CIUDAD: <span className='text-yellow-400'>{evento.ciudad || 'SCL'}</span>
					</div>
					<div>
						// FECHA: <span className='text-yellow-400'>{evento.texto_fechas}</span>
					</div>
					{evento.hora && (
						<div>
							// HORA: <span className='text-yellow-400'>{evento.hora} HRS</span>
						</div>
					)}
				</div>

				{/* Botón de compra de entradas full-width responsivo */}
				<div className='pt-2 sm:pt-4 w-full sm:w-auto'>
					<a
						href={evento.url_ticket}
						target='_blank'
						rel='noopener noreferrer'
						className='w-full sm:w-auto text-center inline-block bg-white text-black hover:bg-red-600 hover:text-white font-mono font-black text-xs px-6 py-3.5 uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000000] transition-all duration-100 cursor-pointer'>
						ADQUIRIR ACCESOS EN {evento.ticketera} ➜
					</a>
				</div>
			</div>
		</div>
	);
}
