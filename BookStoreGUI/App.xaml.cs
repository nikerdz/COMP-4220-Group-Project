using System;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Windows;

namespace BookStoreGUI
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            // Set |DataDirectory| to the Database folder inside BookStoreGUI
            AppDomain.CurrentDomain.SetData(
                "DataDirectory",
                System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Database")
            );

            base.OnStartup(e);
        }
    }
}
