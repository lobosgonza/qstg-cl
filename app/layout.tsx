import type { Metadata } from 'next';
import { Syne, Space_Grotesk } from 'next/font/google'; // 🚀 Cambiado a las fuentes de Google
import './globals.css';

// Componentes globales fijos
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 🎭 Configuración corregida de la fuente Syne (peso 900 eliminado)
const syne = Syne({
	variable: '--font-syne',
	subsets: ['latin'],
	weight: ['400', '700', '800'], // 🚀 Usamos los pesos oficiales disponibles
});

// 💻 Configuración de la fuente para metadatos, fechas y terminal técnica
const spaceGrotesk = Space_Grotesk({
	variable: '--font-space',
	subsets: ['latin'],
	weight: ['500', '700'],
});

// Metadatos optimizados para el SEO real de tu cartelera
export const metadata: Metadata = {
	title: 'QSTG.cl - Panoramas y Eventos en Santiago de Chile',
	description: 'Descubre todos los conciertos, festivales, obras de teatro y panoramas de tu ciudad en un solo lugar y sin ruido.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='es' // Evita que el navegador ofrezca traducir la página
			className={`${syne.variable} ${spaceGrotesk.variable} h-full antialiased`}>
			{/* 🌌 Cambiado bg-gray-50 por el color de revista oscura y texto blanco */}
			<body className='min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased selection:bg-red-600 selection:text-white'>
				<Navbar />
				<div className='flex-1'>{children}</div>
				<Footer />
			</body>
		</html>
	);
}
