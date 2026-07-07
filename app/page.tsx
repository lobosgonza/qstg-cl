'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient'; // Conector nativo de la raíz
import MainBanner from './components/MainBanner';
import EventCard from './components/EventCard';

export default function HomePage() {
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

	// 🧠 Buscamos dinámicamente el show destacado (Highlight) configurado para la HOME
	const bannerHome = useMemo(() => {
		const filaHome = categorias.find((c) => c.nombre_json === 'HOME');
		if (filaHome && filaHome.slug_sponsor) {
			const destacado = eventos.find((e: any) => e.slug?.toLowerCase() === filaHome.slug_sponsor.toLowerCase());
			if (destacado) return destacado;
		}
		// Fallback técnico preventivo: si no encuentra el slug, muestra el primer show disponible
		return eventos[0] || null;
	}, [categorias, eventos]);

	// Filtro automatizado para la fila superior de "PRÓXIMOS 7 DÍAS"
	const proximosEventos = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite7Dias = new Date();
		limite7Dias.setDate(hoy.getDate() + 7);
		limite7Dias.setHours(23, 59, 59, 999);

		return eventos.filter((e: any) => {
			if (e.slug === bannerHome?.slug) return false;

			// Forzamos la lectura de la fecha en horario local añadiendo la T de tiempo
			const fechaIn = new Date((e.fecha_inicio || '1970-01-01') + 'T00:00:00');
			const fechaFin = e.fecha_fin ? new Date(e.fecha_fin + 'T23:59:59') : new Date((e.fecha_inicio || '1970-01-01') + 'T23:59:59');

			return fechaFin >= hoy && fechaIn <= limite7Dias;
		});
	}, [eventos, bannerHome]);

	if (cargando) {
		return (
			<div className='min-h-screen bg-white font-mono flex items-center justify-center'>
				<span className='text-xs font-black animate-pulse uppercase tracking-widest bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_#000]'>
					SYS // CARGANDO_PORTADA_PRINCIPAL...
				</span>
			</div>
		);
	}

	return (
		<main className='min-h-screen pb-20 font-mono bg-white'>
			{/* 🚀 EL HERO BANNER CONECTADO A TU DESTACADO DE SUPABASE */}
			{bannerHome && <MainBanner evento={bannerHome} />}

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12'>
				{/* FILA TEMPORAL: PRÓXIMOS 7 DÍAS */}
				<div className='space-y-4'>
					<div className='flex items-center justify-between border-b-2 border-black pb-2'>
						<h2 className='font-editorial text-xl font-black uppercase tracking-tight'>// PRÓXIMOS 7 DÍAS</h2>
					</div>
					{proximosEventos.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{proximosEventos.map((evento) => {
								// 🚀 CRUCE DINÁMICO: Buscamos el nombre de la primera categoría asignada en el maestro
								const primerId = evento.categoria_ids?.[0];
								const catMatch = categorias.find((c) => Number(c.id) === Number(primerId));
								const nombreCategoria = catMatch ? catMatch.nombre_json : 'PANORAMA';

								return <EventCard key={evento.slug} evento={{ ...evento, categoria: nombreCategoria }} slugLocal={evento.slug} />;
							})}
						</div>
					) : (
						<div className='py-6 border border-dashed border-gray-300 text-center'>
							<p className='text-xs text-gray-400 uppercase font-bold tracking-tight'>Cero transmisiones inminentes agendadas para esta semana.</p>
						</div>
					)}
				</div>

				{/* FILAS AUTOMÁTICAS POR CATEGORÍA MAESTRA */}
				{categorias
					.filter((cat) => cat.nombre_json !== 'HOME') // Ignoramos la fila de configuración técnica de la home
					.map((cat) => {
						// Filtramos los eventos cruzando el nuevo arreglo numérico multi-etiqueta
						const eventosDeCat = eventos
							.filter((e) => {
								if (e.slug === bannerHome?.slug) return false; // Evitamos duplicar con el Hero
								return e.categoria_ids?.map(Number).includes(Number(cat.id));
							})
							.slice(0, 4); // Mostramos un preview elegante de máximo 4 tarjetas por sección

						if (eventosDeCat.length === 0) return null; // Si no hay shows vigentes en esta sección, la fila se oculta sola

						return (
							<div key={cat.id} className='space-y-4'>
								<div className='flex items-center justify-between border-b-2 border-black pb-2'>
									<h2 className='font-editorial text-xl font-black uppercase tracking-tight flex items-center gap-2'>
										<span>{cat.icono}</span>
										<span>{cat.nombre_json}</span>
									</h2>
									<a href={`/${cat.slug_url}`} className='text-xs font-black text-gray-400 hover:text-red-600 uppercase tracking-wider transition-colors cursor-pointer'>
										Ver todo ({cat.nombre_json}) →
									</a>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
									{eventosDeCat.map((evento) => (
										/* 🚀 HERENCIA DIRECTA: Como ya estamos dentro de la fila de la categoría, le inyectamos directamente su nombre real */
										<EventCard key={evento.slug} evento={{ ...evento, categoria: cat.nombre_json }} slugLocal={evento.slug} />
									))}
								</div>
							</div>
						);
					})}
			</div>
		</main>
	);
}
