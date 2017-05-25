using JCGriffin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.DirectoryServices;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ClientPortal
{
    public partial class Default : System.Web.UI.Page
    {
        private JCGUser _currentUser;

        protected void Page_Load(object sender, EventArgs e)
        {

#if DEBUG

            _currentUser = new JCGUser(Environment.UserName, new List<string>() { "All" });
#else
            _currentUser = new JCGUser(HttpContext.Current.User.Identity.Name, System.Web.Security.Roles.GetRolesForUser().ToList());
#endif
            Session["CurrentUser"] = _currentUser;

            //TextBox1.Text = JCGUser.UserName; // HttpContext.Current.User.Identity.Name;
            //if (System.Web.Security.Roles.GetRolesForUser().Count() != 0)
            //    TextBox2.Text = JCGUser.RolesAsString; // System.Web.Security.Roles.GetRolesForUser()[0];

            //TextBox3.Text = Common.GetEnterpriseGroup(_currentUser.Roles);
        }

#region Private Methods



#endregion

#region Static Web Methods

        [WebMethod]
        public static string GetEnterpriseList()
        {
            string enterpriseGroup = Common.GetEnterpriseGroup(((JCGUser)HttpContext.Current.Session["CurrentUser"]).Roles);
            DataTable dt = new DataTable();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["constring"].ConnectionString);
            SqlCommand cmd = new SqlCommand("Cntl.EnterpriseGroups_GET", conn);
            cmd.Parameters.AddWithValue("@ClientGroup", enterpriseGroup);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            using (conn)
            {
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(dt);
                Dictionary<string, object> row;
                foreach (DataRow dr in dt.Rows)
                {
                    row = new Dictionary<string, object>();
                    string enterpriseName = String.Empty;
                    foreach (DataColumn col in dt.Columns)
                    {
                        if (col.ColumnName == "Enterprise_Id")
                        {
                            byte[] enterpriseId = System.Text.ASCIIEncoding.ASCII.GetBytes(dr[col].ToString());
                            row.Add(col.ColumnName, enterpriseId);
                        }
                        else
                            row.Add(col.ColumnName, dr[col]);

                    }

                    rows.Add(row);
                }
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(rows);
        }

#endregion

#region Public Properties
        /// <summary>
        /// Displays the user name on the webpage
        /// </summary>
        public JCGUser JCGUser
        {
            get { return _currentUser; }
            set { _currentUser = value; }
        }

#endregion

    }
}