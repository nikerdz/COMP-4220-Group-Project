-- ============================================================
-- Order History Database Schema
-- ============================================================
-- This script creates the necessary tables for order management
-- Run this on the Agile1422DB25 database before using the order APIs
-- ============================================================

-- Check if tables already exist and drop them (for clean reinstall)
-- WARNING: This will delete all existing order data!
-- Comment out these lines if you want to preserve existing data

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderItems]') AND type in (N'U'))
    DROP TABLE [dbo].[OrderItems];
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderData]') AND type in (N'U'))
    DROP TABLE [dbo].[OrderData];
GO

-- ============================================================
-- Create OrderData Table
-- ============================================================
CREATE TABLE [dbo].[OrderData] (
    [OrderID] INT IDENTITY(1,1) NOT NULL,
    [UserID] INT NOT NULL,
    [OrderDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [TotalAmount] DECIMAL(10,2) NOT NULL,
    [SubtotalAmount] DECIMAL(10,2) NOT NULL,
    [TaxAmount] DECIMAL(10,2) NOT NULL,
    [DeliveryFee] DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    [Status] VARCHAR(20) NOT NULL DEFAULT 'Pending',
    [ShippingAddress] NVARCHAR(200) NULL,
    [PaymentMethod] VARCHAR(20) NULL,
    [Email] VARCHAR(100) NULL,
    
    CONSTRAINT [PK_OrderData] PRIMARY KEY CLUSTERED ([OrderID] ASC),
    CONSTRAINT [FK_OrderData_UserData] FOREIGN KEY ([UserID]) 
        REFERENCES [dbo].[UserData]([UserID])
);
GO

-- Create index on UserID for faster order history queries
CREATE NONCLUSTERED INDEX [IX_OrderData_UserID] 
ON [dbo].[OrderData] ([UserID] ASC);
GO

-- Create index on OrderDate for sorting
CREATE NONCLUSTERED INDEX [IX_OrderData_OrderDate] 
ON [dbo].[OrderData] ([OrderDate] DESC);
GO

-- ============================================================
-- Create OrderItems Table
-- ============================================================
CREATE TABLE [dbo].[OrderItems] (
    [OrderItemID] INT IDENTITY(1,1) NOT NULL,
    [OrderID] INT NOT NULL,
    [ISBN] VARCHAR(20) NOT NULL,
    [Title] NVARCHAR(200) NULL,
    [Author] NVARCHAR(100) NULL,
    [Price] DECIMAL(10,2) NOT NULL,
    [Quantity] INT NOT NULL DEFAULT 1,
    [Subtotal] DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT [PK_OrderItems] PRIMARY KEY CLUSTERED ([OrderItemID] ASC),
    CONSTRAINT [FK_OrderItems_OrderData] FOREIGN KEY ([OrderID]) 
        REFERENCES [dbo].[OrderData]([OrderID]) ON DELETE CASCADE,
    
    -- Ensure positive values
    CONSTRAINT [CK_OrderItems_Price] CHECK ([Price] >= 0),
    CONSTRAINT [CK_OrderItems_Quantity] CHECK ([Quantity] > 0),
    CONSTRAINT [CK_OrderItems_Subtotal] CHECK ([Subtotal] >= 0)
);
GO

-- Create index on OrderID for faster item lookups
CREATE NONCLUSTERED INDEX [IX_OrderItems_OrderID] 
ON [dbo].[OrderItems] ([OrderID] ASC);
GO

-- ============================================================
-- Verify Table Creation
-- ============================================================
PRINT 'Checking created tables...';
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderData]') AND type in (N'U'))
    PRINT '✓ OrderData table created successfully';
ELSE
    PRINT '✗ ERROR: OrderData table was not created';
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OrderItems]') AND type in (N'U'))
    PRINT '✓ OrderItems table created successfully';
ELSE
    PRINT '✗ ERROR: OrderItems table was not created';
GO

PRINT 'Schema creation complete!';
PRINT 'You can now use the order history API endpoints.';
GO

-- ============================================================
-- Optional: Insert sample data for testing
-- ============================================================
-- Uncomment the following section if you want to insert test data
-- Note: Replace UserID with an actual valid UserID from your UserData table

/*
DECLARE @TestUserID INT = 1; -- Change this to a valid UserID

-- Insert a sample order
INSERT INTO OrderData (UserID, OrderDate, TotalAmount, SubtotalAmount, TaxAmount, DeliveryFee, Status, ShippingAddress, PaymentMethod, Email)
VALUES (@TestUserID, GETDATE(), 56.49, 49.99, 6.50, 0.00, 'Pending', '123 Test St, Windsor, ON N9B 1A1', '**** 1234', 'test@example.com');

DECLARE @OrderID INT = SCOPE_IDENTITY();

-- Insert sample order items
INSERT INTO OrderItems (OrderID, ISBN, Title, Author, Price, Quantity, Subtotal)
VALUES 
    (@OrderID, '978-0134685991', 'Effective Java', 'Joshua Bloch', 34.99, 1, 34.99),
    (@OrderID, '978-0135166307', 'Clean Code', 'Robert C. Martin', 15.00, 1, 15.00);

PRINT 'Sample order inserted with OrderID: ' + CAST(@OrderID AS VARCHAR(10));
*/
