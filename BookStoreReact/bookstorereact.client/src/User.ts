export interface User {
    userId: number;
    userName: string;
    fullName: string | null;
    email: string | null;
    type: "CU" | "AD";
    manager: boolean;

    // Admin UI requires password when creating users
    password: string;
}
