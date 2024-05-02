# Show table

## Paso 1

Obtener las fechas de inicio y fin desde el formulario: La función fn espera recibir las fechas de inicio y fin desde el formulario proporcionado en args.form.

```ts
const fn = async function (args: Args) {
  const { startDate, endDate } = args.form; // Suponiendo que las fechas están en el objeto form
};
```

Construir la consulta SQL: Utiliza las fechas proporcionadas para construir la consulta SQL que seleccionará los datos de la base de datos según el rango de fechas.

```ts
const fn = async function (args: Args) {
  const { startDate, endDate } = args.form;
  const sql = `
    SELECT * 
    FROM tabla 
    WHERE fecha BETWEEN :startDate AND :endDate
  `;
  const replacements = { startDate, endDate }; // Reemplazos para las variables en la consulta
};
```

Ejecutar la consulta y obtener los resultados: Utiliza el método query proporcionado en args para ejecutar la consulta SQL y obtener los datos de la base de datos.

```ts
const fn = async function (args: Args) {
  const { startDate, endDate } = args.form;
  const sql = `
    SELECT * 
    FROM tabla 
    WHERE fecha BETWEEN :startDate AND :endDate
  `;
  const replacements = { startDate, endDate };

  const rows = await args.query(sql, replacements); // Ejecutar la consulta y obtener los resultados
};
```

Mostrar los resultados: Utiliza el método table proporcionado en args para enviar los resultados de la consulta como una respuesta de tabla.

```ts
const fn = async function (args: Args) {
  const { startDate, endDate } = args.form;
  const sql = `
    SELECT * 
    FROM tabla 
    WHERE fecha BETWEEN :startDate AND :endDate
  `;
  const replacements = { startDate, endDate };

  const rows = await args.query(sql, replacements);

  return args.table(rows); // Mostrar los resultados como una tabla
};
```

Con estos pasos, puedes completar la función fn para mostrar los resultados de una tabla con filtro de fecha inicial y fecha final. Asegúrate de ajustar el código según las especificaciones y la estructura de tu aplicación.
