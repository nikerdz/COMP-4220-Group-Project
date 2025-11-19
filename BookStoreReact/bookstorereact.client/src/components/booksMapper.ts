export interface BackendBook {
    isbn: string;
    categoryID: number;
    title: string;
    author: string;
    price: number;
    supplierId?: number;
    year: string;
    edition?: string;
    publisher?: string;
    inStock: number;
}

export interface BookItem {
    id: string;
    title: string;
    author: string;
    category: string;
    imageUrl: string;
    shortDescription: string;
    description: string;
}

const categoryMap: Record<number, string> = {
    1: "Classics",
    2: "Programming",
    3: "Software",
    4: "Self-Help",
    5: "Biography",
    6: "Business",
};

const coverMap: Record<string, string> = {
    Classics: "/covers/Classics.png",
    Programming: "/covers/Programming.png",
    Software: "/covers/Software.png",
    "Self-Help": "/covers/Self Help.png",
    Biography: "/covers/Biography.png",
    Business: "/covers/Business.png",
    Default: "/covers/DEFAULT.png",
};

export function getCategoryFromId(id: number): string {
    return categoryMap[id] ?? "Default";
}

export function mapBackendToBookItem(b: BackendBook): BookItem {
    const category = getCategoryFromId(b.categoryID);
    const priceStr = b.price.toFixed(2);

    return {
        id: b.isbn,
        title: b.title,
        author: b.author,
        category,
        imageUrl: coverMap[category] || coverMap.Default,
        shortDescription: `Published ${b.year}. $${priceStr}. In stock: ${b.inStock}`,
        description: `Publisher: ${b.publisher ?? "Unknown"}. Edition: ${b.edition ?? "N/A"
            }.`,
    };
}
