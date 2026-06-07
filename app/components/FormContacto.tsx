'use client';

import React, { useState } from 'react';

export default function FormContacto() {
	// 1. Estados para los campos que el usuario ingresará manualmente
	const [titulo, setTitulo] = useState('');
	const [ticketera, setTicketera] = useState('Ticketmaster');
	const [categoria, setCategoria] = useState('MÚSICA');
	const [linkCompra, setLinkCompra] = useState('');
	const [imagenUrl, setImagenUrl] = useState('');
	const [bannerUrl, setBannerUrl] = useState('');
	const [recinto, setRecinto] = useState('');
	const [ciudad, setCiudad] = useState('SANTIAGO');
	const [region, setRegion] = useState('METROPOLITANA');
	const [fechaFiltro, setFechaFiltro] = useState('');
	const [hora, setHora] = useState('20:00');
	const [descripcion, setDescripcion] = useState('');

	// Estados para control de UI
	const [enviando, setEnviando] = useState(false);
	const [enviadoConExito, setEnviadoConExito] = useState(false);

	// 2. Función auxiliar para transformar el Título en un Slug web limpio
	const generarSlug = (texto: string) => {
		return texto
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '') // Quita tildes
			.replace(/[^a-z0-9\s-]/g, '') // Quita caracteres especiales
			.trim()
			.replace(/\s+/g, '-'); // Cambia espacios por guiones
	};

	// 3. Función auxiliar para transformar la fecha en "Día Texto"
	const generarDiaTexto = (fechaStr: string) => {
		if (!fechaStr) return '';
		const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
		const partes = fechaStr.split('-');
		if (partes.length !== 3) return '';
		const dia = parseInt(partes[2], 10);
		const mesIndex = parseInt(partes[1], 10) - 1;
		return `${dia} de ${meses[mesIndex]}`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setEnviando(true);

		const nuevoEventoJSON = {
			Título: titulo,
			Slug: generarSlug(titulo),
			Ticketera: ticketera,
			Categoría: categoria.toUpperCase(),
			'Link Compra': linkCompra,
			'Imagen URL': imagenUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=640&auto=format&fit=crop',
			'Banner URL': bannerUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
			Recinto: recinto.toUpperCase(),
			Ciudad: ciudad.toUpperCase(),
			Región: region.toUpperCase(),
			'Fecha Filtro': fechaFiltro,
			'Día Texto': generarDiaTexto(fechaFiltro),
			Hora: hora,
			'Es Multifecha': false,
			'Resumen SEO': `${generarDiaTexto(fechaFiltro)} 2026`,
			'Descripción Detallada': descripcion || 'No se encontró descripción detallada para este evento.',
		};

		console.log('🚀 REQUEST LISTA PARA BIGQUERY:', nuevoEventoJSON);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulación de Red
			setEnviadoConExito(true);

			// Limpieza de campos manuales
			setTitulo('');
			setLinkCompra('');
			setImagenUrl('');
			setBannerUrl('');
			setRecinto('');
			setFechaFiltro('');
			setDescripcion('');
		} catch (error) {
			console.error('❌ Error enviando request:', error);
			alert('No se pudo procesar tu sugerencia.');
		} finally {
			setEnviando(false);
		}
	};

	// PANTALLA DE ÉXITO FIJA ESTILO STICKER RÍGIDO
	if (enviadoConExito) {
		return (
			<div className='max-w-2xl mx-auto text-center py-16 bg-white border-2 border-black rounded-none p-8 shadow-[4px_4px_0px_#000000] font-mono'>
				<span className='w-max mx-auto bg-black text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest block border border-black'>STATUS // SUCCESS</span>
				<h3 className='font-editorial text-2xl font-black text-gray-950 mt-4 uppercase tracking-tight'>Evento enviado a revisión</h3>
				<p className='text-xs text-gray-500 mt-2 max-w-md mx-auto font-bold uppercase tracking-tight'>
					Los datos se han estructurado en el formato maestro de QSTG y se guardaron en la base de datos de auditoría.
				</p>
				<button
					onClick={() => setEnviadoConExito(false)}
					className='mt-8 bg-white text-gray-950 hover:bg-red-600 hover:text-white font-black text-xs px-6 py-3.5 rounded-none uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1.5px_1.5px_0px_#000000] transition-all duration-100 cursor-pointer'>
					Sugerir otro show
				</button>
			</div>
		);
	}

	return (
		/* 📰 CONTENEDOR MÁSTER: Acoplado a tu clase global de globals.css */
		<div className='max-w-2xl mx-auto card-brutalista p-6 sm:p-10 font-mono'>
			{/* ENCABEZADO TÉCNICO */}
			<div className='mb-8 border-b-2 border-black pb-5'>
				<span className='w-max bg-black text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase tracking-widest border border-black block'>INGRESO // DATA_ENTRY</span>
				<h2 className='font-editorial text-2xl font-black tracking-tight text-gray-950 mt-3 uppercase leading-none'>Postular o Sugerir un Panorama</h2>
				<p className='text-[11px] text-gray-500 mt-2 font-bold uppercase tracking-tight'>
					Completa la ficha técnica del evento. La información se formateará de manera automatizada para la grilla.
				</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* SECCIÓN 1: DATOS PRINCIPALES */}
				<div className='border-b-2 border-black pb-5'>
					<h3 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>1. Datos del Show</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Título del Evento</label>
							<input
								type='text'
								required
								value={titulo}
								onChange={(e) => setTitulo(e.target.value)}
								placeholder='EJ: RUSH - FIFTY SOMETHING'
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:bg-white focus:text-red-600 transition-colors placeholder-gray-300'
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Categoría</label>
							<select
								value={categoria}
								onChange={(e) => setCategoria(e.target.value)}
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs focus:outline-none focus:bg-white focus:text-red-600 transition-colors cursor-pointer uppercase font-black tracking-wider'>
								<option value='MÚSICA'>MÚSICA / CONCIERTOS</option>
								<option value='ELECTRÓNICA'>ELECTRÓNICA</option>
								<option value='TEATRO'>TEATRO Y COMEDIA</option>
								<option value='DEPORTES'>DEPORTES</option>
								<option value='FESTIVALES'>FESTIVALES</option>
							</select>
						</div>
					</div>
				</div>

				{/* SECCIÓN 2: LOGÍSTICA Y LUGAR */}
				<div className='border-b-2 border-black pb-5'>
					<h3 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>2. Lugar y Horarios</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Recinto / Estadio / Club</label>
							<input
								type='text'
								required
								value={recinto}
								onChange={(e) => setRecinto(e.target.value)}
								placeholder='EJ: ESTADIO BICENTENARIO LA FLORIDA'
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:bg-white focus:text-red-600 transition-colors placeholder-gray-300'
							/>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div className='flex flex-col gap-1'>
								<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Fecha</label>
								<input
									type='date'
									required
									value={fechaFiltro}
									onChange={(e) => setFechaFiltro(e.target.value)}
									className='w-full bg-gray-50 border-2 border-black rounded-none px-3 py-3 text-xs font-bold focus:outline-none focus:bg-white transition-colors cursor-pointer'
								/>
							</div>
							<div className='flex flex-col gap-1'>
								<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Hora</label>
								<input
									type='text'
									required
									value={hora}
									onChange={(e) => setHora(e.target.value)}
									placeholder='20:00'
									className='w-full bg-gray-50 border-2 border-black rounded-none px-3 py-3 text-xs font-bold uppercase focus:outline-none focus:bg-white transition-colors placeholder-gray-300'
								/>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-4 mt-4'>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Ciudad</label>
							<input
								type='text'
								required
								value={ciudad}
								onChange={(e) => setCiudad(e.target.value)}
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:bg-white transition-colors'
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Región</label>
							<input
								type='text'
								required
								value={region}
								onChange={(e) => setRegion(e.target.value)}
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:bg-white transition-colors'
							/>
						</div>
					</div>
				</div>

				{/* SECCIÓN 3: TICKETS Y MULTIMEDIA */}
				<div className='border-b-2 border-black pb-5'>
					<h3 className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4'>3. Venta de Entradas e Imágenes</h3>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Ticketera Distribuidora</label>
							<input
								type='text'
								required
								value={ticketera}
								onChange={(e) => setTicketera(e.target.value)}
								placeholder='EJ: TICKETMASTER, PUNTOTICKET'
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:bg-white focus:text-red-600 transition-colors placeholder-gray-300'
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Link Directo de Compra</label>
							<input
								type='url'
								required
								value={linkCompra}
								onChange={(e) => setLinkCompra(e.target.value)}
								placeholder='HTTPS://...'
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white transition-colors placeholder-gray-300'
							/>
						</div>
					</div>
					<div className='space-y-4 mt-4'>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>URL de Imagen Cuadrada (Card 640x640)</label>
							<input
								type='url'
								value={imagenUrl}
								onChange={(e) => setImagenUrl(e.target.value)}
								placeholder='HTTPS://CDN...'
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white transition-colors placeholder-gray-300'
							/>
						</div>
						<div className='flex flex-col gap-1'>
							<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>URL de Banner Horizontal (Landing 1920x720)</label>
							<input
								type='url'
								value={bannerUrl}
								onChange={(e) => setBannerUrl(e.target.value)}
								placeholder='HTTPS://CDN...'
								className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold focus:outline-none focus:bg-white transition-colors placeholder-gray-300'
							/>
						</div>
					</div>
				</div>

				{/* SECCIÓN 4: DETALLES */}
				<div className='flex flex-col gap-1'>
					<label className='block text-[10px] font-black text-gray-400 uppercase tracking-widest'>Descripción Detallada u Observaciones</label>
					<textarea
						rows={3}
						value={descripcion}
						onChange={(e) => setDescripcion(e.target.value)}
						placeholder='INFORMACIÓN SOBRE PREVENTAS, BANDAS DE SOPORTE O RESTRICCIONES DE EDAD...'
						className='w-full bg-gray-50 border-2 border-black rounded-none px-4 py-3 text-xs font-bold uppercase focus:outline-none focus:bg-white focus:text-red-600 transition-colors resize-none placeholder-gray-300'
					/>
				</div>

				{/* BOTÓN SUBMIT BRUTALISTA INTEGRADO */}
				<button
					type='submit'
					disabled={enviando}
					className={`w-full font-black text-xs py-4 rounded-none uppercase tracking-widest border-2 border-black transition-all duration-100 ${
						enviando
							? 'bg-gray-200 text-gray-400 border-gray-400 cursor-not-allowed shadow-none'
							: 'bg-black text-white hover:bg-red-600 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_#000000] cursor-pointer'
					}`}>
					{enviando ? 'Construyendo Request JSON...' : 'Postular Evento a BigQuery ➜'}
				</button>
			</form>
		</div>
	);
}
