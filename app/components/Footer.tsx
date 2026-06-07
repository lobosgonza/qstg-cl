'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
	return (
		/* 📰 PIE DE REVISTA: Fondo blanco sólido, marco superior de 2px y estilo monoespaciado */
		<footer className='bg-white border-t-2 border-black mt-20 font-mono'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* 🌟 ESTRUCTURA REORGANIZADA A 4 COLUMNAS EN DESKTOP */}
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b-2 border-black items-start'>
					{/* COLUMNA 1: LOGOTIPO Y DECLARACIÓN DE PRINCIPIOS */}
					<div className='space-y-3'>
						<div className='font-editorial text-2xl font-black tracking-tighter text-gray-950 uppercase italic'>
							QSTG<span className='text-red-600'>.CL</span>
						</div>
						<p className='text-[11px] text-gray-600 leading-relaxed uppercase tracking-tight'>
							UNA BITÁCORA ALIMENTADA DE FORMA PARASITARIA. NUESTROS SCRIPTS RASTREAN EXTERNAMENTE LOS REGISTROS PÚBLICOS DE LAS TIQUETERAS CORPORATIVAS PARA EXTRAER
							AUTOMÁTICAMENTE EL REGISTRO DE SHOWS VIGENTES. LIMPIAMOS CADA LÍNEA DE INFORMACIÓN, DEPURAMOS EL RUIDO INVASIVO Y TE ENTREGAMOS LA DATA DESTILADA EN MAYÚSCULAS
							STRICTAS.
						</p>
					</div>

					{/* COLUMNA 2: DIRECTORIO DE RUTAS GLOBALES */}
					<div className='flex flex-col gap-2'>
						<span className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>INDEX // RUTAS</span>
						<Link href='/' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							INICIO
						</Link>
						<Link href='/todos-los-eventos' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							TODOS LOS EVENTOS
						</Link>
						<Link href='/contacto' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							ZONA DE PRODUCTORES
						</Link>
					</div>

					{/* 🚀 COLUMNA 3 NUEVA: INDEX DE SECCIONES CRUZADAS */}
					<div className='flex flex-col gap-2'>
						<span className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1'>SECCIONES // CATEGORÍAS</span>
						<Link href='/musica' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							MÚSICA Y CONCIERTOS
						</Link>
						<Link href='/electronica' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							ELECTRÓNICA
						</Link>
						<Link href='/teatro' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							TEATRO Y COMEDIA
						</Link>
						<Link href='/deportes' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							DEPORTES
						</Link>
						<Link href='/festivales' className='text-xs font-bold text-gray-900 hover:text-red-600 uppercase tracking-tight transition-colors'>
							FESTIVALES
						</Link>
					</div>

					{/* COLUMNA 4: DESCARGA MÓVIL ESTILO FICHA INDUSTRIAL */}
					<div className='flex items-center gap-4 bg-gray-50 p-4 rounded-none border-2 border-black w-full shadow-[3px_3px_0px_#000000]'>
						<div className='w-14 h-14 bg-white border border-black flex flex-col items-center justify-center text-[8px] font-black text-gray-400 select-none shrink-0 tracking-tighter text-center leading-none p-1 border-dashed'>
							QR_CODE
							<span>[IMAGE]</span>
						</div>
						<div className='space-y-0.5'>
							<h4 className='text-xs font-black text-gray-950 uppercase tracking-tight'>FORMATO MÓVIL</h4>
							<p className='text-[10px] text-gray-500 uppercase tracking-tight leading-tight'>ESCANEA EL CÓDIGO DE ACCESO PARA LLEVAR LA GUÍA EN TU DISPOSITIVO.</p>
						</div>
					</div>
				</div>

				{/* CRÉDITOS Y METADATOS DE COMPILACIÓN INFERIORES */}
				<div className='pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider'>
					<p>&copy; {new Date().getFullYear()} QSTG.CL // TODOS LOS DERECHOS RESERVADOS.</p>
					<p className='text-gray-900 font-black'>SYS_STATUS // NEXTJS_SUPABASE_OK ⚡</p>
				</div>
			</div>
		</footer>
	);
}
