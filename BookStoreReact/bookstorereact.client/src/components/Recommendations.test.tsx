import { render, screen, fireEvent } from "@testing-library/react";
import Recommendations from "./Recommendations";
import type { BackendBook } from "./booksMapper";

const mockBooks: BackendBook[] = [
 {
 isbn: "111",
 categoryID:2,
 title: "Test Book",
 author: "Test Author",
 price:10,
 year: "2020",
 inStock:5,
 publisher: "Test Pub",
 edition: "1st",
 },
];

describe("Recommendations UI", () => {
 beforeEach(() => {
 // reset fetch between tests
 // @ts-expect-error - mock global fetch for tests
 global.fetch = vi.fn();
 });

 it("shows recommendations when fetch succeeds (guest)", async () => {
 // @ts-expect-error - mock successful fetch response
 global.fetch.mockResolvedValueOnce({
 ok: true,
 json: async () => mockBooks,
 });

 render(<Recommendations cart={[]} />);

 // card shows after fetch
 const card = await screen.findByText("Test Book");
 expect(card).toBeInTheDocument();
 });

 it("shows error message when fetch fails", async () => {
 // @ts-expect-error - mock failed fetch response
 global.fetch.mockResolvedValueOnce({
 ok: false,
 status:500,
 });

 render(<Recommendations cart={[]} />);

 const errorMsg = await screen.findByText(/failed to load books for recommendations/i);
 expect(errorMsg).toBeInTheDocument();
 });

 it("calls addToCart when Add button is clicked", async () => {
 // @ts-expect-error - mocking global fetch for this test
 global.fetch.mockResolvedValueOnce({
 ok: true,
 json: async () => mockBooks,
 });

 const addToCart = vi.fn();
 render(<Recommendations cart={[]} addToCart={addToCart} />);

    // Button text is "Add to Cart" in the component, match full label
    const addButton = await screen.findByRole("button", { name: /add to cart/i });
 fireEvent.click(addButton);

 expect(addToCart).toHaveBeenCalled();
 });
});
