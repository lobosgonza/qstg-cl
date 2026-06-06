'use client';

import React, { useState } from 'react';

export default function PublicarEventoPage() {
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

	const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus('loading');

		const formData = new FormData(e.currentTarget);
		const datosEvento = Object.fromEntries(formData.entries());

		// Aquí conectas con tu API Route de Next.js o directo a Supabase
		try {
			// const { error } = await supabase.from('postulaciones_eventos').insert([datosEvento]);
			setStatus('success');
		} catch {
			setStatus('error');
		}
	};

	return (
		<main className='min-h-screen bg-gray-50 py-12 px-4'>
			<div className='max-w-xl mx-auto bg-white border border-gray-100 p-8 rounded-3xl shadow-sm'>
				<h1 className='text-2xl font-black text-gray-950 tracking-tight'>Anuncia tu Evento en QSTG</h1>
				<p className='text-xs text-gray-500 mt-1 mb-6'>Si tu evento no aparece en nuestra cartelera automática, postúlalo aquí.</p>

				<form onSubmit={manejarEnvio} className='space-y-4'>
					<div>
						<label className='block text-xs font-black text-gray-700 uppercase mb-1'>Nombre del Evento *</label>
						<input
							required
							name='titulo'
							type='text'
							className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500'
							placeholder='Ej: Festival de Jazz Ñuñoa 2026'
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs font-black text-gray-700 uppercase mb-1'>Fecha *</label>
							<input required name='fecha' type='date' className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500' />
						</div>
						<div>
							<label className='block text-xs font-black text-gray-700 uppercase mb-1'>Hora *</label>
							<input required name='hora' type='time' className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500' />
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs font-black text-gray-700 uppercase mb-1'>Recinto *</label>
							<input
								required
								name='recinto'
								type='text'
								className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500'
								placeholder='Ej: Espacio Riesco'
							/>
						</div>
						<div>
							<label className='block text-xs font-black text-gray-700 uppercase mb-1'>Categoría *</label>
							<select name='categoria' className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500'>
								<option value='CONCIERTOS'>CONCIERTO</option>
								<option value='FÚTBOL'>DEPORTE</option>
								<option value='ARTES Y TEATRO'>TEATRO</option>
								<option value='FIESTA'>FIESTA</option>
							</select>
						</div>
					</div>

					<div>
						<label className='block text-xs font-black text-gray-700 uppercase mb-1'>Link Oficial de Venta *</label>
						<input
							required
							name='link'
							type='url'
							className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500'
							placeholder='https://www.puntoticket.com/...'
						/>
					</div>

					<div>
						<label className='block text-xs font-black text-gray-700 uppercase mb-1'>URL de la Imagen/Afiche (Opcional)</label>
						<input
							name='imagen'
							type='url'
							className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500'
							placeholder='https://...'
						/>
					</div>

					<div>
						<label className='block text-xs font-black text-gray-700 uppercase mb-1'>Descripción Breve *</label>
						<textarea
							required
							name='descripcion'
							rows={3}
							className='w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500'
							placeholder='Cuéntanos de qué se trata el evento...'></textarea>
					</div>

					<button
						type='submit'
						disabled={status === 'loading'}
						className='w-full bg-gray-950 hover:bg-red-600 text-white font-black text-xs py-4 rounded-xl uppercase tracking-wider transition-colors duration-200 disabled:opacity-50'>
						{status === 'loading' ? 'Enviando...' : 'Enviar Evento a Revisión'}
					</button>

					{status === 'success' && <p className='text-xs font-bold text-green-600 text-center mt-2'>¡Recibido! Revisaremos la información y se publicará pronto.</p>}
				</form>
			</div>
		</main>
	);
}
