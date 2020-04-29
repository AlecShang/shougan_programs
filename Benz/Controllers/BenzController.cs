using SG.APP.BizObject;
using SG.APP.Client.Logic;
using SG.APP.Utility;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SG.APP.Web.Areas.Benz.Controllers
{
    public class BenzController : Controller
    {

        CLBenzService cLBenzService = new CLBenzService();

        #region 读取首页
        /// <summary>
        /// 读取首页
        /// </summary>
        /// <returns></returns>
        /// 
        [CheckOpenid]
        public ActionResult Index()
        {

            //LogonInfo l = new LogonInfo();
            ////l.Openid = new Random().Next(10000000) + "";
            //l.Openid = "o0JaWjksIf-XK8pbu3zCBB9lvW_0";
            //ApplicationContext.Current.LogonInfo = l;
            if (DateTime.Now.Month > 6)
            {
                if (DateTime.Now.Day > 7)
                {
                    Response.Redirect("Index3" + Request.Url.Query);            ///暂无禁止投票后是否显示中奖名单的通知,如需显示,这里换成index3
                }
                else
                    Response.Redirect("Index3" + Request.Url.Query);
            }
            else
                Response.Redirect("Index3" + Request.Url.Query);

            return View();
        }


        [CheckOpenid]
        public ActionResult Index2()
        {
            //LogonInfo l = new LogonInfo();
            ////l.Openid = new Random().Next(10000000) + "";
            //l.Openid = "o0JaWjksIf-XK8pbu3zCBB9lvW_0";
            //ApplicationContext.Current.LogonInfo = l;
            return View();
        }


        [CheckOpenid]
        public ActionResult Index3()
        {
            //LogonInfo l = new LogonInfo();
            ////l.Openid = new Random().Next(10000000) + "";
            //l.Openid = "o0JaWjh3VoTU4wJJ1zayzGH2v8Fk1234111";
            //ApplicationContext.Current.LogonInfo = l;
            return View();
        }


        #endregion

        //#region 读取首页本地测试
        ///// <summary>
        ///// 读取首页
        ///// </summary>
        ///// <returns></returns>
        ///// 
        ////[CheckOpenid]
        //public ActionResult Index()
        //{

        //    LogonInfo l = new LogonInfo();
        //    //l.Openid = new Random().Next(10000000) + "";
        //    l.Openid = "o0JaWjksIf-XK8pbu3zCBB9lvW_0";
        //    ApplicationContext.Current.LogonInfo = l;
        //    if (DateTime.Now.Month > 6)
        //    {
        //        if (DateTime.Now.Day > 7)
        //        {
        //            Response.Redirect("Index3" + Request.Url.Query);            ///暂无禁止投票后是否显示中奖名单的通知,如需显示,这里换成index3
        //        }
        //        else
        //            Response.Redirect("Index3" + Request.Url.Query);
        //    }
        //    else
        //        Response.Redirect("Index3" + Request.Url.Query);

        //    return View();
        //}


        ////[CheckOpenid]
        //public ActionResult Index2()
        //{
        //    LogonInfo l = new LogonInfo();
        //    //l.Openid = new Random().Next(10000000) + "";
        //    l.Openid = "o0JaWjksIf-XK8pbu3zCBB9lvW_0";
        //    ApplicationContext.Current.LogonInfo = l;
        //    return View();
        //}


        ////[CheckOpenid]
        //public ActionResult Index3()
        //{
        //    LogonInfo l = new LogonInfo();
        //    //l.Openid = new Random().Next(10000000) + "";
        //    l.Openid = "o0JaWjh3VoTU4wJJ1zayzGH2v8Fk1234111";
        //    ApplicationContext.Current.LogonInfo = l;
        //    return View();
        //}


        //#endregion

        #region 获取时间戳
        /// <summary> 
        /// 获取时间戳 
        /// </summary> 
        /// <returns></returns> 
        public static string GetTimeStamp()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString();
        }

        #endregion

        #region 保存图片
        /// <summary>
        /// 保存图片
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [CheckOpenid]
        public ActionResult UploadImg(string imgbase64, int rotate, double w, double h)
        {
            ////图片类型
            var imgtype = System.Drawing.Imaging.ImageFormat.Jpeg;
            ////选择角度
            var imgrotate = RotateFlipType.RotateNoneFlipNone;
            ////图片后缀名
            var imghz = "jpg";
            ////设置图片类型
            if (imgbase64.IndexOf("data:image/jpeg;base64,") > -1)
            {
                imgtype = System.Drawing.Imaging.ImageFormat.Jpeg;
                imghz = "jpg";
            }
            if (imgbase64.IndexOf("data:image/png;base64,") > -1)
            {
                imgtype = System.Drawing.Imaging.ImageFormat.Png;
                imghz = "png";
            }
            ////设置选择角度
            switch (rotate)
            {
                case 1:
                    imgrotate = RotateFlipType.Rotate90FlipNone;
                    break;
                case 2:
                    imgrotate = RotateFlipType.Rotate180FlipNone;
                    break;
                case 3:
                    imgrotate = RotateFlipType.Rotate270FlipNone;
                    break;
            }
            ////定义图片名称
            string newFileName = System.Web.HttpContext.Current.Server.MapPath("/Areas/Benz/uploadFile/" + ApplicationContext.Current.LogonInfo.Openid + GetTimeStamp()+ "." + imghz);
            string newzoomFileName = System.Web.HttpContext.Current.Server.MapPath("/Areas/Benz/uploadFilezoom/" + ApplicationContext.Current.LogonInfo.Openid + GetTimeStamp() + "." + imghz);
            Session["picurl"] = "/Areas/Benz/uploadFile/" + ApplicationContext.Current.LogonInfo.Openid + GetTimeStamp() + "." + imghz;
            //ViewBag.picurl = "/uploadFile/1." + imghz;
            ////把图片数据格式化到字节数组
            byte[] arr = Convert.FromBase64String(imgbase64.Replace("data:image/jpeg;base64,", "").Replace("data:image/png;base64,", ""));
            ////读取字节数到文件流
            MemoryStream ms = new MemoryStream(arr);
            ////保存图片
            System.Drawing.Image newImage = System.Drawing.Image.FromStream(ms);
            ////旋转角度
            newImage.RotateFlip(imgrotate);
            ////保存
            newImage.Save(newFileName, imgtype);
            ////关闭流
            newImage.Dispose();
            //ImageHandler.ZoomImage(ms, newzoomFileName, w * 0.3, h * 0.3);
            ImageHandler.GetPicThumbnail(newFileName, newzoomFileName, 10);
            return Json(ApplicationContext.Current.LogonInfo.Openid + GetTimeStamp() + "." + imghz);
        }

        #endregion

        #region 通过openid获取信息
        /// <summary>
        /// 通过openid获取信息
        /// </summary>
        /// <param name="openid"></param>
        /// <returns></returns>
        /// 
        [CheckOpenid]

        public ActionResult Getinfo(string openid)
        {
            var dd = cLBenzService.GetBenzUserbydopenid(ApplicationContext.Current.LogonInfo.Openid);
            if (dd.Count > 0)
            {
                string usergroup = dd[0].userGroup;
                var aa = cLBenzService.GetBenzVoteCount(usergroup);
                if (aa.Count > 0)
                {
                    //dd[0].picUrl = aa[0].votepicurl;
                    //dd[0].voteNamecount = aa[0].voteNamecount;
                   int a = 1;
                }
                return Json(dd);
            }
            else
                return Json(0);
        }
        [CheckOpenid]

        public ActionResult GetinfoFriend(string openid)
        {
            var dd = cLBenzService.GetBenzUserbydopenid(openid);
            if (dd.Count > 0)
            {
                string usergroup = dd[0].userGroup;
                var aa = cLBenzService.GetBenzVoteCount(usergroup);
                if (aa.Count > 0)
                {
                    //dd[0].picUrl = aa[0].votepicurl;
                    //dd[0].voteNamecount = aa[0].voteNamecount;
                    int a = 1;
                }
                return Json(dd);
            }
            else
                return Json(0);
        }
        #endregion

        #region 上传用户信息
        /// <summary>
        /// 上传用户信息
        /// </summary>
        /// <param name="openid"></param>
        /// <returns></returns>
        /// 
        [CheckOpenid]

        public ActionResult Editinfo(BenzUserInfo benzUser)
        {
            BenzUserInfo user = new BenzUserInfo();
            user.createTime = DateTime.Now.ToString();
            var dd = cLBenzService.EditBenzUserInfo(new BenzUserInfo { openId = ApplicationContext.Current.LogonInfo.Openid, userName = benzUser.userName, userTel = benzUser.userTel, vinId = benzUser.vinId, userGroup = benzUser.userGroup, picUrl = Session["picurl"].ToString(), dealerName = benzUser.dealerName, dealerProvince = benzUser.dealerProvince, dealerCity = benzUser.dealerCity,createTime=DateTime.Now.ToString() });
            if (dd > 0)
            {
                return Json(dd);
            }
            else
                return Json(0);

        }

        #endregion

        #region 获取投票数
        /// <summary>
        /// 获取投票数
        /// </summary>
        /// <returns></returns>
        /// 
        [CheckOpenid]

        public ActionResult GetBenzVoteCount(string usergroup)
        {
            if (usergroup != null)
            {
                var aa = cLBenzService.GetBenzVoteCount(usergroup);
                return Json(aa);
            }
            else
                return View();
        }

        #endregion

        #region 通过openid获取投票数
        /// <summary>
        /// 通过openid获取投票数
        /// </summary>
        /// <param name="openid"></param>
        /// <returns></returns>
        [CheckOpenid]
        public ActionResult GetBenzVoteCountbyopenid(string openid)
        {
            var s = cLBenzService.GetBenzVoteCountbyopenid(ApplicationContext.Current.LogonInfo.Openid);
            return Json(s);
        }
        [CheckOpenid]
        public ActionResult GetBenzVoteCountbyopenid1(string openid)
        {
            var s = cLBenzService.GetBenzVoteCountbyopenid(openid);
            return Json(s);
        }
        #endregion

        #region 投票
        /// <summary>
        /// 投票
        /// </summary>
        /// <param name="benzVote"></param>
        /// <returns></returns>
        /// 
        [CheckOpenid]

        public ActionResult EditvoteInfo(BenzVoteInfo benzVote)
        {
            if (DateTime.Now.Day > 7)
            {
                return null;
            }
            else
            {
                BenzVoteInfo vote = new BenzVoteInfo();
                var cc = cLBenzService.EditBenzVoteInfo(new BenzVoteInfo { voteName = benzVote.voteName, voteGroup = benzVote.voteGroup, voteFromname = ApplicationContext.Current.LogonInfo.Openid, voteCreatetime = DateTime.Now.ToString() });
                if (cc > 0)
                {
                    return Json(1);
                }
                else
                    return Json(0);
            }
        }

        #endregion

        #region 获取供应商信息
        /// <summary>
        /// 获取供应商信息
        /// </summary>
        /// <param name="b"></param>
        /// <returns></returns>
        /// 
        [CheckOpenid]

        public ActionResult GetDealer(int b)
        {
            var s = cLBenzService.SysServices().GetBenzDealers().Where(a => a.ParentID == b).ToList();
            return Json(s);
        }

        #endregion
    }
}