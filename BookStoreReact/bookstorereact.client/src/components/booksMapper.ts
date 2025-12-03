export interface BackendBook {
    isbn?: string;
    ISBN?: string;

    categoryID?: number;
    CategoryID?: number;

    title?: string;
    Title?: string;

    author?: string;
    Author?: string;

    price?: number | string | null;
    Price?: number | string | null;

    supplierId?: number;
    SupplierId?: number;

    year?: string;
    Year?: string;

    edition?: string;
    Edition?: string;

    publisher?: string;
    Publisher?: string;

    inStock?: number;
    InStock?: number;
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

export const categoryColors: Record<string, string> = {
    Biography: "bg-[#B8BC92] text-white",
    "Self-Help": "bg-[#C94B3B] text-white",
    Business: "bg-[#2B8B8E] text-white",
    Programming: "bg-[#C66C33] text-white",
    Software: "bg-[#7C6A52] text-white",
    Classics: "bg-[#5B3B33] text-white",
    Default: "bg-[#3B1F16] text-[#F5EBDD]",
};

export function getCategoryFromId(id?: number): string {
    return id ? categoryMap[id] ?? "Default" : "Default";
}

export function mapBackendToBookItem(b: BackendBook): BookItem {
    // FIX: safely read all possible casings from backend
    const isbn = b.isbn ?? b.ISBN ?? "";
    const categoryID = b.categoryID ?? b.CategoryID ?? 0;
    const title = b.title ?? b.Title ?? "Untitled";
    const author = b.author ?? b.Author ?? "Unknown";
    const rawPrice = b.price ?? b.Price ?? 0;

    // FIX: ensure price is always a number
    const priceNum = Number(rawPrice) || 0;

    const year = b.year ?? b.Year ?? "N/A";
    const edition = b.edition ?? b.Edition ?? "N/A";
    const publisher = b.publisher ?? b.Publisher ?? "Unknown";
    const inStock = b.inStock ?? b.InStock ?? 0;

    const category = getCategoryFromId(categoryID);

    return {
        id: isbn,
        title,
        author,
        category,
        imageUrl: coverMap[category] || coverMap.Default,
        shortDescription: `Published ${year}. $${priceNum.toFixed(2)}. In stock: ${inStock}`,
        description: `Publisher: ${publisher}. Edition: ${edition}.`,
        price: priceNum,
        inStock,
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
