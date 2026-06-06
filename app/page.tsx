'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Conector nativo de la raíz
import listaEventos from '../eventos.json';
import MainBanner from './components/MainBanner';
import FilterBar from './components/FilterBar';
import EventCard from './components/EventCard'; // Asegúrate de importar tu componente de tarjetas

interface HomePageProps {
	cataInicial?: string;
}

export default function HomePage({ cataInicial }: HomePageProps) {
	// 1. ESTADOS DE FILTROS, PAGINACIÓN Y BASE DE DATOS
	const [catSel, setCatSel] = useState(cataInicial || 'TODOS');
	const [busqueda, setBusqueda] = useState('');
	const [categoriasBD, setCategoriasBD] = useState<any[]>([]); // Lista dinámica viva de Supabase

	const [mesSel, setMesSel] = useState('TODOS');
	const [ciudadSel, setCiudadSel] = useState('TODOS');
	const [ordenSel, setOrdenSel] = useState('FECHA');
	const [limiteVisible, setLimiteVisible] = useState(12);

	const MAPEO_MESES: { [key: string]: string } = {
		'01': 'ENERO',
		'02': 'FEBRERO',
		'03': 'MARZO',
		'04': 'ABRIL',
		'05': 'MAYO',
		'06': 'JUNIO',
		'07': 'JULIO',
		'08': 'AGOSTO',
		'09': 'SEPTIEMBRE',
		'10': 'OCTUBRE',
		'11': 'NOVIEMBRE',
		'12': 'DICIEMBRE',
	};

	// 🌟 DESCARGA AUTOMÁTICA DE CATEGORÍAS COMERCIALES DESDE SUPABASE
	useEffect(() => {
		async function cargarCategorias() {
			const { data, error } = await supabase.from('categorias_maestras').select('*').order('id', { ascending: true });

			if (error) {
				console.error('❌ Error cargando categorías de Supabase:', error);
			} else if (data) {
				setCategoriasBD(data); // Guarda las categorías guardadas (incluida FESTIVALES)
			}
		}
		cargarCategorias();
	}, []);

	// 2. EXTRACCIÓN AUTOMÁTICA DE SELECTORES PARA EL FILTERBAR
	const filtrosDisponibles = useMemo(() => {
		const categorias = new Set<string>();
		const meses = new Set<string>();
		const recintos = new Set<string>();
		const ciudades = new Set<string>();

		listaEventos.forEach((evento: any) => {
			if (evento.Categoría) categorias.add(evento.Categoría.toUpperCase());
			if (evento.Ciudad) ciudades.add(evento.Ciudad.toUpperCase());
			if (evento.Recinto && evento.Recinto !== 'POR CONFIRMAR') recintos.add(evento.Recinto.toUpperCase());
			if (evento['Fecha Filtro'] && evento['Fecha Filtro'].includes('-')) {
				const mesDigito = evento['Fecha Filtro'].split('-')[1];
				const mesTexto = MAPEO_MESES[mesDigito];
				if (mesTexto) meses.add(mesTexto);
			}
		});

		const ORDEN_CALENDARIO = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
		const mesesOrdenados = ORDEN_CALENDARIO.filter((mes) => meses.has(mes));
		return {
			categorias: ['TODOS', ...Array.from(categorias).sort()],
			meses: ['TODOS', ...mesesOrdenados],
			recintos: ['TODOS', ...Array.from(recintos).sort()],
			ciudades: ['TODOS', ...Array.from(ciudades).sort()],
		};
	}, []);

	// 🌟 3. SELECCIÓN DINÁMICA DEL BANNER BASADO EN SUPABASE
	const eventoBanner = useMemo(() => {
		// Si no han cargado las categorías todavía, retornamos el primer show por defecto
		if (categoriasBD.length === 0) return listaEventos[0];

		const categoriaBuscada = catSel === 'TODOS' ? 'HOME' : catSel;
		const configCat = categoriasBD.find((c) => c.nombre_json === categoriaBuscada);

		const slugPatrocinado = configCat?.slug_sponsor;
		if (!slugPatrocinado) return listaEventos[0]; // Fallback seguro si no hay sponsor amarrado

		return listaEventos.find((e: any) => e.Slug === slugPatrocinado) || listaEventos[0];
	}, [catSel, categoriasBD]);

	// 4. FILTRADO Y EXCLUSIÓN DEL EVENTO QUE ESTÉ ACTIVO ARRIBA
	const eventosProcesados = useMemo(() => {
		return listaEventos
			.filter((evento: any) => {
				if (evento.Slug === eventoBanner?.Slug) return false;

				const recintoTexto = evento.Recinto || '';
				const texto = `${evento.Título} ${recintoTexto}`.toLowerCase();
				const matchTexto = texto.includes(busqueda.toLowerCase());
				const matchCat = catSel === 'TODOS' || evento.Categoría?.toUpperCase() === catSel;

				let matchMes = mesSel === 'TODOS';
				if (!matchMes && evento['Fecha Filtro'] && evento['Fecha Filtro'].includes('-')) {
					const mesDigito = evento['Fecha Filtro'].split('-')[1];
					matchMes = MAPEO_MESES[mesDigito] === mesSel;
				}

				const lugarRaw = recintoTexto.toUpperCase();
				const matchCiudad = ciudadSel === 'TODOS' || lugarRaw.includes(ciudadSel) || evento.Ciudad?.toUpperCase() === ciudadSel;

				return matchTexto && matchCat && matchMes && matchCiudad;
			})
			.sort((a, b) => {
				if (ordenSel === 'A-Z') return a.Título.localeCompare(b.Título, 'es');
				if (ordenSel === 'Z-A') return b.Título.localeCompare(a.Título, 'es');

				const fechaA = a['Fecha Filtro'] || '1970-01-01';
				const fechaB = b['Fecha Filtro'] || '1970-01-01';
				return fechaB.localeCompare(fechaA);
			});
	}, [busqueda, catSel, mesSel, ciudadSel, ordenSel, eventoBanner]);

	// 5. CORTE PROGRESIVO DE EVENTOS (Slice para mobile scroll/Ver más)
	const eventosVisibles = useMemo(() => {
		return eventosProcesados.slice(0, limiteVisible);
	}, [eventosProcesados, limiteVisible]);

	// Manejo inteligente de filtros y actualización sincronizada de URLs en minúsculas
	const manejarCambioFiltro = (setFiltro: Function, valor: string) => {
		setFiltro(valor);
		setLimiteVisible(12);

		if (setFiltro.name === 'bound setCatSel' || valor === 'TODOS') {
			if (valor === 'TODOS') {
				window.history.pushState({}, '', '/');
			} else {
				const configCat = categoriasBD.find((c) => c.nombre_json === valor);
				const slugUrl =
					configCat?.slug_url ||
					valor
						.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.replace(/\s+/g, '-');

				window.history.pushState({}, '', `/${slugUrl}`);
			}
		}
	};

	return (
		<main className='min-h-screen bg-gray-50 text-gray-900'>
			<header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4'>
				<div className='max-w-7xl mx-auto flex justify-between items-center'>
					<span className='text-xl font-black tracking-tight text-gray-950'>
						QSTG<span className='text-red-600'>.cl</span>
					</span>
					<span className='text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-bold'>CHILE 🇨🇱</span>
				</div>
			</header>

			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6'>
				{/* 1. Banner Principal publicitario */}
				<MainBanner evento={eventoBanner} />

				{/* 🌟 2. NUEVOS BOTONES DE ACCESO DIRECTO DINÁMICOS DESDE SUPABASE */}
				<div className='grid grid-cols-2 sm:grid-cols-5 gap-3'>
					{categoriasBD.map((cat) => {
						const estaActiva = catSel === cat.nombre_json;
						return (
							<button
								key={cat.slug_url}
								onClick={() => {
									setCatSel(cat.nombre_json);
									setLimiteVisible(12);
									window.history.pushState({}, '', `/${cat.slug_url}`);
								}}
								className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-sm font-bold tracking-wide transition-all duration-200 uppercase ${
									estaActiva
										? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-100 scale-[1.02]'
										: 'bg-white border-gray-100 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
								}`}>
								<span className='text-lg'>{cat.icono}</span>
								{cat.nombre_json}
							</button>
						);
					})}
				</div>

				{/* 3. Barra de filtros Avanzados */}
				<FilterBar
					busqueda={busqueda}
					setBusqueda={(v) => manejarCambioFiltro(setBusqueda, v)}
					catSel={catSel}
					setCatSel={(v) => manejarCambioFiltro(setCatSel, v)}
					mesSel={mesSel}
					setMesSel={(v) => manejarCambioFiltro(setMesSel, v)}
					recintoSel='TODOS'
					setRecintoSel={() => {}}
					ciudadSel={ciudadSel}
					setCiudadSel={(v) => manejarCambioFiltro(setCiudadSel, v)}
					ordenSel={ordenSel}
					setOrdenSel={setOrdenSel}
					opciones={filtrosDisponibles}
					total={eventosProcesados.length}
				/>

				{/* 4. Grilla de Tarjetas */}
				{eventosVisibles.length > 0 ? (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{eventosVisibles.map((evento: any, index: number) => (
								<EventCard key={evento.Slug || index} evento={evento} slugLocal={evento.Slug} />
							))}
						</div>

						<div className='mt-12 flex flex-col items-center gap-6'>
							{eventosProcesados.length > limiteVisible && (
								<button
									onClick={() => setLimiteVisible((prev) => prev + 12)}
									className='bg-gray-950 hover:bg-red-600 text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-md transition-colors duration-200 uppercase tracking-wider cursor-pointer'>
									Ver Más Eventos (+12)
								</button>
							)}

							<div className='text-center flex flex-col items-center gap-1'>
								<span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Filtros Avanzados</span>
								<span className='text-xs font-bold text-gray-500'>
									Mostrando {eventosVisibles.length} de {eventosProcesados.length} Panoramas
								</span>
							</div>
						</div>
					</>
				) : (
					<div className='text-center py-20 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm'>
						<span className='text-3xl'>🏜️</span>
						<h3 className='text-base font-bold text-gray-800 mt-2'>No hay resultados para esta combinación</h3>
					</div>
				)}
			</section>
		</main>
	);
}
