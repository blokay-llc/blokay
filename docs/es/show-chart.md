# Crear ChartLines

Aquí tienes un tutorial paso a paso sobre cómo completar la función fn:

Definir la consulta SQL inicial: La consulta SQL debe seleccionar los datos necesarios de la base de datos. En este caso, queremos contar la cantidad de usuarios creados en los últimos 30 días y agruparlos por mes y año.

```ts
let sql = `SELECT date_format(creationDate, "%m/%Y") as label, count(1) as conteo
from users WHERE creationDate >= NOW() - interval 30 day orderBy creationDate ASC`;
```

Ejecutar la consulta SQL: Utiliza el método query proporcionado en args para ejecutar la consulta SQL y obtener los resultados.

```ts
let results = await args.query(sql);
```

Mostrar la gráfica: Utiliza el método chartLine proporcionado en args para enviar los datos formateados como una respuesta de gráfica de líneas.

```ts
return args.chartLine(data);
```

Con estos pasos, has completado la función fn. Ahora, cuando se llame a esta función, devolverá una gráfica de líneas que muestra la cantidad de usuarios creados por mes en los últimos 30 días. Asegúrate de ajustar el código según las especificaciones y la estructura de tu aplicación.

```ts
const fn = async function (args: Args) {
  // Consulta SQL
  let sql = `SELECT date_format(creationDate, "%m/%Y") as label, count(1) as conteo
    from users WHERE creationDate >= NOW() - interval 30 day orderBy creationDate ASC`;
  // Obtenemos las filas
  let results = await args.query(sql);
  // Mostramos el resultado en una gráfica
  return args.chartLine(results);
};
```
