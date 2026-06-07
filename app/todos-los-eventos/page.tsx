'use client';

import React from 'react';
import listaEventos from '@/eventos.json';
import PlantillaCartelera from '../components/PlantillaCartelera';

export default function TodosLosEventosPage() {
	return (
		<PlantillaCartelera
			listaEventos={listaEventos}
			titulo='Cartelera completa QSTG'
			subtitulo='Explora la totalidad de eventos disponibles indexados de forma cronológica estricta. Utiliza el panel inferior para segmentar la base de datos.'
			tagSistema='ARCHIVO // GLOBAL_LIST'
		/>
	);
}
