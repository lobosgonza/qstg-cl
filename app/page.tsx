'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient'; // Conector nativo de la raíz
import MainBanner from './components/MainBanner';
import EventCard from './components/EventCard';

export default function HomePage() {
	const router = useRouter();

	const [eventos, setEventos] = useState<any[]>([]);
	const [categorias, setCategorias] = useState<any[]>([]);
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
		async function cargarPortada() {
			// 1. Descargamos todos los eventos vigentes ordenados cronológicamente
			const { data: eventsData } = await supabase.from('events_list').select('*').order('fecha_inicio', { ascending: true });

			// 2. Descargamos el maestro de categorías para armar las filas del periódico
			const { data: catsData } = await supabase.from('categorias_maestras').select('*').order('id', { ascending: true });

			if (eventsData) setEventos(eventsData);
			if (catsData) setCategorias(catsData);
			setCargando(false);
		}
		cargarPortada();
	}, []);

	// 🧠 Buscamos el show destacado (Highlight) configurado para la HOME en Supabase
	const bannerHome = useMemo(() => {
		const filaHome = categorias.find((c) => c.nombre_json === 'HOME');
		if (filaHome && filaHome.slug_sponsor) {
			const destacado = eventos.find((e: any) => e.slug?.toLowerCase() === filaHome.slug_sponsor.toLowerCase());
			if (destacado) return destacado;
		}
		return eventos[0] || null;
	}, [categorias, eventos]);

	// Filtro fijo superior para "PRÓXIMOS 7 DÍAS"
	const proximosEventos = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite7Dias = new Date();
		limite7Dias.setDate(hoy.getDate() + 7);
		limite7Dias.setHours(23, 59, 59, 999);

		return eventos.filter((e: any) => {
			const fechaIn = new Date((e.fecha_inicio || '1970-01-01') + 'T00:00:00');
			const fechaFin = e.fecha_fin ? new Date(e.fecha_fin + 'T23:59:59') : new Date((e.fecha_inicio || '1970-01-01') + 'T23:59:59');

			return fechaFin >= hoy && fechaIn <= limite7Dias;
		});
	}, [eventos]);

	if (cargando) {
		return (
			<div className='min-h-screen bg-white font-mono flex items-center justify-center p-4'>
				<span className='text-[10px] sm:text-xs font-black animate-pulse uppercase tracking-widest bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_#000] text-center'>
					SYS // CARGANDO_PORTADA_SWIPE_ENGINE...
				</span>
			</div>
		);
	}

	return (
		<main className='min-h-screen pb-24 font-mono bg-white overflow-x-hidden'>
			{/* HERO HIGHLIGHT */}
			{bannerHome && <MainBanner evento={bannerHome} />}

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14'>
				{/* 📰 FILA DE PRÓXIMOS 7 DÍAS */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between border-b-2 border-black pb-2'>
						<h2 className='font-editorial text-lg sm:text-xl font-black uppercase tracking-tight'>// PRÓXIMOS 7 DÍAS</h2>
					</div>

					{proximosEventos.length > 0 ? (
						<>
							{/* Contenedor Swipe Horizontal Móvil */}
							<div className='flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
								{proximosEventos.map((evento) => {
									const primerId = evento.categoria_ids?.[0];
									const catMatch = categorias.find((c) => Number(c.id) === Number(primerId));
									return (
										<div key={`prox-${evento.slug}`} className='w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start h-full'>
											<EventCard evento={{ ...evento, categoria: catMatch ? catMatch.nombre_json : 'PANORAMA' }} slugLocal={evento.slug} />
										</div>
									);
								})}
							</div>

							{/* 🚀 NUEVO: Botón de acción para el bloque de próximos eventos */}
							<div className='pt-2'>
								<button
									onClick={() => router.push('/todos-los-eventos')}
									className='w-full text-center bg-white text-gray-950 hover:bg-red-600 hover:text-white font-mono font-black text-xs py-4 rounded-none uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer'>
									Ver Próximos Eventos ➜
								</button>
							</div>
						</>
					) : (
						<div className='py-8 border border-dashed border-gray-300 text-center'>
							<p className='text-xs text-gray-400 uppercase font-bold tracking-tight'>Cero transmisiones inminentes agendadas para esta semana.</p>
						</div>
					)}
				</div>

				{/* 🎪 FILAS AUTOMÁTICAS POR CATEGORÍA MAESTRA */}
				{categorias
					.filter((cat) => cat.nombre_json !== 'HOME')
					.map((cat) => {
						const eventosDeCat = eventos
							.filter((e) => {
								return e.categoria_ids?.map(Number).includes(Number(cat.id));
							})
							.slice(0, 12);

						if (eventosDeCat.length === 0) return null;

						return (
							<div key={`seccion-${cat.id}`} className='space-y-4'>
								<div className='flex items-center justify-between border-b-2 border-black pb-2'>
									<h2 className='font-editorial text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2'>
										<span>{cat.icono}</span>
										<span>{cat.nombre_json}</span>
									</h2>
								</div>

								{/* Contenedor Swipe Horizontal Móvil */}
								<div className='flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
									{eventosDeCat.map((evento) => (
										<div key={`item-${cat.id}-${evento.slug}`} className='w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)] shrink-0 snap-start h-full'>
											<EventCard evento={{ ...evento, categoria: cat.nombre_json }} slugLocal={evento.slug} />
										</div>
									))}
								</div>

								{/* Botón de acceso por sección */}
								<div className='pt-2'>
									<button
										onClick={() => router.push(`/${cat.slug_url}`)}
										className='w-full text-center bg-white text-gray-950 hover:bg-red-600 hover:text-white font-mono font-black text-xs py-4 rounded-none uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer'>
										Ver Todos los Eventos de {cat.nombre_json} ➜
									</button>
								</div>
							</div>
						);
					})}
			</div>
		</main>
	);
}
