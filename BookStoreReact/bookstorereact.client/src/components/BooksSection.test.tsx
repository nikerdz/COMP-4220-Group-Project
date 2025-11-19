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
        // @ts-expect-error
        global.fetch = vi.fn();
    });

    it("shows books when fetch succeeds", async () => {
        // @ts-expect-error
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
        // @ts-expect-error
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
        // @ts-expect-error
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
});
