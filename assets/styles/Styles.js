import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f1115',
    },
    card: {
        backgroundColor: '#151922',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#222838',
        overflow: 'hidden',         // importante para que la imagen respete el borderRadius

        padding: 8,
        minHeight: 300,
    },
    content: {
        marginVertical: 16,
        marginHorizontal: 32,
    },
    text: {
        color: '#c7d0e0',
        fontSize: 14,
    },

    title: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },

    subtitle: {
        color: '#8b93a7',
        fontSize: 12,
    },

    statValue: {
        color: '#4da3ff',
        fontWeight: '600',
        fontSize: 14,
    },

    statPositive: {
        color: '#4caf50',
    },

    statNegative: {
        color: '#ff4d4d',
    },

    button: {
        backgroundColor: '#1b2230',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2a3246',
    },

    buttonHighlight: {
        backgroundColor: '#3a6938',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },

    buttonHighlightHover: {
        backgroundColor: '#66a764',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },

    buttonText: {
        color: '#c7d0e0',
        fontSize: 14,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#222838',
        marginBottom: 16,
    },

    input: {
        color: '#c7d0e0',
        padding: 10,
        flex: 1,
    },

});