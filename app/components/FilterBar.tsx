'use client';

import React, { useState } from 'react';

interface FilterBarProps {
	busqueda: string;
	setBusqueda: (v: string) => void;
	catSel: string;
	setCatSel: (v: string) => void;
	mesSel: string;
	setMesSel: (v: string) => void;
	recintoSel: string;
	setRecintoSel: (v: string) => void;
	ciudadSel: string;
	setCiudadSel: (v: string) => void;
	ordenSel: string;
	setOrdenSel: (v: string) => void;
	opciones: {
		categorias: string[];
		meses: string[];
		recintos: string[];
		ciudades: string[];
	};
	total: number;
}

export default function FilterBar({
	busqueda,
	setBusqueda,
	catSel,
	setCatSel,
	mesSel,
	setMesSel,
	recintoSel,
	setRecintoSel,
	ciudadSel,
	setCiudadSel,
	ordenSel,
	setOrdenSel,
	opciones,
	total,
}: FilterBarProps) {
	// Estado local para abrir y cerrar la persiana avanzada en móviles
	const [desplegado, setDesplegado] = useState(false);

	return (
		/* 📰 CONTENEDOR MAESTRO BRUTALISTA */
		<div className='bg-white border-2 border-black p-4 sm:p-5 rounded-none shadow-[4px_4px_0px_#000000] mb-8 space-y-4 font-mono'>
			{/* Fila Primaria Permanente: Info básica + Buscador */}
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
				<div className='space-y-0.5 shrink-0'>
					<span className='text-[10px] font-black text-gray-400 uppercase tracking-widest block'>FILTROS // INDEXADOS</span>
					<p className='text-xs font-black text-red-600 uppercase tracking-tight'>{total} PANORAMAS VIGENTES</p>
				</div>

				{/* Input de búsqueda estilo terminal */}
				<div className='w-full sm:max-w-xs relative'>
					<input
						type='text'
						placeholder='BUSCAR ARTISTA, RECINTO...'
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
						className='w-full px-4 py-2.5 bg-gray-50 border-2 border-black rounded-none text-xs font-bold uppercase tracking-tight placeholder-gray-400 focus:outline-none focus:bg-white focus:text-red-600 transition-colors'
					/>
				</div>
			</div>

			{/* 📱 BOTÓN DE CONTROL MÓVIL: Visible únicamente en pantallas pequeñas */}
			<div className='block md:hidden pt-1'>
				<button
					onClick={() => setDesplegado(!desplegado)}
					className={`w-full text-center font-mono font-black text-xs py-2.5 rounded-none uppercase tracking-wider border-2 border-black transition-all duration-100 ${
						desplegado ? 'bg-black text-white' : 'bg-white text-gray-950 shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
					}`}>
					{desplegado ? 'OCULTAR FILTROS AVANZADOS ▲' : 'HERRAMIENTAS DE FILTRADO ▼'}
				</button>
			</div>

			{/* 🎛️ CONTENEDOR DE SELECTORES DINÁMICO */}
			<div className={`${desplegado ? 'grid' : 'hidden'} md:grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t-2 border-black duration-150 transition-all`}>
				{/* Selector de Categorías */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>CATEGORÍA</label>
					<select
						value={catSel}
						onChange={(e) => setCatSel(e.target.value)}
						className='w-full p-2.5 bg-gray-50 border-2 border-black rounded-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer uppercase tracking-tight'>
						{opciones.categorias.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				{/* Selector de Meses */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>MES DEL SHOW</label>
					<select
						value={mesSel}
						onChange={(e) => setMesSel(e.target.value)}
						className='w-full p-2.5 bg-gray-50 border-2 border-black rounded-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer uppercase tracking-tight'>
						{opciones.meses.map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>
				</div>

				{/* Selector de Ciudades */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>UBICACIÓN</label>
					<select
						value={ciudadSel}
						onChange={(e) => setCiudadSel(e.target.value)}
						className='w-full p-2.5 bg-gray-50 border-2 border-black rounded-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer uppercase tracking-tight'>
						{opciones.ciudades.map((ci) => (
							<option key={ci} value={ci}>
								{catSel === 'TODOS' && ci === 'TODOS' ? 'TODAS' : ci}
							</option>
						))}
					</select>
				</div>

				{/* Criterio de Ordenamiento */}
				<div className='flex flex-col gap-1.5 col-span-2 md:col-span-1'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>ORDENAR POR</label>
					<select
						value={ordenSel}
						onChange={(e) => setOrdenSel(e.target.value)}
						className='w-full p-2.5 bg-black text-white border-2 border-black rounded-none text-xs font-black focus:outline-none cursor-pointer uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,0.15)]'>
						<option value='FECHA'>CRONOLÓGICO</option>
						<option value='A-Z'>ALFABÉTICO A ➔ Z</option>
						<option value='Z-A'>ALFABÉTICO Z ➔ A</option>
					</select>
				</div>
			</div>
		</div>
	);
}
