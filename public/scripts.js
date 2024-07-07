document.addEventListener('DOMContentLoaded', function () {
  const productListElement = document.querySelector('.product-list');
  const productDetailsElement = document.getElementById('product-details');
  let productIdToDelete; // Variable para almacenar el ID del producto a eliminar
  let productIdToEdit; // Variable para almacenar el ID del producto a editar

  // Función para mostrar los detalles del producto
  function showProductDetails(product) {
    productDetailsElement.innerHTML = `
      <h3>${product.nombre}</h3>
      <p><strong>Descripción:</strong> ${product.descripcion}</p>
      <p><strong>Autor:</strong> ${product.autor}</p>
      <p><strong>Categoría:</strong> ${product.categoria}</p>
      <p><strong>Precio:</strong> $${product.precio}</p>
      <p><strong>Cuotas:</strong> ${product.cuotas}</p>
      <p><strong>Promociones:</strong> ${product.banco} - ${product.interes}%</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <img src="${product.foto}" alt="${product.nombre}">
    `;
    productIdToDelete = product.idproductos; // Actualizar productIdToDelete con el ID del producto seleccionado
    productIdToEdit = product.idproductos; // Actualizar productIdToEdit con el ID del producto seleccionado
  }

  // Obtener la lista de productos desde el servidor y mostrarlos
  function loadProducts() {
    fetch('/productos')
      .then(response => response.json())
      .then(productos => {
        productListElement.innerHTML = ''; // Limpiar la lista actual de productos

        // Construir dinámicamente la lista de productos
        productos.forEach(producto => {
          const productItem = document.createElement('div');
          productItem.classList.add('product-item');

          // Construir la estructura HTML para cada producto
          productItem.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Autor: ${producto.autor}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <div class="action-buttons">
              <button class="edit-product-btn" data-id="${producto.idproductos}">Editar</button>
              <button class="delete-product-btn" data-id="${producto.idproductos}">Eliminar</button>
            </div>
          `;

          productListElement.appendChild(productItem);

          // Evento de clic para mostrar los detalles del producto
          productItem.addEventListener('click', function () {
            showProductDetails(producto);
          });

          // Evento de clic para editar producto
          const editButton = productItem.querySelector('.edit-product-btn');
          editButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Evitar propagación al hacer clic en el producto
            const productId = event.target.dataset.id;
            openEditModal(productId);
          });

          // Evento de clic para eliminar producto
          const deleteButton = productItem.querySelector('.delete-product-btn');
          deleteButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Evitar propagación al hacer clic en el producto
            const productId = event.target.dataset.id;
            confirmDelete(productId);
          });
        });
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }

  // Llamar a la función para cargar productos al cargar la página
  loadProducts();

  // Función para abrir el modal de edición con los datos del producto
  function openEditModal(productId) {
    
    fetch(`/productos/${productId}`)
      .then(response => response.json())
      .then(product => {
        // Llenar el formulario de edición con los datos del producto
        document.getElementById('edit-product-id').value = product.idproductos;
        document.getElementById('edit-nombre').value = product.nombre;
        document.getElementById('edit-autor').value = product.autor;
        document.getElementById('edit-precio').value = product.precio;
        document.getElementById('edit-descripcion').value = product.descripcion;
        document.getElementById('edit-stock').value = product.stock;

        // Mostrar el modal de edición
        const editModal = document.getElementById('edit-product-modal');
        editModal.style.display = 'block';
        console.log('Product details:', product); 
      })
      .catch(error => {
        console.error('Error al obtener el producto para editar:', error);
      });
  }

  // Función para confirmar la eliminación del producto
  function confirmDelete(productId) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      fetch(`/productos/${productId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar el producto');
        }
        return response.json(); // Convertir la respuesta a JSON
      })
      .then(data => {
        console.log('Producto eliminado:', data);
        loadProducts(); // Actualizar la lista de productos después de eliminar uno
      })
      .catch(error => {
        console.error('Error al eliminar el producto:', error);
      });
    }
  }

  // Evento de clic para abrir el modal de agregar producto
  const addProductButton = document.getElementById('add-product-btn');
  const addProductModal = document.getElementById('add-product-modal');
  const addProductCloseBtn = document.querySelector('#add-product-modal .close');

  addProductButton.addEventListener('click', function () {
    addProductModal.style.display = 'block';
  });

  addProductCloseBtn.addEventListener('click', function () {
    addProductModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === addProductModal) {
      addProductModal.style.display = 'none';
    }
  });

  // Evento de submit para agregar un nuevo producto
  const addProductForm = document.getElementById('add-product-form');

  addProductForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(addProductForm);
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });

    fetch('/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonObject),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Producto agregado:', data);
      addProductModal.style.display = 'none'; // Ocultar modal después de agregar el producto
      loadProducts(); // Actualizar la lista de productos después de agregar uno
    })
    .catch(error => {
      console.error('Error al agregar el producto:', error);
    });
  });

  // Evento de submit para guardar cambios en un producto editado
  const editProductForm = document.getElementById('edit-product-form');
  const editProductModal = document.getElementById('edit-product-modal');
  const editProductCloseBtn = document.querySelector('#edit-product-modal .close');

  editProductForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(editProductForm);
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });

    fetch(`/productos/${jsonObject.idproductos}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonObject),
    })
    .then(response =>  {
      if (!response.ok) {
        throw new Error('Error al editar producto');
      }
      return response.json(); })
    .then(data => {
      console.log('Producto actualizado:', data);
      editProductModal.style.display = 'none'; // Ocultar modal después de editar el producto
      loadProducts(); // Actualizar la lista de productos después de editar uno
    })
    .catch(error => {
      console.error('Error al actualizar el producto:', error);
    });
  });

  editProductCloseBtn.addEventListener('click', function () {
    editProductModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === editProductModal) {
      editProductModal.style.display = 'none';
    }
  });
});
