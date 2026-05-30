'use client';

import React, { useState, useMemo } from 'react';
import listaEventos from '../eventos.json';
import EventCard from './components/EventCard';
import FilterBar from './components/FilterBar';

export default function HomePage() {
	// 1. ESTADOS PARA CADA FILTRO
	const [busqueda, setBusqueda] = useState('');
	const [catSel, setCatSel] = useState('TODOS');
	const [mesSel, setMesSel] = useState('TODOS');
	const [recintoSel, setRecintoSel] = useState('TODOS');
	const [ciudadSel, setCiudadSel] = useState('TODOS');

	// NUEVOS ESTADOS: ORDEN Y PAGINACIÓN
	const [ordenSel, setOrdenSel] = useState('FECHA'); // 'FECHA', 'A-Z', 'Z-A'
	const [limiteVisible, setLimiteVisible] = useState(12); // Bloques de 12 eventos

	// Mapeo auxiliar para traducir los meses
	const NOMBRES_MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

	// 2. EXTRACCIÓN AUTOMÁTICA DE SELECTORES
	const filtrosDisponibles = useMemo(() => {
		const categorias = new Set<string>();
		const meses = new Set<string>();
		const recintos = new Set<string>();
		const ciudades = new Set<string>();

		listaEventos.forEach((evento: any) => {
			if (evento.Categoría) categorias.add(evento.Categoría.toUpperCase());

			const fechaTexto = (evento['Fecha Evento'] || '').toUpperCase();
			NOMBRES_MESES.forEach((m) => {
				if (fechaTexto.includes(m)) meses.add(m);
			});
			const lugarRaw = evento['Lugar/Recinto'] || '';
			const partes = lugarRaw.split('-');
			const recintoClean = partes[0] ? partes[0].trim().toUpperCase() : '';
			const ciudadClean = partes[1] ? partes[1].trim().toUpperCase() : 'SANTIAGO';

			if (recintoClean && recintoClean !== 'POR CONFIRMAR') recintos.add(recintoClean);
			if (ciudadClean) ciudades.add(ciudadClean);
		});

		return {
			categorias: ['TODOS', ...Array.from(categorias).sort()],
			meses: ['TODOS', ...Array.from(meses)],
			recintos: ['TODOS', ...Array.from(recintos).sort()],
			ciudades: ['TODOS', ...Array.from(ciudades).sort()],
		};
	}, []);

	// 3. EL GRAN FILTRO CRUZADO EN MEMORIA (Usa las 5 condiciones en simultáneo)
	const eventosProcesados = useMemo(() => {
		// Fase A: Filtrado (Se mantiene igual de blindado que antes)
		const filtrados = listaEventos.filter((evento: any) => {
			const texto = `${evento.Título} ${evento['Lugar/Recinto']}`.toLowerCase();
			const matchTexto = texto.includes(busqueda.toLowerCase());
			const matchCat = catSel === 'TODOS' || evento.Categoría?.toUpperCase() === catSel;

			const fechaTexto = (evento['Fecha Evento'] || '').toUpperCase();
			const matchMes = mesSel === 'TODOS' || fechaTexto.includes(mesSel.toUpperCase());

			const lugarRaw = (evento['Lugar/Recinto'] || '').toUpperCase();
			const matchRecinto = recintoSel === 'TODOS' || lugarRaw.startsWith(recintoSel);
			const matchCiudad = ciudadSel === 'TODOS' || lugarRaw.includes(ciudadSel);

			return matchTexto && matchCat && matchMes && matchRecinto && matchCiudad;
		});

		// ========================================================
		// FASE B: ORDENAMIENTO DE ALTA PRECISIÓN 🌟
		// ========================================================
		if (ordenSel === 'A-Z') {
			return [...filtrados].sort((a, b) => a.Título.localeCompare(b.Título, 'es'));
		}
		if (ordenSel === 'Z-A') {
			return [...filtrados].sort((a, b) => b.Título.localeCompare(a.Título, 'es'));
		}

		// MODO CRONOLÓGICO POR DEFECTO ('FECHA') 📅
		// Esta función convierte "19 de Junio", "30-05-2026" o "FECHA POR CONFIRMAR" en milisegundos comparables
		return [...filtrados].sort((a, b) => {
			const obtenerMilisegundos = (fechaRaw: string) => {
				const texto = (fechaRaw || '').toUpperCase().trim();

				// Si el show no tiene fecha definida o dice "VER EN TICKET", lo mandamos al final absoluto
				if (!texto || texto.includes('CONFIRMAR') || texto.includes('VER EN')) {
					return new Date('2028-12-31').getTime();
				}

				// Caso A: Formato ISO o Guiones del Scraper (Ej: "30-05-2026" o "05-06-2026")
				if (texto.includes('-')) {
					const partesIso = texto.split(' ')[0].split('-');
					if (partesIso.length === 3) {
						// Cambiamos DD-MM-AAAA a formato reconocible AAAA-MM-DD
						return new Date(`${partesIso[2]}-${partesIso[1]}-${partesIso[0]}`).getTime();
					}
				}

				// Caso B: Formato Texto Humano Estándar (Ej: "19 de Junio", "4 de Junio 2026")
				const mesesDic: { [key: string]: string } = {
					ENERO: '01',
					FEBRERO: '02',
					MARZO: '03',
					ABRIL: '04',
					MAYO: '05',
					JUNIO: '06',
					JULIO: '07',
					AGOSTO: '08',
					SEPTIEMBRE: '09',
					OCTUBRE: '10',
					NOVIEMBRE: '11',
					DICIEMBRE: '12',
				};

				// Removemos el conector "DE" para dejar solo palabras clave (Ej: "19 JUNIO 2026")
				const limpio = texto.replace(' DE ', ' ').replace('|', ' ').replace('/', ' ');
				const bloques = limpio.split(' ');

				const dia = bloques[0] ? bloques[0].padStart(2, '0') : '01';
				const mesPalabra = bloques[1] || 'ENERO';
				const mesNumero = mesesDic[mesPalabra] || '01';

				// Deducimos el año analizando si el JSON incluyó un bloque de 4 dígitos, sino usamos 2026
				const anio = bloques.find((b) => b.length === 4 && !isNaN(Number(b))) || '2026';

				return new Date(`${anio}-${mesNumero}-${dia}`).getTime();
			};

			return obtenerMilisegundos(a['Fecha Evento']) - obtenerMilisegundos(b['Fecha Evento']);
		});
	}, [busqueda, catSel, mesSel, recintoSel, ciudadSel, ordenSel]);

	// Resetear la paginación a 12 al cambiar filtros
	const manejarCambioFiltro = (setFiltro: Function, valor: string) => {
		setFiltro(valor);
		setLimiteVisible(12);
	};

	// Paginación progresiva slice
	const eventosVisibles = useMemo(() => {
		return eventosProcesados.slice(0, limiteVisible);
	}, [eventosProcesados, limiteVisible]);

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

			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
				<FilterBar
					busqueda={busqueda}
					setBusqueda={(v) => manejarCambioFiltro(setBusqueda, v)}
					catSel={catSel}
					setCatSel={(v) => manejarCambioFiltro(setCatSel, v)}
					mesSel={mesSel}
					setMesSel={(v) => manejarCambioFiltro(setMesSel, v)}
					recintoSel={recintoSel}
					setRecintoSel={(v) => manejarCambioFiltro(setRecintoSel, v)}
					ciudadSel={ciudadSel}
					setCiudadSel={(v) => manejarCambioFiltro(setCiudadSel, v)}
					ordenSel={ordenSel}
					setOrdenSel={setOrdenSel}
					opciones={filtrosDisponibles}
					total={eventosProcesados.length}
				/>

				{eventosVisibles.length > 0 ? (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{eventosVisibles.map((evento: any, index: number) => (
								<EventCard key={evento.Slug || index} evento={evento} slugLocal={evento.Slug} />
							))}
						</div>

						{eventosProcesados.length > limiteVisible && (
							<div className='flex justify-center mt-12'>
								<button
									onClick={() => setLimiteVisible((prev) => prev + 12)}
									className='bg-gray-950 hover:bg-red-600 text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-md transition-colors duration-200 uppercase tracking-wider'>
									Ver Más Eventos (+12)
								</button>
							</div>
						)}
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
