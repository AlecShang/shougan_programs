<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/Benz/Site1.Master" AutoEventWireup="true" CodeBehind="list.aspx.cs" Inherits="SG.APP.Web.Areas.Benz.list" %>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <table width="100%" style="text-align: left; line-height: 35px;">
        <tr>
            <td>姓名:</td>
            <td>
                <asp:TextBox runat="server" ID="txtUserName"></asp:TextBox></td>
            <td>电话:</td>
            <td>
                <asp:TextBox runat="server" ID="txtUserTel"></asp:TextBox></td>
            <td>VIN编号:</td>
            <td>
                <asp:TextBox runat="server" ID="txtVinId"></asp:TextBox></td>
            <td>参赛组别:</td>
            <td>
                <asp:ListBox ID="txtUserGroup" runat="server" SelectionMode="Single" Rows="1">
                    <asp:ListItem Value="" Text="全部"></asp:ListItem>
                    <asp:ListItem Value="GLA" Text="GLA"></asp:ListItem>
                    <asp:ListItem Value="GLC" Text="GLC"></asp:ListItem>
                    <asp:ListItem Value="GLE" Text="GLE"></asp:ListItem>
                    <asp:ListItem Value="GLE s" Text="GLE s"></asp:ListItem>
                    <asp:ListItem Value="GLS" Text="GLS"></asp:ListItem>
                </asp:ListBox></td>
            <td style="text-align: right;">
                <asp:Button runat="server" CssClass="btn blue-hoki" ID="btnQuery" Text="　查询　" OnClick="btnQuery_Click" /></td>
        </tr>

        <%-- <tr>
            <td colspan="9" style="text-align: right">
                <asp:Button runat="server" CssClass="btn blue-hoki" ID="btnQuery" Text="Query" OnClick="btnQuery_Click" />
                <asp:Button runat="server" CssClass="btn blue-hoki" ID="btnAddUser" Text="Add New User" OnClick="btnAddUser_Click" />
                <asp:Button runat="server" CssClass="btn blue-hoki" ID="btnDownLoadExcel" Text="Download Excel" OnClick="btnDownLoadExcel_Click" />
            </td>
        </tr>--%>
    </table>

    <p></p>

    <div style="overflow: auto; height:100%">

        <asp:GridView CssClass="tableForm" runat="server" ID="listview" AllowPaging="True" Width="100%" HeaderStyle-HorizontalAlign="Left"
            AutoGenerateColumns="False" OnPageIndexChanging="list_PageIndexChanging" Font-Size="10pt"  PageSize="30">
            <Columns>
                <asp:BoundField DataField="ID" HeaderText="ID">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="openId" HeaderText="OPEN_ID">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="userName" HeaderText="姓名">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="userTel" HeaderText="电话">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="dealerProvinceDesc" HeaderText="省份">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="dealerCityDesc" HeaderText="城市">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="dealerNameDesc" HeaderText="购车经销商">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="vinId" HeaderText="VIN编码">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="userGroup" HeaderText="参赛组别">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="voteNamecount" HeaderText="获得票数">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="createTime" HeaderText="创建时间">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <asp:BoundField DataField="alterTime" HeaderText="修改时间">
                    <ItemStyle HorizontalAlign="Left"></ItemStyle>
                </asp:BoundField>
                <%-- <asp:ImageField DataAlternateTextField="picUrl" DataImageUrlField="picUrl" HeaderText="作品">
                    <ItemStyle Width="100px" Height="100px" />
                </asp:ImageField>--%>
                <asp:TemplateField HeaderText="操作">
                    <ItemTemplate>
                        <a href="modify.aspx?op=view&openid=<%#Eval("openId") %>" style="color: green; text-decoration: underline;">查看</a>&nbsp;&nbsp;
                        <a href="modify.aspx?op=modify&openid=<%#Eval("openId") %>" style="text-decoration: underline;">编辑</a>&nbsp;&nbsp;
                        <a data-id="<%#Eval("ID") %>" class="btn_del" style="color: red; text-decoration: underline;">删除</a>
                    </ItemTemplate>
                </asp:TemplateField>

            </Columns>
            <HeaderStyle HorizontalAlign="Left"></HeaderStyle>
            <PagerStyle VerticalAlign="Middle" />
        </asp:GridView>
    </div>
    <script>
        $(function () {
            $(".btn_del").on("click", function () {
                var id = $(this).data("id");
                if (window.confirm('你确定要删除该用户以及作品吗？')) {
                    //alert("确定");
                    $.ajax({
                        type: "POST",// 请求方式
                        url: "list.aspx?op=del",// 请求url地址
                        data: { id: id },
                        dataType: "text",// 数据返回类型
                        success: function (data) {
                            // 请求发送成功后执行的函数,data是返回的数据。
                            if (data == "true") {
                                window.location.reload();
                            }
                        },
                        timeout: 3000,// 超时设置,如果3秒内请求无响应,则执行error定义的方法
                        error: function () {
                            // code
                        },
                        async: true,// 默认设置为true，所有请求均为异步请求。
                    })
                    return true;
                } else {
                    //alert("取消");
                    return false;
                }
                

            });
        });
    </script>
</asp:Content>
