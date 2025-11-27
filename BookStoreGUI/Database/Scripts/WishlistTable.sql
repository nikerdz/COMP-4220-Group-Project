IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Wishlist' AND xtype = 'U')
BEGIN
    CREATE TABLE [dbo].[Wishlist] (
        [WishlistID] INT IDENTITY(1,1) PRIMARY KEY,
        [CustomerID] INT NOT NULL,
        [ISBN] CHAR(10) NOT NULL,
        CONSTRAINT [UQ_Wishlist_Customer_ISBN] UNIQUE ([CustomerID],[ISBN]),
        CONSTRAINT [FK_Wishlist_Customer] FOREIGN KEY ([CustomerID]) REFERENCES [dbo].[Customer]([CustomerID]),
        CONSTRAINT [FK_Wishlist_Book] FOREIGN KEY ([ISBN]) REFERENCES [dbo].[BookData]([ISBN])
    );
END;