export const PhoneNumberValidator = (phoneNumber: string): boolean => {
    return phoneNumber.length === 10 && phoneNumber.startsWith('0')
}

