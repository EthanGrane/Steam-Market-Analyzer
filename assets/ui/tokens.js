// ─── Design Tokens ────────────────────────────────────────────────────────────
// Fuente única de verdad para colores, tipografía y espaciado.
// Importar desde cualquier componente para mantener consistencia visual.
// Tokens.js esta generado con claude usando como referencia la pagina https://www.SteamDB.info

export const colors = {
    // Backgrounds
    bg: {
        app:     '#0f1115',
        card:    '#151922',
        modal:   '#0f1318',
        deep:    '#0a0d12',
        overlay: 'rgba(0,0,0,0.78)',
        // Estados interactivos
        pressed: '#121826',
    },

    // Borders
    border: {
        default:  '#222838',
        subtle:   '#1c2333',
        medium:   '#2a3248',
        strong:   '#2a3348',
        // Semánticos
        warning:  '#3d2e00',
        error:    '#3d1515',
    },

    // Texto
    text: {
        primary:   '#ffffff',
        secondary: '#c7d0e0',
        muted:     '#9aa3b5',
        faint:     '#8b93a7',
        dim:       '#555e72',
    },

    // Acentos de marca
    accent: {
        blue:    '#4a90d9',
        purple:  '#8b7fd4',
        gold:    '#e8a838',
    },

    // Semánticos (reviews, estados)
    review: {
        positive: '#639922',
        mixed:    '#BA7517',
        negative: '#A32D2D',
        none:     '#888780',
    },

    // Metacritic
    metacritic: {
        good:   '#639922',
        mixed:  '#BA7517',
        bad:    '#A32D2D',
    },
};

export const typography = {
    // Tamaños
    size: {
        xs:   10,
        sm:   11,
        base: 12,
        md:   13,
        lg:   14,
        xl:   15,
        '2xl': 18,
        '3xl': 20,
    },

    // Pesos
    weight: {
        regular: '400',
        medium:  '500',
        semibold:'600',
        bold:    '700',
    },

    // Familias
    family: {
        mono: 'monospace',
    },
};

export const spacing = {
    1:  4,
    2:  8,
    3:  12,
    4:  16,
    5:  20,
    6:  24,
    8:  32,
    10: 40,
};

export const radius = {
    sm:  6,
    md:  8,
    lg:  10,
    xl:  16,
    full: 9999,
};
