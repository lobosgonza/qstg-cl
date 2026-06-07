'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '../supabaseClient';
import listaEventos from '../eventos.json';
import MainBanner from './components/MainBanner';
import EventCard from './components/EventCard';

export default function HomePage() {
	const [categoriasBD, setCategoriasBD] = useState<any[]>([]);

	// Traemos las categorías vivas de Supabase
	useEffect(() => {
		async function cargarCategorias() {
			const { data } = await supabase.from('categorias_maestras').select('*').order('id', { ascending: true });
			if (data) setCategoriasBD(data);
		}
		cargarCategorias();
	}, []);

	// Definimos el evento estrella para el Banner del Home
	const eventoBannerHome = useMemo(() => listaEventos[0], []);

	// Separamos la data en filas cronológicas vigentes
	const filasHome = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		// 1. Cálculo para la fila virtual de los próximos 14 días
		const limite7Dias = new Date();
		limite7Dias.setDate(hoy.getDate() + 14);

		const eventosProximos = listaEventos
			.filter((e: any) => {
				if (e.Slug === eventoBannerHome?.Slug) return false;
				const fechaEv = new Date(e['Fecha Filtro'] || '1970-01-01');
				return fechaEv >= hoy && fechaEv <= limite7Dias;
			})
			.sort((a: any, b: any) => a['Fecha Filtro'].localeCompare(b['Fecha Filtro']));

		// 2. Mapeamos las categorías normales desde la BD
		const filasCategorias = categoriasBD
			.map((cat) => {
				const filtrados = listaEventos
					.filter((e: any) => {
						if (e.Slug === eventoBannerHome?.Slug) return false;
						const fecha = new Date(e['Fecha Filtro'] || '1970-01-01');
						const matchCat = e.Categoría?.toUpperCase() === cat.nombre_json.toUpperCase();
						return matchCat && fecha >= hoy;
					})
					.sort((a: any, b: any) => a['Fecha Filtro'].localeCompare(b['Fecha Filtro']));

				return {
					id: cat.id,
					nombre_json: cat.nombre_json,
					slug_url: cat.slug_url,
					eventos: filtrados.slice(0, 4),
					total: filtrados.length,
				};
			})
			.filter((f) => f.total > 0);

		// 3. Inyección de la fila virtual de inminentes si contiene registros
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
	}, [categoriasBD, eventoBannerHome]);

	return (
		/* 📰 CONTENEDOR MÁSTER: Fuente monoespaciada base, sin fondos opacos */
		<main className='min-h-screen pb-20 font-mono'>
			{/* 1. El Main Banner unificado arriba */}
			<MainBanner evento={eventoBannerHome} />

			{/* 2. Vitrina de Filas Estilo Periódico o Fanzine */}
			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16'>
				{filasHome.map((fila) => (
					<div key={fila.id} className='border-b-2 border-black pb-12 last:border-none'>
						{/* ENCABEZADO DE FILA: Tratamiento técnico de bloque sólido */}
						<div className='flex justify-between items-end mb-6 border-b border-black/10 pb-3'>
							<div className='flex flex-col gap-1.5'>
								{/* Identificador de bloque de datos */}
								<span className='w-max bg-black text-white text-[8px] font-mono font-black px-2 py-0.5 uppercase tracking-widest border border-black'>
									{fila.id === 'virtual-proximos' ? 'SYS // TRACK_ROW' : `CAT // ${fila.nombre_json.toUpperCase()}`}
								</span>

								{/* Título de sección en tipografía de imprenta Syne */}
								<h2 className='font-editorial text-lg sm:text-xl font-black text-gray-950 tracking-tight uppercase mt-1'>
									{fila.id === 'virtual-proximos' ? 'Próximos 7 Días' : `Cartelera de ${fila.nombre_json.replace('EVENTOS DE ', '')}`}
								</h2>
							</div>

							{/* ENLACE DE NAVEGACIÓN ENMARCADO COMO STICKER */}
							<Link
								href={`/${fila.slug_url}`}
								className='text-[10px] font-mono font-black text-gray-950 hover:bg-red-600 hover:text-white uppercase tracking-wider px-3 py-1.5 border-2 border-black bg-white shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 whitespace-nowrap'>
								INDEX_COMPLETO ➜
							</Link>
						</div>

						{/* Grilla Brutalista de Tarjetas (4 por fila en desktop) */}
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{fila.eventos.map((evento: any) => (
								<EventCard key={evento.Slug} evento={evento} slugLocal={evento.Slug} />
							))}
						</div>
					</div>
				))}
			</section>
		</main>
	);
}
