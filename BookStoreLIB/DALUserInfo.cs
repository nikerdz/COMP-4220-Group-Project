using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace BookStoreLIB
{
    public class DALUserInfo
    {
        // ---------------------- LOGIN ----------------------
        public int LogIn(string userName, string password)
        {
            var conn = new SqlConnection(Properties.Settings.Default.BookStoreDBConnectionString);

            try
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = conn;
                cmd.CommandText = "SELECT UserID FROM UserData WHERE UserName = @UserName AND Password = @Password";

                cmd.Parameters.AddWithValue("@UserName", userName);
                cmd.Parameters.AddWithValue("@Password", password);

                conn.Open();
                object result = cmd.ExecuteScalar();

                if (result != null && result != DBNull.Value)
                    return Convert.ToInt32(result);

                return -1;
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error in LogIn: " + ex.Message);
                return -1;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
        }

        // ---------------------- REGISTER (AddUser for compatibility) ----------------------
        public int AddUser(string fullName, string email, string userName, string password)
        {
            using (SqlConnection conn = new SqlConnection(Properties.Settings.Default.BookStoreDBConnectionString))
            {
                try
                {
                    conn.Open();

                    // Check if Username or Email already exists
                    string checkQuery = "SELECT COUNT(*) FROM UserData WHERE UserName = @UserName OR Email = @Email";
                    using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                    {
                        checkCmd.Parameters.AddWithValue("@UserName", userName);
                        checkCmd.Parameters.AddWithValue("@Email", email);

                        int count = Convert.ToInt32(checkCmd.ExecuteScalar());
                        if (count > 0)
                        {
                            // Username or email already exists
                            return -1;
                        }
                    }

                    // Insert new record
                    string insertQuery = @"INSERT INTO UserData (FullName, Email, UserName, Password, Type, Manager)
                                           VALUES (@FullName, @Email, @UserName, @Password, 'U', 0)";
                    using (SqlCommand insertCmd = new SqlCommand(insertQuery, conn))
                    {
                        insertCmd.Parameters.AddWithValue("@FullName", fullName);
                        insertCmd.Parameters.AddWithValue("@Email", email);
                        insertCmd.Parameters.AddWithValue("@UserName", userName);
                        insertCmd.Parameters.AddWithValue("@Password", password);

                        int rows = insertCmd.ExecuteNonQuery();
                        return rows; // return number of rows added (1 = success)
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Error in AddUser: " + ex.Message);
                    return 0;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }
            }
        }

        // ---------------------- MANAGER/TYPE RETRIEVAL ----------------------
        public (bool IsManager, string Type) GetManagerAndType(int userId)
        {
            using (SqlConnection conn = new SqlConnection(Properties.Settings.Default.BookStoreDBConnectionString))
            {
                try
                {
                    string query = "SELECT Manager, Type FROM UserData WHERE UserID = @UserID";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@UserID", userId);

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        bool manager = Convert.ToBoolean(reader["Manager"]);
                        string type = reader["Type"].ToString();
                        return (manager, type);
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Error in GetManagerAndType: " + ex.Message);
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                        conn.Close();
                }
                return (false, null);
            }
        }

        internal bool RegisterUser(string username, string password, string fullName, string email)
        {
            throw new NotImplementedException();
        }
    }
}
