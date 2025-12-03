using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Data.SqlClient;
using System.Data;
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

                        // Convert 0.10 ? 10%
                        DiscountPercent = (int)(rate * 100),

            SqlCommand cmd = new SqlCommand("SELECT * FROM Coupon ORDER BY CouponID", conn);
            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new OfferModel
                {
                    CouponID = Convert.ToInt32(r["CouponID"]),
                    Code = r["Code"].ToString(),
                    Description = r["Description"]?.ToString(),
                    DiscountRate = Convert.ToDecimal(r["DiscountRate"]),
                    UsageLimit = r["UsageLimit"] == DBNull.Value ? null : Convert.ToInt32(r["UsageLimit"]),
                    TimesUsed = Convert.ToInt32(r["TimesUsed"]),
                    StartDate = r["StartDate"] == DBNull.Value ? null : Convert.ToDateTime(r["StartDate"]),
                    EndDate = r["EndDate"] == DBNull.Value ? null : Convert.ToDateTime(r["EndDate"]),
                    IsActive = Convert.ToBoolean(r["IsActive"])
                });
            }

            return list;
        }

        public int Add(OfferModel m)
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

                // Convert percentage ? decimal (10% ? 0.10)
                cmd.Parameters.AddWithValue("@DR", (decimal)m.DiscountPercent / 100m);

                cmd.Parameters.AddWithValue("@A", m.Active);
                cmd.Parameters.AddWithValue("@E",
                    string.IsNullOrWhiteSpace(m.ExpiryDate)
                        ? (object)DBNull.Value
                        : DateTime.Parse(m.ExpiryDate));

                cmd.ExecuteNonQuery();
            }
        }

        public int Update(OfferModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"UPDATE Coupon SET 
                    Code=@C, Description=@D, DiscountRate=@R,
                    UsageLimit=@UL, StartDate=@SD, EndDate=@ED, IsActive=@A
                  WHERE CouponID=@ID", conn);

            cmd.Parameters.AddWithValue("@ID", m.CouponID);
            cmd.Parameters.AddWithValue("@C", m.Code);
            cmd.Parameters.AddWithValue("@D", (object?)m.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@R", m.DiscountRate);
            cmd.Parameters.AddWithValue("@UL", (object?)m.UsageLimit ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@SD", (object?)m.StartDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ED", (object?)m.EndDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@A", m.IsActive);

            return cmd.ExecuteNonQuery();
        }

        public int Delete(int id)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("DELETE FROM Coupon WHERE CouponID=@ID", conn);
            cmd.Parameters.AddWithValue("@ID", id);

            return cmd.ExecuteNonQuery();
        }
    }
}
