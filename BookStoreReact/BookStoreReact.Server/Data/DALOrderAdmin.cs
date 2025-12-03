using System.Data;
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

        public List<OrderAdminModel> GetAll()
        {
            List<OrderAdminModel> list = new();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"SELECT OrderID, UserID, OrderDate, TotalAmount, Status, PaymentMethod
                  FROM OrderData ORDER BY OrderID DESC", conn);

            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new OrderAdminModel
                {
                    OrderID = Convert.ToInt32(r["OrderID"]),
                    UserID = Convert.ToInt32(r["UserID"]),
                    OrderDate = Convert.ToDateTime(r["OrderDate"]),
                    TotalAmount = Convert.ToDecimal(r["TotalAmount"]),
                    Status = r["Status"].ToString() ?? "",
                    PaymentMethod = r["PaymentMethod"]?.ToString()
                });
            }

            return list;
        }

        public int Add(OrderAdminModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"INSERT INTO OrderData (UserID, OrderDate, TotalAmount, Status, PaymentMethod)
                  VALUES (@U, @D, @T, @S, @P)", conn);

            cmd.Parameters.Add("@U", SqlDbType.Int).Value = m.UserID;
            cmd.Parameters.Add("@D", SqlDbType.DateTime).Value = m.OrderDate;
            cmd.Parameters.Add("@T", SqlDbType.Decimal).Value = m.TotalAmount;
            cmd.Parameters.Add("@S", SqlDbType.VarChar, 30).Value = m.Status;
            cmd.Parameters.Add("@P", SqlDbType.VarChar, 40).Value = m.PaymentMethod ?? (object)DBNull.Value;

            return cmd.ExecuteNonQuery();
        }

        public int Update(OrderAdminModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"UPDATE OrderData
                  SET UserID = @U,
                      OrderDate = @D,
                      TotalAmount = @T,
                      Status = @S,
                      PaymentMethod = @P
                  WHERE OrderID = @ID", conn);

            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = m.OrderID;
            cmd.Parameters.Add("@U", SqlDbType.Int).Value = m.UserID;
            cmd.Parameters.Add("@D", SqlDbType.DateTime).Value = m.OrderDate;
            cmd.Parameters.Add("@T", SqlDbType.Decimal).Value = m.TotalAmount;
            cmd.Parameters.Add("@S", SqlDbType.VarChar, 30).Value = m.Status;
            cmd.Parameters.Add("@P", SqlDbType.VarChar, 40).Value = m.PaymentMethod ?? (object)DBNull.Value;

            return cmd.ExecuteNonQuery();
        }

        public int Delete(int id)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("DELETE FROM OrderData WHERE OrderID=@ID", conn);
            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = id;

            return cmd.ExecuteNonQuery();
        }

        public int UpdateStatus(int orderId, string newStatus)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"UPDATE OrderData 
          SET Status = @S 
          WHERE OrderID = @ID", conn);

            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = orderId;
            cmd.Parameters.Add("@S", SqlDbType.VarChar, 20).Value = newStatus;

            return cmd.ExecuteNonQuery();
        }

    }
}
