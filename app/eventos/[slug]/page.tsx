import React from 'react';
import listaEventos from '../../../eventos.json';
import { notFound } from 'next/navigation';

interface Props {
	params: Promise<{ slug: string }>; // Cambiado de id: string a slug: string
}

export default async function EventoPage({ params }: Props) {
	const { slug } = await params;

	// Buscamos el evento cuyo Slug coincida exactamente con el de la URL
	// Usamos .toLowerCase() en ambos lados por si acaso para evitar caídas por una mayúscula
	const evento = listaEventos.find((e: any) => e.Slug?.toLowerCase() === slug?.toLowerCase());

	if (!evento) {
		notFound();
	}

	return (
		<main className='min-h-screen bg-gray-50 text-gray-900 pb-12'>
			<div className='max-w-4xl mx-auto px-4 pt-6'>
				<a href='/' className='inline-flex items-center text-xs font-bold text-gray-500 hover:text-red-600 mb-6 transition-colors'>
					⬅️ VOLVER A LA CARTELERA
				</a>

				{/* Imagen del Evento */}
				<div className='relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-gray-900'>
					{/* 🌟 BLINDAJE APLICADO ACÁ: Fallback, object-center y no-referrer integrados */}
					<img
						src={evento['Imagen URL'] || 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000'}
						alt={evento['Título']}
						className='w-full h-full object-cover object-center opacity-90 block'
						loading='lazy'
						referrerPolicy='no-referrer'
					/>
					<span className='absolute bottom-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider'>{evento['Categoría']}</span>
				</div>

				{/* Contenido Dinámico */}
				<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-8'>
					{/* Bloque Fijo Lateral de Información */}
					<div className='md:col-span-1 order-1 md:order-2'>
						<div className='bg-white border border-gray-100 p-6 rounded-2xl shadow-sm sticky top-24'>
							<p className='text-[11px] font-black text-gray-400 uppercase tracking-wider'>TICKET VERIFICADO</p>
							<div className='text-2xl font-black text-gray-950 mt-1'>QSTG Pass</div>

							<div className='mt-4 space-y-3 text-sm text-gray-600'>
								<p>
									📍 <span className='font-semibold text-gray-900'>{evento['Lugar/Recinto']}</span>
								</p>
								<p>
									📅 <span className='font-semibold text-gray-900'>{evento['Fecha Evento']}</span>
								</p>
							</div>

							<a
								href={evento['Link Compra']}
								target='_blank'
								rel='noopener noreferrer'
								className='block w-full mt-6 text-center bg-red-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-gray-950 transition-colors duration-200 shadow-md shadow-red-600/20'>
								Comprar Entradas
							</a>
						</div>
					</div>

					{/* Textos que cambian según el evento pinchado */}
					<div className='md:col-span-2 order-2 md:order-1 space-y-6'>
						<h1 className='text-2xl sm:text-4xl font-black text-gray-950 leading-tight'>{evento['Título']}</h1>

						<div className='prose prose-gray bg-white border border-gray-100 p-6 rounded-2xl shadow-sm'>
							{/* MODIFICACIÓN 1: Pintamos el Resumen SEO extraído de la metadata */}
							<div className='bg-gray-50 border-l-4 border-red-500 p-4 rounded-r-xl my-4'>
								<p className='text-sm italic text-gray-700 font-medium'>{evento['Resumen SEO'] || 'Sin resumen disponible.'}</p>
							</div>

							<h3 className='text-lg font-bold text-gray-900 mt-6 mb-2'>Sobre el evento</h3>

							{/* MODIFICACIÓN 2: Pintamos la Descripción Detallada del cuerpo */}
							<p className='text-sm text-gray-600 leading-relaxed whitespace-pre-line'>
								{evento['Descripción Detallada'] || 'No se encontró descripción detallada para este evento.'}
							</p>

							<h3 className='text-lg font-bold text-gray-900 mt-6 mb-2'>Información Importante</h3>
							<ul className='list-disc list-inside text-sm text-gray-600 space-y-1'>
								<li>Presenta tu e-ticket directamente en el acceso desde tu celular.</li>
								<li>Apertura de puertas: Generalmente 2 horas antes del show.</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
