'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import FilterBar from '@/app/components/FilterBar';
import EventCard from '@/app/components/EventCard';
import MainBanner from '@/app/components/MainBanner';

interface PlantillaProps {
	listaEventos: any[];
	titulo: string;
	subtitulo: string;
	tagSistema: string;
	soloInminentes?: boolean; // El interruptor maestro de tiempo
	infoCategoria?: any; // 🚀 ADICIÓN CRUCIAL: Recibe los datos de Supabase para activar modo sección
}

export default function PlantillaCartelera({
	listaEventos,
	titulo,
	subtitulo,
	tagSistema,
	soloInminentes = false,
	infoCategoria = null, // Por defecto es null (Modo Cartelera Global)
}: PlantillaProps) {
	const router = useRouter();

	const [busqueda, setBusqueda] = useState('');
	const [mesSel, setMesSel] = useState('TODOS');
	const [ciudadSel, setCiudadSel] = useState('TODOS');
	const [ordenSel, setOrdenSel] = useState('FECHA');
	const [limiteVisible, setLimiteVisible] = useState(12);
	const [catSel, setCatSel] = useState('TODOS');

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

	// Determinamos de forma limpia el estado operativo del componente
	const esCategoria = !!infoCategoria;
	const bannerActivo = esCategoria ? infoCategoria.eventoBanner : listaEventos[0];

	// 1. Motor de Filtrado Cruzado Inteligente
	const eventosProcesados = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite14Dias = new Date();
		limite14Dias.setDate(hoy.getDate() + 14);

		return listaEventos
			.filter((evento: any) => {
				// 1. Excluir el show destacado del banner superior si aplica
				if (esCategoria && evento.Slug === bannerActivo?.Slug) return false;

				const campoFecha = evento['Fecha Filtro'] || '1970-01-01';
				const fechaEvento = new Date(campoFecha);

				// 2. Control estricto de ventanas de tiempo iniciales según la ruta activa
				if (soloInminentes) {
					const dentroDeRango = fechaEvento >= hoy && fechaEvento <= limite14Dias;
					if (!dentroDeRango) return false;
				} else {
					if (fechaEvento < hoy) return false; // Filtro base: no mostrar eventos pasados
				}

				// 3. Filtro interactivo de categorías en barra global
				if (!esCategoria) {
					const matchCat = catSel === 'TODOS' || (evento.Categoría || '').toUpperCase().trim() === catSel.toUpperCase().trim();
					if (!matchCat) return false;
				}

				// 4. FILTRADO POR CATEGORÍA DIRECTA (Si venimos de la ruta app/[categoria])
				if (esCategoria) {
					const catEvento = (evento.Categoría || '').toUpperCase().trim();
					const catBD = (infoCategoria.nombre_json || '').toUpperCase().trim();
					const catBDLimpia = catBD.replace('EVENTOS DE ', '').trim();

					const matchEstricto = catEvento === catBD || catEvento === catBDLimpia || catBD.includes(catEvento);
					if (!matchEstricto) return false;
				}

				// 5. FILTROS INTERACTIVOS SECUNDARIOS (Habilitados para listas globales e inminentes)
				// Filtro A: Buscador por texto (Título + Recinto)
				const recintoTexto = evento.Recinto || '';
				const textoCompleto = `${evento.Título} ${recintoTexto}`.toLowerCase();
				if (!textoCompleto.includes(busqueda.toLowerCase())) return false;

				// Filtro B: Selector de Meses (Activo siempre que NO sea la vista de inminentes)
				if (!soloInminentes) {
					let matchMes = mesSel === 'TODOS';
					if (!matchMes && campoFecha.includes('-')) {
						const mesDigito = campoFecha.split('-')[1];
						matchMes = MAPEO_MESES[mesDigito] === mesSel;
					}
					if (!matchMes) return false;
				}

				// Filtro C: Selector de Ciudad (Habilitado global)
				const matchCiudad = ciudadSel === 'TODOS' || recintoTexto.toUpperCase().includes(ciudadSel) || evento.Ciudad?.toUpperCase() === ciudadSel;
				if (!matchCiudad) return false;

				return true;
			})
			.sort((a: any, b: any) => {
				// Permitir ordenamiento personalizado por A-Z en listados
				if (ordenSel === 'A-Z') return a.Título.localeCompare(b.Título, 'es');
				if (ordenSel === 'Z-A') return b.Título.localeCompare(a.Título, 'es');

				// Orden cronológico por defecto
				return a['Fecha Filtro'].localeCompare(b['Fecha Filtro']);
			});
	}, [listaEventos, infoCategoria, bannerActivo, busqueda, catSel, mesSel, ciudadSel, ordenSel, soloInminentes, esCategoria]);

	// 2. Extracción dinámica de filtros disponibles adaptativos (¡REPARADO AQUÍ!)
	const filtrosDisponibles = useMemo(() => {
		const meses = new Set<string>();
		const ciudades = new Set<string>();
		const categorias = new Set<string>(); // 🚀 Se agrega el recolector de categorías del JSON

		const conjuntoOrigen = soloInminentes ? eventosProcesados : listaEventos;

		conjuntoOrigen.forEach((evento: any) => {
			if (evento.Ciudad) ciudades.add(evento.Ciudad.toUpperCase().trim());

			// 🚀 Extraer categorías para el FilterBar interactivo
			if (!esCategoria && evento.Categoría) {
				categorias.add(evento.Categoría.toUpperCase().trim());
			}

			const campoFecha = evento['Fecha Filtro'];
			if (!soloInminentes && campoFecha && campoFecha.includes('-')) {
				const mesDigito = campoFecha.split('-')[1];
				const mesTexto = MAPEO_MESES[mesDigito];
				if (mesTexto) meses.add(mesTexto);
			}
		});

		const ORDEN_CALENDARIO = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
		const mesesOrdenados = ORDEN_CALENDARIO.filter((mes) => meses.has(mes));

		return {
			// 🚀 Si es ruta de categoría se bloquea, si es global inyecta los elementos únicos ordenados
			categorias: esCategoria ? ['TODOS'] : ['TODOS', ...Array.from(categorias).sort()],
			meses: soloInminentes ? ['TODOS'] : ['TODOS', ...mesesOrdenados],
			recintos: ['TODOS'],
			ciudades: ['TODOS', ...Array.from(ciudades).sort()],
		};
	}, [listaEventos, eventosProcesados, soloInminentes, esCategoria]);

	const eventosVisibles = eventosProcesados.slice(0, limiteVisible);

	return (
		<main className='min-h-screen pb-20 font-mono'>
			{/* 🚀 El banner con doble fondo SÓLO se renderiza en las páginas de categorías dinámicas */}
			{esCategoria && bannerActivo && <MainBanner evento={bannerActivo} />}

			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'>
				{/* BOTÓN REGRESAR TÉCNICO */}
				<button onClick={() => router.push('/')} className='text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider cursor-pointer'>
					← VOLVER A LA PORTADA PRINCIPAL // QSTG_SYS
				</button>

				{/* ENCABEZADO DE LA CARTELERA ADAPTATIVO */}
				<div className='flex flex-col gap-1 border-b-2 border-black pb-6'>
					<span className='w-max bg-black text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase tracking-widest border border-black'>
						{esCategoria ? `SECCIÓN // ${infoCategoria.nombre_json.toUpperCase()}` : tagSistema}
					</span>
					<h1 className='font-editorial text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight mt-2 leading-none'>
						{esCategoria ? `Todos los panoramas de ${infoCategoria.nombre_json.replace('EVENTOS DE ', '')}` : titulo}
					</h1>
					<p className='text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-2 max-w-2xl'>
						{esCategoria ? `Mostrando la cartelera filtrada e indexada para la sección cultural elegida.` : subtitulo}
					</p>
				</div>

				{/* BARRA DE FILTROS */}
				{!esCategoria && (
					<FilterBar
						busqueda={busqueda}
						setBusqueda={(v) => {
							setBusqueda(v);
							setLimiteVisible(12);
						}}
						catSel={catSel}
						setCatSel={(v) => {
							setCatSel(v);
							setLimiteVisible(12);
						}}
						mesSel={soloInminentes ? 'TODOS' : mesSel}
						setMesSel={
							soloInminentes
								? () => {}
								: (v) => {
										setMesSel(v);
										setLimiteVisible(12);
									}
						}
						recintoSel='TODOS'
						setRecintoSel={() => {}}
						ciudadSel={ciudadSel}
						setCiudadSel={(v) => {
							setCiudadSel(v);
							setLimiteVisible(12);
						}}
						ordenSel={ordenSel}
						setOrdenSel={setOrdenSel}
						opciones={filtrosDisponibles}
						total={eventosProcesados.length}
					/>
				)}

				{/* GRILLA DE TARJETAS */}
				{eventosVisibles.length > 0 ? (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{eventosVisibles.map((evento: any, index: number) => (
								<EventCard key={evento.Slug || index} evento={evento} slugLocal={evento.Slug} />
							))}
						</div>

						{eventosProcesados.length > limiteVisible && (
							<div className='mt-12 flex justify-center'>
								<button
									onClick={() => setLimiteVisible((prev) => prev + 12)}
									className='bg-white text-gray-950 hover:bg-red-600 hover:text-white font-mono font-black text-xs px-8 py-4 rounded-none uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000000] transition-all duration-100 cursor-pointer'>
									Cargar más eventos (+12)
								</button>
							</div>
						)}
					</>
				) : (
					<div className='text-center py-20 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_#000000] p-8'>
						<h3 className='font-editorial text-base font-black text-gray-900 uppercase tracking-tight'>Cero coincidencias en el registro</h3>
						<p className='font-mono text-xs text-gray-400 mt-1 uppercase tracking-tight'>Ningún panorama vigente coincide con los parámetros de esta sección.</p>
					</div>
				)}
			</section>
		</main>
	);
}
