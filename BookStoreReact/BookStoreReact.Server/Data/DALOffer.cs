using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public class DALOffer
    {
        private readonly string _connStr;

        public DALOffer(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }


        
        // GET ALL COUPONS
        
        public List<OfferModel> GetAll()
        {
            List<OfferModel> list = new();

            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    SELECT 
                        CouponID,
                        Code,
                        Description,
                        DiscountRate,
                        IsActive,
                        EndDate
                    FROM Coupon
                    ORDER BY CouponID DESC;
                ", conn);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    decimal rate = Convert.ToDecimal(r["DiscountRate"]); // 0.10, 0.25, etc.

                    list.Add(new OfferModel
                    {
                        OfferId = Convert.ToInt32(r["CouponID"]),
                        Code = r["Code"]?.ToString(),
                        Description = r["Description"]?.ToString(),

                        // Convert 0.10 → 10%
                        DiscountPercent = (int)(rate * 100),

                        Active = Convert.ToBoolean(r["IsActive"]),

                        ExpiryDate = r["EndDate"] == DBNull.Value
                            ? null
                            : Convert.ToDateTime(r["EndDate"]).ToString("yyyy-MM-dd")
                    });
                }
            }

            return list;
        }



        
        // ADD COUPON
        
        public void Add(OfferModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO Coupon
                        (Code, Description, DiscountRate, IsActive, EndDate)
                    VALUES
                        (@C, @D, @DR, @A, @E);
                ", conn);

                cmd.Parameters.AddWithValue("@C", m.Code ?? "");
                cmd.Parameters.AddWithValue("@D", m.Description ?? "");

                // Convert percentage → decimal (10% → 0.10)
                cmd.Parameters.AddWithValue("@DR", (decimal)m.DiscountPercent / 100m);

                cmd.Parameters.AddWithValue("@A", m.Active);
                cmd.Parameters.AddWithValue("@E",
                    string.IsNullOrWhiteSpace(m.ExpiryDate)
                        ? (object)DBNull.Value
                        : DateTime.Parse(m.ExpiryDate));

                cmd.ExecuteNonQuery();
            }
        }



        
        // UPDATE COUPON
        
        public void Update(int id, OfferModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    UPDATE Coupon SET
                        Code=@C,
                        Description=@D,
                        DiscountRate=@DR,
                        IsActive=@A,
                        EndDate=@E
                    WHERE CouponID=@ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", id);
                cmd.Parameters.AddWithValue("@C", m.Code ?? "");
                cmd.Parameters.AddWithValue("@D", m.Description ?? "");

                cmd.Parameters.AddWithValue("@DR", (decimal)m.DiscountPercent / 100m);
                cmd.Parameters.AddWithValue("@A", m.Active);

                cmd.Parameters.AddWithValue("@E",
                    string.IsNullOrWhiteSpace(m.ExpiryDate)
                        ? (object)DBNull.Value
                        : DateTime.Parse(m.ExpiryDate));

                cmd.ExecuteNonQuery();
            }
        }



        
        // DELETE COUPON
        
        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    DELETE FROM Coupon
                    WHERE CouponID=@ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", id);
                cmd.ExecuteNonQuery();
            }
        }
    }
}
