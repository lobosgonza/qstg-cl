import React from 'react';
import HomePage from '../page'; // Sube un nivel para morder app/page.tsx
import { supabase } from '../../supabaseClient'; // Sube dos niveles para morder tu archivo de la raíz

interface Props {
	params: Promise<{ categoria: string }>;
}

export default async function CategoriaPage({ params }: Props) {
	const { categoria } = await params;

	if (!categoria) return <HomePage cataInicial='TODOS' />;

	// Consulta automática a la tabla que creamos en Supabase
	const { data } = await supabase.from('categorias_maestras').select('nombre_json').eq('slug_url', categoria.toLowerCase()).single();

	// Si calza con Supabase usa el nombre estandarizado (ej: "ELECTRÓNICA"),
	// si no, usa el formateo básico por defecto
	const categoriaFinal = data?.nombre_json || categoria.toUpperCase().replace('-', ' ');

	return <HomePage cataInicial={categoriaFinal} />;
}

// import React from 'react';
// import HomePage from '../page'; // Asegúrate de que apunte a tu app/page.tsx principal

// interface Props {
// 	params: Promise<{ categoria: string }>;
// }

// export default async function CategoriaPage({ params }: Props) {
// 	const { categoria } = await params;

// 	if (!categoria) return <HomePage cataInicial='TODOS' />;

// 	// 🌟 TODO SE REDUCE A ESTO:
// 	// Como JP ya se encarga de las tildes en el backend, el Front solo limpia los guiones y pasa a mayúsculas.
// 	// Ejemplo: "teatro-y-comedia" -> "TEATRO Y COMEDIA" (que calzará idéntico con tu JSON limpio).
// 	const categoriaFormateada = categoria.toUpperCase().replace('-', ' ');

// 	return <HomePage cataInicial={categoriaFormateada} />;
// }
