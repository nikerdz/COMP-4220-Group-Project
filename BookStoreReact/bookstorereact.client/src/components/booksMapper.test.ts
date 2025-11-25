import {
    getCategoryFromId,
    mapBackendToBookItem,
    filterBooks,
    type BackendBook,
    type BookItem,
} from "./booksMapper";

describe("getCategoryFromId", () => {
    it("returns the correct category for known IDs", () => {
        expect(getCategoryFromId(1)).toBe("Classics");
        expect(getCategoryFromId(2)).toBe("Programming");
        expect(getCategoryFromId(6)).toBe("Business");
    });

    it("returns Default for unknown IDs", () => {
        expect(getCategoryFromId(999)).toBe("Default");
    });
});

describe("mapBackendToBookItem", () => {
    const base: BackendBook = {
        isbn: "123",
        categoryID: 2,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 45,
        year: "2008",
        inStock: 10,
        publisher: "Prentice Hall",
        edition: "1st",
    };

    it("maps BackendBook to BookItem with correct formatting", () => {
        const item = mapBackendToBookItem(base);

        expect(item.id).toBe("123");
        expect(item.title).toBe("Clean Code");
        expect(item.author).toBe("Robert C. Martin");
        expect(item.category).toBe("Programming");
        expect(item.imageUrl).toContain("Programming.png");
        expect(item.shortDescription).toBe(
            "Published 2008. $45.00. In stock: 10"
        );
        expect(item.description).toBe(
            "Publisher: Prentice Hall. Edition: 1st."
        );
    });

    it("uses default values when publisher or edition are missing", () => {
        const item = mapBackendToBookItem({
            ...base,
            publisher: undefined,
            edition: undefined,
        });

        expect(item.description).toBe(
            "Publisher: Unknown. Edition: N/A."
        );
    });

    it("uses default category and cover when categoryID is unknown", () => {
        const item = mapBackendToBookItem({
            ...base,
            categoryID: 999,
        });

        expect(item.category).toBe("Default");
        expect(item.imageUrl).toContain("DEFAULT.png");
    });
});

// TDD: filterBooks search behaviour

const sampleBooks: BookItem[] = [
    {
        id: "1",
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Programming",
        imageUrl: "",
        shortDescription: "",
        description: "",
        price: 0,
        inStock: 0
    },
    {
        id: "2",
        title: "Becoming",
        author: "Michelle Obama",
        category: "Biography",
        imageUrl: "",
        shortDescription: "",
        description: "",
        price: 0,
        inStock: 0
    },
    {
        id: "3",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Classics",
        imageUrl: "",
        shortDescription: "",
        description: "",
        price: 0,
        inStock: 0
    },
];

describe("filterBooks", () => {
    it("returns all books when query is empty", () => {
        const result = filterBooks(sampleBooks, "");
        expect(result).toEqual(sampleBooks);
    });

    it("matches by title (case-insensitive)", () => {
        const result = filterBooks(sampleBooks, "clean");
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Clean Code");
    });

    it("matches by author (case-insensitive)", () => {
        const result = filterBooks(sampleBooks, "obama");
        expect(result).toHaveLength(1);
        expect(result[0].author).toBe("Michelle Obama");
    });

    it("matches by category name", () => {
        const result = filterBooks(sampleBooks, "classics");
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Pride and Prejudice");
    });

    it("returns empty array when no books match", () => {
        const result = filterBooks(sampleBooks, "qwerty");
        expect(result).toHaveLength(0);
    });
});
