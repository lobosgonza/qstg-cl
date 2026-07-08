'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient'; // Conector relativo
import FilterBar from '@/app/components/FilterBar';
import EventCard from '@/app/components/EventCard';
import MainBanner from '@/app/components/MainBanner';
import CtaDifusion from '@/app/components/CtaDifusion';

interface PlantillaProps {
	listaEventos: any[];
	titulo: string;
	subtitulo: string;
	tagSistema: string;
	soloInminentes?: boolean;
	infoCategoria?: any;
}

export default function PlantillaCartelera({ listaEventos, titulo, subtitulo, tagSistema, soloInminentes = false, infoCategoria = null }: PlantillaProps) {
	const router = useRouter();

	const [busqueda, setBusqueda] = useState('');
	const [mesSel, setMesSel] = useState('TODOS');
	const [ciudadSel, setCiudadSel] = useState('TODOS');
	const [ordenSel, setOrdenSel] = useState('FECHA');
	const [limiteVisible, setLimiteVisible] = useState(12);

	const [maestroCategorias, setMaestroCategorias] = useState<any[]>([]);

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

	// 🚀 IMPORTANTE: Recuerda sincronizar este arreglo con los slugs exactos que dejes en tu BD (ej: si cambias 'futbol' por 'deportes')
	const SLUGS_PERMITIDOS = ['musica', 'electronica', 'teatro', 'deportes'];

	useEffect(() => {
		async function descargarMaestro() {
			const { data } = await supabase.from('categorias_maestras').select('id, nombre_json, slug_url, icono');
			if (data) {
				// Filtramos para conservar únicamente los slugs aprobados por diseño
				const filtradas = data.filter((c) => SLUGS_PERMITIDOS.includes(c.slug_url?.toLowerCase()));
				// Ordenamos los elementos basándonos estrictamente en la posición de nuestro array de control
				const ordenadas = filtradas.sort((a, b) => SLUGS_PERMITIDOS.indexOf(a.slug_url?.toLowerCase()) - SLUGS_PERMITIDOS.indexOf(b.slug_url?.toLowerCase()));
				setMaestroCategorias(ordenadas);
			}
		}
		descargarMaestro();
	}, []);

	// Motor de Filtrado Cruzado Inteligente
	const eventosProcesados = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite14Dias = new Date();
		limite14Dias.setDate(hoy.getDate() + 14);

		return listaEventos
			.filter((evento: any) => {
				const campoFechaIn = evento.fecha_inicio || '1970-01-01';
				const fechaIn = new Date(campoFechaIn);
				const fechaFin = evento.fecha_fin ? new Date(evento.fecha_fin) : new Date(campoFechaIn);
				fechaFin.setHours(23, 59, 59, 999);

				if (soloInminentes) {
					const dentroDeRango = fechaFin >= hoy && fechaIn <= limite14Dias;
					if (!dentroDeRango) return false;
				} else {
					if (fechaFin < hoy) return false;
				}

				if (esCategoria) {
					const matchEstricto = evento.categoria_ids?.map(Number).includes(Number(infoCategoria.id));
					if (!matchEstricto) return false;
				}

				const recintoTexto = evento.recinto || '';
				const textoCompleto = `${evento.titulo} ${recintoTexto}`.toLowerCase();
				if (!textoCompleto.includes(busqueda.toLowerCase())) return false;

				if (!soloInminentes) {
					let matchMes = mesSel === 'TODOS';
					if (!matchMes && campoFechaIn.includes('-')) {
						const mesDigito = campoFechaIn.split('-')[1];
						matchMes = MAPEO_MESES[mesDigito] === mesSel;
					}
					if (!matchMes) return false;
				}

				const matchCiudad = ciudadSel === 'TODOS' || recintoTexto.toUpperCase().includes(ciudadSel) || evento.ciudad?.toUpperCase() === ciudadSel;
				if (!matchCiudad) return false;

				return true;
			})
			.sort((a: any, b: any) => {
				if (ordenSel === 'A-Z') return (a.titulo || '').localeCompare(b.titulo || '', 'es');
				if (ordenSel === 'Z-A') return (b.titulo || '').localeCompare(a.titulo || '', 'es');
				return (a.fecha_inicio || '').localeCompare(b.fecha_inicio || '');
			});
	}, [listaEventos, infoCategoria, bannerActivo, busqueda, mesSel, ciudadSel, ordenSel, soloInminentes, esCategoria]);

	// Extracción dinámica de filtros adaptativos
	const filtrosDisponibles = useMemo(() => {
		const meses = new Set<string>();
		const ciudades = new Set<string>();

		const conjuntoOrigen = esCategoria
			? listaEventos.filter((e) => e.categoria_ids?.map(Number).includes(Number(infoCategoria.id)))
			: soloInminentes
				? eventosProcesados
				: listaEventos;

		conjuntoOrigen.forEach((evento: any) => {
			if (evento.ciudad) ciudades.add(evento.ciudad.toUpperCase().trim());

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
			meses: soloInminentes ? ['TODOS'] : ['TODOS', ...mesesOrdenados],
			recintos: ['TODOS'],
			ciudades: ['TODOS', ...Array.from(ciudades).sort()],
		};
	}, [listaEventos, eventosProcesados, soloInminentes, esCategoria, infoCategoria]);

	const eventosVisibles = eventosProcesados.slice(0, limiteVisible);

	return (
		<main className='min-h-screen font-mono bg-white overflow-x-hidden pb-16 sm:pb-0'>
			{esCategoria && bannerActivo && <MainBanner evento={bannerActivo} />}

			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8'>
				<button
					onClick={() => router.push('/')}
					className='text-[10px] sm:text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider cursor-pointer'>
					← VOLVER A LA PORTADA PRINCIPAL // QSTG_SYS
				</button>

				{/* ENCABEZADO DE LA CARTELERA */}
				<div className='flex flex-col gap-1 '>
					<span className='w-max bg-black text-white text-[8px] sm:text-[9px] font-mono font-black px-2 py-0.5 sm:py-1 uppercase tracking-widest border border-black'>
						{esCategoria ? `SECCIÓN // ${infoCategoria.nombre_json?.toUpperCase()}` : tagSistema}
					</span>
					<h1 className='font-editorial text-xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight mt-1 leading-none'>
						{esCategoria ? `Todos los panoramas de ${infoCategoria.nombre_json?.toUpperCase().replace('EVENTOS DE ', '')}` : titulo}
					</h1>
					<p className='text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-1 max-w-2xl leading-tight'>{subtitulo}</p>
				</div>

				{/* BARRA UNIFICADA */}
				<FilterBar
					busqueda={busqueda}
					setBusqueda={(v) => {
						setBusqueda(v);
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

				{eventosVisibles.length > 0 ? (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
							{eventosVisibles.map((evento: any, index: number) => {
								const primerId = evento.categoria_ids?.[0];
								const catObj = maestroCategorias.find((c) => Number(c.id) === Number(primerId));

								return <EventCard key={evento.slug || index} evento={{ ...evento, categoria: catObj ? catObj.nombre_json : 'PANORAMA' }} slugLocal={evento.slug} />;
							})}
						</div>

						{eventosProcesados.length > limiteVisible && (
							<div className='mt-8 sm:mt-12 flex justify-center'>
								<button
									onClick={() => setLimiteVisible((prev) => prev + 12)}
									className='w-full sm:w-auto bg-white text-gray-950 hover:bg-red-600 hover:text-white font-mono font-black text-xs px-8 py-4 rounded-none uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all duration-100 cursor-pointer'>
									Cargar más eventos (+12)
								</button>
							</div>
						)}
					</>
				) : (
					<div className='text-center py-12 sm:py-20 bg-white border-2 border-black rounded-none shadow-[4px_4px_0px_#000000] p-6 sm:p-8'>
						<h3 className='font-editorial text-sm sm:text-base font-black text-gray-900 uppercase tracking-tight'>Cero coincidencias en el registro</h3>
						<p className='font-mono text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-tight'>Ningún panorama vigente coincide con los parámetros de esta sección.</p>
					</div>
				)}

				{/* 🚀 SHORTCUTS CON ENRUTAMIENTO DIRECTO SIN TRADUCCIONES MANUALES */}
				<div className='space-y-4 bg-white border-2 border-black p-4 sm:p-5 rounded-none shadow-[4px_4px_0px_#000000] pt-4 mt-6'>
					<div className='flex flex-col gap-0.5'>
						<span className='w-max bg-black text-white text-[8px] sm:text-[9px] font-mono font-black px-2 py-0.5 uppercase tracking-widest'>// NAVEGACIÓN_RÁPIDA</span>
					</div>

					<div className='flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory'>
						{/* Botón Maestro: VER TODO */}
						<button
							onClick={() => router.push('/todos-los-eventos')}
							className={`snap-start shrink-0 font-mono text-[11px] font-black px-4 py-3 tracking-tight uppercase border-2 border-black transition-all cursor-pointer ${
								tagSistema.includes('GLOBAL') || (!esCategoria && !soloInminentes)
									? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5'
									: 'bg-white text-black shadow-[3px_3px_0px_#000000] hover:bg-gray-50'
							}`}>
							📦 VER TODO
						</button>

						{/* Mapeo limpio directo desde Supabase */}
						{maestroCategorias.map((cat) => {
							const estaActiva = esCategoria && String(infoCategoria.id) === String(cat.id);

							return (
								<button
									key={`atajo-cat-${cat.id}`}
									onClick={() => router.push(`/${cat.slug_url}`)}
									className={`snap-start shrink-0 font-mono text-[11px] font-black px-4 py-3 tracking-tight uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-2 ${
										estaActiva ? 'bg-black text-white shadow-none translate-x-0.5 translate-y-0.5' : 'bg-white text-black shadow-[3px_3px_0px_#000000] hover:bg-gray-50'
									}`}>
									<span>{cat.icono || '⚡'}</span>
									<span>{cat.nombre_json}</span>
								</button>
							);
						})}
					</div>
				</div>

				<CtaDifusion />
			</section>
		</main>
	);
}
