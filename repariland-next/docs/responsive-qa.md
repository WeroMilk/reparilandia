# Matriz QA responsive — Reparilandia

## Breakpoint principal

| Modo | Ancho | Comportamiento |
|------|-------|----------------|
| Móvil (iOS) | &lt; 1024px | Tab bar inferior, bottom sheets, sin scroll de página |
| Escritorio (macOS) | ≥ 1024px | Dock flotante, modales centrados con chrome de ventana |

## Viewports de referencia

| Dispositivo | Resolución | Comprobaciones |
|-------------|------------|----------------|
| iPhone 14 | 390×844 | Notch/safe-area, tab bar 49px, drawers |
| iPhone Pro Max | 430×932 | Cards inicio sin recorte en snap |
| iPad portrait | 768×1024 | Modo móvil; carruseles legibles |
| MacBook | 1280×800 | Dock blur, grid Historia/Contacto |
| Diseño ref. | 1920×1080 | Escala `--ui-scale-clamp` |
| Ultra-wide | 2560×1440 | Cards inicio no estiradas (`max-w-7xl`) |

## Checklist manual

- [ ] Contenido no queda bajo el dock ni el home indicator
- [ ] Formularios: email/teléfono en columna en móvil
- [ ] Modales cotización/contacto: sheet en móvil, ventana en desktop
- [ ] Rotación landscape (Historia/Servicios): timeline/carousel usables
- [ ] `prefers-reduced-motion`: sin partículas ni springs largos
- [ ] Enlaces legales del footer legibles &lt; 360px (solo icono + `aria-label`)

## Pruebas automatizadas

```bash
cd repariland-next
npm run test:visual          # compara screenshots
npm run test:visual:update   # actualiza baseline
```

Snapshots en `e2e/responsive.spec.ts-snapshots/`.

## Notas

- `maximumScale: 1` en viewport limita zoom del usuario (sensación app); valorar accesibilidad si el cliente lo requiere.
- Etiqueta del tab móvil **Contacto** alineada con desktop **CONTACTO**.
