'use client';

import React, { useState } from 'react';

interface FilterBarProps {
	busqueda: string;
	setBusqueda: (v: string) => void;
	mesSel: string;
	setMesSel: (v: string) => void;
	recintoSel: string;
	setRecintoSel: (v: string) => void;
	ciudadSel: string;
	setCiudadSel: (v: string) => void;
	ordenSel: string;
	setOrdenSel: (v: string) => void;
	opciones: {
		meses: string[];
		recintos: string[];
		ciudades: string[];
	};
	total: number;
}

export default function FilterBar({
	busqueda,
	setBusqueda,
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
	const [modalAbierto, setModalAbierto] = useState(false);

	// Estados espejo locales para almacenar borradores provisionales en mobile
	const [localMes, setLocalMes] = useState(mesSel);
	const [localCiudad, setLocalCiudad] = useState(ciudadSel);
	const [localOrden, setLocalOrden] = useState(ordenSel);

	const handleAbrirModal = () => {
		setLocalMes(mesSel);
		setLocalCiudad(ciudadSel);
		setLocalOrden(ordenSel);
		setModalAbierto(true);
	};

	const handleAplicarFiltros = () => {
		setMesSel(localMes);
		setCiudadSel(localCiudad);
		setOrdenSel(localOrden);
		setModalAbierto(false);

		// Retorno inmediato al tope al aplicar filtros en mobile
		window.scrollTo({ top: 0, behavior: 'auto' });
	};

	const RenderSelectores = ({ esModal }: { esModal: boolean }) => {
		const valorMes = esModal ? localMes : mesSel;
		const valorCiudad = esModal ? localCiudad : ciudadSel;
		const valorOrden = esModal ? localOrden : ordenSel;

		const cambioMes = esModal
			? setLocalMes
			: (v: string) => {
					setMesSel(v);
					window.scrollTo({ top: 0, behavior: 'smooth' });
				};
		const cambioCiudad = esModal
			? setLocalCiudad
			: (v: string) => {
					setCiudadSel(v);
					window.scrollTo({ top: 0, behavior: 'smooth' });
				};
		const cambioOrden = esModal
			? setLocalOrden
			: (v: string) => {
					setOrdenSel(v);
					window.scrollTo({ top: 0, behavior: 'smooth' });
				};

		return (
			<>
				{/* Selector de Meses */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>MES</label>
					<select
						value={valorMes}
						onChange={(e) => cambioMes(e.target.value)}
						className='w-full p-2.5 bg-gray-50 border-2 border-black rounded-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer uppercase tracking-tight'>
						{opciones.meses.map((m) => (
							<option key={m} value={m}>
								{m}
							</option>
						))}
					</select>
				</div>

				{/* Selector de Ciudad */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>CIUDAD / REGIÓN</label>
					<select
						value={valorCiudad}
						onChange={(e) => cambioCiudad(e.target.value)}
						className='w-full p-2.5 bg-gray-50 border-2 border-black rounded-none text-xs font-bold text-gray-900 focus:outline-none cursor-pointer uppercase tracking-tight'>
						{opciones.ciudades.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				{/* Selector de Orden */}
				<div className='flex flex-col gap-1.5'>
					<label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>ORDENAR</label>
					<select
						value={valorOrden}
						onChange={(e) => cambioOrden(e.target.value)}
						className='w-full p-2.5 bg-black text-white font-mono font-black text-xs px-4 py-2.5 rounded-none uppercase border-2 border-black tracking-wider cursor-pointer'>
						<option value='FECHA'>▲ CRONOLÓGICO ASC</option>
						<option value='A-Z'>A-Z ALFABÉTICO</option>
						<option value='Z-A'>Z-A ALFABÉTICO</option>
					</select>
				</div>
			</>
		);
	};

	return (
		<>
			{/* BARRA SUPERIOR FIJA DE ESCRITORIO */}
			<div className='bg-white border-2 border-black p-4 sm:p-5 rounded-none shadow-[4px_4px_0px_#000000] mb-6 space-y-4 font-mono'>
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
					<div className='space-y-0.5 shrink-0'>
						<p className='text-xs font-black text-red-600 uppercase tracking-tight'>{total} PANORAMAS DISPONIBLES</p>
					</div>

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

				{/* Grilla limpia a 3 columnas para PC */}
				<div className='hidden md:grid grid-cols-3 gap-4 pt-4 border-t-2 border-black'>
					<RenderSelectores esModal={false} />
				</div>
			</div>

			{/* 🎛️ BOTÓN FLOTANTE INFERIOR (Solo Mobile) */}
			<div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden block w-max max-w-[calc(100vw-2rem)]'>
				<button
					onClick={handleAbrirModal}
					className='bg-yellow-400 text-black hover:bg-black hover:text-white font-mono font-black text-xs px-6 py-4 rounded-none uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer flex items-center gap-2'>
					🎛️ FILTRAR REGISTROS ({total})
				</button>
			</div>

			{/* 🎭 PERSIANA MODAL FLOTANTE CENTRADA */}
			{modalAbierto && (
				<div
					className='fixed inset-0 w-screen h-screen z-50 md:hidden bg-black/60 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200'
					onClick={() => setModalAbierto(false)} // Clic afuera descarta y cierra
				>
					<div
						className='bg-white border-4 border-black w-full max-w-sm p-6 shadow-[8px_8px_0px_#000000] space-y-6 max-h-[85vh] overflow-y-auto flex flex-col justify-between rounded-none animate-in zoom-in-95 duration-150'
						onClick={(e) => e.stopPropagation()} // Detiene propagación de cierre interno
					>
						<div className='flex items-center justify-between border-b-2 border-black pb-3 shrink-0'>
							<div>
								<span className='text-[9px] font-black text-gray-400 uppercase tracking-widest block'>QSTG_SYS // PANEL</span>
								<h3 className='font-editorial text-base font-black uppercase tracking-tight text-gray-950'>CRITERIOS DE BÚSQUEDA</h3>
							</div>
							<button onClick={() => setModalAbierto(false)} className='text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase font-mono cursor-pointer'>
								[CERRAR ✕]
							</button>
						</div>

						<div className='space-y-5 flex-grow py-2'>
							<RenderSelectores esModal={true} />
						</div>

						<div className='pt-4 border-t border-gray-200 shrink-0'>
							<button
								onClick={handleAplicarFiltros}
								className='w-full bg-black text-white hover:bg-red-600 font-mono font-black text-xs py-4 rounded-none uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.15)] cursor-pointer'>
								APLICAR FILTROS Y REVISAR ➜
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
