document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.querySelector('#productos');
    const detalleContainer = document.querySelector('.detalle-contenido');
    const popupEditar = document.getElementById('popupEditar');
    const popupBorrar = document.getElementById('popupBorrar');

    // Mostrar lista de productos al cargar la página
    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            const productos = data;

            productos.forEach(producto => {
                const productoElement = document.createElement('div');
                productoElement.classList.add('producto');
                productoElement.innerHTML = `
                    <h2>${producto.nombre}</h2>
                    <ul>
                        <li>Autor: ${producto.autor}</li>
                        <li>Precio: $${producto.precio}</li>
                        <li>Categoría: ${producto.categoria}</li>
                        <li>Banco: ${producto.banco} - Descuento: ${producto.descuento}%</li>
                        <li>Cuotas: ${producto.cuotas}</li>
                        <li>Stock: ${producto.stock}</li>
                    </ul>
                `;
                productoElement.addEventListener('click', () => {
                    fetch(`/productos/${producto.idproductos}`)
                    .then(response => response.json())
                    .then(detalle => {
                        detalleContainer.innerHTML = `
                            <div class="detalle-info">
                                <h2>${detalle.nombre}</h2>
                                <p>${detalle.descripcion}</p>
                                <ul>
                                    <li>Autor: ${detalle.autor}</li>
                                    <li>Categoría: ${detalle.categoria}</li>
                                    <li>Precio: $${detalle.precio}</li>
                                    <li>Banco: ${detalle.banco} - Descuento: ${detalle.descuento}%</li>
                                    <li>Cuotas: ${detalle.cuotas}</li>
                                    <li>Interés: ${detalle.interes}</li>
                                    <li>Stock: ${detalle.stock}</li>
                                </ul>
                                <button type="button" id="editarProductoBtn">Editar Producto</button>
                                <button type="button" id="borrarProductoBtn">Borrar Producto</button>
                            </div>
                            <img src="${detalle.foto}" alt="Imagen de ${detalle.nombre}">
                        `;

                        // Evento para abrir el popup de edición
                        const editarProductoBtn = document.getElementById('editarProductoBtn');
                        editarProductoBtn.addEventListener('click', () => {
                            popupEditar.style.display = 'block';
                            document.getElementById('idProductoEditar').value = detalle.idproductos;
                            document.getElementById('nombre').value = detalle.nombre;
                            document.getElementById('autor').value = detalle.autor;
                            document.getElementById('descripcion').value = detalle.descripcion;
                            document.getElementById('categoria').value = detalle.categoria;
                            document.getElementById('precio').value = detalle.precio;
                            document.getElementById('banco').value = detalle.banco;
                            document.getElementById('descuento').value = detalle.descuento;
                            document.getElementById('cuotas').value = detalle.cuotas;
                            document.getElementById('interes').value = detalle.interes;
                            document.getElementById('stock').value = detalle.stock;
                        });

                        // Evento para abrir el popup de confirmación de borrado
                        const borrarProductoBtn = document.getElementById('borrarProductoBtn');
                        borrarProductoBtn.addEventListener('click', () => {
                            popupBorrar.style.display = 'block';
                        });
                    })
                    .catch(error => console.error('Error:', error));
                });
                productosContainer.appendChild(productoElement);
            });
        })
        .catch(error => console.error('Error:', error));

    // Evento para cancelar edición
    const cancelarEdicionBtn = document.getElementById('cancelarEdicion');
    cancelarEdicionBtn.addEventListener('click', () => {
        popupEditar.style.display = 'none'; // Ocultar el popup de edición al cancelar
    });

    // Evento para guardar edición
    const formEditar = document.getElementById('formEditar');
    formEditar.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        // Obtener los datos del formulario
        const formData = new FormData(formEditar);
        const idProducto = formData.get('idProductoEditar');

        // Construir objeto con los datos a enviar
        const productoEditado = {
            nombre: formData.get('nombre'),
            autor: formData.get('autor'),
            descripcion: formData.get('descripcion'),
            categoria: formData.get('categoria'),
            precio: formData.get('precio'),
            banco: formData.get('banco'),
            descuento: formData.get('descuento'),
            cuotas: formData.get('cuotas'),
            interes: formData.get('interes'),
            stock: formData.get('stock')
        };

        // Enviar los datos actualizados al servidor
        fetch(`/productos/${idProducto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoEditado),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al editar el producto.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto editado correctamente:', data);
            // Opcional: Actualizar la interfaz para reflejar los cambios
            // Aquí podrías recargar la lista de productos o actualizar el detalle mostrado
        })
        .catch(error => console.error('Error al editar producto:', error));

        // Cerrar el popup de edición después de guardar
        popupEditar.style.display = 'none';
    });

    // Eventos para el popup de confirmación de borrado
    const confirmarBorradoBtn = document.getElementById('confirmarBorrado');
    confirmarBorradoBtn.addEventListener('click', () => {
        const idProducto = document.getElementById('idProductoEditar').value;

        fetch(`/productos/${idProducto}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al borrar el producto.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Producto borrado correctamente:', data);
            // Opcional: Actualizar la interfaz para reflejar los cambios
            // Aquí podrías recargar la lista de productos o limpiar el detalle mostrado
        })
        .catch(error => console.error('Error al borrar producto:', error));

        popupBorrar.style.display = 'none';
    });

    const cancelarBorradoBtn = document.getElementById('cancelarBorrado');
    cancelarBorradoBtn.addEventListener('click', () => {
        popupBorrar.style.display = 'none'; // Ocultar el popup de confirmación de borrado al cancelar
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const popupAgregar = document.getElementById('popupAgregar');
    const formAgregarProducto = document.getElementById('formAgregarProducto');
    const cancelarAgregarBtn = document.getElementById('cancelarAgregar');

    // Mostrar el popup para agregar producto
    agregarProductoBtn.addEventListener('click', () => {
        popupAgregar.style.display = 'block';
    });

    // Evento para cerrar el popup al hacer clic en Cancelar
    cancelarAgregarBtn.addEventListener('click', () => {
        popupAgregar.style.display = 'none';
    });

    // Evento para enviar el formulario de agregar producto
    formAgregarProducto.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío por defecto del formulario

        const formData = new FormData(formAgregarProducto);
        const nuevoProducto = {
            nombre: formData.get('nombre'),
            autor: formData.get('autor'),
            descripcion: formData.get('descripcion'),
            categoria: formData.get('categoria'),
            precio: formData.get('precio'),
            stock: formData.get('stock')
            // Agrega aquí todos los campos que necesitas enviar al servidor
        };

        // Enviar los datos del nuevo producto al servidor mediante POST
        fetch('/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProducto),
        })
        .then(response => {
            if (response.ok) {
                console.log('Producto agregado correctamente');
                // Aquí puedes actualizar la interfaz o hacer otras acciones necesarias después de agregar el producto
            } else {
                console.error('Error al agregar el producto:', response.statusText);
            }
            // Cerrar el popup después de procesar la respuesta
            popupAgregar.style.display = 'none';
        })
        .catch(error => console.error('Error en la solicitud de agregar producto:', error));
    });
});
