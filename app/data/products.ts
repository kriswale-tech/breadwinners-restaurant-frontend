export interface Product {
    id: number
    image?: string
    name: string
    description?: string
    price: number | string
}

export const products: Product[] = [
    {
        id: 1,
        image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Fresh_made_bread_05.jpg',
        name: 'Bread Winner',
        description: 'Freshly baked artisan loaf with a crisp crust and soft, airy crumb. Perfect with butter or jam.',
        price: 10.00,
    },
    {
        id: 2,
        image: 'https://static01.nyt.com/images/2024/10/08/multimedia/13EATrex-LD-briocherex-blfk/13EATrex-LD-briocherex-blfk-jumbo.jpg',
        name: 'Bread Winner',
        description: 'Rich brioche-style bread, slightly sweet and ideal for French toast or morning pastries.',
        price: 10.00,
    },
    {
        id: 3,
        image: 'https://www.allrecipes.com/thmb/_Mgp9ObZqGUJAnsdsvoCHq_yoUc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/272420-easy-100-whole-wheat-bread-VAT-Beauty-4x3-d2b2488a1ce04a4eaac67658cfc99e45.jpg',
        name: 'Bread Winner',
        description: '100% whole wheat loaf, hearty and nutritious. Great for sandwiches and toast.',
        price: 10.00,
    },
    {
        id: 4,
        image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Korb_mit_Br%C3%B6tchen.JPG',
        name: 'Bread Winner',
        description: 'Assorted rolls and mini loaves, perfect for sharing at the table or as a side.',
        price: 10.00,
    }
]