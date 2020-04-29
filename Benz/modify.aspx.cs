using SG.APP.BizObject;
using SG.APP.Client.Logic;
using SG.APP.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SG.APP.Web.Areas.Benz
{
    public partial class modify : System.Web.UI.Page
    {
        BenzUserInfo userInfo;
        public CLBenzService clBenzService = new CLBenzService();
        protected void Page_Load(object sender, EventArgs e)
        {
            if (CurrentLogonInfo.ComAppLogon == null || CurrentLogonInfo.ComAppLogon.UACUserInfo == null)
            {
                Response.Redirect("/home/Benz");
            }
            if (!Page.IsPostBack)
            {
                if (!string.IsNullOrEmpty(Request.QueryString["op"]))
                {
                    if (Request.QueryString["op"].ToString() == "view")
                    {
                        this.lblTitle.Text = "查看用户信息";
                    }
                    else if (Request.QueryString["op"].ToString() == "modify")
                    {
                        this.lblTitle.Text = "编辑用户信息";
                    }

                }
                else {
                    MessageBox.Show(this, "非法的访问请求! Illegal access requests!");
                    Response.Redirect("list.aspx");
                }

                if (!string.IsNullOrEmpty(Request.QueryString["openid"]))
                {
                    userInfo = clBenzService.GetBenzUserbydopenid(Request.QueryString["openid"].ToString()).FirstOrDefault();
                    if (userInfo != null)
                    {
                        ShowUserInfo(userInfo);
                    }
                    else
                    {
                        MessageBox.Show(this, "用户信息不存在! User not exists!");
                        Response.Redirect("list.aspx");
                    }

                }
                else
                {
                    MessageBox.Show(this, "用户信息不存在! User not exists!");
                    Response.Redirect("list.aspx");
                }
            }

        }
        protected void ShowUserInfo(BenzUserInfo userInfo)
        {
            lab_ID.Text = userInfo.ID.ToString();
            lab_openId.Text = userInfo.openId;
            txt_userName.Text = userInfo.userName;
            txt_userTel.Text = userInfo.userTel;
            txt_vinId.Text = userInfo.vinId;
            txt_dealerProvince.Text = userInfo.dealerProvinceDesc;
            txt_dealerCity.Text = userInfo.dealerCityDesc;
            txt_dealerName.Text = userInfo.dealerNameDesc;
            list_userGroup.SelectedValue = userInfo.userGroup;
            lab_alertTime.Text = userInfo.alterTime;
            lab_createTime.Text = userInfo.createTime;
            img_Pic.ImageUrl = userInfo.picUrl;

            /*----------------------单纯的分割线-----------------------*/
            hid_openId.Value = userInfo.openId;
            if (Request.QueryString["op"] == "view")
            {
                btnSave.Visible = false;
            }
        }

        protected void btnSave_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(hid_openId.Value))
            {
                userInfo = clBenzService.GetBenzUserbydopenid(hid_openId.Value).FirstOrDefault();

                userInfo.alterTime = DateTime.Now.ToString();
                userInfo.vinId = txt_vinId.Text.Trim();
                userInfo.userName = txt_userName.Text.Trim();
                userInfo.userTel = txt_userTel.Text.Trim();
                userInfo.userGroup = list_userGroup.SelectedValue.Trim();


                string filename = FileUpload1.PostedFile.FileName.ToString();
                if (!string.IsNullOrEmpty(filename)) {
                    string type = filename.Substring(filename.LastIndexOf('.') + 1);
                    double large = FileUpload1.PostedFile.ContentLength / 1024.0;
                    string imgurl = userInfo.openId + "." + type;
                    if (type.ToLower() == "jpg" || type.ToLower() == "png" || type.ToLower() == "jpeg")
                    {
                        FileUpload1.PostedFile.SaveAs(System.Web.HttpContext.Current.Server.MapPath("/Areas/Benz/uploadFile/" + imgurl));
                        userInfo.picUrl = "/Areas/Benz/uploadFile/" + imgurl;
                    }
                }
                

                var ret= clBenzService.EditBenzUserInfo(userInfo);
                if (ret !=0) {
                    clBenzService.ModifyVoteGroup(userInfo.openId, userInfo.userGroup);
                    MessageBox.Show(this, "用户信息修改完成!");
                    Response.Redirect("list.aspx");
                }

            }
            
        }

    }
}