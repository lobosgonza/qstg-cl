'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';
import PlantillaCartelera from '../components/PlantillaCartelera';

export default function CategoríaPage() {
	const params = useParams();
	const router = useRouter();
	const categoriaSlug = params.categoria as string;

	const [infoCategoria, setInfoCategoria] = useState<any>(null);
	const [eventosBD, setEventosBD] = useState<any[]>([]); // Estado para los datos vivos de Supabase
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
		async function cargarDatosSeccion() {
			// 1. Buscamos los datos maestros de la categoría por su slug_url
			const { data: catData } = await supabase.from('categorias_maestras').select('*').eq('slug_url', categoriaSlug).single();

			if (!catData) {
				// Si la categoría no existe en DB, redirigimos a home
				router.push('/');
				return;
			}

			// 2. Consumimos los eventos reales para pasárselos a la grilla
			const { data: eventsData } = await supabase.from('events_list').select('*');

			const todosLosEventos = eventsData || [];
			setEventosBD(todosLosEventos);

			// 3. Buscamos el patrocinador (sponsor) configurado usando el slug corregido en snake_case
			const sponsorEncontrado = todosLosEventos.find((e: any) => e.slug?.toLowerCase() === catData.slug_sponsor?.toLowerCase());

			// Inyectamos el objeto calculado del banner dentro del objeto de metadatos
			setInfoCategoria({
				...catData,
				eventoBanner: sponsorEncontrado || todosLosEventos[0] || null,
			});

			setCargando(false);
		}

		if (categoriaSlug) cargarDatosSeccion();
	}, [categoriaSlug, router]);

	if (cargando) {
		return (
			<div className='min-h-screen bg-white font-mono flex items-center justify-center'>
				<span className='text-xs font-black animate-pulse uppercase tracking-widest bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_#000]'>
					SYS // CARGANDO_SECCION_CULTURAL...
				</span>
			</div>
		);
	}

	return (
		/* 🚀 Plantilla maestra operando en modo Filtro por Categoría ID */
		<PlantillaCartelera listaEventos={eventosBD} infoCategoria={infoCategoria} tagSistema='SECCIÓN // DYNAMIC_ROW' titulo={infoCategoria?.nombre_json || 'CARTELERA'} />
	);
}
