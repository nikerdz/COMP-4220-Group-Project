using System;
using BookStoreReact.Server.Data;

namespace BookStoreReact.Server.Models
{
    public class UserData
    {
        public int UserID { get; set; }
        public string LoginName { get; set; }
        public string Password { get; set; }
        public bool LoggedIn { get; set; }
        public bool IsManager { get; private set; }
        public string Type { get; private set; }

        // ---------------------- LOGIN ----------------------
        public bool LogIn(string loginName, string passWord)
        {
            // Step 1: Basic validation
            if (string.IsNullOrEmpty(loginName) || string.IsNullOrEmpty(passWord))
                throw new ArgumentException("Please fill in all slots.");

            bool hasLetter = false, hasDigit = false;
            foreach (char c in passWord)
            {
                if (Char.IsLetter(c)) hasLetter = true;
                else if (Char.IsDigit(c)) hasDigit = true;
                else throw new ArgumentException("A valid password can only contain letters and numbers.");
            }

            // Step 2: Password format checks
            if (passWord.Length < 6)
                throw new ArgumentException("A valid password needs at least six characters with both letters and numbers.");

            if (!Char.IsLetter(passWord[0]))
                throw new ArgumentException("A valid password must start with a letter.");

            if (!hasLetter || !hasDigit)
                throw new ArgumentException("A valid password needs letters and numbers.");

            // Step 3: Database lookup
            var dbUser = new DALUserInfo();
            UserID = dbUser.LogIn(loginName, passWord);

            if (UserID > 0)
            {
                LoginName = loginName;
                Password = passWord;
                LoggedIn = true;

                var flags = dbUser.GetManagerAndType(UserID);
                IsManager = flags.IsManager;
                Type = flags.Type;

                return true;
            }
            else
            {
                LoggedIn = false;
                IsManager = false;
                Type = null;
                return false;
            }
        }

        // ---------------------- REGISTER ----------------------
        public bool Register(string username, string password, string fullName, string email)
        {
            if (string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(fullName) ||
                string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Please fill in all fields.");
            }

            var dal = new DALUserInfo();
            return dal.RegisterUser(username, password, fullName, email);
        }
    }
}
