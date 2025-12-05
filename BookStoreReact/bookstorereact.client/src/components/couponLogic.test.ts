import {
    isCouponValid,
    applyCouponDiscount,
    type Coupon,
    type OrderItem,
} from "./couponLogic";

describe("couponLogic - isCouponValid", () => {
    const baseCoupon: Coupon = {
        couponID: 1,
        code: "TEST10",
        description: "10% off",
        discountRate: 0.1,
        type: "Percentage",
        isActive: true,
        startDate: undefined,
        endDate: undefined,
        usageLimit: undefined,
        timesUsed: undefined,
        minimumOrderAmount: undefined,
        requiredAuthor: undefined,
        requiredCategory: undefined,
    };

    const items: OrderItem[] = [
        { author: "Jane Austen", category: "Classics", price: 15 },
        { author: "Robert C. Martin", category: "Programming", price: 45 },
    ];

    beforeAll(() => {
        // Freeze time so date-based tests are deterministic
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-10-01T12:00:00Z"));
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it("returns false when coupon is not active", () => {
        const coupon = { ...baseCoupon, isActive: false };
        const valid = isCouponValid(coupon, 60, items);
        expect(valid).toBe(false);
    });

    it("returns false when current date is before StartDate", () => {
        const coupon = {
            ...baseCoupon,
            startDate: new Date("2024-11-01T00:00:00Z"), // in the future relative to frozen time
        };

        const valid = isCouponValid(coupon, 60, items);
        expect(valid).toBe(false);
    });

    it("returns false when current date is after EndDate", () => {
        const coupon = {
            ...baseCoupon,
            startDate: new Date("2024-01-01T00:00:00Z"),
            endDate: new Date("2024-09-01T00:00:00Z"), // already expired
        };

        const valid = isCouponValid(coupon, 60, items);
        expect(valid).toBe(false);
    });

    it("returns false when usage limit is reached", () => {
        const coupon = {
            ...baseCoupon,
            usageLimit: 5,
            timesUsed: 5, // >= usageLimit
        };

        const valid = isCouponValid(coupon, 60, items);
        expect(valid).toBe(false);
    });

    it("enforces minimum order amount", () => {
        const coupon = {
            ...baseCoupon,
            minimumOrderAmount: 50,
        };

        const tooLow = isCouponValid(coupon, 40, items);
        const enough = isCouponValid(coupon, 50, items);

        expect(tooLow).toBe(false);
        expect(enough).toBe(true);
    });

    it("requires at least one item with the required author (case-insensitive)", () => {
        const coupon = {
            ...baseCoupon,
            requiredAuthor: "jane austen",
        };

        const valid = isCouponValid(coupon, 60, items);

        // Because items contain "Jane Austen", coupon should be valid
        expect(valid).toBe(true);

        const couponNoMatch = {
            ...baseCoupon,
            requiredAuthor: "J.K. Rowling",
        };

        const validNoMatch = isCouponValid(couponNoMatch, 60, items);
        expect(validNoMatch).toBe(false);
    });

    it("requires at least one item with the required category (case-insensitive)", () => {
        const coupon = {
            ...baseCoupon,
            requiredCategory: "programming",
        };

        const valid = isCouponValid(coupon, 60, items);
        expect(valid).toBe(true);

        const couponNoMatch = {
            ...baseCoupon,
            requiredCategory: "Mystery",
        };

        const validNoMatch = isCouponValid(couponNoMatch, 60, items);
        expect(validNoMatch).toBe(false);
    });

    it("returns true when all conditions are satisfied", () => {
        const coupon = {
            ...baseCoupon,
            isActive: true,
            startDate: new Date("2024-01-01T00:00:00Z"),
            endDate: new Date("2024-12-31T23:59:59Z"),
            usageLimit: 10,
            timesUsed: 3,
            minimumOrderAmount: 50,
            requiredAuthor: "Jane Austen",
            requiredCategory: "Classics",
        };

        const valid = isCouponValid(coupon, 60, items);
        expect(valid).toBe(true);
    });
});

describe("couponLogic - applyCouponDiscount", () => {
    const baseCoupon: Coupon = {
        couponID: 1,
        code: "TEST",
        description: "",
        discountRate: 0.1,
        type: "Percentage",
        isActive: true,
        startDate: undefined,
        endDate: undefined,
        usageLimit: undefined,
        timesUsed: undefined,
        minimumOrderAmount: undefined,
        requiredAuthor: undefined,
        requiredCategory: undefined,
    };

    it("applies a percentage discount correctly", () => {
        const coupon = { ...baseCoupon, discountRate: 0.2, type: "Percentage" };
        const subtotal = 100;

        const total = applyCouponDiscount(coupon, subtotal);

        // 20% off 100 = 80
        expect(total).toBe(80);
    });

    it("applies a fixed amount discount correctly", () => {
        const coupon = { ...baseCoupon, discountRate: 15, type: "FixedAmount" };
        const subtotal = 100;

        const total = applyCouponDiscount(coupon, subtotal);

        // 100 - 15 = 85
        expect(total).toBe(85);
    });

    it("never discounts more than the order subtotal", () => {
        const coupon = { ...baseCoupon, discountRate: 50, type: "FixedAmount" };
        const subtotal = 30;

        const total = applyCouponDiscount(coupon, subtotal);

        // Discount capped at subtotal => total becomes 0
        expect(total).toBe(0);
    });
});
