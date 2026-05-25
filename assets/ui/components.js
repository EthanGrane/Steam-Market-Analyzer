// ─── UI Component Library ─────────────────────────────────────────────────────
// Componentes primitivos reutilizables para toda la app.
// Basados en los design tokens de tokens.js.
// Components.js esta generado con claude usando como referencia la pagina https://www.SteamDB.info

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from './tokens';
import { useState } from 'react';

// ─── StatBox ──────────────────────────────────────────────────────────────────
// Caja numérica con valor + etiqueta, usada en paneles de estadísticas.
// Props:
//   label     string   Etiqueta inferior (uppercase)
//   value     string   Valor principal a mostrar
//   accent    string?  Color override para el valor
//   small     bool?    Reduce el tamaño del valor (para textos largos)
export function StatBox({ label, value, accent, small }) {
    return (
        <View style={s.statBox}>
            <Text style={[
                s.statValue,
                accent && { color: accent },
                small && { fontSize: typography.size.base },
            ]}>
                {value}
            </Text>
            <Text style={s.statLabel}>{label}</Text>
        </View>
    );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
// Etiqueta/chip compacta para géneros, plataformas, categorías, etc.
// Props:
//   label     string   Texto de la etiqueta
export function Tag({ label }) {
    return (
        <View style={s.tag}>
            <Text style={s.tagText}>{label}</Text>
        </View>
    );
}

// ─── TagRow ───────────────────────────────────────────────────────────────────
// Fila con wrap para agrupar Tags.
// Props:
//   children  ReactNode
export function TagRow({ children }) {
    return <View style={s.tagRow}>{children}</View>;
}

// ─── Section ──────────────────────────────────────────────────────────────────
// Bloque de sección con título con línea divisoria y contenido.
// Props:
//   title     string   Título de la sección
//   accent    string?  Color override para el título
//   children  ReactNode
export function Section({ title, accent, children }) {
    return (
        <View style={s.section}>
            <Text style={[
                s.sectionTitle,
                accent && { color: accent, borderBottomColor: accent + '40' }
            ]}>
                {title}
            </Text>
            {children}
        </View>
    );
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────
// Fila clave-valor para mostrar metadatos (Desarrollador, Publisher, etc).
// Props:
//   label     string   Clave (ej. "Developer")
//   value     string   Valor (ej. "Valve")
export function InfoRow({ label, value }) {
    return (
        <View style={s.infoRow}>
            <Text style={s.infoLabel}>{label}</Text>
            <Text style={s.infoValue}>{value}</Text>
        </View>
    );
}

// ─── ReviewBar ────────────────────────────────────────────────────────────────
// Barra de progreso coloreada para representar el ratio de reviews.
// Props:
//   ratio     number   0–100 (porcentaje de reviews positivas)
//   color     string   Color de relleno
//   scoreDesc string?  Texto debajo de la barra
export function ReviewBar({ ratio, color, scoreDesc }) {
    return (
        <View style={s.reviewBarWrap}>
            <View style={s.barBackground}>
                <View style={[s.barFill, { width: `${Math.round(ratio)}%`, backgroundColor: color }]} />
            </View>
            {scoreDesc ? (
                <Text style={[s.reviewScoreDesc, { color }]}>{scoreDesc}</Text>
            ) : null}
        </View>
    );
}

// ─── Disclaimer ───────────────────────────────────────────────────────────────
// Caja de aviso/advertencia en tono amarillo. Ideal para estimaciones o notas.
// Props:
//   icon      string?  Emoji o símbolo (por defecto ⚠️)
//   children  ReactNode
export function Disclaimer({ icon = '⚠️', children }) {
    return (
        <View style={s.disclaimer}>
            <Text style={s.disclaimerIcon}>{icon}</Text>
            <Text style={s.disclaimerText}>{children}</Text>
        </View>
    );
}

// ─── AssumptionsBlock ─────────────────────────────────────────────────────────
// Bloque oscuro para listar supuestos/hipótesis de un cálculo.
// Props:
//   title     string?  Título opcional (por defecto "Assumptions")
//   children  ReactNode
export function AssumptionsBlock({ title = 'Assumptions', children }) {
    return (
        <CollapsibleSecondary style={s.assumptionsBlock} title={title}>
            {children}
        </CollapsibleSecondary>
    );
}

// ─── AssumptionItem ───────────────────────────────────────────────────────────
// Línea individual de supuesto con valor resaltado.
// Props:
//   label     string   Texto descriptivo
//   value     string   Valor resaltado en gris claro
export function AssumptionItem({ label, value }) {
    return (
        <Text style={s.assumptionItem}>
            • {label}{' '}
            <Text style={s.assumptionValue}>{value}</Text>
        </Text>
    );
}

// ─── EstimateRow ──────────────────────────────────────────────────────────────
// Fila de estimación con columnas Low / Mid / High.
// Props:
//   label     string   Descripción de la métrica
//   low       number   Valor bajo
//   mid       number   Valor central (destacado)
//   high      number   Valor alto
//   prefix    string?  Prefijo para los valores (ej. "€")
//   midColor  string?  Color override para la columna Mid
export function EstimateRow({ label, low, mid, high, prefix = '', midColor }) {
    return (
        <View style={s.estimateRow}>
            <Text style={s.estimateLabel}>{label}</Text>
            <View style={s.estimateValues}>
                <Text style={s.estimateLow}>{prefix}{formatK(low)}</Text>
                <Text style={[s.estimateMid, midColor && { color: midColor }]}>
                    {prefix}{formatK(mid)}
                </Text>
                <Text style={s.estimateHigh}>{prefix}{formatK(high)}</Text>
            </View>
        </View>
    );
}

// ─── EstimateHeader ───────────────────────────────────────────────────────────
// Cabecera de columnas para la tabla de estimaciones.
export function EstimateHeader() {
    return (
        <View style={s.estimateHeader}>
            <Text style={{ flex: 1 }} />
            <View style={s.estimateValues}>
                <Text style={s.estimateColLabel}>Low</Text>
                <Text style={[s.estimateColLabel, { color: colors.accent.gold }]}>Mid ★</Text>
                <Text style={s.estimateColLabel}>High</Text>
            </View>
        </View>
    );
}

// ─── LinkButton ───────────────────────────────────────────────────────────────
// Botón de enlace externo estilizado.
// Props:
//   label     string   Texto del botón
//   onPress   fn       Handler de pulsación
export function LinkButton({ label, onPress }) {
    return (
        <Pressable style={s.linkButton} onPress={onPress}>
            <Text style={s.linkButtonText}>{label}</Text>
        </Pressable>
    );
}

// ─── DevNote ──────────────────────────────────────────────────────────────────
// Nota narrativa para la sección de investigación del desarrollador.
// Props:
//   children  ReactNode
export function DevNote({ children }) {
    return <Text style={s.devNote}>{children}</Text>;
}

// ─── SeoBlock ─────────────────────────────────────────────────────────────────
// Bloque de código oscuro para mostrar snippets (SEO, datos técnicos).
// Props:
//   title     string?  Título del bloque
//   children  ReactNode
export function SeoBlock({ title, children }) {
    return (
        <View style={s.seoBlock}>
            {title ? <Text style={s.seoBlockTitle}>{title}</Text> : null}
            {children}
        </View>
    );
}

// ─── Utilidad interna ─────────────────────────────────────────────────────────
function formatK(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
}

export function Collapsible({ title, children, defaultOpen = false, accent }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <View style={collapsibleStyles.wrapper}>
            <Pressable onPress={() => setOpen(p => !p)} style={collapsibleStyles.header}>
                <Text style={[collapsibleStyles.title, accent && { color: accent }]}>{title}</Text>
                <Text style={[collapsibleStyles.chevron, accent && { color: accent }]}>
                    {open ? '▲' : '▼'}
                </Text>
            </Pressable>
            {open && <View style={collapsibleStyles.content}>{children}</View>}
        </View>
    );
}

export function CollapsibleSecondary({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <View style={collapsibleStyles.wrapperSecondary}>
            <Pressable onPress={() => setOpen(p => !p)} style={collapsibleStyles.headerSecondary}>
                <Text style={collapsibleStyles.titleSecondary}>{title}</Text>
                <Text style={collapsibleStyles.chevronSecondary}>{open ? '▲' : '▼'}</Text>
            </Pressable>
            {open && <View style={collapsibleStyles.content}>{children}</View>}
        </View>
    );
}




// ─── Estilos internos ─────────────────────────────────────────────────────────
const collapsibleStyles = StyleSheet.create({
    // — Principal: igual que tu versión original —
    wrapper: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#1c2333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 4,
    },
    title: {
        color: '#4a90d9',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    chevron: {
        color: '#4a90d9',
        fontSize: 9,
    },
    content: {
        paddingBottom: 12,
    },

    // — Secondary: más discreta —
    wrapperSecondary: {
        marginVertical: 6,
        marginLeft: 8,
        paddingLeft: 10,
        borderLeftWidth: 1.5,
        borderLeftColor: '#1c2333',
    },
    headerSecondary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    titleSecondary: {
        color: '#8b93a7',
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chevronSecondary: {
        color: '#8b93a7',
        fontSize: 8,
    },
});

const s = StyleSheet.create({
    // StatBox
    statBox: {
        flex: 1,
        minWidth: 70,
        backgroundColor: colors.bg.card,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.default,
        padding: spacing[3],
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        color: colors.text.primary,
        fontSize: typography.size.lg,
        fontWeight: typography.weight.bold,
        textAlign: 'center',
    },
    statLabel: {
        color: colors.text.dim,
        fontSize: typography.size.xs,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        textAlign: 'center'
    },

    // Tag
    tag: {
        backgroundColor: '#1a2030',
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border.strong,
        paddingHorizontal: spacing[3] - 2,
        paddingVertical: spacing[1],
    },
    tagText: {
        color: colors.text.faint,
        fontSize: typography.size.base,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },

    // Section
    section: {
        marginTop: spacing[4],
        gap: spacing[2],
    },
    sectionTitle: {
        color: colors.accent.blue,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.bold,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: spacing[1],
        borderBottomWidth: 1,
        borderBottomColor: colors.border.subtle,
        paddingBottom: spacing[1],
    },

    // InfoRow
    infoRow: {
        flexDirection: 'row',
        gap: spacing[2],
        alignItems: 'flex-start',
        marginBottom: spacing[1],
    },
    infoLabel: {
        color: colors.text.dim,
        fontSize: typography.size.base,
        width: 72,
    },
    infoValue: {
        color: colors.text.muted,
        fontSize: typography.size.base,
        flex: 1,
    },

    // ReviewBar
    reviewBarWrap: {
        gap: 6,
    },
    barBackground: {
        height: 6,
        borderRadius: radius.sm - 2,
        backgroundColor: colors.border.default,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: radius.sm - 2,
    },
    reviewScoreDesc: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.semibold,
    },

    // Disclaimer
    disclaimer: {
        flexDirection: 'row',
        backgroundColor: '#1a1500',
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.warning,
        padding: spacing[3] - 2,
        gap: spacing[2],
        alignItems: 'flex-start',
    },
    disclaimerIcon: {
        fontSize: typography.size.lg,
    },
    disclaimerText: {
        color: '#b89a4a',
        fontSize: typography.size.sm,
        lineHeight: 17,
        flex: 1,
    },

    // AssumptionsBlock
    assumptionsBlock: {
        backgroundColor: colors.bg.deep,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.subtle,
        padding: spacing[3],
        marginTop: spacing[2],
        gap: spacing[1],
    },
    assumptionsTitle: {
        color: colors.text.dim,
        fontSize: typography.size.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing[1],
    },
    assumptionItem: {
        color: colors.text.dim,
        fontSize: typography.size.sm,
        lineHeight: 16,
    },
    assumptionValue: {
        color: colors.text.faint,
    },

    // EstimateRow / Header
    estimateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
        marginTop: spacing[1],
    },
    estimateColLabel: {
        width: 60,
        textAlign: 'center',
        fontSize: typography.size.xs,
        color: colors.text.dim,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    estimateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomWidth: 1,
        borderBottomColor: '#1a2030',
    },
    estimateLabel: {
        flex: 1,
        color: colors.text.faint,
        fontSize: typography.size.sm,
    },
    estimateValues: {
        flexDirection: 'row',
    },
    estimateLow: {
        width: 60,
        textAlign: 'center',
        color: colors.text.dim,
        fontSize: typography.size.base,
    },
    estimateMid: {
        width: 60,
        textAlign: 'center',
        color: colors.accent.gold,
        fontSize: typography.size.md,
        fontWeight: typography.weight.bold,
    },
    estimateHigh: {
        width: 60,
        textAlign: 'center',
        color: colors.text.dim,
        fontSize: typography.size.base,
    },

    // LinkButton
    linkButton: {
        backgroundColor: colors.bg.card,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.strong,
        paddingVertical: spacing[3] - 2,
        paddingHorizontal: spacing[3] + 2,
        marginBottom: 6,
    },
    linkButtonText: {
        color: colors.accent.blue,
        fontSize: typography.size.md,
        fontWeight: typography.weight.medium,
    },

    // DevNote
    devNote: {
        color: colors.text.muted,
        fontSize: typography.size.base,
        lineHeight: 18,
    },

    // SeoBlock
    seoBlock: {
        backgroundColor: colors.bg.deep,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border.subtle,
        padding: spacing[3],
        marginTop: spacing[1],
    },
    seoBlockTitle: {
        color: colors.text.dim,
        fontSize: typography.size.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
    },
});
