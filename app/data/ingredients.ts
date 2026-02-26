export interface Ingredient {
    id: number
    name: string
    quantity: number
    unit: string
}

export const ingredients = ref<Ingredient[]>([
    { id: 1, name: 'Flour', quantity: 50, unit: 'kg' },
    { id: 2, name: 'Sugar', quantity: 25, unit: 'kg' },
    { id: 3, name: 'Butter', quantity: 10, unit: 'kg' },
    { id: 4, name: 'Yeast', quantity: 2.5, unit: 'kg' },
    { id: 5, name: 'Salt', quantity: 5, unit: 'kg' },
])
