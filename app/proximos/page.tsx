'use client';

import React from 'react';
import listaEventos from '@/eventos.json';
import PlantillaCartelera from '../components/PlantillaCartelera';

export default function ProximosEventosPage() {
	return (
		<PlantillaCartelera
			listaEventos={listaEventos}
			titulo='Próximos eventos'
			subtitulo='Estás viendo la cartelera exclusiva para los próximos 7 días en Chile. ¡Ideal para armar tu fin de semana!'
			tagSistema='SISTEMA // URGENT_ROWS'
			soloInminentes={true} // 🚀 Activa el filtro matemático de 2 semanas
		/>
	);
}
