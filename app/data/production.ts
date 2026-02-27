import { products, type Product } from '~/data/products'
import { ingredients, type Ingredient } from '~/data/ingredients'
import { users, type User } from '~/data/users'

export interface ProductionIngredientLine {
    ingredientId: number
    ingredientName: string
    quantityUsed: number
    unit: string
}

export interface ProductionRecord {
    id: number
    date: string
    productId: number
    productName: string
    quantityProduced: number
    producedBy: string
    ingredients: ProductionIngredientLine[]
}

function findProduct(id: number): Product | undefined {
    return products.find((p) => p.id === id)
}

function findUser(id: number): User | undefined {
    return users.value.find((u) => u.id === id)
}

function findIngredient(id: number): Ingredient | undefined {
    return ingredients.value.find((i) => i.id === id)
}

export const productionHistory = ref<ProductionRecord[]>([
    {
        id: 1,
        date: '2025-02-24T09:00:00',
        productId: 1,
        productName: findProduct(1)?.name ?? 'Product 1',
        quantityProduced: 40,
        producedBy: `${findUser(1)?.firstName ?? 'Ama'} ${findUser(1)?.lastName ?? 'Mensah'}`,
        ingredients: [
            {
                ingredientId: 1,
                ingredientName: findIngredient(1)?.name ?? 'Flour',
                quantityUsed: 20,
                unit: findIngredient(1)?.unit ?? 'kg',
            },
            {
                ingredientId: 4,
                ingredientName: findIngredient(4)?.name ?? 'Yeast',
                quantityUsed: 1,
                unit: findIngredient(4)?.unit ?? 'kg',
            },
        ],
    },
    {
        id: 2,
        date: '2025-02-23T14:30:00',
        productId: 2,
        productName: findProduct(2)?.name ?? 'Product 2',
        quantityProduced: 24,
        producedBy: `${findUser(2)?.firstName ?? 'John'} ${findUser(2)?.lastName ?? 'Smith'}`,
        ingredients: [
            {
                ingredientId: 1,
                ingredientName: findIngredient(1)?.name ?? 'Flour',
                quantityUsed: 15,
                unit: findIngredient(1)?.unit ?? 'kg',
            },
            {
                ingredientId: 2,
                ingredientName: findIngredient(2)?.name ?? 'Sugar',
                quantityUsed: 5,
                unit: findIngredient(2)?.unit ?? 'kg',
            },
            {
                ingredientId: 3,
                ingredientName: findIngredient(3)?.name ?? 'Butter',
                quantityUsed: 3,
                unit: findIngredient(3)?.unit ?? 'kg',
            },
        ],
    },
    {
        id: 3,
        date: '2025-02-22T08:15:00',
        productId: 3,
        productName: findProduct(3)?.name ?? 'Product 3',
        quantityProduced: 30,
        producedBy: `${findUser(3)?.firstName ?? 'Abena'} ${findUser(3)?.lastName ?? 'Osei'}`,
        ingredients: [
            {
                ingredientId: 1,
                ingredientName: findIngredient(1)?.name ?? 'Flour',
                quantityUsed: 18,
                unit: findIngredient(1)?.unit ?? 'kg',
            },
            {
                ingredientId: 5,
                ingredientName: findIngredient(5)?.name ?? 'Salt',
                quantityUsed: 0.5,
                unit: findIngredient(5)?.unit ?? 'kg',
            },
        ],
    },
])

