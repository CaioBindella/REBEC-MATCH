// src/lib/media.ts (Completo e Corrigido)
import { css, CSSObject, Interpolation } from 'styled-components';

// --- Breakpoints ---
const breakpoints = {
  xs: 390,
  smMin: 391,
  smMax: 600,
  mdMin: 601,
  mdMax: 1000,
  lgMin: 1001,
  lgMax: 1440,
  xxlMin: 2001,
  xxlMax: 3000,
  xxxlMin: 3001,
  xxxlMax: 4000,
  xxxxl: 4001,
};

// --- Tipos auxiliares ---
type BreakpointKey = keyof typeof breakpoints;
// Aceita CSSObject, string literal (com interpolações opcionais), ou função de interpolação
type StylesType = CSSObject | string | Interpolation<any>;

// --- Helper genérico de media query (CORRIGIDO) ---
// Agora lida corretamente com tagged template literals e objetos/strings
const createMediaQuery =
  (query: string) =>
  (first: StylesType | TemplateStringsArray, ...interpolations: Interpolation<any>[]) => css`
    @media ${query} {
      ${css(first as any, ...interpolations)} // Passa diretamente para o css helper
    }
  `;


// --- Mapa de media queries ---
const media = {
  xsOnly: createMediaQuery(`(max-width: ${breakpoints.xs}px)`),
  smOnly: createMediaQuery(
    `(min-width: ${breakpoints.smMin}px) and (max-width: ${breakpoints.smMax}px)`
  ),
  mdOnly: createMediaQuery(
    `(min-width: ${breakpoints.mdMin}px) and (max-width: ${breakpoints.mdMax}px)`
  ),
  lgOnly: createMediaQuery(
    `(min-width: ${breakpoints.lgMin}px) and (max-width: ${breakpoints.lgMax}px)`
  ),
  xxlOnly: createMediaQuery(
    `(min-width: ${breakpoints.xxlMin}px) and (max-width: ${breakpoints.xxlMax}px)`
  ),
  xxxlOnly: createMediaQuery(
    `(min-width: ${breakpoints.xxxlMin}px) and (max-width: ${breakpoints.xxxlMax}px)`
  ),
  xxxxlUp: createMediaQuery(`(min-width: ${breakpoints.xxxxl}px)`),

  smUp: createMediaQuery(`(min-width: ${breakpoints.smMin}px)`),
  mdUp: createMediaQuery(`(min-width: ${breakpoints.mdMin}px)`),
  lgUp: createMediaQuery(`(min-width: ${breakpoints.lgMin}px)`),
  xxlUp: createMediaQuery(`(min-width: ${breakpoints.xxlMin}px)`),
  xxxlUp: createMediaQuery(`(min-width: ${breakpoints.xxxlMin}px)`),
};

export default media;