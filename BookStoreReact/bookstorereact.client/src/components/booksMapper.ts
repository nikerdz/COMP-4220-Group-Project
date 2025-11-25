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
    price: number;
    inStock: number;
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

// category color map
export const categoryColors: Record<string, string> = {
    Biography: "bg-[#B8BC92] text-white",
    "Self-Help": "bg-[#C94B3B] text-white",
    Business: "bg-[#2B8B8E] text-white",
    Programming: "bg-[#C66C33] text-white",
    Software: "bg-[#7C6A52] text-white",
    Classics: "bg-[#5B3B33] text-white",
    Default: "bg-[#3B1F16] text-[#F5EBDD]",
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
        description: `Publisher: ${b.publisher ?? "Unknown"}. Edition: ${b.edition ?? "N/A"}.`,
        price: b.price,
        inStock: b.inStock,
    };
}
export function filterBooks(books: BookItem[], query: string): BookItem[] {
    const q = query.trim().toLowerCase();
    if (q === "") return books;

    return books.filter((b) => {
        const title = b.title.toLowerCase();
        const author = b.author.toLowerCase();
        const category = b.category.toLowerCase();
        return (
            title.includes(q) ||
            author.includes(q) ||
            category.includes(q)
        );
    });
}
