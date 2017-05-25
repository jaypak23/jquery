using JCGriffin;
using JCGriffin.BusinessObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ClientPortal
{
    public partial class Map : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            if (HttpContext.Current.Session["EnterpriseId"] == null) Server.Transfer("Default.aspx");
        }

        //Commenting this out 5/15/2016 JP.  This function is not currently called so commenting out for now.
        //[WebMethod]
        //public static string GetHccByGeoCodes()
        //{
        //    AjaxData ad = new AjaxData("usp_GetHccByGeoCodes");
        //    return ad.JSON;
        //}

        //Commenting this out 5/15/2016 JP.  This function is not currently called so commenting out for now.
        //[WebMethod]
        //public static string GetPatientCountGeoCodeByZip()
        //{
        //    string enterpriseId = HttpContext.Current.Session["EnterpriseId"].ToString();
        //    AjaxData ad = new AjaxData("usp_GetPatientCountGeoCodeByZip");
        //    ad.AddParameters("@Enterprise_Id", enterpriseId);
        //    return ad.JSON;
        //}

        [WebMethod(EnableSession = true)]
        public static string GetDistinctHCCByEnterprise()
        {
            string enterpriseId = HttpContext.Current.Session["EnterpriseId"].ToString();
            AjaxData ad = new AjaxData("Cntl.DistinctHCCByEnterprise_GET");
            ad.AddParameters("@Enterprise_Id", enterpriseId);
            return ad.JSON;
        }

        [WebMethod(EnableSession = true)]
        public static string GetPatientCountsByZipByHcc(string hcc)
        {
            string enterpriseId = HttpContext.Current.Session["EnterpriseId"].ToString();
            AjaxData ad = new AjaxData("Cntl.PatientCountsByZipByHcc_GET");
            ad.AddParameters("@Enterprise_Id", enterpriseId);
            ad.AddParameters("@Hcc", hcc);
            return ad.JSON;
        }

        [WebMethod(EnableSession = true)]
        public static string GeoJsonShapeByZipCodeByEnterprise()
        {
            string enteprirseId = Convert.ToString(((Enteprise)HttpContext.Current.Session["Enterprise"]).EnterpriseId);
            AjaxData ad = new AjaxData("Cntl.GeoJsonShapeByZipCodeByEnterprise_GET");
            ad.AddParameters("@Enterprise_Id", enteprirseId);
            return ad.JSON;
        }


        [WebMethod(EnableSession = true)]
        public static string GetTop15TotalChargesByZip()
        {
            string enterpriseId = HttpContext.Current.Session["EnterpriseId"].ToString();
            AjaxData ad = new AjaxData("Rpt.TotalChargesByZip_GET");
            ad.AddParameters("@Enterprise_Id", enterpriseId);
            return ad.JSON;
        }

        [WebMethod(EnableSession = true)]
        public static string GetTop15TotalPaymentsByZip()
        {
            string enterpriseId = HttpContext.Current.Session["EnterpriseId"].ToString();
            AjaxData ad = new AjaxData("Rpt.TotalPaymentsByZip_GET");
            ad.AddParameters("@Enterprise_Id", enterpriseId);
            return ad.JSON;
        }

        #region Public Properties

        /// <summary>
        /// Read only current enterprise id
        /// </summary>
        public Enteprise Enterprise
        {
            get { return (Enteprise)HttpContext.Current.Session["Enterprise"]; ; }
        }

        public JCGUser JCGUser
        {
            get { return (JCGUser)Session["CurrentUser"]; }
        }

        #endregion
    }
}