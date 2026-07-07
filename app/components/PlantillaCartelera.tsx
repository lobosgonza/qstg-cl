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
	const [catSel, setCatSel] = useState('TODOS');

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

	useEffect(() => {
		async function descargarMaestro() {
			const { data } = await supabase.from('categorias_maestras').select('id, nombre_json, slug_sponsor');
			if (data) setMaestroCategorias(data);
		}
		descargarMaestro();
	}, []);

	const bannerActivo = useMemo(() => {
		if (esCategoria) return infoCategoria.eventoBanner;

		const filaHome = maestroCategorias.find((c) => c.nombre_json === 'HOME');
		if (filaHome && filaHome.slug_sponsor) {
			const showDestacado = listaEventos.find((e: any) => e.slug?.toLowerCase() === filaHome.slug_sponsor.toLowerCase());
			if (showDestacado) return showDestacado;
		}

		return listaEventos[0] || null;
	}, [esCategoria, infoCategoria, maestroCategorias, listaEventos]);

	const mostrarHeroBanner = esCategoria || !tagSistema.includes('ARCHIVO');

	// 2. Motor de Filtrado Cruzado Inteligente
	const eventosProcesados = useMemo(() => {
		const hoy = new Date();
		hoy.setHours(0, 0, 0, 0);

		const limite14Dias = new Date();
		limite14Dias.setDate(hoy.getDate() + 14);

		return listaEventos
			.filter((evento: any) => {
				// 🚀 MODIFICADO: Se eliminó la línea de exclusión. Ahora el show del banner también se lista abajo.

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

				if (!esCategoria && catSel !== 'TODOS') {
					const catEncontrada = maestroCategorias.find((c) => c.nombre_json === catSel);
					if (catEncontrada) {
						const matchCat = evento.categoria_ids?.map(Number).includes(Number(catEncontrada.id));
						if (!matchCat) return false;
					} else {
						return false;
					}
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
	}, [listaEventos, infoCategoria, bannerActivo, busqueda, catSel, mesSel, ciudadSel, ordenSel, soloInminentes, esCategoria, maestroCategorias, mostrarHeroBanner]);

	const filtrosDisponibles = useMemo(() => {
		const meses = new Set<string>();
		const ciudades = new Set<string>();
		const categoriasVisibles = new Set<string>();

		const conjuntoOrigen = soloInminentes ? eventosProcesados : listaEventos;

		conjuntoOrigen.forEach((evento: any) => {
			if (evento.ciudad) ciudades.add(evento.ciudad.toUpperCase().trim());

			if (!esCategoria && evento.categoria_ids && maestroCategorias.length > 0) {
				evento.categoria_ids.forEach((id: number) => {
					const cObj = maestroCategorias.find((c) => Number(c.id) === Number(id));
					if (cObj && cObj.nombre_json !== 'HOME') {
						categoriasVisibles.add(cObj.nombre_json.toUpperCase().trim());
					}
				});
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
			categorias: esCategoria ? ['TODOS'] : ['TODOS', ...Array.from(categoriasVisibles).sort()],
			meses: soloInminentes ? ['TODOS'] : ['TODOS', ...mesesOrdenados],
			recintos: ['TODOS'],
			ciudades: ['TODOS', ...Array.from(ciudades).sort()],
		};
	}, [listaEventos, eventosProcesados, soloInminentes, esCategoria, maestroCategorias]);

	const eventosVisibles = eventosProcesados.slice(0, limiteVisible);

	return (
		<main className='min-h-screen font-mono bg-white'>
			{mostrarHeroBanner && bannerActivo && <MainBanner evento={bannerActivo} />}

			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'>
				<button onClick={() => router.push('/')} className='text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider cursor-pointer'>
					← VOLVER A LA PORTADA PRINCIPAL // QSTG_SYS
				</button>

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

				{eventosVisibles.length > 0 ? (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{eventosVisibles.map((evento: any, index: number) => {
								const primerId = evento.categoria_ids?.[0];
								const catMatch = maestroCategorias.find((c) => Number(c.id) === Number(primerId));
								const nombreCategoria = catMatch ? catMatch.nombre_json : 'PANORAMA';

								return <EventCard key={evento.slug || index} evento={{ ...evento, categoria: nombreCategoria }} slugLocal={evento.slug} />;
							})}
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
						<h3 className='font-editorial text-base font-black text-gray-900 uppercase tracking-tight'>Cero COINCIDENCIAS en el registro</h3>
						<p className='font-mono text-xs text-gray-400 mt-1 uppercase tracking-tight'>Ningún panorama vigente coincide con los parámetros de esta sección.</p>
					</div>
				)}
				<CtaDifusion />
			</section>
		</main>
	);
}
