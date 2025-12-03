using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public static class CouponDAL
    {
        // -------------------- Connection resolution --------------------
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

        public static Coupon LoadCoupon(string code)
        {
            if (string.IsNullOrWhiteSpace(code)) return null;

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();
                // Table name is 'Coupon' based on user screenshot
                var sql = "SELECT CouponID, Code, Description, DiscountRate, Type, IsActive, StartDate, EndDate, UsageLimit, TimesUsed, MinimumOrderAmount, RequiredAuthor, RequiredCategory FROM Coupon WHERE Code = @Code";
                
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@Code", code);
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Coupon
                            {
                                CouponID = (int)reader["CouponID"],
                                Code = (string)reader["Code"],
                                Description = reader["Description"] as string,
                                DiscountRate = (decimal)reader["DiscountRate"],
                                Type = reader["Type"] != DBNull.Value ? (DiscountType)(int)reader["Type"] : DiscountType.Percentage,
                                IsActive = (bool)reader["IsActive"],
                                StartDate = reader["StartDate"] as DateTime?,
                                EndDate = reader["EndDate"] as DateTime?,
                                UsageLimit = reader["UsageLimit"] as int?,
                                TimesUsed = reader["TimesUsed"] as int?,
                                MinimumOrderAmount = reader["MinimumOrderAmount"] as decimal?,
                                RequiredAuthor = reader["RequiredAuthor"] as string,
                                RequiredCategory = reader["RequiredCategory"] as string
                            };
                        }
                    }
                }
            }
            return null;
        }

        public static bool IncrementUsage(int couponId)
        {
            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();
                var sql = "UPDATE Coupon SET TimesUsed = ISNULL(TimesUsed, 0) + 1 WHERE CouponID = @CouponID";
                
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@CouponID", couponId);
                    int rows = cmd.ExecuteNonQuery();
                    return rows > 0;
                }
            }
        }
    }
}
