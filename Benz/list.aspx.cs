using Aspose.Cells;
using SG.APP.Client.Logic;
using SG.APP.Utility;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SG.APP.Web.Areas.Benz
{
    public partial class list : System.Web.UI.Page
    {
        public CLBenzService clBenzService = new CLBenzService();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (CurrentLogonInfo.ComAppLogon == null || CurrentLogonInfo.ComAppLogon.UACUserInfo == null)
            {
                Response.Redirect("/home/Benz");
            }
            if (!Page.IsPostBack)
            {
                //获取当前经销商ID
                int dealerId = CurrentLogonInfo.ComAppLogon.UACUserInfo.DealerID;

                var view = clBenzService.GetBenzUserList(dealerId);

                listview.DataSource = view;
                listview.DataBind();
            }

            if (Request.RequestType.ToUpper() == "POST")
            {
                switch (Request.QueryString["op"])
                {
                    //删除
                    case "del":
                        if (!string.IsNullOrEmpty(Request.Form["id"])) {
                            try
                            {
                                clBenzService.DeleteUserByID(Convert.ToInt32(Request.Form["id"]));
                                Response.Write("true");
                            }
                            catch(Exception ex) {
                                Response.Write("false");
                            }
                            Response.End();
                        }
                        break;
                }

            }
        }
        private void QueryUserInfor()
        {
            //获取当前经销商ID
            int dealerId = CurrentLogonInfo.ComAppLogon.UACUserInfo.DealerID;

            var view = clBenzService.GetBenzUserList(dealerId);

            if (!string.IsNullOrEmpty(txtUserName.Text.Trim())) {
                view = view.Where(o => o.userName == txtUserName.Text.Trim()).ToList();
            }
            if (!string.IsNullOrEmpty(txtUserTel.Text.Trim()))
            {
                view = view.Where(o => o.userTel == txtUserTel.Text.Trim()).ToList();
            }
            if (!string.IsNullOrEmpty(txtVinId.Text.Trim()))
            {
                view = view.Where(o => o.vinId == txtVinId.Text.Trim()).ToList();
            }
            if (!string.IsNullOrEmpty(txtUserGroup.SelectedValue.Trim()))
            {
                view = view.Where(o => o.userGroup == txtUserGroup.SelectedValue.Trim()).ToList();
            }

            listview.DataSource = view;
            listview.DataBind();
        }

        protected void btnQuery_Click(object sender, EventArgs e)
        {
            QueryUserInfor();
        }

        protected void list_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            listview.PageIndex = e.NewPageIndex;
            btnQuery_Click(this.btnQuery, null);
        }

    }
}