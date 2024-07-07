# cac-deploy-node
El trabajo práctico es un backend que simula un stock de libros.
Tiene una base de MySQL con 4 tablas relacionadas entre sí:
+ productos
  + categorias
  + cuotas
  + promos

La tabla productos es la principal y está relacionada con las otras por una clave (fk) para cada una: fk_categoria, fk_promos y fk_cuotas
Ahí se forma la relación "uno a muchos".

Se generaron 4 tipos de funcionalidades:
- CREATE (POST): se da de alta un libro
- READ (GET): traigo información de toda la base o un id de libro en particular
- UPDATE (PUT): actualizo la información de un libro utilizando su id
- DELETE (DELETE): borro una entrada de la tabla principal (productos) utilizando el id del libro

El deploy de la base de datos se hizo en [Clever-Cloud](https://clever-cloud.com) y el de la web en [Render](https://render.com/)
La URL del proyecto es https://cac-deploy-node.onrender.com

Utilizando algún cliente para APIs tipo Postman o Thunderclient se pueden hacer utilizar las 4 consultas mencionadas.
Se entrega también un front para poder interactuar de manera gráfica con el proyecto [URL proyecto](https://cac-deploy-node.onrender.com)
