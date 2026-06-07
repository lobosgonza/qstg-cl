'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
	// 🚀 FUNCIÓN DE SCROLL NATIVA: Lleva la pantalla a coordenada cero con suavidad
	const irAlTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		/* 📰 PIE DE REVISTA: Fondo blanco sólido, marco superior de 2px y estilo monoespaciada */
		<footer className='bg-white border-t-2 border-black font-mono'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* ESTRUCTURA REORGANIZADA A 4 COLUMNAS EN DESKTOP */}
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b-2 border-black items-start'>
					{/* COLUMNA 1: LOGOTIPO Y DECLARACIÓN DE PRINCIPIOS CON ESTILO PUNK */}
					<div className='space-y-4'>
						<div className='font-editorial text-2xl font-black tracking-tighter text-gray-950 uppercase italic select-none'>
							QSTG<span className='text-red-600'>.CL</span>
						</div>
						<p className='text-[11px] text-gray-700 leading-relaxed uppercase tracking-tight font-mono font-black text-justify italic'>
							<span className='text-white bg-black px-2 py-0.5 not-italic text-[10px] tracking-widest block w-max mb-2 shadow-[2px_2px_0px_#000]'>
								SISTEMA DE DIFUSIÓN // DATA_SCRAPING
							</span>
							UNA BITÁCORA ALIMENTADA DE FORMA PARASITARIA.
							<strong> NUESTROS SCRIPTS RASTREAN EXTERNAMENTE</strong> LOS REGISTROS PÚBLICOS DE LAS TIQUETERAS CORPORATIVAS PARA EXTRAER AUTOMÁTICAMENTE EL REGISTRO DE SHOWS
							VIGENTES. LIMPIAMOS CADA LÍNEA DE INFORMACIÓN, DEPURAMOS EL RUIDO INVASIVO Y TE ENTREGAMOS LA DATA
							<span className='text-gray-950 border-b-2 border-black not-italic px-0.5'> DESTILADA EN MAYÚSCULAS STRICTAS</span>.
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
							PUBLICAR PANORAMA
						</Link>
					</div>

					{/* COLUMNA 3: INDEX DE SECCIONES CRUZADAS */}
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

				{/* 🚀 CRÉDITOS, METADATOS Y BOTÓN DE RETORNO FUSIONADOS EN UN SOLO CONTENEDOR */}
				<div className='pt-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-t border-black/10 mt-4 w-full'>
					{/* Sub-bloque 1: Derechos y Enlace Legal */}
					<div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left order-2 lg:order-1'>
						<p>&copy; {new Date().getFullYear()} QSTG.CL // REGISTRO AUTOMADO.</p>

						<Link
							href='/terminos'
							className='text-gray-500 hover:text-red-600 transition-colors border-b-2 border-gray-200 hover:border-red-600 font-black block w-max mx-auto sm:mx-0'>
							TÉRMINOS DEL SERVICIO // CLÁUSULAS
						</Link>
					</div>

					{/* Sub-bloque 2: Estado del sistema e Interruptor de Scroll */}
					<div className='flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto order-1 lg:order-2 justify-end'>
						<p className='text-gray-950 font-black whitespace-nowrap text-center sm:text-left'>SYS_STATUS // NEXTJS_SUPABASE_OK ⚡</p>

						{/* 🛠️ INTEGRADO: Botón adaptativo responsivo de alto contraste */}
						<button
							onClick={irAlTop}
							className='w-full sm:w-auto text-center bg-white text-gray-950 hover:bg-black hover:text-white text-[9px] font-mono font-black px-3 py-2 rounded-none uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer'>
							IR_AL_TOP // ▲
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
