using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace BookStoreLIB
{
    /// <summary>
    /// Data Access Layer for Order operations
    /// </summary>
    public class DALOrder
    {
        // Connection resolution using same pattern as DALUserInfo
        private static string ResolveConn()
        {
            var user = Environment.GetEnvironmentVariable("AGILE_DB_USER");
            var pass = Environment.GetEnvironmentVariable("AGILE_DB_PASSWORD");
            var server = Environment.GetEnvironmentVariable("AGILE_DB_SERVER") ?? "tfs.cs.uwindsor.ca";
            var db = Environment.GetEnvironmentVariable("AGILE_DB_NAME") ?? "Agile1422DB25";

            if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
                throw new InvalidOperationException("Missing AGILE_DB_USER/AGILE_DB_PASSWORD.");

            var cs = new SqlConnectionStringBuilder
            {
                DataSource = server,
                InitialCatalog = db,
                PersistSecurityInfo = true,
                UserID = user,
                Password = pass,
                Encrypt = true,
                TrustServerCertificate = true
            };

            return cs.ConnectionString;
        }

        /// <summary>
        /// Creates a new order with its items in a transaction
        /// </summary>
        /// <returns>The new OrderID</returns>
        public int CreateOrder(Order order, List<OrderItem> items)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            if (items == null || items.Count == 0)
                throw new ArgumentException("Order must contain at least one item.", nameof(items));

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();
                using (var transaction = conn.BeginTransaction())
                {
                    try
                    {
                        int orderId;

                        // Insert order
                        const string orderSql = @"
                            INSERT INTO OrderData 
                            (UserID, OrderDate, TotalAmount, SubtotalAmount, TaxAmount, DeliveryFee, 
                             Status, ShippingAddress, PaymentMethod, Email)
                            VALUES 
                            (@UserID, @OrderDate, @TotalAmount, @SubtotalAmount, @TaxAmount, @DeliveryFee, 
                             @Status, @ShippingAddress, @PaymentMethod, @Email);
                            SELECT CAST(SCOPE_IDENTITY() AS INT);";

                        using (var cmd = new SqlCommand(orderSql, conn, transaction))
                        {
                            cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = order.UserID;
                            cmd.Parameters.Add("@OrderDate", SqlDbType.DateTime).Value = order.OrderDate;
                            cmd.Parameters.Add("@TotalAmount", SqlDbType.Decimal).Value = order.TotalAmount;
                            cmd.Parameters.Add("@SubtotalAmount", SqlDbType.Decimal).Value = order.SubtotalAmount;
                            cmd.Parameters.Add("@TaxAmount", SqlDbType.Decimal).Value = order.TaxAmount;
                            cmd.Parameters.Add("@DeliveryFee", SqlDbType.Decimal).Value = order.DeliveryFee;
                            cmd.Parameters.Add("@Status", SqlDbType.VarChar, 20).Value = order.Status ?? "Pending";
                            cmd.Parameters.Add("@ShippingAddress", SqlDbType.NVarChar, 200).Value = 
                                string.IsNullOrWhiteSpace(order.ShippingAddress) ? (object)DBNull.Value : order.ShippingAddress;
                            cmd.Parameters.Add("@PaymentMethod", SqlDbType.VarChar, 20).Value = 
                                string.IsNullOrWhiteSpace(order.PaymentMethod) ? (object)DBNull.Value : order.PaymentMethod;
                            cmd.Parameters.Add("@Email", SqlDbType.VarChar, 100).Value = 
                                string.IsNullOrWhiteSpace(order.Email) ? (object)DBNull.Value : order.Email;

                            orderId = (int)cmd.ExecuteScalar();
                        }

                        // Insert order items
                        const string itemSql = @"
                            INSERT INTO OrderItems 
                            (OrderID, ISBN, Title, Author, Price, Quantity, Subtotal)
                            VALUES 
                            (@OrderID, @ISBN, @Title, @Author, @Price, @Quantity, @Subtotal);";

                        foreach (var item in items)
                        {
                            using (var cmd = new SqlCommand(itemSql, conn, transaction))
                            {
                                cmd.Parameters.Add("@OrderID", SqlDbType.Int).Value = orderId;
                                cmd.Parameters.Add("@ISBN", SqlDbType.VarChar, 20).Value = item.ISBN ?? "";
                                cmd.Parameters.Add("@Title", SqlDbType.NVarChar, 200).Value = 
                                    string.IsNullOrWhiteSpace(item.Title) ? (object)DBNull.Value : item.Title;
                                cmd.Parameters.Add("@Author", SqlDbType.NVarChar, 100).Value = 
                                    string.IsNullOrWhiteSpace(item.Author) ? (object)DBNull.Value : item.Author;
                                cmd.Parameters.Add("@Price", SqlDbType.Decimal).Value = item.Price;
                                cmd.Parameters.Add("@Quantity", SqlDbType.Int).Value = item.Quantity;
                                cmd.Parameters.Add("@Subtotal", SqlDbType.Decimal).Value = item.Subtotal;

                                cmd.ExecuteNonQuery();
                            }
                        }

                        transaction.Commit();
                        return orderId;
                    }
                    catch
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        /// <summary>
        /// Retrieves all orders for a specific user
        /// </summary>
        public List<Order> GetOrdersByUserId(int userId)
        {
            var orders = new List<Order>();

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                const string sql = @"
                    SELECT o.OrderID, o.UserID, o.OrderDate, o.TotalAmount, o.SubtotalAmount, 
                           o.TaxAmount, o.DeliveryFee, o.Status, o.ShippingAddress, o.PaymentMethod, o.Email,
                           COUNT(oi.OrderItemID) as ItemCount
                    FROM OrderData o
                    LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
                    WHERE o.UserID = @UserID
                    GROUP BY o.OrderID, o.UserID, o.OrderDate, o.TotalAmount, o.SubtotalAmount, 
                             o.TaxAmount, o.DeliveryFee, o.Status, o.ShippingAddress, o.PaymentMethod, o.Email
                    ORDER BY o.OrderDate DESC;";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var order = new Order
                            {
                                OrderID = reader.GetInt32(0),
                                UserID = reader.GetInt32(1),
                                OrderDate = reader.GetDateTime(2),
                                TotalAmount = reader.GetDecimal(3),
                                SubtotalAmount = reader.GetDecimal(4),
                                TaxAmount = reader.GetDecimal(5),
                                DeliveryFee = reader.GetDecimal(6),
                                Status = reader.GetString(7),
                                ShippingAddress = reader.IsDBNull(8) ? null : reader.GetString(8),
                                PaymentMethod = reader.IsDBNull(9) ? null : reader.GetString(9),
                                Email = reader.IsDBNull(10) ? null : reader.GetString(10)
                            };

                            orders.Add(order);
                        }
                    }
                }
            }

            return orders;
        }

        /// <summary>
        /// Retrieves a specific order with all its items
        /// </summary>
        public Order GetOrderDetails(int orderId)
        {
            Order order = null;

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                // Get order
                const string orderSql = @"
                    SELECT OrderID, UserID, OrderDate, TotalAmount, SubtotalAmount, TaxAmount, 
                           DeliveryFee, Status, ShippingAddress, PaymentMethod, Email
                    FROM OrderData
                    WHERE OrderID = @OrderID;";

                using (var cmd = new SqlCommand(orderSql, conn))
                {
                    cmd.Parameters.Add("@OrderID", SqlDbType.Int).Value = orderId;

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            order = new Order
                            {
                                OrderID = reader.GetInt32(0),
                                UserID = reader.GetInt32(1),
                                OrderDate = reader.GetDateTime(2),
                                TotalAmount = reader.GetDecimal(3),
                                SubtotalAmount = reader.GetDecimal(4),
                                TaxAmount = reader.GetDecimal(5),
                                DeliveryFee = reader.GetDecimal(6),
                                Status = reader.GetString(7),
                                ShippingAddress = reader.IsDBNull(8) ? null : reader.GetString(8),
                                PaymentMethod = reader.IsDBNull(9) ? null : reader.GetString(9),
                                Email = reader.IsDBNull(10) ? null : reader.GetString(10)
                            };
                        }
                    }
                }

                if (order == null)
                    return null;

                // Get order items
                const string itemsSql = @"
                    SELECT OrderItemID, OrderID, ISBN, Title, Author, Price, Quantity, Subtotal
                    FROM OrderItems
                    WHERE OrderID = @OrderID;";

                using (var cmd = new SqlCommand(itemsSql, conn))
                {
                    cmd.Parameters.Add("@OrderID", SqlDbType.Int).Value = orderId;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var item = new OrderItem
                            {
                                OrderItemID = reader.GetInt32(0),
                                OrderID = reader.GetInt32(1),
                                ISBN = reader.GetString(2),
                                Title = reader.IsDBNull(3) ? null : reader.GetString(3),
                                Author = reader.IsDBNull(4) ? null : reader.GetString(4),
                                Price = reader.GetDecimal(5),
                                Quantity = reader.GetInt32(6),
                                Subtotal = reader.GetDecimal(7)
                            };

                            order.Items.Add(item);
                        }
                    }
                }
            }

            return order;
        }

        /// <summary>
        /// Updates the status of an order (for admin/manager use)
        /// </summary>
        public bool UpdateOrderStatus(int orderId, string status)
        {
            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                const string sql = "UPDATE OrderData SET Status = @Status WHERE OrderID = @OrderID;";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.Add("@OrderID", SqlDbType.Int).Value = orderId;
                    cmd.Parameters.Add("@Status", SqlDbType.VarChar, 20).Value = status ?? "Pending";

                    int rows = cmd.ExecuteNonQuery();
                    return rows > 0;
                }
            }
        }
    }
}
