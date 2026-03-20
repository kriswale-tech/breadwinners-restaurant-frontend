export const PhoneNumberValidator = (phoneNumber: string): boolean => {
    return phoneNumber.length === 10 && phoneNumber.startsWith('0')
}

export function formatCoord(value: number | undefined, maxLen: number): string | number | undefined {
    if (value == null) return undefined

    const original = String(value)
    if (original.length <= maxLen) return value

    // Try rounding with fewer decimals until the string fits the backend limits.
    for (let decimals = 6; decimals >= 0; decimals--) {
        const rounded = Number(value.toFixed(decimals))
        const s = String(rounded)
        if (s.length <= maxLen) return s
    }

    // Last-resort hard cut (should rarely happen).
    return original.slice(0, maxLen)
}
