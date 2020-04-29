<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/Benz/Site1.Master" AutoEventWireup="true" CodeBehind="modify.aspx.cs" Inherits="SG.APP.Web.Areas.Benz.modify" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    
    <table class="tableForm" style="width: 100%; text-align: left; line-height: 35px; margin: 0 auto;">
        <tr>
            <td colspan="3" style="text-align: center;">
                <asp:Label runat="server" ID="lblTitle" Style="font-size: 24px; font-weight:bold;">
                </asp:Label>
            </td>
        </tr>
        <tr>
            <td style="width:150px"><strong>ID</strong></td>
            <td style="width:500px">
                <asp:Label runat="server" ID="lab_ID"></asp:Label></td>
            <td rowspan="12">
                <asp:Image ID="img_Pic" runat="server" style="max-height:500px; max-width:600px;" /></td>
        </tr>
        <tr>
            <td><strong>OPEN_ID</strong></td>
            <td>
                <asp:Label runat="server" ID="lab_openId"></asp:Label>
            </td>
        </tr>
        <tr>
            <td><strong>姓名</strong></td>
            <td>
                <asp:TextBox runat="server" ID="txt_userName"></asp:TextBox></td>
        </tr>
        <tr>
            <td><strong>电话</strong></td>
            <td>
                <asp:TextBox runat="server" ID="txt_userTel"></asp:TextBox></td>
        </tr>
        <tr>
            <td><strong>省份</strong></td>
            <td>
                <asp:TextBox runat="server" ID="txt_dealerProvince" Enabled="false"></asp:TextBox></td>
        </tr>
        <tr>
            <td><strong>城市</strong></td>
            <td>
                <asp:TextBox runat="server" ID="txt_dealerCity" Enabled="false"></asp:TextBox></td>
        </tr>
        <tr>
            <td><strong>购车经销商</strong></td>
            <td><asp:TextBox runat="server" ID="txt_dealerName" Enabled="false"></asp:TextBox></td>
        </tr>
        <tr>
            <td><strong>VIN编码</strong></td>
            <td>
                <asp:TextBox runat="server" ID="txt_vinId"></asp:TextBox></td>
        </tr>
        <tr>
            <td><strong>参赛组别</strong></td>
            <td>
                <asp:ListBox ID="list_userGroup" runat="server" SelectionMode="Single" Rows="1">
                    <asp:ListItem Value="GLA" Text="GLA"></asp:ListItem>
                    <asp:ListItem Value="GLC" Text="GLC"></asp:ListItem>
                    <asp:ListItem Value="GLE" Text="GLE"></asp:ListItem>
                    <asp:ListItem Value="gles" Text="GLE s"></asp:ListItem>
                    <asp:ListItem Value="GLS" Text="GLS"></asp:ListItem>
                </asp:ListBox>
        </tr>
        <tr>
            <td><strong>创建时间</strong></td>
            <td>
                <asp:Label runat="server" ID="lab_createTime"></asp:Label></td>
        </tr>
        <tr>
            <td><strong>最后修改时间</strong></td>
            <td>
                <asp:Label runat="server" ID="lab_alertTime"></asp:Label></td>
        </tr>
        <tr>
          <td><strong>作品</strong></td>
          <td><asp:FileUpload ID="FileUpload1" runat="server" style="display:none;" /></td>
        </tr>
        <tr>
            <td colspan="3" style="border-right: none;">
                <a href="list.aspx" class="btn blue-hoki" style="background:#c2bfbf;">返回用户列表</a>
                <asp:Button runat="server" ID="btnSave" Text="保存用户信息 Save" CssClass="btn blue-hoki" Width="150px" OnClientClick="return checkForm();"  OnClick="btnSave_Click" />
                
                <asp:HiddenField runat="server" ID="hid_openId" />
            </td>
        </tr>
    </table>

    <script src="../../Scripts/jquery.min.js"></script>
    <script type="text/javascript">

        function checkForm() {
            var mobileRegex = /^[1][3578]\d{9}$/;
            //var emailRegex = /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/;
            var mobile = $.trim($("#ContentPlaceHolder1_txt_userTel").val());
            //var email = $.trim($("#txtEmail").val());
            if (mobile.length < 1) {
                alert("手机号不能为空 \r\n Please input your mobile number");
                return false;
            }
            if (!mobileRegex.test(mobile)) {
                alert("手机号尾数不正确 \r\n Wrong mobile number digits");
                return false;
            }
            //if (email.length < 1) {
            //    alert("邮箱不能为空 \r\n Please input your email address");
            //    return false;
            //}
            //else if (!emailRegex.test(email)) {
            //    alert("邮箱格式不正确 \r\n Wrong email format");
            //    return false;
            //}
        }

    </script>
</asp:Content>
