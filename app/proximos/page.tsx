'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; // Conector dinámico global
import PlantillaCartelera from '../components/PlantillaCartelera';

export default function ProximosEventosPage() {
	const [eventosBD, setEventosBD] = useState<any[]>([]);
	const [cargando, setCargando] = useState<boolean>(true);

	// Absorber toda la cartelera de Supabase
	useEffect(() => {
		async function cargarProximosShows() {
			const { data, error } = await supabase.from('events_list').select('*');

			if (error) {
				console.error('Error al devorar eventos inminentes:', error);
			} else if (data) {
				setEventosBD(data);
			}
			setCargando(false);
		}
		cargarProximosShows();
	}, []);

	if (cargando) {
		return (
			<div className='min-h-screen bg-white font-mono flex items-center justify-center'>
				<span className='text-xs font-black animate-pulse uppercase tracking-widest bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_#000]'>
					SYS // BUSCANDO_EVENTOS_INMINENTES...
				</span>
			</div>
		);
	}

	return (
		<PlantillaCartelera
			listaEventos={eventosBD} // Inyectamos la data en minúsculas viva de Supabase
			titulo='Próximos eventos'
			subtitulo='Estás viendo la cartelera exclusiva para los próximos 7 días en Chile. ¡Ideal para armar tu fin de semana!'
			tagSistema='SISTEMA // URGENT_ROWS'
			soloInminentes={true} // 🚀 Mantiene encendido tu filtro temporal automático para festivales
		/>
	);
}
