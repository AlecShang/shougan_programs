using SG.APP.BizObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SG.APP.Web.Areas.Benz.Controllers
{
    public class CheckOpenidAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpRequestBase bases = (HttpRequestBase)filterContext.HttpContext.Request;
            if (!string.IsNullOrEmpty(ApplicationContext.Current.LogonInfo.Openid))
            {
                base.OnActionExecuting(filterContext);
            }
            else
            {
                BackToLogon(filterContext, "/Auth/Auth2?appid=wx66fc2f2e90e877ba&url=" + System.Web.HttpUtility.UrlEncode(bases.Url.ToString()) + "&flag=false");
            }
        }
        /// <summary>
        /// 重定向到登录页面
        /// </summary>
        /// <param name="filterContext"></param>
        private void BackToLogon(ActionExecutingContext filterContext, string action)
        {
            filterContext.Result = new RedirectResult(action);
        }
    }
}