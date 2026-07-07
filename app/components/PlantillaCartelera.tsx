'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import FilterBar from '@/app/components/FilterBar';
import EventCard from '@/app/components/EventCard';
import MainBanner from '@/app/components/MainBanner';
import CtaDifusion from '@/app/components/CtaDifusion';

interface PlantillaProps {
	listaEventos: any[];
	titulo: string;
	subtitulo: string;
	tagSistema: string;
	soloInminentes?: boolean; // El interruptor maestro de tiempo
	infoCategoria?: any; // Recibe los datos de Supabase para activar modo sección
}

export default function PlantillaCartelera({ listaEventos, titulo, subtitulo, tagSistema, soloInminentes = false, infoCategoria = null }: PlantillaProps) {
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

	const esCategoria = !!infoCategoria;
	const bannerActivo = esCategoria ? infoCategoria.eventoBanner : listaEventos[0];

	// 1. Motor de Filtrado Cruzado Inteligente adaptado a Supabase (snake_case)
	const eventosProcesados = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite14Dias = new Date();
		limite14Dias.setDate(hoy.getDate() + 14);

		return listaEventos
			.filter((evento: any) => {
				// 1. Excluir el show destacado del banner superior
				if (esCategoria && evento.slug === bannerActivo?.slug) return false;

				const campoFechaIn = evento.fecha_inicio || '1970-01-01';
				const fechaIn = new Date(campoFechaIn);
				// Si no tiene fecha de fin (evento unitario), la fecha de término es la misma de inicio
				const fechaFin = evento.fecha_fin ? new Date(evento.fecha_fin) : new Date(campoFechaIn);
				fechaFin.setHours(23, 59, 59, 999);

				// 2. Control estricto de ventanas de tiempo (Lógica Festival Multifecha)
				if (soloInminentes) {
					const dentroDeRango = fechaFin >= hoy && fechaIn <= limite14Dias;
					if (!dentroDeRango) return false;
				} else {
					if (fechaFin < hoy) return false; // Oculta si el evento ya terminó por completo
				}

				// 3. Filtro interactivo global de la barra (Filtra por Ticketera/Origen de forma provisoria)
				if (!esCategoria) {
					const matchCat = catSel === 'TODOS' || (evento.ticketera || '').toUpperCase().trim() === catSel.toUpperCase().trim();
					if (!matchCat) return false;
				}

				// 4. Filtrado por categoría directa (Ruta app/[categoria])
				if (esCategoria) {
					const matchEstricto = Number(evento.categoria_id) === Number(infoCategoria.id);
					if (!matchEstricto) return false;
				}

				// 5. Filtros Interactivos Secundarios
				// Buscador por texto (Título + Recinto en minúsculas)
				const recintoTexto = evento.recinto || '';
				const textoCompleto = `${evento.titulo} ${recintoTexto}`.toLowerCase();
				if (!textoCompleto.includes(busqueda.toLowerCase())) return false;

				// Selector de Meses
				if (!soloInminentes) {
					let matchMes = mesSel === 'TODOS';
					if (!matchMes && campoFechaIn.includes('-')) {
						const mesDigito = campoFechaIn.split('-')[1];
						matchMes = MAPEO_MESES[mesDigito] === mesSel;
					}
					if (!matchMes) return false;
				}

				// Selector de Ciudad
				const matchCiudad = ciudadSel === 'TODOS' || recintoTexto.toUpperCase().includes(ciudadSel) || evento.ciudad?.toUpperCase() === ciudadSel;
				if (!matchCiudad) return false;

				return true;
			})
			.sort((a: any, b: any) => {
				if (ordenSel === 'A-Z') return (a.titulo || '').localeCompare(b.titulo || '', 'es');
				if (ordenSel === 'Z-A') return (b.titulo || '').localeCompare(a.titulo || '', 'es');

				// CORREGIDO AQUÍ: Orden cronológico estricto apuntando a fecha_inicio en snake_case
				return (a.fecha_inicio || '').localeCompare(b.fecha_inicio || '');
			});
	}, [listaEventos, infoCategoria, bannerActivo, busqueda, catSel, mesSel, ciudadSel, ordenSel, soloInminentes, esCategoria]);

	// 2. Extracción dinámica de filtros adaptativos basados en la data de Supabase
	const filtrosDisponibles = useMemo(() => {
		const meses = new Set<string>();
		const ciudades = new Set<string>();
		const categorias = new Set<string>();

		const conjuntoOrigen = soloInminentes ? eventosProcesados : listaEventos;

		conjuntoOrigen.forEach((evento: any) => {
			if (evento.ciudad) ciudades.add(evento.ciudad.toUpperCase().trim());

			// Extraemos ticketeras como categorías dinámicas provisorias para la barra
			if (!esCategoria && evento.ticketera) {
				categorias.add(evento.ticketera.toUpperCase().trim());
			}

			const campoFechaIn = evento.fecha_inicio;
			if (!soloInminentes && campoFechaIn && campoFechaIn.includes('-')) {
				const mesDigito = campoFechaIn.split('-')[1];
				const mesTexto = MAPEO_MESES[mesDigito];
				if (mesTexto) meses.add(mesTexto);
			}
		});

		const ORDEN_CALENDARIO = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
		const mesesOrdenados = ORDEN_CALENDARIO.filter((mes) => meses.has(mes));

		return {
			categorias: esCategoria ? ['TODOS'] : ['TODOS', ...Array.from(categorias).sort()],
			meses: soloInminentes ? ['TODOS'] : ['TODOS', ...mesesOrdenados],
			recintos: ['TODOS'],
			ciudades: ['TODOS', ...Array.from(ciudades).sort()],
		};
	}, [listaEventos, eventosProcesados, soloInminentes, esCategoria]);

	const eventosVisibles = eventosProcesados.slice(0, limiteVisible);

	return (
		<main className='min-h-screen font-mono'>
			{esCategoria && bannerActivo && <MainBanner evento={bannerActivo} />}

			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'>
				{/* BOTÓN REGRESAR TÉCNICO */}
				<button onClick={() => router.push('/')} className='text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider cursor-pointer'>
					← VOLVER A LA PORTADA PRINCIPAL // QSTG_SYS
				</button>

				{/* ENCABEZADO DE LA CARTELERA ADAPTATIVO */}
				<div className='flex flex-col gap-1 '>
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

				{/* GRILLA DE TARJETAS CORREGIDA */}
				{eventosVisibles.length > 0 ? (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{eventosVisibles.map((evento: any, index: number) => (
								<EventCard key={evento.slug || index} evento={evento} slugLocal={evento.slug} />
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
				<CtaDifusion />
			</section>
		</main>
	);
}
