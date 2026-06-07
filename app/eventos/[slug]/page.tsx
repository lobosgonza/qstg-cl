import React from 'react';
import listaEventos from '../../../eventos.json';
import { notFound } from 'next/navigation';

interface Props {
	params: Promise<{ slug: string }>;
}

export default async function EventoPage({ params }: Props) {
	const { slug } = await params;

	// Búsqueda por coincidencia exacta de Slug
	const evento = listaEventos.find((e: any) => e.Slug?.toLowerCase() === slug?.toLowerCase());

	if (!evento) {
		notFound();
	}

	return (
		<main className='min-h-screen pb-12 font-mono'>
			<div className='max-w-4xl mx-auto px-4 pt-6 space-y-6'>
				{/* ENLACE DE REGRESO BRUTALISTA */}
				<a href='/' className='inline-flex items-center text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider'>
					← VOLVER A LA CARTELERA // QSTG
				</a>

				{/* IMAGEN DEL EVENTO CON MARCO DE IMPRENTA */}
				<div className='relative aspect-video w-full border-2 border-black rounded-none overflow-hidden shadow-[4px_4px_0px_#000000] bg-black'>
					<img
						src={evento['Imagen URL'] || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000'}
						alt={evento['Título']}
						className='w-full h-full object-cover object-center filter  contrast-125 opacity-95 block'
						loading='lazy'
						referrerPolicy='no-referrer'
					/>
					{/* Viñeta de Categoría rígida */}
					<span className='absolute bottom-4 left-4 bg-black text-white text-[10px] font-mono font-black px-3 py-1.5 rounded-none uppercase tracking-widest border border-white shadow-[2px_2px_0px_#000]'>
						{evento['Categoría']}
					</span>
				</div>

				{/* CONTENIDO DE LA FICHA TÉCNICA */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-4'>
					{/* COLUMNA 1 (LATERAL DE COMPRA): MÁXIMO CONTRASTE */}
					<div className='md:col-span-1 order-1 md:order-2'>
						<div className='bg-white border-2 border-black p-6 rounded-none shadow-[4px_4px_0px_#000000] sticky top-24 space-y-4'>
							<div>
								<span className='text-[10px] font-black text-gray-400 uppercase tracking-widest block'>TICKET // VERIFICADO</span>
								<div className='font-editorial text-xl font-black text-gray-950 uppercase tracking-tight mt-1'>{evento.Ticketera} PASS</div>
							</div>

							{/* Datos limpios en texto puro, sin iconos */}
							<div className='space-y-3 text-xs border-t border-gray-100 pt-3 text-gray-600 font-bold uppercase tracking-tight'>
								<p className='leading-normal'>
									<span className='text-red-600 block text-[9px] tracking-widest font-black'>UBICACIÓN //</span>
									<span className='text-gray-950 block mt-0.5'>{evento['Recinto'] || 'POR CONFIRMAR'}</span>
									{evento['Ciudad'] && (
										<span className='text-[10px] text-gray-400 block mt-0.5'>
											{evento['Ciudad']} // {evento['Región']}
										</span>
									)}
								</p>

								<p className='leading-normal'>
									<span className='text-red-600 block text-[9px] tracking-widest font-black'>HORARIO //</span>
									<span className='text-gray-950 block mt-0.5'>{evento['Día Texto'] || 'FECHA POR CONFIRMAR'}</span>
									{evento['Hora'] && <span className='text-[10px] text-gray-400 block mt-0.5'>{evento['Hora']} HRS</span>}
								</p>
							</div>

							{/* Botón de compra tipo pegatina */}
							<a
								href={evento['Link Compra']}
								target='_blank'
								rel='noopener noreferrer'
								className='block w-full text-center bg-white text-gray-950 hover:bg-red-600 hover:text-white font-black py-3.5 rounded-none text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#000000] transition-all duration-100'>
								COMPRAR ENTRADAS ➜
							</a>
						</div>
					</div>

					{/* COLUMNA 2 (PRINCIPAL): TEXTOS EDITORIALES */}
					<div className='md:col-span-2 order-2 md:order-1 space-y-6'>
						{/* Título de la Ficha en fuente Syne */}
						<h1 className='font-editorial text-2xl sm:text-4xl font-black text-gray-950 uppercase tracking-tight leading-none'>{evento['Título']}</h1>

						<div className='bg-white border-2 border-black p-6 rounded-none shadow-[4px_4px_0px_#000000] space-y-6 text-xs text-gray-700 font-medium uppercase tracking-tight'>
							{/* Resumen SEO destacado como bloque de prensa */}
							<div className='bg-gray-50 border-l-4 border-black p-4 rounded-none my-4'>
								<p className='text-xs italic text-gray-800 leading-relaxed font-bold'>"{evento['Resumen SEO'] || 'SIN RESUMEN DISPONIBLE.'}"</p>
							</div>

							<div>
								<h3 className='font-editorial text-sm font-black text-gray-950 mb-2 tracking-tight'>SOBRE EL EVENTO //</h3>
								<p className='text-gray-600 leading-relaxed whitespace-pre-line font-mono text-[11px] font-bold'>
									{evento['Descripción Detallada'] || 'NO SE ENCONTRÓ DESCRIPCIÓN DETALLADA PARA ESTE EVENTO.'}
								</p>
							</div>

							<div className='border-t-2 border-black pt-4'>
								<h3 className='font-editorial text-sm font-black text-gray-950 mb-2 tracking-tight'>INFORMACIÓN IMPORTANTE //</h3>
								<ul className='list-none space-y-1.5 font-mono text-[11px] font-bold text-gray-500'>
									<li>// PRESENTA TU E-TICKET DIRECTAMENTE EN EL ACCESO DESDE TU CELULAR.</li>
									<li>// APERTURA DE PUERTAS: GENERALMENTE 2 HORAS ANTES DEL SHOW.</li>
									<li>// CUIDA TUS PERTENENCIAS DENTRO Y FUERA DEL RECINTO.</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
