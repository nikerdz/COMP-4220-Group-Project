IF NOT EXISTS (
    SELECT * FROM sysobjects 
    WHERE name = 'Cart' AND xtype = 'U'
)
BEGIN
    CREATE TABLE [dbo].[Cart] (
        [CartID] INT IDENTITY(1,1) PRIMARY KEY,
        [CustomerID] INT NOT NULL,
        [ISBN] CHAR(10) NOT NULL,
        [Quantity] INT DEFAULT 1,
        [Subtotal] DECIMAL(10,2),
        CONSTRAINT [FK_Cart_Customer] FOREIGN KEY ([CustomerID]) REFERENCES [dbo].[Customer]([CustomerID]),
        CONSTRAINT [FK_Cart_Book] FOREIGN KEY ([ISBN]) REFERENCES [dbo].[BookData]([ISBN])
    );
END;
