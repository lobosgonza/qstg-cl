import React from 'react';

export default function MainBanner({ evento }: { evento: any }) {
	if (!evento) return null;

	return (
		<div className='relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden bg-gray-950 shadow-xl mb-10 group'>
			{/* Imagen de Fondo Alargada */}
			<img
				src={evento['Banner URL'] || evento['Imagen URL']}
				alt={evento['Título']}
				className='w-full h-full object-cover object-center opacity-40 group-hover:scale-102 transition-transform duration-700'
			/>
			{/* Degradado para legibilidad del texto */}
			<div className='absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent' />

			{/* Contenido del Banner */}
			<div className='absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-2xl'>
				<span className='w-max bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest mb-3 animate-pulse'>Destacado QSTG</span>
				<h2 className='text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2 tracking-tight drop-shadow-md'>{evento['Título']}</h2>
				<p className='text-xs md:text-sm text-gray-200 font-medium mb-4 line-clamp-2 opacity-90'>{evento['Resumen SEO']}</p>
				<div className='flex items-center gap-4 text-xs font-bold text-white mb-4'>
					<span>📍 {evento['Recinto']}</span>
					<span>📅 {evento['Día Texto']}</span>
				</div>
				<a
					href={`/${evento['Slug']}`}
					className='w-max bg-white text-gray-950 hover:bg-red-600 hover:text-white font-black text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition-colors duration-200 shadow-lg'>
					Ver Detalles / Entradas
				</a>
			</div>
		</div>
	);
}
