const boton = document.getElementById('boton');
const contenedor = document.getElementById('dbz');
const input = document.getElementById('input');

boton.addEventListener('click', mostrarDatos);

async function mostrarDatos(){
    const url = 'https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'PON TU API KEY AQUI DE RAPIDAPI',
            'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: input.value.trim(),
            style_id: 4,
            size: '1-1'
        })
    };

    if(input.value.trim() === ''){
        contenedor.innerHTML = 'No pusiste nada';
        return;
    }

    // Deshabilitar el botón mientras se genera la imagen para evitar múltiples clics
    boton.disabled = true;
    boton.style.opacity = '0.6';
    boton.style.cursor = 'not-allowed';

    try {
        contenedor.innerHTML = '🧠 Generando imagen...';
        const response = await fetch(url, options);
        const result = await response.json(); // la API devuelve JSON

        // Extraer URL de imagen - la API devuelve final_result como array de objetos
        const firstResult = result?.final_result?.[0] || result?.result?.data?.results?.[0];
        let imageUrl = firstResult?.thumb || firstResult?.origin || firstResult?.url || 
                       firstResult?.image || firstResult?.src;
        // Fallback: buscar cualquier string que parezca URL de imagen en el objeto
        if (!imageUrl && firstResult && typeof firstResult === 'object') {
            const val = Object.values(firstResult).find(v => typeof v === 'string' && v.startsWith('http'));
            if (val) imageUrl = val;
        }

        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Imagen generada';
            // MODIFICACIÓN: Se eliminaron los estilos inline (width y borderRadius) 
            // para que la imagen use los estilos CSS que controlan el tamaño y 
            // se ajuste correctamente dentro de la card sin salirse
            // Los estilos CSS en style.css manejan: max-width: 100%, max-height: 500px, object-fit: contain

            contenedor.innerHTML = ''; // limpiar el texto anterior
            contenedor.appendChild(img);
        } else {
            // Si la estructura es diferente, mostrar en consola para depurar
            console.log('Respuesta de la API:', result);
            contenedor.innerHTML = '❌ No se pudo generar la imagen. Revisa la consola para más detalles.';
        }
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '❌ Error al generar la imagen (Posiblemente no pusiste tu API KEY de RapidAPI).';
    } finally {
        // Rehabilitar el botón al finalizar (tanto en éxito como en error)
        boton.disabled = false;
        boton.style.opacity = '1';
        boton.style.cursor = 'pointer';
    }
}
