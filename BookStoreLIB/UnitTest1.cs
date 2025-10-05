using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using BookStoreLIB;

namespace BookStoreLIB
{
    [TestClass]
    public class UnitTest1
    {

        UserData userData;

        [TestInitialize]
        public void Setup()
        {
            // Create a new UserData instance before each test
            userData = new UserData();
        }

        [TestMethod]
        public void ValidLogin_ShouldReturnTrue()
        {
            // Specify the value of test inputs
            string inputName = "dclark";
            string inputPassword = "dc1234";

            // Specify the value of expected outputs
            bool expectedReturn = true;
            int expectedUserID = 4;

            // Obtain the actual outputs by calling the method under testing
            bool actualReturn = userData.LogIn(inputName, inputPassword);
            int actualUserID = userData.UserID;

            // Verify the result:
            Assert.AreEqual(expectedReturn, actualReturn);
            Assert.AreEqual(expectedUserID, actualUserID);
        }

        [TestMethod]
        public void InvalidUsername_ShouldReturnFalse()
        {
            string inputName = "notexist";      // Username does not exist in the database
            string inputPassword = "xx1234";

            bool actualReturn = userData.LogIn(inputName, inputPassword);

            Assert.IsFalse(actualReturn);
        }

        [TestMethod]
        public void PasswordTooShort_ShouldReturnFalse()
        {
            string inputName = "dclark";
            string inputPassword = "dc12";      // Password too short

            bool actualReturn = userData.LogIn(inputName, inputPassword);

            Assert.IsFalse(actualReturn);
        }

        [TestMethod]
        public void PasswordStartsWithDigit_ShouldReturnFalse()
        {
            string inputName = "dclark";
            string inputPassword = "1c1234";     // Password starts with digit

            bool actualReturn = userData.LogIn(inputName, inputPassword);

            Assert.IsFalse(actualReturn);
        }
    }
}