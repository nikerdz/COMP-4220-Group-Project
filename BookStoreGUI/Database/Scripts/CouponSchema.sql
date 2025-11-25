INSERT INTO Coupon (Code, Description, DiscountRate, IsActive, StartDate, EndDate, UsageLimit, TimesUsed)
VALUES 
('SAVE10', '10% Off Purchase', 0.10, 1, GETDATE(), NULL, 100, 0),
('SAVE20', '20% Off Purchase', 0.20, 1, GETDATE(), NULL, 100, 0),
('SAVE30', '30% Off Purchase', 0.30, 1, GETDATE(), NULL, 100, 0),
('SAVE40', '40% Off Purchase', 0.40, 1, GETDATE(), NULL, 100, 0),
('SAVE50', '50% Off Purchase', 0.50, 1, GETDATE(), NULL, 100, 0),
('SAVE75', '75% Off Purchase', 0.75, 1, GETDATE(), NULL, 50, 0);
-- Verify the insertion
SELECT * FROM Coupon;