import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import BooksSection from "./BooksSection";
import type { BackendBook } from "./booksMapper";

const mockBooks: BackendBook[] = [
    {
        isbn: "111",
        categoryID: 2,
        title: "Test Book",
        author: "Test Author",
        price: 10,
        year: "2020",
        inStock: 5,
        publisher: "Test Pub",
        edition: "1st",
    },
];

describe("BooksSection UI", () => {
    beforeEach(() => {
        // reset fetch between tests
        // @ts-expect-error - mock global fetch for tests
        global.fetch = vi.fn();
    });

    it("shows books when fetch succeeds", async () => {
        // @ts-expect-error - mock successful fetch response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockBooks,
        });

        render(<BooksSection />);

        // title exists immediately
        expect(
            screen.getByRole("heading", { name: /books/i })
        ).toBeInTheDocument();

        // card shows after fetch
        const card = await screen.findByText("Test Book");
        expect(card).toBeInTheDocument();
    });

    it("shows error message when fetch fails", async () => {
        // @ts-expect-error - mock failed fetch response
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        render(<BooksSection />);

        const errorMsg = await screen.findByText(
            /failed to load books from server/i
        );
        expect(errorMsg).toBeInTheDocument();
    });

    it("opens and closes modal when clicking a book", async () => {
        // @ts-expect-error - mocking global fetch for this test
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockBooks,
        });

        render(<BooksSection />);

        const card = await screen.findByText("Test Book");
        fireEvent.click(card);

        // modal open
        expect(
            screen.getByText(/Test Author · Programming/)
        ).toBeInTheDocument();

        const closeButton = screen.getByRole("button", { name: /✕/i });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(
                screen.queryByText(/Test Author · Programming/)
            ).not.toBeInTheDocument();
        });
    });
    it("filters rendered books when user types in search box", async () => {
        // @ts-expect-error - mock fetch for this test
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [
                {
                    isbn: "111",
                    categoryID: 2,
                    title: "Clean Code",
                    author: "Robert C. Martin",
                    price: 10,
                    year: "2008",
                    inStock: 5,
                    publisher: "Prentice Hall",
                    edition: "1st",
                },
                {
                    isbn: "222",
                    categoryID: 2,
                    title: "The Pragmatic Programmer",
                    author: "Andrew Hunt",
                    price: 15,
                    year: "1999",
                    inStock: 3,
                    publisher: "Addison-Wesley",
                    edition: "1st",
                },
            ],
        });

        render(<BooksSection />);

        // both books should show initially
        expect(await screen.findByText("Clean Code")).toBeInTheDocument();
        expect(screen.getByText("The Pragmatic Programmer")).toBeInTheDocument();

        // type into the search box (update selector to whatever you used)
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: "clean" } });

        // after filtering, only Clean Code should be visible
        expect(screen.getByText("Clean Code")).toBeInTheDocument();
        expect(
            screen.queryByText("The Pragmatic Programmer")
        ).not.toBeInTheDocument();
    });

});
