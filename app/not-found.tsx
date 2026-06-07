'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		/* 🚨 CONTENEDOR DE EMERGENCIA: Pantalla completa, tipografía técnica monoespaciada */
		<main className='min-h-[85vh] flex items-center justify-center p-4 font-mono select-none'>
			{/* CAJA DE COLAPSO: Estilo advertencia de terminal defectuosa */}
			<div className='w-full max-w-xl bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000] space-y-6 relative overflow-hidden'>
				{/* Timbre técnico de esquina superior */}
				<div className='absolute top-0 right-0 bg-red-600 text-white font-black text-[9px] px-3 py-1 uppercase tracking-widest border-b-2 border-l-2 border-black'>
					ERR_CODE // 404
				</div>

				{/* Cabecera del Error */}
				<div className='space-y-1.5 pt-2'>
					<span className='text-[10px] font-black text-gray-400 uppercase tracking-widest block'>QSTG_SYS // MONITOR_ALERT</span>
					<h1 className='font-editorial text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tighter leading-none'>LINK ROTO</h1>
				</div>

				{/* Bloque de bitácora simulada: Conectando con la narrativa del scraper */}
				<div className='bg-gray-950 text-red-500 p-4 border-2 border-black text-xs font-bold uppercase tracking-tight space-y-2 leading-relaxed shadow-[inner_3px_3px_0px_rgba(0,0,0,0.2)]'>
					<p className='text-gray-400 font-normal'>[STATUS] Executing automated external tracking...</p>
					<p>[ERROR] El script de absorción parasitaria no encontró registros vigentes en esta dirección.</p>
					<p className='text-yellow-500'>[WARN] Es posible que la ticketera de origen haya purgado el evento o la URL ingresada sea inválida.</p>
					<p className='text-gray-500 font-normal pt-1 border-t border-red-900/40'>QSTG_BOT_v2.6 // TARGET_NOT_FOUND</p>
				</div>

				{/* Texto de bajada editorial */}
				<p className='text-xs text-gray-600 font-bold uppercase tracking-tight leading-relaxed text-justify'>
					Despeja la pantalla. No dejes que las interfaces rotas corporativas consuman tu tiempo de navegación. Vuelve al índice centralizado para revisar los panoramas que sí
					están vigentes en Chile.
				</p>

				{/* Acción de escape brutalista */}
				<div className='pt-2 flex flex-col sm:flex-row gap-4'>
					<button
						onClick={() => router.push('/')}
						className='w-full text-center bg-black text-white hover:bg-red-600 font-black text-xs px-6 py-4 rounded-none uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer'>
						REINICIAR RUTA Y VOLVER ➜
					</button>
				</div>
			</div>
		</main>
	);
}
