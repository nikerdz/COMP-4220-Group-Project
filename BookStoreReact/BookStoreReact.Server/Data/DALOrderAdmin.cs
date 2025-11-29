using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public class DALOrderAdmin
    {
        private readonly string _connStr;

        public DALOrderAdmin(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }


        
        // GET ALL ORDERS (with UserData)
        
        public List<OrderModel> GetOrders()
        {
            List<OrderModel> list = new();

            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    SELECT 
                        o.OrderID,
                        o.UserID,
                        u.UserName,
                        o.OrderDate,
                        o.TotalAmount,
                        o.Status
                    FROM OrderData o
                    LEFT JOIN UserData u ON o.UserID = u.UserID
                    ORDER BY o.OrderID DESC;
                ", conn);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    list.Add(new OrderModel
                    {
                        OrderID = Convert.ToInt32(r["OrderID"]),
                        UserID = Convert.ToInt32(r["UserID"]),
                        UserName = r["UserName"]?.ToString(),
                        OrderDate = Convert.ToDateTime(r["OrderDate"]).ToString("yyyy-MM-dd"),
                        TotalAmount = Convert.ToDecimal(r["TotalAmount"]),
                        Status = r["Status"].ToString()
                    });
                }
            }

            return list;
        }


        
        // GET ORDER ITEMS
        
        public List<OrderItemModel> GetOrderItems(int orderId)
        {
            List<OrderItemModel> list = new();

            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    SELECT i.ISBN, 
                           b.Title, 
                           i.Price, 
                           i.Quantity
                    FROM OrderItems i
                    LEFT JOIN BookData b ON i.ISBN = b.ISBN
                    WHERE i.OrderID = @OID;
                ", conn);

                cmd.Parameters.AddWithValue("@OID", orderId);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    list.Add(new OrderItemModel
                    {
                        ISBN = r["ISBN"].ToString(),
                        Title = r["Title"]?.ToString(),
                        Price = Convert.ToDecimal(r["Price"]),
                        Quantity = Convert.ToInt32(r["Quantity"])
                    });
                }
            }

            return list;
        }


        
        // UPDATE ORDER STATUS
        
        public void UpdateStatus(int orderId, string newStatus)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    UPDATE OrderData
                    SET Status = @S
                    WHERE OrderID = @OID;
                ", conn);

                cmd.Parameters.AddWithValue("@OID", orderId);
                cmd.Parameters.AddWithValue("@S", newStatus);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
