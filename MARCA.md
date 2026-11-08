# Marca de NeumorStudio

El logo es la **n del punto dentro**: una n minúscula en arco, de trazo grueso y puntas redondas, con un punto ámbar dentro del arco, como una luz en una puerta. La eligieron Stark y Carlos el 9 de noviembre de 2026 (versión 5 del boceto). No se rediseña sin el acuerdo de los dos.

El logo siempre es plano. El cristal y el neumorfismo van en cómo se presenta.

## Archivos

Todo está en `public/marca/` y sale de `scripts/marca/`.

### Logo

| Archivo | Para qué |
| --- | --- |
| `n-marca.svg` | El de la web. El arco toma el color del texto (`currentColor`) y el punto es ámbar |
| `n-marca-blanco.svg` | Sobre fondo oscuro. Es la versión principal |
| `n-marca-negro.svg` | Sobre fondo claro. El punto va en el ámbar más oscuro |
| `n-marca-una-tinta.svg` | Todo de un color: sellos, bordados, grabados o fondos ámbar |

### Iconos

| Archivo | Para qué |
| --- | --- |
| `n-icono.svg` | Icono suelto con volumen: n blanca en relieve sobre carbón |
| `n-icono-cristal.svg` | El mismo icono en cristal, para campañas |
| `icono-16.png`, `-32`, `-48` | Favicon. Plano y con la n pequeña (ver abajo) |
| `icono-180.png`, `-192`, `-512`, `-1024` | Apple, PWA, tiendas y avatar de redes. La n blanca en relieve, en cuadrado y sin transparencia |

### La n pequeña

Por debajo de 48 px el punto se acerca demasiado a las patas. Los favicons usan una versión con el arco algo más abierto y el punto un poco mayor. A la vista es la misma n. No se usa en grande.

### Acabados

Son imágenes de 1600 px sobre su fondo. Por debajo de unos 200 px se usa siempre el plano.

| Archivo | Para qué |
| --- | --- |
| `n-cristal.webp` | El acabado principal: portada, redes y anuncios |
| `n-blanco.webp` | La n blanca en relieve. Es la del icono de la app |
| `n-relieve-oscuro.webp` | Neumorfismo puro sobre oscuro. Solo se lee en grande |
| `n-relieve-claro.webp` | Neumorfismo sobre claro: papelería y fondos claros |
| `n-cristal-sin-fondo.webp` | Portada de la web en tema oscuro |
| `n-relieve-claro-sin-fondo.webp` | Portada de la web en tema claro |
| `n-cristal-social.jpg` | La imagen que sale al compartir un enlace de la web |

## Colores

| Nombre | Valor | Uso |
| --- | --- | --- |
| Negro | `#0B0B0F` | Fondo del logo plano |
| Carbón | `#17181F` | Superficies de la web |
| Blanco | `#FFFFFF` | Logo y titulares |
| Ámbar | `#F2A93B` | El punto y el único acento |
| Ámbar sobre claro | `#E8962A` | El punto cuando el fondo es claro |

El neumorfismo vive de las sombras, y sobre negro puro casi no se ven. Por eso las superficies van sobre carbón.

## Espacios

Alrededor del logo se deja libre un cuarto de su alto.

| En la web | Escritorio | Móvil |
| --- | --- | --- |
| Logo en la barra | 32 px | 32 px |
| Espacio sobre el titular | 128 px | 88 px |
| Margen arriba y abajo de cada sección | 112 px | 72 px |
| Dentro de las tarjetas | 32 px | 24 px |

## Reglas

- El tema oscuro es la cara de la marca: web, anuncios y tiendas.
- El logo no se deforma ni se gira, y el plano no lleva sombras ni efectos.
- El punto siempre va dentro del arco y en ámbar, salvo en la versión de una tinta.
- Tamaño mínimo: 16 px en pantalla.
- El ámbar es el único acento. En cada pantalla va en una sola acción principal.
- El cristal se reserva a lo que flota, como la barra y el hero. El texto largo va sobre superficies opacas.

## Regenerar el kit

La forma está en `scripts/marca/forma.mjs` y los acabados en `scripts/marca/motor.mjs`. Si cambia la forma, se vuelve a generar todo:

```bash
node scripts/marca/kit.mjs
```

`kit.mjs` escribe también los iconos de `public/icons/`, `app/favicon.ico` y la forma que usa la web, `components/ui/n-forma.ts`. Si cambian los iconos o el logo, hay que subir la versión de la caché en `public/sw.js`.

Los campos de luz del hero salen de `node scripts/marca/fondos.mjs`.
