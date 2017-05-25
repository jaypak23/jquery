using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Security.Principal;

namespace ClientPortal
{
    public partial class Report : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["CurrentUser"] == null) Server.Transfer("Default.aspx");
            if (HttpContext.Current.Session["EnterpriseId"] == null) Response.Redirect("Default.aspx");

            if (!Page.IsPostBack)
            {
                ReportViewer1.ProcessingMode = ProcessingMode.Remote;
                ServerReport serverReport = ReportViewer1.ServerReport;
                //encrypt the following
                serverReport.ReportServerCredentials = new ReportCredentials("SVC_RptSvc", "1qaz!QAZ@WSX2wsx", "analytics");
                string enterpriseId = HttpContext.Current.Session["EnterpriseId"].ToString();
                string reportName = ClientQueryString.Split('=')[1].Replace('+', ' ');
                Title = reportName;

                // Set the report server URL and report path
                serverReport.ReportServerUrl =
                    new Uri("https://client.jcgriffin.com/ReportServer");
                serverReport.ReportPath = "/Griffin/" + reportName;

               
                #region Pass Report Parameters Example
                ReportParameter practice = new ReportParameter();
                practice.Name = "Enterprise_ID";
                practice.Values.Add(enterpriseId);

                // Set the report parameters for the report
                ReportViewer1.ServerReport.SetParameters(
                    new ReportParameter[] { practice });

                #endregion

                #region Get Parameters From Report Example

                //ReportParameterInfoCollection parameters = ReportViewer1.ServerReport.GetParameters();

                #endregion


            }
        }
    }

    public class ReportCredentials : IReportServerCredentials
    {
        private string _userName;
        private string _password;
        private string _domain;


        public ReportCredentials(string userName, string password, string domain)
        {
            _userName = userName;
            _password = password;
            _domain = domain;


        }

        public WindowsIdentity ImpersonationUser
        {
            get
            {
                return null;
            }
        }

        public ICredentials NetworkCredentials
        {
            get
            {
                return new NetworkCredential(_userName, _password, _domain);

            }
        }

        public bool GetFormsCredentials(out Cookie authCookie, out string userName, out string password, out string authority)
        {
            authCookie = null;
            userName = _userName;
            password = _password;
            authority = _domain;


            // Not using form credentials
            return false;
        }
    }

}