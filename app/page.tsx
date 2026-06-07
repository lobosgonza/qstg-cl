'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '../supabaseClient';
import listaEventos from '../eventos.json';
import MainBanner from './components/MainBanner';
import EventCard from './components/EventCard';
import CtaDifusion from './components/CtaDifusion';

export default function HomePage() {
	const [categoriasBD, setCategoriasBD] = useState<any[]>([]);
	const [slugDestacado, setSlugDestacado] = useState<string>(''); // Aquí guardamos el slug de Def Leppard o el que pague

	// 1. Traemos la data directo de tu tabla existente en Supabase
	useEffect(() => {
		async function cargarDatos() {
			const { data } = await supabase.from('categorias_maestras').select('id, nombre_json, slug_url, icono, slug_sponsor').order('id', { ascending: true });

			if (data) {
				setCategoriasBD(data);

				// 🎯 REGLA COMERCIAL:
				// Buscamos la fila cuyo slug_url sea 'home' para extraer el slug_sponsor premium.
				const configHome = data.find((cat) => cat.slug_url === 'home');
				if (configHome?.slug_sponsor) {
					setSlugDestacado(configHome.slug_sponsor);
				}
			}
		}
		cargarDatos();
	}, []);

	// 2. Definimos el evento estrella buscando en tu JSON por el slug_sponsor de Supabase
	const eventoBannerHome = useMemo(() => {
		if (!slugDestacado) return null; // Si no hay sponsor pagado en Supabase, no hay banner destacado.

		// Busca el show exacto que pagó las lucas
		const showPagado = listaEventos.find((e: any) => e.Slug === slugDestacado);
		return showPagado || null; // Si pusiste un slug erróneo, devuelve null para no romper nada
	}, [slugDestacado]);

	// 3. Separamos la data en las filas de la portada (Excluyendo el destacado para que no se repita)
	const filasHome = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite7Dias = new Date();
		limite7Dias.setDate(hoy.getDate() + 14);

		// A. Fila virtual de inminentes
		const eventosProximos = listaEventos
			.filter((e: any) => {
				if (e.Slug === eventoBannerHome?.Slug) return false; // 🚫 Excluye el del banner comercial
				const fechaEv = new Date(e['Fecha Filtro'] || '1970-01-01');
				return fechaEv >= hoy && fechaEv <= limite7Dias;
			})
			.sort((a: any, b: any) => a['Fecha Filtro'].localeCompare(b['Fecha Filtro']));

		// B. Filtrado dinámico por categorías (filtrando las filas normales de la BD)
		const filasCategorias = categoriasBD
			// Filtramos la fila 'home' para que no aparezca abajo como si fuera una categoría de shows vacía
			.filter((cat) => cat.slug_url !== 'home' && cat.nombre_json !== 'HOME')
			.map((cat) => {
				const filtrados = listaEventos
					.filter((e: any) => {
						if (e.Slug === eventoBannerHome?.Slug) return false; // 🚫 Excluye el del banner comercial
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
		<main className='min-h-screen pb-20 font-mono'>
			{/* 1. Banner manual leyendo desde tu columna slug_sponsor */}
			{eventoBannerHome && <MainBanner evento={eventoBannerHome} />}

			{/* 2. Vitrina de Filas Estilo Periódico */}
			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16'>
				{filasHome.map((fila) => (
					<div key={fila.id} className='  last:border-none'>
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
								<EventCard key={evento.Slug} evento={evento} slugLocal={evento.Slug} />
							))}
						</div>
					</div>
				))}

				{/* BLOQUE DE REMATE GLOBAL */}
				<div className=' flex flex-col items-center w-full space-y-6'>
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
