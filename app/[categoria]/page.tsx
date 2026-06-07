'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';
import listaEventos from '../../eventos.json';
import PlantillaCartelera from '../components/PlantillaCartelera';

export default function CategoríaPage() {
	const params = useParams();
	const router = useRouter();
	const categoriaSlug = params.categoria as string;

	const [infoCategoria, setInfoCategoria] = useState<any>(null);
	const [cargando, setCargando] = useState(true);

	useEffect(() => {
		async function cargarCategoria() {
			const { data } = await supabase.from('categorias_maestras').select('*').eq('slug_url', categoriaSlug).single();

			if (!data) {
				router.push('/');
			} else {
				// Buscamos el patrocinador en el JSON local
				const sponsorEncontrado = listaEventos.find((e: any) => e.Slug?.toLowerCase() === data.slug_sponsor?.toLowerCase());

				// Inyectamos el objeto del banner dentro del estado de información
				setInfoCategoria({
					...data,
					eventoBanner: sponsorEncontrado || listaEventos[0],
				});
			}
			setCargando(false);
		}
		if (categoriaSlug) cargarCategoria();
	}, [categoriaSlug, router]);

	if (cargando) {
		return <div className='p-20 text-center text-xs font-mono font-bold text-gray-400 uppercase tracking-widest bg-transparent'>Cargando sección // qstg_sys</div>;
	}

	return (
		/* 🚀 Llamamos a la plantilla maestra en modo categoría */
		<PlantillaCartelera listaEventos={listaEventos} infoCategoria={infoCategoria} tagSistema='SECCIÓN // DYNAMIC_ROW' />
	);
}
