export type DiscountType = "Percentage" | "FixedAmount";

export interface Coupon {
    couponID: number;
    code: string;
    description?: string;
    discountRate: number;
    type: DiscountType;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    usageLimit?: number;
    timesUsed?: number;
    minimumOrderAmount?: number;
    requiredAuthor?: string;
    requiredCategory?: string;
}

export interface OrderItem {
    author?: string | null;
    category?: string | null;
    price: number;
}

export function isCouponValid(
    coupon: Coupon,
    orderSubtotal: number,
    items: OrderItem[]
): boolean {
    if (!coupon.isActive) return false;

    const now = new Date();

    if (coupon.startDate && now < coupon.startDate) return false;
    if (coupon.endDate && now > coupon.endDate) return false;

    if (
        coupon.usageLimit != null &&
        coupon.timesUsed != null &&
        coupon.timesUsed >= coupon.usageLimit
    ) {
        return false;
    }

    if (
        coupon.minimumOrderAmount != null &&
        orderSubtotal < coupon.minimumOrderAmount
    ) {
        return false;
    }

    if (coupon.requiredAuthor && coupon.requiredAuthor.trim() !== "") {
        const hasAuthor = items.some(
            (i) =>
                i.author &&
                i.author.toLowerCase() === coupon.requiredAuthor!.toLowerCase()
        );
        if (!hasAuthor) return false;
    }

    if (coupon.requiredCategory && coupon.requiredCategory.trim() !== "") {
        const hasCategory = items.some(
            (i) =>
                i.category &&
                i.category.toLowerCase() ===
                coupon.requiredCategory!.toLowerCase()
        );
        if (!hasCategory) return false;
    }

    return true;
}

export function applyCouponDiscount(
    coupon: Coupon,
    subtotal: number
): number {
    let discountAmount = 0;

    if (coupon.type === "Percentage") {
        discountAmount = subtotal * coupon.discountRate;
    } else {
        discountAmount = coupon.discountRate;
    }

    if (discountAmount > subtotal) {
        discountAmount = subtotal;
    }

    return subtotal - discountAmount;
}
