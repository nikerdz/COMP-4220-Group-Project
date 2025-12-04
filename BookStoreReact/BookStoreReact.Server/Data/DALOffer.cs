using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
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
            var list = new List<OfferModel>();

            using (var conn = new SqlConnection(_connStr))
            using (var cmd = new SqlCommand(@"
                SELECT CouponID, Code, Description, DiscountRate, UsageLimit, TimesUsed, StartDate, EndDate, IsActive
                FROM Coupon
                ORDER BY CouponID DESC", conn))
            {
                conn.Open();
                using (var r = cmd.ExecuteReader())
                {
                    while (r.Read())
                    {
                        list.Add(new OfferModel
                        {
                            CouponID = Convert.ToInt32(r["CouponID"]),
                            Code = r["Code"]?.ToString(),
                            Description = r["Description"]?.ToString(),
                            DiscountRate = r.IsDBNull(r.GetOrdinal("DiscountRate")) ?0m : Convert.ToDecimal(r["DiscountRate"]),
                            UsageLimit = r.IsDBNull(r.GetOrdinal("UsageLimit")) ? (int?)null : Convert.ToInt32(r["UsageLimit"]),
                            TimesUsed = r.IsDBNull(r.GetOrdinal("TimesUsed")) ?0 : Convert.ToInt32(r["TimesUsed"]),
                            StartDate = r.IsDBNull(r.GetOrdinal("StartDate")) ? (DateTime?)null : Convert.ToDateTime(r["StartDate"]),
                            EndDate = r.IsDBNull(r.GetOrdinal("EndDate")) ? (DateTime?)null : Convert.ToDateTime(r["EndDate"]),
                            IsActive = r.IsDBNull(r.GetOrdinal("IsActive")) ? false : Convert.ToBoolean(r["IsActive"]) 
                        });
                    }
                }
            }

            return list;
        }

        public int Add(OfferModel m)
        {
            using (var conn = new SqlConnection(_connStr))
            using (var cmd = new SqlCommand(@"
                INSERT INTO Coupon (Code, Description, DiscountRate, UsageLimit, TimesUsed, StartDate, EndDate, IsActive)
                VALUES (@Code, @Desc, @Rate, @UsageLimit, @TimesUsed, @StartDate, @EndDate, @IsActive)", conn))
            {
                cmd.Parameters.AddWithValue("@Code", m.Code ?? "");
                cmd.Parameters.AddWithValue("@Desc", (object?)m.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Rate", m.DiscountRate);
                cmd.Parameters.AddWithValue("@UsageLimit", (object?)m.UsageLimit ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TimesUsed", m.TimesUsed);
                cmd.Parameters.AddWithValue("@StartDate", (object?)m.StartDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@EndDate", (object?)m.EndDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IsActive", m.IsActive);

                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        public int Update(OfferModel m)
        {
            using (var conn = new SqlConnection(_connStr))
            using (var cmd = new SqlCommand(@"
                UPDATE Coupon SET
                    Code=@Code,
                    Description=@Desc,
                    DiscountRate=@Rate,
                    UsageLimit=@UsageLimit,
                    TimesUsed=@TimesUsed,
                    StartDate=@StartDate,
                    EndDate=@EndDate,
                    IsActive=@IsActive
                WHERE CouponID=@ID", conn))
            {
                cmd.Parameters.AddWithValue("@ID", m.CouponID);
                cmd.Parameters.AddWithValue("@Code", m.Code ?? "");
                cmd.Parameters.AddWithValue("@Desc", (object?)m.Description ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Rate", m.DiscountRate);
                cmd.Parameters.AddWithValue("@UsageLimit", (object?)m.UsageLimit ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TimesUsed", m.TimesUsed);
                cmd.Parameters.AddWithValue("@StartDate", (object?)m.StartDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@EndDate", (object?)m.EndDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IsActive", m.IsActive);

                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }

        public int Delete(int id)
        {
            using (var conn = new SqlConnection(_connStr))
            using (var cmd = new SqlCommand("DELETE FROM Coupon WHERE CouponID=@ID", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                return cmd.ExecuteNonQuery();
            }
        }
    }
}
