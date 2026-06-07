'use client';

import React from 'react';
import Link from 'next/link';
import FormContacto from '../components/FormContacto';

export default function ContactoPage() {
	return (
		/* 📰 CONTENEDOR ESTRUCTURAL: Sin fondo plano para que respire la retícula global */
		<main className='min-h-screen pb-20 font-mono'>
			{/* Sección alineada simétricamente con el Navbar y el Formulario */}
			<section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 flex flex-col items-center'>
				{/* Botón de regreso alineado perfectamente al borde izquierdo del formulario (max-w-2xl) */}
				<div className='w-full max-w-2xl'>
					<Link href='/' className='text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider block'>
						← VOLVER A LA PORTADA PRINCIPAL // QSTG_SYS
					</Link>
				</div>

				{/* Invocación de tu formulario brutalista de alta costura */}
				<div className='w-full'>
					<FormContacto />
				</div>
			</section>
		</main>
	);
}
