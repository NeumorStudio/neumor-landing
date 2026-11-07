# Marca de NeumorStudio

El logo es el **NS**: una N y una S en un solo trazo líquido, con los huecos y las puntas redondeados. No se rediseña sin el acuerdo de Stark y Carlos.

El logo siempre es plano. Lo líquido y lo neumórfico van en cómo se presenta.

## Archivos

Todo está en `public/marca/`.

### Logo

| Archivo | Para qué |
| --- | --- |
| `ns-marca.svg` | El maestro. Toma el color del texto (`currentColor`) |
| `ns-marca-blanco.svg` | Sobre fondo oscuro. Es la versión principal |
| `ns-marca-negro.svg` | Sobre fondo claro |
| `ns-marca-ambar.svg` | Acento, nunca como logo principal |

### Iconos

| Archivo | Para qué |
| --- | --- |
| `ns-icono-oscuro.svg` | La tecla: icono con volumen, para usar en la web |
| `ns-icono-ambar.svg` | Variante de icono para campañas |
| `icono-16.png`, `-32`, `-48` | Favicon. Plano, con el NS al 82 % del alto |
| `icono-180.png`, `-192`, `-512`, `-1024` | Apple, PWA, tiendas y avatar de redes. La tecla en cuadrado y sin transparencia, con el NS al 66 % |

### Acabados

Son imágenes de 1600 px sobre carbón. Por debajo de unos 200 px se usa siempre el plano.

| Archivo | Para qué |
| --- | --- |
| `ns-porcelana.webp` | Portada de la web, redes y anuncios |
| `ns-cristal.webp` | Momentos especiales, como una campaña. Si se usa en todo, cansa |
| `ns-relieve.webp` | Neumorfismo puro. Solo se lee en grande |

El 3D (`public/images/logoneumor.jpeg`) es la versión para fondos claros y la tarjeta de visita. La porcelana es esa misma idea sobre negro.

## Colores

| Nombre | Valor | Uso |
| --- | --- | --- |
| Negro | `#0B0B0F` | Fondo del logo plano |
| Carbón | `#17181F` | Superficies de la web |
| Blanco | `#FFFFFF` | Logo y titulares |
| Ámbar | `#F2A93B` | Único acento. Sale de la luz del 3D |

El neumorfismo vive de las sombras, y sobre negro puro casi no se ven. Por eso las superficies van sobre carbón.

## Espacios

Alrededor del logo se deja libre un cuarto de su alto.

| En la web | Escritorio | Móvil |
| --- | --- | --- |
| Logo en la barra | 40 px | 40 px |
| Espacio sobre el titular | 128 px | 88 px |
| Espacio entre secciones | 112 px | 72 px |
| Dentro de las tarjetas | 32 px | 24 px |

## Reglas

- El tema oscuro es la cara de la marca: web, anuncios y tiendas.
- El logo no se deforma ni se gira, y el plano no lleva sombras ni efectos.
- Tamaño mínimo: 16 px en pantalla.
- El ámbar es el único acento. En cada pantalla va en una sola acción principal.
- El cristal se reserva a lo que flota, como la barra y el hero. El texto largo va sobre superficies opacas.

## Regenerar el kit

Todo sale de `ns-marca.svg`. Si cambia el maestro, hay que volver a generar el resto:

```bash
node scripts/marca/kit.mjs
node scripts/marca/acabados.mjs
```
