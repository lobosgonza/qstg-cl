'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function TerminosPage() {
	const router = useRouter();

	return (
		<main className='min-h-screen pb-20 font-mono'>
			<section className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'>
				{/* BOTÓN REGRESAR */}
				<button onClick={() => router.push('/')} className='text-xs font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider cursor-pointer'>
					← VOLVER A LA PORTADA PRINCIPAL // QSTG_SYS
				</button>

				{/* ENCABEZADO TÉCNICO */}
				<div className='flex flex-col gap-1 border-b-2 border-black pb-6'>
					<span className='w-max bg-black text-white text-[9px] font-mono font-black px-2.5 py-1 uppercase tracking-widest border border-black'>
						LEGAL_SYS // CLÁUSULAS_VIGENTES
					</span>
					<h1 className='font-editorial text-2xl sm:text-3xl font-black text-gray-950 uppercase tracking-tight mt-2 leading-none'>Términos de Servicio y Uso del Sistema</h1>
					<p className='text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-2'>
						ÚLTIMA ACTUALIZACIÓN // JUNIO 2026. REGLAMENTO DE OPERACIÓN PARA USUARIOS Y PRODUCTORES.
					</p>
				</div>

				{/* TEXTO LEGAL EN BLOQUES BRUTALISTAS */}
				<div className='space-y-6 text-xs text-gray-700 font-bold uppercase tracking-tight leading-relaxed text-justify'>
					<div className='p-4 bg-gray-50 border-2 border-black space-y-2 rounded-none'>
						<h3 className='text-gray-950 font-black border-b border-black pb-1'>01 // NATURALEZA DEL SERVICIO</h3>
						<p className='font-normal text-gray-600 normal-case'>
							QSTG.cl opera estrictamente como un sistema automatizado de indexación, recopilación y difusión de eventos culturales y panoramas en Chile.{' '}
							<strong className='text-gray-950 uppercase'>QSTG.cl no es una ticketera</strong>, no vende pases de acceso, no gestiona filas virtuales ni recauda dinero por concepto
							de entradas. Cualquier transacción comercial se ejecuta directamente en las plataformas externas correspondientes.
						</p>
					</div>

					<div className='p-4 bg-gray-50 border-2 border-black space-y-2 rounded-none'>
						<h3 className='text-gray-950 font-black border-b border-black pb-1'>02 // ORIGEN DE LOS DATOS Y DESLINDE</h3>
						<p className='font-normal text-gray-600 normal-case'>
							Nuestros scripts automatizados rastrean de forma externa registros e información que ya ha sido dispuesta de manera pública en internet por terceros. QSTG.cl no
							altera la data de origen, por lo tanto, no se hace responsable por modificaciones de última hora, errores tipográficos en los precios, cambios de recinto o
							cancelaciones efectuadas por las productoras o las tiqueteras dueñas del evento.
						</p>
					</div>

					<div className='p-4 bg-gray-50 border-2 border-black space-y-2 rounded-none'>
						<h3 className='text-gray-950 font-black border-b border-black pb-1'>03 // CONTENIDO AUTOGESTIONADO (DIFUSIÓN)</h3>
						<p className='font-normal text-gray-600 normal-case'>
							Al utilizar nuestro sistema de envío de panoramas ("Difundir un panorama"), el usuario o productor garantiza que posee los derechos de imagen y la información
							fidedigna del evento. QSTG.cl se reserva el derecho técnico de auditar, modificar el formato de texto a mayúsculas estrictas o dar de baja cualquier publicación que
							sature o degrade la experiencia del índice centralizado.
						</p>
					</div>

					<div className='p-4 bg-gray-50 border-2 border-black space-y-2 rounded-none'>
						<h3 className='text-gray-950 font-black border-b border-black pb-1'>04 // MONETIZACIÓN Y ESPACIOS PATROCINADOS</h3>
						<p className='font-normal text-gray-600 normal-case'>
							El sistema se reserva el derecho de comercializar banners destacados, enlaces de afiliación o priorización de filas de eventos mediante acuerdos comerciales privados
							con productoras o marcas locales. Estos acuerdos no alteran nuestro compromiso de mantener la navegación libre de ventanas emergentes invasivas o cookies de rastreo
							parásitas.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
