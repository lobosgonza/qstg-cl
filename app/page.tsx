'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '../supabaseClient';
import MainBanner from './components/MainBanner';
import EventCard from './components/EventCard';
import CtaDifusion from './components/CtaDifusion';

export default function HomePage() {
	const [categoriasBD, setCategoriasBD] = useState<any[]>([]);
	const [eventosBD, setEventosBD] = useState<any[]>([]); // 1. NUEVO: Estado para los eventos de la DB
	const [slugDestacado, setSlugDestacado] = useState<string>('');

	// 2. Traemos TODA la data viva en paralelo desde Supabase
	useEffect(() => {
		async function cargarDatos() {
			// Fetch de categorías
			const { data: catData } = await supabase.from('categorias_maestras').select('id, nombre_json, slug_url, icono, slug_sponsor').order('id', { ascending: true });

			if (catData) {
				setCategoriasBD(catData);
				const configHome = catData.find((cat) => cat.slug_url === 'home');
				if (configHome?.slug_sponsor) {
					setSlugDestacado(configHome.slug_sponsor);
				}
			}

			// Fetch de los eventos del robot (events_list)
			const { data: eventsData } = await supabase.from('events_list').select('*');

			if (eventsData) {
				setEventosBD(eventsData);
			}
		}
		cargarDatos();
	}, []);

	// 3. Definimos el evento estrella buscando en tu nueva lista de la DB (Cambiamos 'Slug' por 'slug')
	const eventoBannerHome = useMemo(() => {
		if (!slugDestacado || eventosBD.length === 0) return null;
		const showPagado = eventosBD.find((e: any) => e.slug === slugDestacado);
		return showPagado || null;
	}, [slugDestacado, eventosBD]);

	// 4. Separamos la data en las filas de la portada con lógica multifecha para Festivales
	const filasHome = useMemo(() => {
		if (eventosBD.length === 0) return [];

		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite14Dias = new Date();
		limite14Dias.setDate(hoy.getDate() + 14);

		// A. Fila virtual de inminentes (Incluye festivales activos)
		const eventosProximos = eventosBD
			.filter((e: any) => {
				if (e.slug === eventoBannerHome?.slug) return false; // 🚫 Excluye el destacado

				const fechaIn = new Date(e.fecha_inicio || '1970-01-01');
				// Si no tiene fecha_fin, asumimos que dura solo el día de inicio
				const fechaFin = e.fecha_fin ? new Date(e.fecha_fin) : fechaIn;
				fechaFin.setHours(23, 59, 59, 999);

				// 🔥 LÓGICA FESTIVAL: Se muestra si el evento termina hoy o en el futuro,
				// Y SIEMPRE QUE su fecha de inicio no supere el límite de 14 días.
				return fechaFin >= hoy && fechaIn <= limite14Dias;
			})
			.sort((a: any, b: any) => {
				const dateA = new Date(a.fecha_inicio || '1970-01-01');
				const dateB = new Date(b.fecha_inicio || '1970-01-01');
				return dateA.getTime() - dateB.getTime(); // Orden cronológico real
			});

		// B. Filtrado dinámico por categorías mapeado por id numérico
		const filasCategorias = categoriasBD
			.filter((cat) => cat.slug_url !== 'home' && cat.nombre_json !== 'HOME')
			.map((cat) => {
				const filtrados = eventosBD
					.filter((e: any) => {
						if (e.slug === eventoBannerHome?.slug) return false; // 🚫 Excluye el destacado

						const fechaIn = new Date(e.fecha_inicio || '1970-01-01');
						const fechaFin = e.fecha_fin ? new Date(e.fecha_fin) : fechaIn;
						fechaFin.setHours(23, 59, 59, 999);

						// Vinculamos usando el id de categoría que el robot de Juan Pablo inyectará
						const matchCat = Number(e.categoria_id) === Number(cat.id);
						return matchCat && fechaFin >= hoy;
					})
					.sort((a: any, b: any) => {
						const dateA = new Date(a.fecha_inicio || '1970-01-01');
						const dateB = new Date(b.fecha_inicio || '1970-01-01');
						return dateA.getTime() - dateB.getTime();
					});

				return {
					id: cat.id,
					nombre_json: cat.nombre_json,
					slug_url: cat.slug_url,
					eventos: filtrados.slice(0, 4),
					total: filtrados.length,
				};
			})
			.filter((f) => f.total > 0);

		if (eventosProximos.length > 0) {
			const filaVirtual = {
				id: 'virtual-proximos',
				nombre_json: 'PRÓXIMOS 7 DÍAS',
				slug_url: 'proximos',
				eventos: eventosProximos.slice(0, 4),
				total: eventosProximos.length,
			};
			return [filaVirtual, ...filasCategorias];
		}

		return filasCategorias;
	}, [categoriasBD, eventosBD, eventoBannerHome]);

	return (
		<main className='min-h-screen pb-20 font-mono'>
			{/* Banner comercial dinámico de la DB */}
			{eventoBannerHome && <MainBanner evento={eventoBannerHome} />}

			{/* Vitrina de Filas Estilo Periódico */}
			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16'>
				{filasHome.map((fila) => (
					<div key={fila.id} className='last:border-none'>
						<div className='flex justify-between items-end mb-6 border-b border-black/10 pb-3'>
							<div className='flex flex-col gap-1.5'>
								<span className='w-max bg-black text-white text-[8px] font-mono font-black px-2 py-0.5 uppercase tracking-widest border border-black'>
									{fila.id === 'virtual-proximos' ? 'SYS // TRACK_ROW' : `CAT // ${fila.nombre_json.toUpperCase()}`}
								</span>
								<h2 className='font-editorial text-lg sm:text-xl font-black text-gray-950 tracking-tight uppercase mt-1'>
									{fila.id === 'virtual-proximos' ? 'Próximos 7 Días' : `Cartelera de ${fila.nombre_json.replace('EVENTOS DE ', '')}`}
								</h2>
							</div>

							<Link
								href={`/${fila.slug_url}`}
								className='text-[10px] font-mono font-black text-gray-950 hover:bg-red-600 hover:text-white uppercase tracking-wider px-3 py-1.5 border-2 border-black bg-white shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 whitespace-nowrap'>
								INDEX_COMPLETO ➜
							</Link>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{fila.eventos.map((evento: any) => (
								<EventCard key={evento.slug} evento={evento} slugLocal={evento.slug} />
							))}
						</div>
					</div>
				))}

				{/* BLOQUE DE REMATE GLOBAL */}
				<div className='flex flex-col items-center w-full space-y-6'>
					<Link
						href='/todos-los-eventos'
						className='w-full text-center bg-red-600 text-white hover:bg-black font-mono font-black text-xs sm:text-sm px-6 py-5 rounded-none uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer block'>
						VER CARTELERA COMPLETA // ACCESO_TOTAL ➔
					</Link>
					<CtaDifusion />
				</div>
			</section>
		</main>
	);
}
