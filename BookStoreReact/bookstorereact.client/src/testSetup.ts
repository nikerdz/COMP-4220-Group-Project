import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll, vi } from "vitest";

// Automatically cleanup after each test
afterEach(() => {
    cleanup();
});

// Silence expected console.error logs (e.g. simulated HTTP 500) during tests
let _errorSpy: ReturnType<typeof vi.spyOn> | undefined;
beforeAll(() => {
    _errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
    _errorSpy?.mockRestore();
});
