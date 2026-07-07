'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import PlantillaCartelera from '../components/PlantillaCartelera';

export default function TodosLosEventosPage() {
	const [eventosBD, setEventosBD] = useState<any[]>([]);
	const [cargando, setCargando] = useState<boolean>(true);

	// Traemos la cartelera completa desde Supabase de forma cronológica
	useEffect(() => {
		async function cargarTodosLosEventos() {
			const { data, error } = await supabase.from('events_list').select('*').order('fecha_inicio', { ascending: true }); // Orden estricto cronológico

			if (error) {
				console.error('Error al devorar la cartelera global:', error);
			} else if (data) {
				setEventosBD(data);
			}
			setCargando(false);
		}
		cargarTodosLosEventos();
	}, []);

	if (cargando) {
		return (
			<div className='min-h-screen bg-white font-mono flex items-center justify-center'>
				<span className='text-xs font-black animate-pulse uppercase tracking-widest bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_#000]'>
					SYS // CARGANDO_ARCHIVO_GLOBAL...
				</span>
			</div>
		);
	}

	return (
		<PlantillaCartelera
			listaEventos={eventosBD} //Sincronizado con tu estado de Supabase en snake_case
			titulo='Cartelera completa QSTG'
			subtitulo='Explora la totalidad de eventos disponibles indexados de forma cronológica estricta. Utiliza el panel inferior para segmentar la base de datos.'
			tagSistema='ARCHIVO // GLOBAL_LIST'
		/>
	);
}
