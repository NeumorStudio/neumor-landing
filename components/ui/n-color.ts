// La n a color: ámbar a la izquierda y azul a la derecha, con porcelana en el
// paso de uno a otro para que los dos colores no se ensucien al cruzarse. El
// degradado baja un poco hacia la derecha: el ámbar se queda arriba del arco.
//
// Va en coordenadas de la caja de 100 del logo (n-forma.ts), con el eje y hacia
// abajo, como en SVG. Lo usan la n en 3D de la portada (NEnTres.tsx) y la de la
// pantalla de carga (Intro.tsx), para que sean la misma n.
export const N_COLOR = {
  desde: { x: 22, y: 36 },
  hacia: { x: 78, y: 50 },
  paradas: [
    [0, '#f4b23b'],
    [0.32, '#f6c86b'],
    [0.52, '#eceef2'],
    [0.7, '#9bb8f5'],
    [1, '#2f62ee'],
  ],
} as const
