'use client';

import React from 'react';

export default function MainBanner({ evento }: { evento: any }) {
	if (!evento) return null;

	const titulo = evento['Título'] || 'CONCIERTO DESTACADO';
	const imagen = evento['Imagen URL'] || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000';
	const recinto = evento['Recinto'] || 'POR CONFIRMAR';
	const fechaTexto = evento['Día Texto'] || 'PRÓXIMAMENTE';
	const categoria = evento['Categoría'] || 'DESTACADO';

	return (
		/* 📰 CONTENEDOR MAESTRO: Sin márgenes redondeados, integrado al grid de la app */
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6'>
			{/* 🎨 EL FONDO DOBLE: Dividido en 2 bloques limpios con un marco rígido de tinta */}
			<div className='bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_#000000] grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[340px]'>
				{/* BLOQUE IZQUIERDO (7 de 12 columnas): El fondo de texto editorial */}
				<div className='md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-8 bg-white z-10'>
					{/* Encabezado técnico */}
					<div className='space-y-2'>
						<span className='w-max bg-red-600 text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase tracking-widest border border-red-600 block shadow-[2px_2px_0px_#000]'>
							PANORAMA DESTACADO // {categoria}
						</span>

						{/* Título en la fuente Syne pesada, limpio sin rectángulos flotantes */}
						<h2 className='font-editorial text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tighter leading-tight pt-2'>{titulo}</h2>
					</div>

					{/* Ficha técnica inferior y botón de acción */}
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t-2 border-black font-mono'>
						<div className='text-xs font-bold text-gray-600 uppercase tracking-tight space-y-1'>
							<p className='flex items-center gap-1'>
								<span className='text-red-600 font-black'>HORA //</span> {fechaTexto} {evento.Hora ? `// ${evento.Hora} HRS` : ''}
							</p>
							<p className='flex items-center gap-1'>
								<span className='text-red-600 font-black'>REF //</span> {recinto.split(' - ')[0]} // {evento.Ciudad || 'SCL'}
							</p>
						</div>

						{/* Botón engrapado brutalista */}
						<a
							href={evento['Link Compra'] || '#'}
							target='_blank'
							rel='noopener noreferrer'
							className='w-full sm:w-auto text-center bg-black text-white hover:bg-red-600 hover:text-white font-black text-xs px-6 py-3.5 rounded-none uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#000000] transition-all duration-100 shrink-0'>
							ADQUIRIR PASES ➜
						</a>
					</div>
				</div>

				{/* BLOQUE DERECHO (5 de 12 columnas): El fondo de imagen enmarcado */}
				<div className='md:col-span-5 relative bg-black min-h-[240px] md:min-h-full border-t-2 md:border-t-0 md:border-l-2 border-black group'>
					<img
						src={imagen}
						alt={titulo}
						/* Tratamiento de afiche impreso clásico */
						className='absolute inset-0 w-full h-full object-cover object-center filter  contrast-125 opacity-95 group-hover:filter-none transition-all duration-500'
					/>

					{/* Sello técnico de esquina inferior */}
					<span className='absolute bottom-3 right-3 bg-white text-gray-950 font-mono font-black text-[9px] px-2 py-0.5 uppercase border border-black shadow-[2px_2px_0px_#000]'>
						PRENSA_IMG // 01
					</span>
				</div>
			</div>
		</div>
	);
}
