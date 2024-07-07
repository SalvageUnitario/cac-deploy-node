# cac-deploy-node
El trabajo práctico es un backend que simula un stock de libros.
Tiene una base de MySQL con 4 tablas relacionadas entre sí:
+ productos
  + categorias
  + cuotas
  + promos
 
Los datos son de 4 tipos diferentes:
+ INT (ejemplo: precio)
+ VARCHAR (ejemplo: nombre, autor)
+ LONGTEXT (ejemplo: descripcion)
+ DATE (ejemplo: ingreso)

La tabla productos es la principal y está relacionada con las otras por una clave (fk) para cada una: fk_categoria, fk_promos y fk_cuotas
Ahí se forma la relación "uno a muchos".

Se generaron 4 tipos de funcionalidades:
- CREATE (POST): se da de alta un libro
- READ (GET): traigo información de toda la base o un id de libro en particular
- UPDATE (PUT): actualizo la información de un libro utilizando su id
- DELETE (DELETE): borro una entrada de la tabla principal (productos) utilizando el id del libro

El deploy de la base de datos se hizo en [Clever-Cloud](https://clever-cloud.com) y el de la web en [Render](https://render.com/).

Utilizando algún cliente para APIs tipo Postman o Thunderclient se pueden utilizar las 4 consultas mencionadas a través de la url del proyecto https://cac-deploy-node.onrender.com/productos. 
Los campos que debe contener un producto son:
+ nombre
+ autor
+ precio
+ descripcion
+ stock
+ ingreso
+ fk_categoria
+ fk_promos
+ fk_cuotas

Se entrega también un front para poder interactuar de manera gráfica con el proyecto [URL front](https://cac-deploy-node.onrender.com). Me sumé en la parte de backend y el front no lo hice responsive, es mejor verlo en un monitor.
