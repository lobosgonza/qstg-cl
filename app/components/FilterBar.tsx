'use client';

import React from 'react';

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
	return (
		<div className='bg-white border border-gray-100 p-5 rounded-2xl shadow-sm mb-6 space-y-4'>
			{/* Caja de Búsqueda General */}
			<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
				{/* <div>
					<h2 className='text-xs font-black text-gray-400 uppercase tracking-wider'>Filtros Avanzados</h2>
					<p className='text-[11px] font-bold text-red-600 uppercase mt-0.5'>{total} Panoramas Filtrados</p>
				</div> */}

				<div className='w-full sm:max-w-xs relative'>
					<span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 text-xs'>🔍</span>
					<input
						type='text'
						placeholder='Buscar artista, banda o recinto...'
						value={busqueda}
						onChange={(e) => setBusqueda(e.target.value)}
						className='w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-red-500'
					/>
				</div>
			</div>

			{/* Selectores Cruzados Multi-Eje - 🌟 CORREGIDO A 5 COLUMNAS EN DESKTOP */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-gray-100'>
				{/* Selector de Categorías */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-wide'>Categoría</label>
					<select
						value={catSel}
						onChange={(e) => setCatSel(e.target.value)}
						className='w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer'>
						{opciones.categorias.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				{/* Selector de Meses */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-wide'>Mes del Show</label>
					<select
						value={mesSel}
						onChange={(e) => setMesSel(e.target.value)}
						className='w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer'>
						{opciones.meses.map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>
				</div>

				{/* Selector de Recintos */}
				{/* <div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-wide'>Recinto</label>
					<select
						value={recintoSel}
						onChange={(e) => setRecintoSel(e.target.value)}
						className='w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer'>
						{opciones.recintos.map((r) => (
							<option key={r} value={r}>
								{r}
							</option>
						))}
					</select>
				</div> */}

				{/* Selector de Ciudades */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-wide'>Ciudad</label>
					<select
						value={ciudadSel}
						onChange={(e) => setCiudadSel(e.target.value)}
						className='w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer'>
						{opciones.ciudades.map((ci) => (
							<option key={ci} value={ci}>
								{catSel === 'TODOS' && ci === 'TODOS' ? 'TODAS' : ci}
							</option>
						))}
					</select>
				</div>

				{/* Criterio de Ordenamiento - 🌟 CORREGIDO: Ocupa una sola columna simétrica */}
				<div className='flex flex-col gap-1.5 col-span-2 md:col-span-1'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-wide'>Ordenar Por</label>
					<select
						value={ordenSel}
						onChange={(e) => setOrdenSel(e.target.value)}
						className='w-full p-2 bg-gray-950 text-white border border-gray-950 rounded-xl text-xs font-bold focus:outline-none cursor-pointer'>
						<option value='FECHA'>📅 FECHA</option>
						<option value='A-Z'>🔤 A ➔ Z</option>
						<option value='Z-A'>🔤 Z ➔ A</option>
					</select>
				</div>
			</div>
		</div>
	);
}
