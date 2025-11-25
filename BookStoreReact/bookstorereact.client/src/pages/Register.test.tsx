import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Helper to render component with routing
const renderRegister = () => {
    return render(
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    );
};

describe("Register Component - White Box Testing", () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        // @ts-expect-error - mock global fetch for tests
        global.fetch = vi.fn();
        localStorage.clear();
    });

    describe("Input Field Validation - Branch Coverage", () => {
        it("should validate that firstName is required (line 25-27)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Leave firstName empty, fill other required fields
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/first name is required/i)
                ).toBeInTheDocument();
            });
        });

        it("should validate that lastName is required (line 29-31)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Leave lastName empty
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/last name is required/i)
                ).toBeInTheDocument();
            });
        });

        it("should validate that username is required (line 33-35)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Leave username empty
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/username is required/i)
                ).toBeInTheDocument();
            });
        });

        it("should validate that email is required (line 37-38)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Leave email empty
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/email is required/i)
                ).toBeInTheDocument();
            });
        });

        it("should validate email format using regex (line 39-41)", async () => {
            const { container } = renderRegister();

            // Fill all fields but use invalid email
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "invalidemail" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            // Submit the form directly to ensure onSubmit handler fires
            const form = container.querySelector("form");
            if (form) {
                fireEvent.submit(form);
            }

            // Use findByText which automatically waits for the element
            const errorMessage = await screen.findByText(/invalid email format/i);
            expect(errorMessage).toBeInTheDocument();
        });

        it("should validate that password is required (line 43-45)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Leave password empty
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/password is required/i)
                ).toBeInTheDocument();
            });
        });

        it("should validate that confirmPassword is required (line 47-49)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Leave confirmPassword empty
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/please confirm your password/i)
                ).toBeInTheDocument();
            });
        });

        it("should validate that passwords match (line 51-53)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Fill all fields but passwords don't match
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "differentpassword" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/passwords do not match/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe("Form Submission - API Call Testing", () => {
        it("should submit form with valid data and call API correctly (line 64-75)", async () => {
            const mockResponse = {
                userId: 1,
                username: "testuser",
                email: "test@test.com",
            };

            // @ts-expect-error - mock successful fetch response
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            renderRegister();

            // Fill all fields correctly
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith("/api/test/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: "John Doe",
                        username: "testuser",
                        password: "password123",
                        email: "test@test.com",
                    }),
                });
            });
        });

        it("should store user data in localStorage on successful registration (line 79-82)", async () => {
            const mockResponse = {
                userId: 1,
                username: "testuser",
                email: "test@test.com",
            };

            // @ts-expect-error - mock successful fetch response
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            renderRegister();

            // Fill all fields correctly
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                const storedUser = localStorage.getItem("user");
                expect(storedUser).toBeTruthy();
                expect(JSON.parse(storedUser!)).toEqual(mockResponse);
            });
        });

        it("should navigate to home page on successful registration (line 82)", async () => {
            const mockResponse = {
                userId: 1,
                username: "testuser",
                email: "test@test.com",
            };

            // @ts-expect-error - mock successful fetch response
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            renderRegister();

            // Fill all fields correctly
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/");
            });
        });

        it("should display error message when API returns error (line 83-85)", async () => {
            const errorMessage = "Username already exists";

            // @ts-expect-error - mock failed API response
            global.fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ message: errorMessage }),
            });

            renderRegister();

            // Fill all fields correctly
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "existinguser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(errorMessage)).toBeInTheDocument();
            });
        });

        it("should display network error message on fetch failure (line 86-88)", async () => {
            // @ts-expect-error - mock fetch rejection
            global.fetch.mockRejectedValueOnce(new Error("Network error"));

            renderRegister();

            // Fill all fields correctly
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/network error.*try again/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe("State Management - Loading State Testing", () => {
        it("should set loading state during form submission (line 60, 89)", async () => {
            // @ts-expect-error - mock successful fetch with delay
            global.fetch.mockImplementationOnce(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({
                                ok: true,
                                json: async () => ({ userId: 1 }),
                            });
                        }, 100);
                    })
            );

            renderRegister();

            // Fill form
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            // Check loading state
            await waitFor(() => {
                expect(
                    screen.getByRole("button", { name: /creating account/i })
                ).toBeInTheDocument();
                expect(
                    screen.getByRole("button", { name: /creating account/i })
                ).toBeDisabled();
            });
        });

        it("should clear errors when form is resubmitted (line 20)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });

            // Submit empty form to generate errors
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/first name is required/i)
                ).toBeInTheDocument();
            });

            // Fill in firstName and resubmit
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "John" },
            });

            fireEvent.click(submitButton);

            await waitFor(() => {
                // Original error should be cleared
                expect(
                    screen.queryByText(/first name is required/i)
                ).not.toBeInTheDocument();
                // But other validation errors should appear
                expect(
                    screen.getByText(/last name is required/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe("Input Change Handler - State Updates (line 93-99)", () => {
        it("should update firstName state when input changes", () => {
            renderRegister();

            const firstNameInput = screen.getByLabelText(
                /first name/i
            ) as HTMLInputElement;

            fireEvent.change(firstNameInput, { target: { value: "Jane" } });

            expect(firstNameInput.value).toBe("Jane");
        });

        it("should update lastName state when input changes", () => {
            renderRegister();

            const lastNameInput = screen.getByLabelText(
                /last name/i
            ) as HTMLInputElement;

            fireEvent.change(lastNameInput, { target: { value: "Smith" } });

            expect(lastNameInput.value).toBe("Smith");
        });

        it("should update username state when input changes", () => {
            renderRegister();

            const usernameInput = screen.getByLabelText(
                /^username/i
            ) as HTMLInputElement;

            fireEvent.change(usernameInput, { target: { value: "jsmith" } });

            expect(usernameInput.value).toBe("jsmith");
        });

        it("should update email state when input changes", () => {
            renderRegister();

            const emailInput = screen.getByLabelText(
                /^email/i
            ) as HTMLInputElement;

            fireEvent.change(emailInput, {
                target: { value: "jane@test.com" },
            });

            expect(emailInput.value).toBe("jane@test.com");
        });

        it("should update password state when input changes", () => {
            renderRegister();

            const passwordInput = screen.getByLabelText(
                /^password$/i
            ) as HTMLInputElement;

            fireEvent.change(passwordInput, {
                target: { value: "securepass" },
            });

            expect(passwordInput.value).toBe("securepass");
        });

        it("should update confirmPassword state when input changes", () => {
            renderRegister();

            const confirmPasswordInput = screen.getByLabelText(
                /confirm password/i
            ) as HTMLInputElement;

            fireEvent.change(confirmPasswordInput, {
                target: { value: "securepass" },
            });

            expect(confirmPasswordInput.value).toBe("securepass");
        });
    });

    describe("UI Rendering - Component Structure", () => {
        it("should render registration form with all required fields", () => {
            renderRegister();

            expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^username/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
            expect(
                screen.getByLabelText(/confirm password/i)
            ).toBeInTheDocument();
        });

        it("should render submit button", () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).not.toBeDisabled();
        });

        it("should render heading and description", () => {
            renderRegister();

            expect(
                screen.getByRole("heading", { name: /create account/i })
            ).toBeInTheDocument();
            expect(screen.getByText(/join bookstore today/i)).toBeInTheDocument();
        });

        it("should not display error container when no errors exist", () => {
            renderRegister();

            const errorContainer = screen.queryByRole("list");
            expect(errorContainer).not.toBeInTheDocument();
        });

        it("should display error container when errors exist (line 111-119)", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                const errorContainer = screen.getByRole("list");
                expect(errorContainer).toBeInTheDocument();
            });
        });
    });

    describe("Multiple Validation Errors", () => {
        it("should display all validation errors when all fields are empty", async () => {
            renderRegister();

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/first name is required/i)
                ).toBeInTheDocument();
                expect(
                    screen.getByText(/last name is required/i)
                ).toBeInTheDocument();
                expect(
                    screen.getByText(/username is required/i)
                ).toBeInTheDocument();
                expect(screen.getByText(/email is required/i)).toBeInTheDocument();
                expect(
                    screen.getByText(/password is required/i)
                ).toBeInTheDocument();
                expect(
                    screen.getByText(/please confirm your password/i)
                ).toBeInTheDocument();
            });
        });
    });

    describe("Edge Cases", () => {
        it("should trim whitespace from firstName during validation", async () => {
            renderRegister();

            // Fill firstName with only whitespace
            fireEvent.change(screen.getByLabelText(/first name/i), {
                target: { value: "   " },
            });
            fireEvent.change(screen.getByLabelText(/last name/i), {
                target: { value: "Doe" },
            });
            fireEvent.change(screen.getByLabelText(/^username/i), {
                target: { value: "testuser" },
            });
            fireEvent.change(screen.getByLabelText(/^email/i), {
                target: { value: "test@test.com" },
            });
            fireEvent.change(screen.getByLabelText(/^password$/i), {
                target: { value: "password123" },
            });
            fireEvent.change(screen.getByLabelText(/confirm password/i), {
                target: { value: "password123" },
            });

            const submitButton = screen.getByRole("button", {
                name: /create account/i,
            });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(/first name is required/i)
                ).toBeInTheDocument();
            });
        });
    });
});
