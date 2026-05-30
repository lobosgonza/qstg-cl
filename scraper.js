const axios = require('axios');
const { JSDOM } = require('jsdom'); // <-- Corregido typo de JJSOM
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// 🌟 CONFIGURACIÓN AVANZADA ANTI-BLOQUEO (Solución al Error 403)
const AXIOS_CONFIG = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'es-CL,es;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Delivered-With': 'Navigate',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
    },
    timeout: 20000 // Subimos a 20 segundos el margen de respuesta
};

function generarSlug(texto) {
    return texto
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ========================================================
// FUNCIÓN AUXILIAR REPARADA: Forzar Español en Landings
// ========================================================
async function extraerDetalleLanding(urlControl) {
    if (!urlControl || !urlControl.includes('http')) {
        return { resumen: "", cuerpo: "", fechaReal: "", lugarReal: "", bannerGigante: "", imagenCuadradaHD: "" };
    }

    try {
        // Creamos una configuración de cabeceras específica para los sub-viajes profundos
        const CONFIG_DETALLE = {
            headers: {
                ...AXIOS_CONFIG.headers,
                'Accept-Language': 'es-CL,es;q=0.9',
                // 🌟 TRUCO MAESTRO DJANGO: Forzamos la cookie de idioma español
                'Cookie': 'django_language=es'
            },
            timeout: 15000
        };

        const { data: htmlInner } = await axios.get(urlControl, CONFIG_DETALLE);
        const dom = new JSDOM(htmlInner);
        const doc = dom.window.document;

        // 1. Extraemos el Resumen SEO
        const resumen = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
            doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || "";

        // 2. Extraemos la descripción detallada del cuerpo
        const contenedorCuerpo = doc.querySelector('.cover-line, .prose, .event-description, #main p, .tab-panels');
        const cuerpo = contenedorCuerpo ? contenedorCuerpo.textContent.replace(/\s+/g, ' ').trim() : "";

        // 3. Extraemos el lugar real
        const lugarReal = doc.querySelector('.list-describe, .venue, .event-venue, .posted_in a')?.textContent?.trim() || "";

        // 4. TRUCO DE REPARACIÓN DE FECHA (Para selectores planos e inglés residual)
        let fechaReal = doc.querySelector('time, .fecha, .event-date')?.textContent?.trim() || "";

        // Si la ticketera no usa etiquetas semánticas, atrapamos el texto del primer contenedor de iconos
        if (!fechaReal) {
            const iconoFecha = doc.querySelector('svg font, span.text-lg.font-medium');
            if (iconoFecha) {
                fechaReal = iconoFecha.textContent?.trim() || "";
            }
        }

        // Traductores de Fallback de emergencia por si el servidor ignora la cookie (un clásico en AWS)
        if (fechaReal) {
            fechaReal = fechaReal.toUpperCase()
                .replace("JUNE", "JUNIO")
                .replace("JULY", "JULIO")
                .replace("MAY", "MAYO")
                .replace("AUGUST", "AGOSTO")
                .replace("SEPTEMBER", "SEPTIEMBRE")
                .replace(", 9 P.M.", " - 21:00 HRS"); // Formateamos a hora chilena
        }

        if (!fechaReal) {
            const scriptsSchema = doc.querySelectorAll('script[type="application/ld+json"]');
            for (let script of scriptsSchema) {
                try {
                    const dataJson = JSON.parse(script.textContent);
                    if (dataJson["@graph"]) {
                        const webpageData = dataJson["@graph"].find((item) => item["@type"] === "ItemPage");
                        if (webpageData && webpageData.datePublished) {
                            const dateObj = new Date(webpageData.datePublished);
                            fechaReal = dateObj.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
                            break;
                        }
                    }
                } catch (e) { }
            }
        }

        // 5. Captura de Imágenes HD
        const imagenCuadradaHD = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || "";

        const bannerGigante = doc.querySelector('.event-header img[data-type="desktop"], #component-fca93ed5-b7a7-492e-b25a-2ada2f02af3b img:first-child')?.getAttribute('src') ||
            doc.querySelector('picture source[media="(min-width:1024px)"]')?.getAttribute('srcset') ||
            doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || "";

        return { resumen, cuerpo, fechaReal, lugarReal, bannerGigante, imagenCuadradaHD };
    } catch (e) {
        return { resumen: "", cuerpo: "", fechaReal: "", lugarReal: "", bannerGigante: "", imagenCuadradaHD: "" };
    }
}

// ========================================================
// SCRAPER PUNTOTICKET
// ========================================================
async function scrapperPuntoTicket() {
    console.log("🚀 Buscando eventos en PuntoTicket...");
    try {
        const { data: html } = await axios.get('https://www.puntoticket.com', AXIOS_CONFIG);
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const tarjetas = document.querySelectorAll('#listado-eventos-filterizr article.event-item');
        const resultados = [];

        for (let i = 0; i < tarjetas.length; i++) {
            const tarjeta = tarjetas[i];
            let titulo = tarjeta.querySelector('h3')?.innerText?.trim() || "";
            if (!titulo || titulo === "Sin título") {
                titulo = tarjeta.querySelector('h3')?.getAttribute('title') || tarjeta.getAttribute('title') || 'Evento QSTG';
            }

            const descripcionRaw = tarjeta.querySelector('p.descripcion')?.textContent?.trim() || '';
            const partes = descripcionRaw.split('/');
            const lugarRealGeneral = partes[0] ? partes[0].trim() : 'MOVISTAR ARENA';
            const categoriaReal = partes[1] ? partes[1].trim().toUpperCase() : 'MÚSICA';

            const linkRelativo = tarjeta.querySelector('a')?.getAttribute('href') || '';
            const linkFinal = linkRelativo.startsWith('http') ? linkRelativo : `https://www.puntoticket.com${linkRelativo}`;

            // 🌟 CORREGIDO: Lógica de imagen HD movida ADENTRO del ciclo for
            const imagenCaluga = tarjeta.querySelector('img.img--evento')?.getAttribute('src') || '';
            const imagenHD = imagenCaluga.replace('_calugalistado.jpg', '_rs.jpg');

            console.log(`   ↳ [PT] Escaneando landing interna: ${titulo}`);
            const detalle = await extraerDetalleLanding(linkFinal);

            resultados.push({
                "Título": titulo.trim(),
                "Slug": generarSlug(titulo),
                "Lugar/Recinto": detalle.lugarReal || lugarRealGeneral.toUpperCase(),
                "Categoría": categoriaReal,
                "Fecha Evento": detalle.fechaReal || "FECHA POR CONFIRMAR",
                "Link Compra": linkFinal,
                "Imagen URL": imagenHD,
                "Banner URL": detalle.bannerGigante,
                "Resumen SEO": detalle.resumen,
                "Descripción Detallada": detalle.cuerpo,
                "Ticketera": "PuntoTicket"
            });
        }
        return resultados;
    } catch (error) {
        console.error("❌ Error en PuntoTicket:", error.message);
        return [];
    }
}

// ========================================================
// SCRAPER TICKETMASTER MULTI-PÁGINA (Base de datos completa)
// ========================================================
async function scrapperTicketMaster() {
    console.log("🚀 Iniciando raspado masivo de Ticketmaster por categorías...");

    const urlsCategorias = [
        { url: 'https://www.ticketmaster.cl/page/musica', nombre: 'MÚSICA' },
        { url: 'https://www.ticketmaster.cl/page/artes-y-teatro', nombre: 'ARTES Y TEATRO' },
        { url: 'https://www.ticketmaster.cl/page/deportes', nombre: 'DEPORTES' },
        { url: 'https://www.ticketmaster.cl/page/ferias-y-expo', nombre: 'FERIAS Y EXPO' }
    ];

    let todosLosEventosRaw = [];

    for (const cat of urlsCategorias) {
        console.log(`   🔍 Conectando a categoría: ${cat.nombre}...`);
        try {
            const { data: html } = await axios.get(cat.url, AXIOS_CONFIG);
            const dom = new JSDOM(html);
            const document = dom.window.document;

            const tarjetas = document.querySelectorAll('.events_grid .grid_element');
            let contadorCat = 0;

            for (let i = 0; i < tarjetas.length; i++) {
                const tarjeta = tarjetas[i];
                const titulo = tarjeta.querySelector('.item_title')?.textContent?.trim() || 'Evento por confirmar';
                const lugarRaw = tarjeta.querySelector('.grid-label')?.textContent?.trim() || 'Recinto Santiago';
                const lugar = lugarRaw.replace('<span class="hide"></span>', '').trim();
                const fecha = tarjeta.querySelector('.details p')?.textContent?.trim() || 'Fecha por confirmar';
                const linkRelativo = tarjeta.querySelector('a')?.getAttribute('href') || '';
                const linkFinal = linkRelativo.startsWith('http') ? linkRelativo : `https://www.ticketmaster.cl${linkRelativo.replace('../', '/')}`;
                const imagen = tarjeta.querySelector('img')?.getAttribute('src') || '';

                if (titulo !== 'Evento por confirmar' && !linkFinal.includes('/page/')) {
                    todosLosEventosRaw.push({
                        "Título": titulo,
                        "Slug": generarSlug(titulo),
                        "Lugar/Recinto": lugar.toUpperCase(),
                        "Categoría": cat.nombre,
                        "Fecha Evento": fecha,
                        "Link Compra": linkFinal,
                        "Imagen URL": imagen
                    });
                    contadorCat++;
                }
            }
            console.log(`      ✅ Extraídos ${contadorCat} eventos de ${cat.nombre}.`);
        } catch (error) {
            console.error(`   ❌ Error al raspar la categoría ${cat.nombre}:`, error.message);
        }
    }

    console.log("🧹 Limpiando eventos repetidos de Ticketmaster...");
    const mapeoUnicos = new Map();
    todosLosEventosRaw.forEach(evento => {
        mapeoUnicos.set(evento.Slug, evento);
    });
    const resultadosUnicos = Array.from(mapeoUnicos.values());

    console.log(`⏱️ Iniciando sub-viajes para ${resultadosUnicos.length} descripciones de Ticketmaster...`);
    for (let evento of resultadosUnicos) {
        console.log(`      ↳ [TM] Extrayendo detalles de: ${evento.Título}`);
        const detalle = await extraerDetalleLanding(evento["Link Compra"]);

        evento["Resumen SEO"] = detalle.resumen;
        evento["Descripción Detallada"] = detalle.cuerpo;
        evento["Imagen URL"] = detalle.imagenCuadradaHD || evento["Imagen URL"].split('?')[0];
        evento["Banner URL"] = detalle.bannerGigante;
        evento["Ticketera"] = "Ticketmaster";
    }

    return resultadosUnicos;
}

// ========================================================
// SCRAPER TICKETHOY
// ========================================================
async function scrapperTicketHoy() {
    console.log("🚀 Buscando eventos en TicketHoy Chile...");
    try {
        const { data: html } = await axios.get('https://scl.tickethoy.com', AXIOS_CONFIG);
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const tarjetas = document.querySelectorAll('.eventos-normal .container-home-event');
        const resultados = [];

        for (let i = 0; i < tarjetas.length; i++) {
            const tarjeta = tarjetas[i];
            const linkElement = tarjeta.querySelector('.home-event-image a');
            const imgElement = tarjeta.querySelector('.home-event-image img');

            if (!linkElement || !imgElement) continue;

            const titulo = imgElement.getAttribute('alt') || 'Evento TicketHoy';
            const linkRelativo = linkElement.getAttribute('href') || '';
            const linkFinal = linkRelativo.startsWith('http') ? linkRelativo : `https://scl.tickethoy.com${linkRelativo}`;

            const imagenRaw = imgElement.getAttribute('src') || imgElement.getAttribute('data-src') || '';
            const imagenFinal = imagenRaw.startsWith('http') ? imagenRaw : `https://scl.tickethoy.com${imagenRaw}`;

            let recinto = "SANTIAGO";
            if (titulo.toUpperCase().includes("BATUTA")) {
                recinto = "LA BATUTA - ÑUÑOA";
            }

            resultados.push({
                "Título": titulo.trim(),
                "Slug": generarSlug(titulo),
                "Lugar/Recinto": recinto,
                "Categoría": "MÚSICA",
                "Fecha Evento": "VER EN TICKET CONCIERTO",
                "Link Compra": linkFinal,
                "Imagen URL": imagenFinal,
                "Banner URL": imagenFinal,
                "Resumen SEO": `Compra tus entradas para ${titulo} a través de TicketHoy Chile.`,
                "Descripción Detallada": `Disfruta de ${titulo} en vivo. Asegura tu acceso oficial a través de la ticketera TicketHoy.`,
                "Ticketera": "TicketHoy"
            });
        }

        console.log(`   ✅ Extraídos ${resultados.length} eventos de TicketHoy.`);
        return resultados;
    } catch (error) {
        console.error("❌ Error en TicketHoy:", error.message);
        return [];
    }
}

// ========================================================
// SCRAPER TU ACCESO - REFACTORIZADO Y BLINDADO EN HD
// ========================================================
async function scrapperTuAcceso() {
    console.log("🚀 [ANTI-BOT BYPASS] Iniciando Tu Acceso con Chrome Real...");
    let browser;
    try {
        console.log("   🌐 Levantando navegador en segundo plano...");
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        console.log("   ✈️ Navegando a https://tuacceso.cl/...");
        await page.goto('https://tuacceso.cl/', { waitUntil: 'networkidle2', timeout: 30000 });

        const html = await page.content();
        await browser.close();

        const dom = new JSDOM(html);
        const document = dom.window.document;

        const tarjetas = document.querySelectorAll('.products .product-small.col, .product-small.col');
        console.log(`   📊 [INFO] Se encontraron ${tarjetas.length} eventos en la vitrina de Tu Acceso.`);

        let listaEventosRaw = [];

        for (let i = 0; i < tarjetas.length; i++) {
            const tarjeta = tarjetas[i];
            const linkElement = tarjeta.querySelector('.product-title a');
            const imgElement = tarjeta.querySelector('.box-image img');
            const recintoElement = tarjeta.querySelector('.product-cat');

            if (!linkElement || !imgElement) continue;

            const titulo = linkElement.textContent?.trim() || 'Evento Tu Acceso';
            const linkFinal = linkElement.getAttribute('href') || '';
            const imagenRaw = imgElement.getAttribute('data-src') || imgElement.getAttribute('src') || '';
            const recintoRaw = recintoElement?.textContent?.trim() || "BODEGUITA DE NICANOR";
            const recinto = recintoRaw.toUpperCase();

            // Corregida la doble declaración que tenías aquí
            let ciudad = "SANTIAGO";
            const clasesTarjeta = tarjeta.className.toUpperCase();

            if (clasesTarjeta.includes("CONCEPCION") || recinto.includes("NICANOR") || recinto.includes("MARINA")) {
                ciudad = "CONCEPCIÓN";
            } else if (clasesTarjeta.includes("LA-SERENA") || recinto.includes("FARO") || recinto.includes("PAPAYO")) {
                ciudad = "LA SERENA";
            } else if (clasesTarjeta.includes("IQUIQUE") || recinto.includes("FURIA")) {
                ciudad = "IQUIQUE";
            } else if (clasesTarjeta.includes("PUERTO-VARAS")) {
                ciudad = "PUERTO VARAS";
            } else if (clasesTarjeta.includes("TALCA")) {
                ciudad = "TALCA";
            } else if (clasesTarjeta.includes("VALPARAISO")) {
                ciudad = "VALPARAÍSO";
            }

            const recintoUnificado = `${recinto} - ${ciudad}`;

            let categoria = "MÚSICA";
            const tituloUpper = titulo.toUpperCase();
            if (tituloUpper.includes("FIESTA") || tituloUpper.includes("MECHONA") || tituloUpper.includes("FOTOLOG")) {
                categoria = "FIESTA";
            } else if (tituloUpper.includes("DON CARTER") || tituloUpper.includes("HUMOR") || tituloUpper.includes("STAND UP")) {
                categoria = "ARTES Y TEATRO";
            } else if (tituloUpper.includes("ESTACIONAMIENTO")) {
                categoria = "ESPECIALES";
            }

            listaEventosRaw.push({
                "Título": titulo,
                "Slug": generarSlug(titulo),
                "Lugar/Recinto": recintoUnificado,
                "Categoría": categoria,
                "Link Compra": linkFinal,
                "Imagen Base": imagenRaw
            });
        }

        const resultadosDefinitivos = [];
        console.log(`⏱️ Iniciando sub-viajes para ${listaEventosRaw.length} descripciones de Tu Acceso...`);

        browser = await puppeteer.launch({ headless: true });
        const pageDetail = await browser.newPage();
        await pageDetail.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        // 🌟 AGREGA ESTA LÍNEA DEBAJO:
        await pageDetail.setExtraHTTPHeaders({
            'Accept-Language': 'es-CL,es;q=0.9',
            'Cookie': 'django_language=es'
        });

        for (let evento of listaEventosRaw) {
            console.log(`      ↳ [TA] Abriendo sub-landing: "${evento["Título"]}"`);

            try {
                await pageDetail.goto(evento["Link Compra"], { waitUntil: 'networkidle2', timeout: 20000 });
                const innerHtml = await pageDetail.content();

                const innerDom = new JSDOM(innerHtml);
                const doc = innerDom.window.document;

                const resumen = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                    doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || "";

                const contenedorCuerpo = doc.querySelector('.cover-line, .prose, .event-description, #main p, .tab-panels');
                const cuerpo = contenedorCuerpo ? contenedorCuerpo.textContent.replace(/\s+/g, ' ').trim() : "";

                let fechaReal = "";
                const scriptsSchema = doc.querySelectorAll('script[type="application/ld+json"]');
                for (let script of scriptsSchema) {
                    try {
                        const dataJson = JSON.parse(script.textContent);
                        if (dataJson["@graph"]) {
                            const webpageData = dataJson["@graph"].find((item) => item["@type"] === "ItemPage");
                            if (webpageData && webpageData.datePublished) {
                                const dateObj = new Date(webpageData.datePublished);
                                fechaReal = dateObj.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' });
                                break;
                            }
                        }
                    } catch (e) { }
                }

                // ESTRATEGIA DE IMAGEN HD INTEGRADA Y SANADA
                let imagenDefinitiva = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                    doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') ||
                    evento["Imagen Base"];

                // Fallback de seguridad: si de todos modos se nos coló una miniatura del Home, la limpiamos a su formato madre
                if (imagenDefinitiva.includes('-247x296')) {
                    imagenDefinitiva = imagenDefinitiva.replace('-247x296', '');
                }

                const bannerGigante = doc.querySelector('.header-bg-image')?.style?.backgroundImage ||
                    doc.querySelector('.event-header img[data-type="desktop"]')?.getAttribute('src') ||
                    imagenDefinitiva;

                resultadosDefinitivos.push({
                    "Título": evento["Título"],
                    "Slug": evento["Slug"],
                    "Lugar/Recinto": evento["Lugar/Recinto"],
                    "Categoría": evento["Categoría"],
                    "Fecha Evento": fechaReal || "FECHA POR CONFIRMAR",
                    "Link Compra": evento["Link Compra"],
                    "Imagen URL": imagenDefinitiva,
                    "Banner URL": bannerGigante,
                    "Resumen SEO": resumen || `Compra tus entradas para ${evento["Título"]} en Tu Acceso.`,
                    "Descripción Detallada": cuerpo || "Detalles del evento en cartelera oficial.",
                    "Ticketera": "Tu Acceso"
                });
            } catch (err) {
                console.log(`      ⚠️ Error menor al abrir la landing de un show: ${err.message}`);
            }
        }

        await browser.close();
        console.log(`=== ✅ [ÉXITO] Tu Acceso completado con ${resultadosDefinitivos.length} eventos ===`);
        return resultadosDefinitivos;

    } catch (error) {
        console.error("❌ [ERROR GENERAL PUPPETEER]:", error.message);
        if (browser) await browser.close();
        return [];
    }
}


// ========================================================
// SCRAPER EVENTRID CHILE REPARADO (Bypass de React/Vite)
// ========================================================
async function scrapperEventrid() {
    console.log("🚀 [SPA BROWSER RUNNER] Iniciando Eventrid con Chrome Oculto...");
    let browser;
    try {
        console.log("   🌐 Inicializando Puppeteer para renderizar JavaScript...");
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        console.log("   ✈️ Navegando a la cartelera de https://www.eventrid.cl/eventos ...");
        // Forzamos a que espere a que la red esté ociosa (lo que garantiza que React ya dibujó las tarjetas)
        await page.goto('https://www.eventrid.cl/eventos', { waitUntil: 'networkidle2', timeout: 35000 });

        // Extraemos el HTML ya masticado y procesado por el motor V8 de Chrome
        const html = await page.content();
        await browser.close();

        console.log("   🧱 Pasando código renderizado a JSDOM...");
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Selector ultra-preciso: Busca los enlaces que apuntan a un evento dentro de la grilla principal
        const tarjetas = document.querySelectorAll('div.grid a[href*="/eventos/"]');
        console.log(`   📊 [INFO] El navegador detectó ${tarjetas.length} eventos activos en la grilla.`);

        const resultados = [];

        for (let i = 0; i < tarjetas.length; i++) {
            const tarjeta = tarjetas[i];
            const tituloElement = tarjeta.querySelector('h3');
            const imgElement = tarjeta.querySelector('div[style*="background-image"]');
            const infoFechaElement = tarjeta.querySelector('p.text-xs');

            if (!tituloElement || !imgElement) continue;

            const titulo = tituloElement.textContent?.trim() || "Evento Eventrid";
            const linkCompra = tarjeta.getAttribute('href') || "";

            // TRUCO DE IMAGEN HD: Extraemos la URL limpia del background-image inline
            const estiloBg = imgElement.getAttribute('style') || "";
            const matchUrl = estiloBg.match(/url\(([^)]+)\)/);
            let imagenUrl = "";
            if (matchUrl && matchUrl[1]) {
                imagenUrl = matchUrl[1].replace(/["']/g, ""); // Limpiamos comillas inyectadas
            }

            const fechaRaw = infoFechaElement?.textContent?.trim() || "CONSULTAR CARTELERA";

            // Categorización dinámica según el título del show
            let categoria = "MÚSICA";
            const tituloUpper = titulo.toUpperCase();
            if (tituloUpper.includes("EXPO") || tituloUpper.includes("FERIA") || tituloUpper.includes("CONGRESO")) {
                categoria = "FERIAS Y EXPO";
            } else if (tituloUpper.includes("RUNNING") || tituloUpper.includes("CORRIDA") || tituloUpper.includes("MARATON")) {
                categoria = "DEPORTES";
            } else if (tituloUpper.includes("FESTIVAL") || tituloUpper.includes("FEST") || tituloUpper.includes("FIESTA")) {
                categoria = "FIESTA";
            }

            resultados.push({
                "Título": titulo,
                "Slug": generarSlug(titulo),
                "Lugar/Recinto": "RECINTO POR CONFIRMAR", // Eventrid maneja esto dentro de la landing, lo dejamos listo
                "Categoría": categoria,
                "Fecha Evento": fechaRaw.toLowerCase()
                    .replace("mayo", "Mayo")
                    .replace("junio", "Junio")
                    .replace("julio", "Julio")
                    .replace("agosto", "Agosto"),
                "Link Compra": linkCompra,
                "Imagen URL": imagenUrl,
                "Banner URL": imagenUrl,
                "Resumen SEO": `Compra tus e-tickets oficiales para ${titulo} a través de Eventrid Chile.`,
                "Descripción Detallada": `No te pierdas ${titulo}. Entradas y acreditaciones digitales oficiales disponibles en la plataforma Eventrid.`,
                "Ticketera": "Eventrid"
            });
        }

        console.log(`   ✅ Extraídos ${resultados.length} eventos de Eventrid de forma exitosa.`);
        return resultados;

    } catch (error) {
        console.error("❌ Error al ejecutar el headless browser en Eventrid:", error.message);
        if (browser) await browser.close();
        return [];
    }
}

// ========================================================
// SCRAPER TICKETJUSTO (CON SIFÓN DE FECHAS EN ESPAÑOL)
// ========================================================
async function scrapperTicketJusto() {
    console.log("🚀 Buscando eventos en TicketJusto Chile...");
    try {
        const { data: html } = await axios.get('https://ticketjusto.com/', AXIOS_CONFIG);
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const contenedorActivos = document.querySelectorAll('h2.text-2xl.font-bold')[0]?.nextElementSibling;

        if (!contenedorActivos) {
            console.log("   ⚠️ No se detectó la sección de eventos activos en TicketJusto.");
            return [];
        }

        const tarjetas = contenedorActivos.querySelectorAll('a[href*="/events/"]');
        const resultados = [];

        for (let i = 0; i < tarjetas.length; i++) {
            const tarjeta = tarjetas[i];
            const tituloElement = tarjeta.querySelector('h2');
            const imgElement = tarjeta.querySelector('img');
            const pElement = tarjeta.querySelector('p.text-gray-600');
            const contenedoresIconos = tarjeta.querySelectorAll('.flex.items-center.text-gray-500');

            if (!tituloElement || !imgElement) continue;

            const titulo = tituloElement.textContent?.trim() || "Evento TicketJusto";
            const linkRelativo = tarjeta.getAttribute('href') || "";
            const linkFinal = linkRelativo.startsWith('http') ? linkRelativo : `https://ticketjusto.com${linkRelativo}`;
            const imagenUrl = imgElement.getAttribute('src') || "";
            const descripcionCuerpo = pElement?.textContent?.trim() || "Disfruta del evento en vivo.";

            // 1. Extraemos los datos crudos
            const fechaRaw = contenedoresIconos[0]?.querySelector('span')?.textContent?.trim() || "";
            const recintoRaw = contenedoresIconos[1]?.querySelector('span')?.textContent?.trim() || "RECINTO POR CONFIRMAR";

            // 🌟 MOTOR DE TRADUCCIÓN Y FORMATEO DE FECHA INTEGRADO
            let fechaFormateada = "FECHA POR CONFIRMAR";

            if (fechaRaw) {
                // Mapeo manual para asegurar español e ignorar cómo responda el middleware
                const mesesDic = {
                    'JANUARY': 'Enero', 'FEBRUARY': 'Febrero', 'MARCH': 'Marzo',
                    'APRIL': 'Abril', 'MAY': 'Mayo', 'JUNE': 'Junio',
                    'JULY': 'Julio', 'AUGUST': 'Agosto', 'SEPTEMBER': 'Septiembre',
                    'OCTOBER': 'Octubre', 'NOVEMBER': 'Noviembre', 'DECEMBER': 'Diciembre'
                };

                // Desarmamos el string (Ej: "June 20, 2026") usando espacios y comas
                // Partes esperadas: [ "June", "20", "", "2026" ]
                const partes = fechaRaw.replace(',', '').split(' ');
                const mesIngles = partes[0] ? partes[0].toUpperCase() : "";
                const dia = partes[1] || "";
                const anio = partes[2] || "2026";

                const mesEspanol = mesesDic[mesIngles] || "Junio";

                // Re-armamos el formato estándar idéntico al resto: "20 de Junio"
                if (dia && mesEspanol) {
                    fechaFormateada = `${dia} de ${mesEspanol}`;
                } else {
                    fechaFormateada = fechaRaw; // Fallback por si cambia la estructura
                }
            }

            // Clasificación de ciudad analizando el texto del recinto
            let ciudad = "SANTIAGO";
            const recintoUpper = recintoRaw.toUpperCase();
            if (recintoUpper.includes("PADRE LAS CASAS") || recintoUpper.includes("TEMUCO") || recintoUpper.includes("MAQUEHUE")) {
                ciudad = "PADRE LAS CASAS";
            } else if (recintoUpper.includes("CHILLAN") || recintoUpper.includes("CHILLÁN") || recintoUpper.includes("MAGNOLIA")) {
                ciudad = "CHILLÁN";
            } else if (recintoUpper.includes("COPIAPO") || recintoUpper.includes("COPIAPÓ") || recintoUpper.includes("AMMA")) {
                ciudad = "COPIAPÓ";
            } else if (recintoUpper.includes("VALDIVIA") || recintoUpper.includes("BÜNEMANN")) {
                ciudad = "VALDIVIA";
            } else if (recintoUpper.includes("PROVIDENCIA") || recintoUpper.includes("BAR DE RENE") || recintoUpper.includes("ITALIA")) {
                ciudad = "SANTIAGO";
            }

            const recintoUnificado = `${recintoRaw.toUpperCase()} - ${ciudad}`;

            resultados.push({
                "Título": titulo,
                "Slug": generarSlug(titulo),
                "Lugar/Recinto": recintoUnificado,
                "Categoría": "MÚSICA",
                "Fecha Evento": fechaFormateada, // 🌟 "20 de Junio" impecable
                "Link Compra": linkFinal,
                "Imagen URL": imagenUrl,
                "Banner URL": imagenUrl,
                "Resumen SEO": `${titulo}. Venta de entradas oficial disponible en TicketJusto Chile.`,
                "Descripción Detallada": descripcionCuerpo,
                "Ticketera": "TicketJusto"
            });
        }

        console.log(`   ✅ Extraídos ${resultados.length} eventos vigentes de TicketJusto.`);
        return resultados;
    } catch (error) {
        console.error("❌ Error en TicketJusto:", error.message);
        return [];
    }
}
// ========================================================
// ORQUESTADOR CENTRAL
// ========================================================
// async function correrTodoElServidor() {
//     console.log("🔥 [QSTG DEEP AUTOMATION] Iniciando raspado unificado de 4 ejes...");

//     const eventosPunto = await scrapperPuntoTicket();
//     const eventosTicket = await scrapperTicketMaster();
//     const eventosHoy = await scrapperTicketHoy();
//     const eventosTuAcceso = await scrapperTuAcceso();

//     const carteleraTotal = [...eventosPunto, ...eventosTicket, ...eventosHoy, ...eventosTuAcceso];

//     const rutaArchivo = path.join(__dirname, 'eventos.json');
//     fs.writeFileSync(rutaArchivo, JSON.stringify(carteleraTotal, null, 2), 'utf-8');

//     console.log(`✨ [CONSOLIDADO FINAL] ¡Proceso impecable! qstg.cl ahora tiene ${carteleraTotal.length} panoramas integrando PuntoTicket, Ticketmaster, TicketHoy y Tu Acceso.`);
// }

// correrTodoElServidor();


// ========================================================
// ORQUESTADOR CENTRAL MODULAR (Soporte para 6 Ticketeras)
// ========================================================
async function correrServidorModular() {
    const argumento = process.argv[2] ? process.argv[2].toLowerCase() : 'todos';

    console.log("🔥 [QSTG AUTOMATION] Iniciando sistema de raspado modular v6...");

    let eventosPunto = [];
    let eventosTicket = [];
    let eventosHoy = [];
    let eventosTuAcceso = [];
    let eventosEventrid = [];
    let eventosJusto = []; // <-- NUEVA VARIABLE

    const rutaArchivo = path.join(__dirname, 'eventos.json');
    let carteleraExistente = [];
    if (fs.existsSync(rutaArchivo)) {
        try {
            carteleraExistente = JSON.parse(fs.readFileSync(rutaArchivo, 'utf-8'));
        } catch (e) {
            carteleraExistente = [];
        }
    }

    // DISPARADORES SELECTIVOS POR ARGUMENTO
    if (argumento === 'puntoticket' || argumento === 'todos') {
        eventosPunto = await scrapperPuntoTicket();
    }
    if (argumento === 'ticketmaster' || argumento === 'todos') {
        eventosTicket = await scrapperTicketMaster();
    }
    if (argumento === 'tickethoy' || argumento === 'todos') {
        eventosHoy = await scrapperTicketHoy();
    }
    if (argumento === 'tuacceso' || argumento === 'todos') {
        eventosTuAcceso = await scrapperTuAcceso();
    }
    if (argumento === 'eventrid' || argumento === 'todos') {
        eventosEventrid = await scrapperEventrid();
    }
    if (argumento === 'ticketjusto' || argumento === 'todos') {
        eventosJusto = await scrapperTicketJusto(); // <-- NUEVO DISPARADOR
    }

    let carteleraFinal = [];

    if (argumento === 'todos') {
        carteleraFinal = [...eventosPunto, ...eventosTicket, ...eventosHoy, ...eventosTuAcceso, ...eventosEventrid, ...eventosJusto];
    } else {
        const mapeoMantenido = new Map();

        // Conservamos los datos de las otras marcas intactas en el archivo estático JSON
        carteleraExistente.forEach(ev => {
            if (ev.Ticketera && ev.Ticketera.toLowerCase() !== argumento) {
                mapeoMantenido.set(ev.Slug, ev);
            }
        });

        const nuevosEventos = [...eventosPunto, ...eventosTicket, ...eventosHoy, ...eventosTuAcceso, ...eventosEventrid, ...eventosJusto];
        nuevosEventos.forEach(ev => mapeoMantenido.set(ev.Slug, ev));

        carteleraFinal = Array.from(mapeoMantenido.values());
    }

    fs.writeFileSync(rutaArchivo, JSON.stringify(carteleraFinal, null, 2), 'utf-8');

    console.log(`\n✨ [PROCESO COMPLETADO]`);
    console.log(`   Modo ejecutado: "${argumento.toUpperCase()}"`);
    console.log(`   Total de la cartelera en QSTG.cl: ${carteleraFinal.length} eventos consolidados.`);
}

correrServidorModular();