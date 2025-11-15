IF NOT EXISTS (
    SELECT * FROM sysobjects 
    WHERE name = 'Coupon' AND xtype = 'U'
)

CREATE TABLE [dbo].[Coupon] (
    [CouponID]      INT IDENTITY(1,1) NOT NULL,
    [Code]          VARCHAR(20)       NOT NULL,                                                 -- e.g., 'SPRING2025', 'BLACKFRIDAY30'
    [Description]   VARCHAR(255)      NULL,                                                     -- Optional: human-readable description of coupon
    [DiscountRate]  DECIMAL(4,2)      NOT NULL,                                                 -- Stored as percentage (e.g., 30.00 for 30%)
    [UsageLimit]    INT               NULL,                                                     -- Null = unlimited; set like 1 for one-time-only coupons
    [TimesUsed]     INT               NOT NULL CONSTRAINT [DF_Coupon_TimesUsed] DEFAULT ((0)),  -- Tracks usage
    [StartDate]     DATETIME          NULL,                                                     -- Coupon becomes valid
    [EndDate]       DATETIME          NULL,                                                     -- Coupon expires
    [IsActive]      BIT               NOT NULL CONSTRAINT [DF_Coupon_IsActive] DEFAULT ((1)),   -- Allows soft disabling of coupons

    CONSTRAINT [PK_Coupon] PRIMARY KEY CLUSTERED ([CouponID] ASC),
    CONSTRAINT [UQ_Coupon_Code] UNIQUE ([Code]),

    CONSTRAINT [CHK_Coupon_DiscountRate] CHECK ([DiscountRate] > 0 AND [DiscountRate] <= 1),
    CONSTRAINT [CHK_Coupon_TimesUsed] CHECK ([TimesUsed] >= 0),
    CONSTRAINT [CHK_Coupon_DateRange] CHECK ([StartDate] IS NULL OR [EndDate] IS NULL OR [StartDate] <= [EndDate])
);
