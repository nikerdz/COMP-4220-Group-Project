CREATE TABLE [dbo].[Wishlist] (
    [WishlistID] INT IDENTITY(1,1) PRIMARY KEY,
    [UserID]     INT       NOT NULL,
    [ISBN]       CHAR(10)  NOT NULL,
    [DateAdded]  DATETIME  NOT NULL DEFAULT GETDATE(),

    CONSTRAINT UQ_Wishlist UNIQUE (UserID, ISBN),

    CONSTRAINT FK_Wishlist_User
        FOREIGN KEY (UserID) REFERENCES [dbo].[UserData] (UserID)
        ON DELETE CASCADE,

    CONSTRAINT FK_Wishlist_Book
        FOREIGN KEY (ISBN) REFERENCES [dbo].[BookData] (ISBN)
        ON DELETE CASCADE
);
