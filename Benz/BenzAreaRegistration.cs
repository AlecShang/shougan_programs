using System.Web.Mvc;

namespace SG.APP.Web.Areas.Benz
{
    public class BenzAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Benz";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Benz_default",
                "Benz/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}