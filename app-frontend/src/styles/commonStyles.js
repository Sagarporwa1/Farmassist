import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 16,
    },

    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },

    button: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonOutlineText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },

    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: colors.textPrimary,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
        marginBottom: 8,
    },

    heading1: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    heading2: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    heading3: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    bodyText: {
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 24,
    },
    caption: {
        fontSize: 12,
        color: colors.textSecondary,
    },

    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 16,
    },
});
