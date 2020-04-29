/*******************************************全局变量******************************************/
var App = {
    height: document.documentElement.clientHeight,//浏览器高度
    ismove: true,//允许上滑
    globalH: 1136,//原始高度
    nowW: 640,//当前宽度
    nowPage: 1,//当前页
    oldPage: 1,//历史页
    nowChose: 0,//当前选择
    fack: 4,//个人信息
    openid: null,//Openid
    editzt: true,//提交按钮状态
    istj: true,//提交控制按钮
    gbpage: 1,//提交控制按钮
    pro: '',//省份
    city: '',//城市
    dealer: '',//经销商
    defaultpro: '',//默认省份
    iscp: true,//展示产品页
    xz: 0,
    ispicurl: true,///参赛作品图片路径
    picopenid: null,///作品所属用户openid
    picheight: null,///作品的高度
    imgurl: '',///图片路径
    issy: true,///图片路径
    votecount: null,///排行榜和个人作品页传递投票数
    isvotesuccess: 0,///是否投票成功
    rankvotecount: null,////票数容器
    glalabel: null,///判断切换TAB是否需要查询数据库 这里给一个标记，如果里边有值则不用查询
    glclabel: null,
    glelabel: null,
    gleslabel: null,
    glslabel: null,
    group: null,  ///投票组别检查
    p: 1,///防止排行榜刷新
    imgw: 0,////上传图片的宽度
    imgh: 0,////上传图片的高度
    isupdatepic: false,///是否保存了图片
    updatepic: null,///保存的地址
    issubmitpic: false,///是否上传图片并提交信息
    touch: false,///是否是主页滑动
    ishpp: false,///横屏监视

}
/*******************************************全局变量******************************************/
////设置UI显示比例和位置
function setLoc(loclist) {   ///其中setLoc是初始化UI，这部分循环的作用是重新定义比例
    for (var i = 0; i < loclist.length; i++) {
        $(loclist[i].ui).css({
            "width": App.height * loclist[i].w / App.globalH + "px",
            "height": App.height * loclist[i].h / App.globalH + "px",
            "top": App.height * loclist[i].top / App.globalH + "px",
            "left": (App.nowW - App.height * loclist[i].w / App.globalH) / loclist[i].left + "px"
        });
    }
}
/****************************************上传图片********************************************/
/*************判断是否需要旋转图片***************/
var img;
////上传文件
function UploadFile(obj) {
    if ($.trim(obj.value) == "") {
        //用户没有选择文件
        $("#tips2").text("请选择图片");
        return;
    }
    if (obj.files[0].type != "image/jpeg" && obj.files[0].type != "image/png") {
        alert("只能上传png,jpg格式图片");
        return;
    }
    //var reader = new FileReader();
    //reader.onload = function (evt) {
    //    $('#cszp').attr('src', evt.target.result);
    //    img = evt.target.result;
    //}
    //reader.readAsDataURL(obj.files[0]);
    //$('#UpLoadForm').hide();
    //$('.picdiv').css('border', 0);

    var file = obj.files[0];
    var orientation;
    //EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
    EXIF.getData(file, function () {
        orientation = EXIF.getTag(this, 'Orientation');
    });
    var reader = new FileReader();
    reader.onload = function (e) {
        getImgData(this.result, orientation, function (data) {
            //这里可以使用校正后的图片data了 
            $('#cszp').attr('src', data).show();
            img = data;
        });
    }
    reader.readAsDataURL(file);
    $('#UpLoadForm').hide();
    $('.picdiv').css('border', 0);
}
// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img, dir, next) {
    var image = new Image();
    image.onload = function () {
        var degree = 0, drawWidth, drawHeight, width, height;
        App.imgw = drawWidth = this.naturalWidth;
        App.imgh = drawHeight = this.naturalHeight;

        //以下改变一下图片大小
        var maxSide = Math.max(drawWidth, drawHeight);
        if (maxSide > 1024) {
            var minSide = Math.min(drawWidth, drawHeight);
            minSide = minSide / maxSide * 1024;
            maxSide = 1024;
            if (drawWidth > drawHeight) {
                drawWidth = maxSide;
                drawHeight = minSide;
            } else {
                drawWidth = minSide;
                drawHeight = maxSide;
            }
        }
        var canvas = document.createElement('canvas');
        canvas.width = width = drawWidth;
        canvas.height = height = drawHeight;
        var context = canvas.getContext('2d');
        //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
        switch (dir) {
            //iphone横屏拍摄，此时home键在左侧
            case 3:
                degree = 180;
                drawWidth = -width;
                drawHeight = -height;
                break;
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
            case 6:
                canvas.width = height;
                canvas.height = width;
                degree = 90;
                drawWidth = width;
                drawHeight = -height;
                break;
                //iphone竖屏拍摄，此时home键在上方
            case 8:
                canvas.width = height;
                canvas.height = width;
                degree = 270;
                drawWidth = -width;
                drawHeight = height;
                break;
        }
        //使用canvas旋转校正
        context.rotate(degree * Math.PI / 180);
        context.drawImage(this, 0, 0, drawWidth, drawHeight);

        if ((Math.abs(drawWidth) < Math.abs(drawHeight)) && (drawWidth < 0 || drawHeight < 0)) {
            setLoc([

                               { 'ui': '.picdiv', 'w': 595, 'h': 401, 'top': 269, 'left': 2 },
            ]);
            App.imgw = drawHeight;
            App.imgh = drawWidth;
        }
        else if ((drawWidth > drawHeight) && drawWidth > 0 && drawHeight > 0) {

            setLoc([

                                 { 'ui': '.picdiv', 'w': 595, 'h': 401, 'top': 269, 'left': 2 },
            ]);
            App.imgw = drawHeight;
            App.imgh = drawWidth;
        }
        //返回校正图片
        next(canvas.toDataURL("image/jpeg", .8));

    }
    image.src = img;
}
/*************判断是否需要旋转图片***************/


/****************************************上传图片********************************************/

/****************************************获取经销商********************************************/
function getdealerinfo(a) {
    var i = 0;
    $.ajax({
        type: "POST",
        url: "/Benz/Benz/GetDealer",
        async: false,
        data: {
            b: a,
        },
        success: function (data) {
            i = data
        },
    });
    return i;
}
/****************************************获取经销商********************************************/
function Load() {
    this.picLoad();
}
Load.prototype = {
    //预加载代码
    picLoad: function () {
        //图片数组
        var loadImages = [
            'loadingback.png',
            'camera.png',
            'rulecontent.png',
            'video.png',
            'bg.png',
            'logo.png',
            'p1bg.png',
            'p1bt.png',
            'p1black.png',
            'p2font1.png',
            'p2font2.png',
            //'p2font21.png',
            'p2font3.png',
            'p2font4.png',
            'myproi1.png',
            'myproi2.png',
            'myproi3.png',
            'myproi4.png',
            'myprojoin.png',
            'myproblack.png',
            'mypro.png',
            'joinblack.png',
            'contactreturn.png',
            'submit.png',
            'rankblack.png',
            'icon.png',
            'up.png',
            'contactblack.png',
            'returnbtn.png',
            'pic.png',
            'upload.png',
            'rank2bg1.png',
            'rank2bg2.png',
            'rank2xin.png',
            'rule.png',
            'star.png',
            'line.png',
            'jointext.png',
            'group.png',
            'close.png',
            'imgrotate.png',
            'isupdate.jpg',
            'joinisnull.png',
            'joinreturn.png',
            'joinsubmit.png',
            'jointext.png',
            'jxs.png',
            'loading2.gif',
            'loadingcemara.png',
            'p2jxs.png',
            'p2rule.png',
            'picreturn.png',
            'project.png',
            'save.png',
            'share.png',
            'share1.png',
            'submit_bak.png',
            'submitsuccess.png',
            'title.png',
            'joined.png'
        ];
        ////计数函数
        var imgcounter = (function () {
            var initalnum = 0;
            return {
                addOne: function () {
                    initalnum++;
                    return initalnum;
                }
            }
        })();
        for (i = 0; i < loadImages.length; i++) {
            img = new Image();
            img.src = "../../Areas/benz/img/" + loadImages[i];
            img.onload = function () {
                var imgnum = imgcounter.addOne();
                //$(".loading").show();
                $(".loading_div").html(parseInt(imgnum / loadImages.length * 100) + "%");
                $(".loadingline2").width(parseInt(imgnum / loadImages.length * 100) + "%")
                //$(".loadingcemara").show();
                //图片加载完毕
                if (imgnum == loadImages.length) {
                    $(".loading").hide();
                    if (getUrlParam('fopenid') != null) {
                        $.ajax({
                            //提交数据的类型 POST GET
                            type: "POST",
                            //提交的网址
                            url: "/Benz/Benz/GetinfoFriend",
                            cache: false,
                            //提交的数据
                            data: {
                                Openid: getUrlParam('fopenid')
                            },
                            //返回数据的格式
                            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                            //成功返回之后调用的函数
                            success: function (data) {
                                if (data != 0) {
                                    $("#name").val(data[0].userName);
                                    App.group = data[0].userGroup;
                                    App.picopenid = data[0].openId;
                                    if (data[0].picUrl != null) {
                                        var image = new Image();
                                        image.onload = function () {
                                            var a = 1;
                                            if (this.naturalWidth < this.naturalHeight) {
                                                setLoc([

                                                                    { 'ui': '.myprodiv', 'w': 396, 'h': 705, 'top': 172, 'left': 2 },
                                                ]);
                                            }
                                            else {

                                                setLoc([

                                                                     { 'ui': '.myprodiv', 'w': 595, 'h': 401, 'top': 269, 'left': 2 },
                                                ]);
                                            }
                                        }
                                        image.src = data[0].picUrl;
                                        $("#pic").attr("src", data[0].picUrl);

                                    }
                                    else
                                        App.ispicurl = null;
                                    $("#mypropic").attr("src", "../../" + data[0].picUrl);
                                    $(".votenum").text(data[0].voteNamecount);
                                    $(".username").text(data[0].ID + ' ' + data[0].userName);
                                    $('#mypropage').show();
                                }

                                else if (data == 0) {
                                    App.ispicurl = null;
                                }
                                else {
                                    App.ispicurl = null;
                                }


                            },

                            //调用出错执行的函数
                            error: function (e) {
                                App.ispicurl == null;
                                App.fack = 6;
                            }
                        });
                        $.ajax({
                            type: "post",
                            url: "/Benz/Benz/GetBenzVoteCountbyopenid1",
                            cache: false,
                            data: {
                                openid: getUrlParam('fopenid')
                            },
                            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                            success: function (data) {
                                $(".votenum").text(data[0].voteNamecount);
                            }
                        })
                        $("#myproreturn").css({
                            'background': ' url(../../Areas/Benz/img/myprojoin.png) no-repeat',
                            '-webkit-background-size': '100% 100%',
                            'background-size': '100% 100%'
                        });
                    }
                    else {
                        $(".index123").show();
                        //$('.index123', '#p2').fadeToggle('fast');
                        datainit();///验证手机号
                    }

                    /***************************************分享********************************************/
                    dz({
                        debug: false,
                        appid: 'wxb4241f71d299251a',  ////公众号Appid
                        oauthurl: escape(window.location.href),////当前页面完整URL
                        timestamp: '1414587457',////生成签名的时间戳
                        nonceStr: 'Wm3WZYTPz0wzccnW',////生成签名的随机串
                        title: '梦想如影随形，梅赛德斯 - 奔驰东区摄影大赛第二季', // 分享标题
                        desc: '2016梅赛德斯 - 奔驰SUV征服之旅等你来战', // 分享描述window.location='../index.html?ti='+Q.ti+'&fens='+Q.fens+'&gailv='+gailv;
                        link: 'http://app.shougan.com.cn/benz/benz/index', // 分享链接
                        imgUrl: 'http://app.shougan.com.cn/Areas/Benz/img/title.png', // 分享图标
                        success: function () {////分享成功后执行的方法

                        }
                    });
                    /***************************************分享********************************************/





                    /***************************************内部函数********************************************/

                    $('#joinpage').css('height', App.height + 'px');
                    ////注册滑一滑
                    function hyh() {
                        //滑动开始
                        document.addEventListener("touchstart",
                                   function (e) {
                                       if (!event.touches.length) {
                                           return
                                       }
                                       tmpEndY = 0;
                                       var touch = event.touches[0];
                                       tmpStartY = touch.pageY;
                                   });
                        //滑动过程
                        document.addEventListener("touchmove",
                            function (e) {
                                //if (!App.touch)
                                //{

                                //}
                                if (App.ismove && App.iscp) {
                                    e.preventDefault();                             ///禁止滑动。
                                }
                                if (App.ishpp) {
                                    e.preventDefault();
                                }
                                if (!event.touches.length) {
                                    return
                                }
                                if (App.nowPage == 1) {
                                    var touch = event.touches[0];
                                    tmpEndY = touch.pageY;
                                }

                            });
                        //滑动结束
                        document.addEventListener("touchend",
                            function (e) {
                                var endY = tmpEndY;
                                var startY = tmpStartY;
                                //上划p2_z1
                                if (endY && endY !== startY && endY - startY <= -25 && App.nowPage == 1 && !App.ishpp) {        ///如果页面在主页面的话

                                    $('.index123', '#p2').fadeToggle('fast');
                                    App.nowPage++;
                                    $("#p2").show();
                                    App.touch = true;
                                    App.iscp = false;
                                }
                            });
                    }
                    hyh();

                    $("#mypropic").on('touchstart', function () {
                        wx.previewImage({
                            current: 'http://app.shougan.com.cn/' + $('#mypropic').attr('src').replace('../..//', ''), // 当前显示图片的http链接
                            urls: ['http://app.shougan.com.cn/' + $('#mypropic').attr('src').replace('../..//', '')] // 需要预览的图片http链接列表
                        });
                    })

                    $("#pic").on('touchstart', function () {
                        if ($("#pic").attr('src') == "" || $("#pic").attr('src') == null || $("#pic").attr('src') == undefined) {
                            alert("未上传参赛作品");
                            return;
                        }
                            //if (obj.files[0].type != "image/jpeg" && obj.files[0].type != "image/png") {
                            //    alert("只能上传png,jpg格式图片");
                            //    return;
                            //}
                            //else if (!App.issubmitpic) {
                            //    alert("false");
                            //    return;
                            //}
                        else {
                            //var a = 'http://app.shougan.com.cn' + $(this).attr('src').replace('../..//', '');
                            //alert(a);
                            wx.previewImage({
                                current: 'http://app.shougan.com.cn/' + $(this).attr('src').replace('../..//', ''), // 当前显示图片的http链接
                                urls: ['http://app.shougan.com.cn/' + $(this).attr('src').replace('../..//', '')] // 需要预览的图片http链接列表
                            });

                        }

                    })

                    /***************************************主页跳转分页********************************************/
                    ///页面跳转至我的作品页面
                    $("#myprobtn").click(
                        function targetmypro() {
                            //如果当前用户没有参加活动，跳转至参加活动页面
                            if (App.ispicurl == null) {
                                ///页面提示请上传作品
                                $("#video").hide();
                                $("#joinisnull").show();
                            }
                                //如果当前用户已经上传作品，则展示作品
                            else {
                                datainit();
                                getvotebyopenid();
                                $("#myproreturn").show();
                                $("#myproreturn2").hide();
                                $('#p2, #mypropage').fadeToggle('fast'); //前消失，后呈现
                                dzt({
                                    title: '梦想如影随形，梅赛德斯 - 奔驰东区摄影大赛第二季', // 分享标题
                                    desc: '2016梅赛德斯 - 奔驰SUV征服之旅等你来战', // 分享描述window.location='../index.html?ti='+Q.ti+'&fens='+Q.fens+'&gailv='+gailv;
                                    link: 'http://app.shougan.com.cn/benz/benz/index?fopenid=' + App.openid, // 分享链接
                                    imgUrl: 'http://app.shougan.com.cn/Areas/Benz/img/title.png', // 分享图标
                                    success: function () {////分享成功后执行的方法

                                    }
                                });
                                // $("#mypropic").css("margin", "-" + parseInt($("#mypropic").height() / 2) + "px auto 0 auto");
                            }
                        })

                    ///我的作品页面

                    ///页面跳转至参加活动页面
                    $("#joinbtn").click(function targetjoin() {
                        datainit();
                        if ($("#name").val() != "") {
                            //$("#joined").show();
                            $('#p2, #joined').fadeToggle('fast'); //前消失，后呈现
                            //var a = document.getElementById("submitpicbtn").innerHTML = "修改";
                        }
                        else {
                            ////datainit();
                            var myDate = new Date();
                            var mon=myDate.getMonth(); //获取当前月份(0-11,0代表1月)
                            if (mon > 6) {
                                alert("报名已截止!");
                            }
                            else {
                                $(".submitsuccess").hide();
                                $('#p2, #joinpage').fadeToggle('fast'); //前消失，后呈现
                            }
                        }

                    })
                    ///页面跳转至获奖名单
                    $("#rewardbtn").click(function () {
                        $("#rewardpage").show();

                    })

                    ///参加活动页面上传图片按钮
                    $(".submitpicbtn").click(function () {
                        //if ($("#cszp").val() != "")
                        //{
                        //    $(".upload").hide();
                        //}
                        $("#tips2").text("");
                        $('#joinpage, #submitpicpage').fadeToggle('fast'); //前消失，后呈现.

                        App.xz = 0;
                        //setLoc([

                        //  { 'ui': '.picdiv', 'w': 396, 'h': 705, 'top': 172, 'left': 2 },
                        //]);
                    })
                    ///参加活动页面提交图片按钮
                    $("#submitpicbtn2").click(function () {
                        $('#submitpicpage, #joinpage').fadeToggle('fast'); //前消失，后呈现
                    })
                    ///排行榜从车型到具体展示
                    //$("#rankpage").click(function () {
                    //    $('#rankpage, #rankpage2').fadeToggle('fast'); //前消失，后呈现
                    //})
                    ///页面跳转至排行榜页面
                    $("#rankbtn").click(function targetrank() {
                        $('#p2, #rankpage').fadeToggle('fast'); //前消失，后呈现


                    })
                    ///页面跳转至联系我们页面
                    $("#contactbtn").click(function targetcontact() {
                        var p = getdealerinfo(0);
                        App.pro = '';
                        //App.pro += '<option selected>请选择</option >';
                        for (var i = 0; i < p.length; i++) {
                            App.pro += '<option data-id=' + p[i].OwnID + ' value="' + p[i].OwnName + '">' + p[i].OwnName + '</option> ';
                        }
                        $("#province2").html(App.pro);
                        $("#province2").change();
                        $("#city2").change();


                        $('#p2, #contactpage').fadeToggle('fast'); //前消失，后呈现
                        if (App.iscp) {
                            App.iscp = false;
                            return;
                        }

                    })
                    ///点击右上角图标
                    $(".icon").click(function () {
                        $('#p2, #promptpage').fadeToggle('fast'); //前消失，后呈现
                    })

                    ///弹出规则页面
                    $(".rule").click(function () {
                        $('.p2v').hide();
                        $(".ruleback").show();
                    })
                    $(".p2rule").click(function () {
                        $(".ruleback").show();
                    })
                    $(" .closerule").click(function () {
                        $('.p2v').show();
                        $(".ruleback").hide();
                    })



                    /***************************************主页跳转分页********************************************/

                    /***************************************分页跳转********************************************/
                    ///从我的作品返回主页
                    $("#myproreturn").click(function () {
                        $("#myproreturn").css({
                            'background': ' url(../../Areas/Benz/img/returnbtn.png) no-repeat',
                            '-webkit-background-size': '100% 100%',
                            'background-size': '100% 100%'
                        });
                        $('#mypropage, #p2').fadeToggle('fast'); //前消失，后呈现
                        $("#pic").attr("src", "");
                        $("#name").val("");
                        App.group = null;
                        datainit();
                    })
                    ///从提示已参加活动返回到主界面
                    $("#joinedreturn").click(function () {
                        //$('#joined').hide();
                        $('#joined, #p2').fadeToggle('fast'); //前消失，后呈现
                    })
                    ///从我的作品返回排行榜页
                    $("#myproreturn2").click(function () {
                        $('#mypropage, #rankpage2').fadeToggle('fast'); //前消失，后呈现
                        //if (App.isvotesuccess==1)
                        //$($(".rankvotecount")[App.votecount]).text($($(".rankvotecount")[App.votecount]).text() * 1 + 1);
                    })

                    ///作品页投票
                    $(".mypropagei3").click(function () {
                        var myDate = new Date();
                        var day = myDate.getDate(); //获取当前月份(0-11,0代表1月)
                        if (day >7) {
                            alert("投票已截止!");
                        }
                        else
                        {
                            vote();
                        }
                    })
                    ///未参加活动提示后返回
                    $("#isnullreturn").click(function () {
                        $("#video").show();
                        $("#joinisnull").hide();
                    })
                    ///参加活动提交成功返回
                    $("#submitsuccessreturn").click(function () {
                        //if ($("#name").val() != "")
                        //    $("#joined").show();
                        //$("#joinbtn").attr("class", "p2font21");
                        //datainit();
                        $("#joinpage,#p2").fadeToggle('fast');
                    })
                    ///从排行榜返回主页
                    $("#rank1return").click(function () {
                        //datainit();
                        $('#rankpage, #p2').fadeToggle('fast'); //前消失，后呈现
                    })
                    ///从参与活动返回至主页面
                    $("#joinreturn").click(function () {
                        //datainit();
                        $('#joinpage, #p2').fadeToggle('fast'); //前消失，后呈现
                    })
                    ///默认活动参与提示信息为隐藏
                    $(".prompt").hide();
                    ///显示活动参与提示信息
                    $(".icon").click(function () {
                        $(".prompt").show();
                    })
                    ///默认参加活动页面为隐藏
                    $("#joinpage").hide();
                    ///联系我们活动返回
                    $("#contactreturn").click(function () {
                        $('#contactpage, #p2').fadeToggle('fast'); //前消失，后呈现
                    })
                    ///获奖名单返回
                    $("#rewardreturn").click(function () {
                        $("#rewardpage").hide("normal", null);
                        //$('#rewardpage, #p2').fadeToggle('fast'); //前消失，后呈现
                    })
                    ///排行榜2返回
                    $("#rank2return").click(function () {
                        $('#rankpage2, #rankpage').fadeToggle('fast'); //前消失，后呈现
                    })
                    ///获奖页面返回
                    ///排行榜2返回
                    $("#huojiangreturn").click(function () {
                        $("#rewardpage").hide();
                    })

                    
                    ///上传图片页面返回
                    $("#picreturn").click(function () {
                        $("#tips").text("");
                        $("#tips2").text("");
                        if (!App.isupdatepic) {
                            $("#cszp").attr("src", "../../Areas/Benz/img/isupdate.jpg");
                        }
                        //else {
                        //    //$("#cszp").attr("src", App.updatepic[0].src);
                        //}
                        $('#submitpicpage, #joinpage').fadeToggle('fast'); //前消失，后呈现
                        // $("#cszp").hide().attr("src", "");
                        //$("#UpLoadForm").show();
                        //$(".picdiv").css("border", " 2px solid #e0e0e0");
                        //$("#picPath").val('');
                    })

                    ///点击图片后可以重置上传图片
                    $("#cszp").click(function () {
                        $("#picPath").click();
                    })
                    ///分享页面
                    $(" .mypropagei4").click(function () {
                        $(".share").show();
                    })
                    ///分享页面点击屏幕返回
                    $(" .share").click(function () {
                        $(".share").hide();
                    })

                    ///提交个人信息

                    $("#joinsubmit").on('touchstart', function () {
                        var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                        if ($("#name").val() == "") {
                            $("#tips").text("");
                            $("#tips").text("请填写正确姓名");
                        }
                        else if ($("#tel").val() == "") {
                            $("#tips").text("");
                            $("#tips").text("请填写正确电话");
                        }
                        else if (!reg.test($("#tel").val())) {
                            $("#tips").text("");
                            $("#tips").text("请填写正确电话");
                        }
                        else if ($("#province").val() == "" || $("#province").val() == "请选择") {
                            $("#tips").text("");
                            $("#tips").text("请选择正确省份");
                        }
                        else if ($("#city").val() == "" || $("#city").val() == "请选择") {
                            $("#tips").text("");
                            $("#tips").text("请选择正确城市");
                        }
                        else if ($("#dealer").val() == "" || $("#dealer").val() == "请选择") {
                            $("#tips").text("");
                            $("#tips").text("请选择购车经销商");
                        }
                        else if ($("#vin").val() == "") {
                            $("#tips").text("");
                            $("#tips").text("请填写正确车架号");
                        }
                        else if ($("#pic").attr("src").length == 0) {
                            $("#tips").text("");
                            $("#tips").text("请上传参赛作品");
                        }
                        else {
                            $("#tips").text("");
                            $("#loadinggif").show();
                            $.ajax({
                                type: "post",
                                url: "/Benz/Benz/Editinfo",
                                cache: false,
                                data: {
                                    Openid: App.openid,
                                    userName: $("#name").val(),
                                    userTel: $("#tel").val(),
                                    vinId: $("#vin").val(),
                                    userGroup: $("#group").val(),
                                    picUrl: 'Areas/Benz' + App.imgurl,
                                    dealerName: $("#dealer option:selected").attr("data-id"),
                                    dealerProvince: $("#province option:selected").attr("data-id"),
                                    dealerCity: $("#city option:selected").attr("data-id")
                                },
                                datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                                success: function (data) {
                                    if (data > 0) {
                                        App.issubmitpic = true;
                                        $(".submitsuccess").show();
                                        $("#loadinggif").hide();
                                    }
                                    else
                                        alert("error");
                                }
                            })

                        }
                    })

                    /***************************************分页跳转********************************************/

                    ////初始滚动条在屏幕顶端
                    function InitScroll() {
                        window.scrollTo(0, 0);
                    }
                    ////禁止或启用输入框
                    function initinput(flag) {
                        App.editzt = !flag;
                        $("#name").attr("disabled", flag);
                        $("#tel").attr("disabled", flag);
                        $("#province").attr("disabled", flag);
                        $("#city").attr("disabled", flag);
                        $("#dealer").attr("disabled", flag);
                        $("#dealer2").attr("disabled", flag);
                        $("#group").attr("disabled", flag);
                        $("#vin").attr("disabled", flag);
                        $(".submitpicbtn").hide();
                        $("#joinsubmit").hide();
                        $("#label").hide();
                        $("#pic").show();
                        $(".joinreturn").css("left", "32%");
                    }
                    ////初始化
                    function datainit() {
                        $.ajax({
                            //提交数据的类型 POST GET
                            type: "POST",
                            //提交的网址
                            url: "/Benz/Benz/Getinfo",
                            cache: false,
                            //提交的数据
                            data: {
                                Openid: App.openid
                            },
                            //返回数据的格式
                            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                            //成功返回之后调用的函数
                            success: function (data) {
                                if (data != 0) {
                                    App.fack = 4;
                                    App.picopenid = data[0].openId;
                                    App.openid = data[0].openId;
                                    App.issubmitpic = true;
                                    App.ispicurl = data[0].picUrl;
                                    $("#name").val(data[0].userName);
                                    $("#tel").val(data[0].userTel);
                                    $("#province").html('<option>' + data[0].dealerProvinceDesc + '</option> ');
                                    App.defaultpro = data[0].dealerProvince;
                                    $("#city").html('<option>' + data[0].dealerCityDesc + '</option> ');
                                    $("#dealer").html('<option>' + data[0].dealerNameDesc + '</option> ');
                                    $("#vin").val(data[0].vinId);
                                    $("#group").html('<option>' + data[0].userGroup + '</option> ');
                                    App.group = data[0].userGroup;
                                    if (data[0].picUrl != null) {
                                        var image = new Image();
                                        image.onload = function () {
                                            var a = 1;
                                            if (this.naturalWidth < this.naturalHeight) {
                                                setLoc([

                                                                    { 'ui': '.myprodiv', 'w': 396, 'h': 705, 'top': 172, 'left': 2 },
                                                ]);
                                            }
                                            else {

                                                setLoc([

                                                                     { 'ui': '.myprodiv', 'w': 595, 'h': 401, 'top': 269, 'left': 2 },
                                                ]);
                                            }
                                        }
                                        image.src = data[0].picUrl;
                                        $("#pic").attr("src", data[0].picUrl);

                                    }
                                    else
                                        App.ispicurl = null;
                                    $("#cszp").attr("src", data[0].picUrl);
                                    $(".rankpicurl").attr("src", data[0].picUrl);
                                    $("#mypropic").attr("src", "../../" + data[0].picUrl);
                                    //App.picheight = $("#mypropic").height();
                                    //$(".myprodiv").attr("margin", "-" +parseInt($("#mypropic").height() / 2) + " auto 0 auto");
                                    $(".votenum").text(data[0].voteNamecount);
                                    $(".username").text(data[0].ID + ' ' + data[0].userName);
                                    initinput(true);

                                }

                                else if (data == 0) {
                                    App.ispicurl = null;
                                }
                                else {
                                    App.ispicurl = null;
                                }


                            },

                            //调用出错执行的函数
                            error: function (e) {
                                App.ispicurl == null;
                                App.fack = 6;
                            }
                        });
                    }


                    function vote() {
                        if (App.picopenid == null) {
                            App.picopenid = App.openid;
                        }
                        $.ajax({
                            type: "post",
                            url: "/Benz/Benz/EditvoteInfo",
                            cache: false,
                            data: {
                                voteName: App.picopenid,
                                voteFromname: App.openid,
                                voteGroup: App.group,
                            },
                            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                            success: function (data) {
                                if (data > 0) {
                                    $(".votenum").text($(".votenum").text() * 1 + 1);
                                    //App.isvotesuccess = 1;
                                    $(App.rankvotecount).html($(App.rankvotecount).html() * 1 + 1);
                                }
                                else if (data == 0) {
                                    alert("每组用户只能投一票");
                                }
                                else
                                    alert("error");
                            }
                        })

                    }

                    ///获取排行榜的票数根据组别
                    function getvote(group) {
                        $("#loadinggif").show();
                        $.ajax({
                            type: "post",
                            url: "/Benz/Benz/GetBenzVoteCount",
                            cache: false,
                            data: {
                                usergroup: group
                            },
                            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                            success: function (data) {
                                $("#loadinggif").hide();
                                var con = '';
                                var i = 0;
                                var o = 0;
                                //con += '<div class="item" style="overflow-y:scroll;-webkit-overflow-scrolling:touch;" >';
                                data.forEach(function (d) {
                                    con += '<table style="height:180px;width:100%" class="tbgl">';
                                    con += '<tr>';
                                    con += '<td  style="height:160px;width:158px;padding-left: 4%;">';
                                    con += '<img src="' + d.votepicurl.replace('uploadFile', 'uploadFilezoom') + '"   style="max-height:150px;max-width:158px;min-height:112px" class="rankpicurl"   />';
                                    con += '</td>';
                                    con += '<td style="width:35%;text-align:left">';
                                    con += '<label class="' + group + 'content" style="width:100%;height:20px;font-size:20px;color:#ffffff;margin-left: 10%;" datanum="' + o + '"    dataopenid="' + d.openid + '" datanameid="' + d.username + '"  datapicid="' + d.votepicurl + '"  datacountid="' + d.voteNamecount + '">作者：' + d.username + '</label>';
                                    con += '</td>';
                                    con += '<td style="text-align:left">';
                                    con += '<img src="/Areas/benz/img/rank2xin.png" width="22" height="20" style="max-width:27px;" /><label style="width:60px;height:20px;font-size:25px;color:#ffffff;margin-left:3px" class="rankvotecount" >' + d.voteNamecount + '</label>';
                                    con += '</td>';
                                    if (i == 0) {
                                        con += '</tr>';
                                        con += '</table>';
                                        i = 1;
                                    }
                                    else {
                                        con += '<div style="width:100%"><div style="border:#928d8d 1px solid;width:94%;margin-left: 3%; "></div></div>'
                                        con += '</tr>';
                                        con += '</table>';
                                    }
                                    o += 1;
                                })
                                //con += '</div>';
                                if (group == 'gla') {
                                    App.glalabel = o;
                                    $('#glacontent').html(con);
                                }
                                else if (group == 'glc') {
                                    App.glclabel = o;
                                    $('#glccontent').html(con);

                                }
                                else if (group == 'gle') {
                                    App.glelabel = o;
                                    $('#glecontent').html(con);

                                }
                                else if (group == 'gles') {
                                    App.gleslabel = o;
                                    $('#glescontent').html(con);

                                }
                                else {
                                    App.glslabel = o;
                                    $('#glscontent').html(con);

                                }


                                //$('#tbinfo').html(con);


                                ///通过排行榜页跳转至我的作品页面
                                //$(".rankpicurl").click(function () {
                                //    App.rankvotecount = $(this).parent().next().next().children()[1];  ///获取票数
                                //    var image = new Image();
                                //    image.onload = function () {
                                //        var a = 1;
                                //        if (this.naturalWidth < this.naturalHeight) {
                                //            setLoc([

                                //                                { 'ui': '.myprodiv', 'w': 396, 'h': 705, 'top': 172, 'left': 2 },
                                //            ]);
                                //        }
                                //        else {

                                //            setLoc([

                                //                                 { 'ui': '.myprodiv', 'w': 595, 'h': 401, 'top': 269, 'left': 2 },
                                //            ]);
                                //        }
                                //    }
                                //    image.src = $($(this).parent().next().children()).attr('datapicid');
                                //    $("#mypropic").attr("src", $($(this).parent().next().children()).attr('datapicid').replace('uploadFilezoom', 'uploadFile'));
                                //    $(".username").text($($(this).parent().next().children()).attr('datanameid'));
                                //    $(".votenum").text($($(this).parent().next().children()).attr('datacountid'));
                                //    App.picopenid = $($(this).parent().next().children()).attr('dataopenid');
                                //    App.votecount = $($(this).parent().next().children()).attr('datanum');
                                //    $("#myproreturn2").show();
                                //    $("#myproreturn").hide();
                                //    $('#rankpage2, #mypropage').fadeToggle('slow'); //前消失，后呈现
                                //})

                                $(".rankpicurl").each(function () {
                                    if (($._data($(this)[0], "events") || $.data($(this)[0], "events")) == undefined) {
                                        $(this).click(function () {

                                            App.rankvotecount = $(this).parent().next().next().children()[1];  ///获取票数
                                            var image = new Image();
                                            image.onload = function () {
                                                var a = 1;
                                                if (this.naturalWidth < this.naturalHeight) {

                                                    setLoc([
                                                                        { 'ui': '.myprodiv', 'w': 396, 'h': 705, 'top': 172, 'left': 2 },
                                                    ]);
                                                }
                                                else {

                                                    setLoc([

                                                                         { 'ui': '.myprodiv', 'w': 595, 'h': 401, 'top': 269, 'left': 2 },
                                                    ]);
                                                }
                                            }
                                            image.src = $($(this).parent().next().children()).attr('datapicid');
                                            $("#mypropic").attr("src", $($(this).parent().next().children()).attr('datapicid').replace('uploadFilezoom', 'uploadFile'));
                                            $(".username").text($($(this).parent().next().children()).attr('datanameid'));
                                            $(".votenum").text(App.rankvotecount.innerHTML);
                                            App.picopenid = $($(this).parent().next().children()).attr('dataopenid');
                                            //App.votecount = $($(this).parent().next().children()).attr('datanum');
                                            App.group = group;
                                            $("#myproreturn2").show();
                                            $("#myproreturn").hide();
                                            $('#rankpage2, #mypropage').fadeToggle('slow'); //前消失，后呈现
                                        });

                                    }

                                });
                            }



                        })

                    }
                    ///获取获奖名单,根据组别获取不同数量
                    function getvotereward(group,sum) {
                        $("#loadinggif").show();
                        $.ajax({
                            type: "post",
                            url: "/Benz/Benz/GetBenzVoteCount",
                            cache: false,
                            data: {
                                usergroup: group
                            },
                            datatype: "json",
                            success: function (data) {
                                $("#loadinggif").hide();
                                var con = '';
                                var i = 0;
                                var o = 0;
                                data.forEach(function (d) {
                                    con += '<table style="height:180px;width:100%" class="tbgl">';
                                    con += '<tr>';
                                    con += '<td style="width:35%;text-align:left">';
                                    con += '<label class="' + group + 'content" style="width:100%;height:20px;font-size:20px;color:#ffffff;margin-left: 10%;" datanum="' + o + '"    dataopenid="' + d.openid + '" datanameid="' + d.username + '"  datapicid="' + d.votepicurl + '"  datacountid="' + d.voteNamecount + '">作者：' + d.username + '</label>';
                                    con += '</td>';
                                    con += '<td style="text-align:left">';
                                    con += '<img src="/Areas/benz/img/rank2xin.png" width="22" height="20" style="max-width:27px;" /><label style="width:60px;height:20px;font-size:25px;color:#ffffff;margin-left:3px" class="rankvotecount" >' + d.voteNamecount + '</label>';
                                    con += '</td>';
                                    if (i == 0) {
                                        con += '</tr>';
                                        con += '</table>';
                                        i = 1;
                                    }
                                    else {
                                        con += '<div style="width:100%"><div style="border:#928d8d 1px solid;width:94%;margin-left: 3%; "></div></div>'
                                        con += '</tr>';
                                        con += '</table>';
                                    }
                                    o += 1;
                                })
                                if (group == 'gla') {
                                    App.glalabel = o;
                                    $('#glacontent').html(con);
                                }
                                else if (group == 'glc') {
                                    App.glclabel = o;
                                    $('#glccontent').html(con);

                                }
                                else if (group == 'gle') {
                                    App.glelabel = o;
                                    $('#glecontent').html(con);

                                }
                                else if (group == 'gles') {
                                    App.gleslabel = o;
                                    $('#glescontent').html(con);

                                }
                                else {
                                    App.glslabel = o;
                                    $('#glscontent').html(con);

                                }
                                $(".rankpicurl").each(function () {
                                    if (($._data($(this)[0], "events") || $.data($(this)[0], "events")) == undefined) {
                                        $(this).click(function () {

                                            App.rankvotecount = $(this).parent().next().next().children()[1];  ///获取票数
                                            var image = new Image();
                                            image.onload = function () {
                                                var a = 1;
                                                if (this.naturalWidth < this.naturalHeight) {

                                                    setLoc([
                                                                        { 'ui': '.myprodiv', 'w': 396, 'h': 705, 'top': 172, 'left': 2 },
                                                    ]);
                                                }
                                                else {

                                                    setLoc([

                                                                         { 'ui': '.myprodiv', 'w': 595, 'h': 401, 'top': 269, 'left': 2 },
                                                    ]);
                                                }
                                            }
                                            image.src = $($(this).parent().next().children()).attr('datapicid');
                                            $("#mypropic").attr("src", $($(this).parent().next().children()).attr('datapicid').replace('uploadFilezoom', 'uploadFile'));
                                            $(".username").text($($(this).parent().next().children()).attr('datanameid'));
                                            $(".votenum").text(App.rankvotecount.innerHTML);
                                            App.picopenid = $($(this).parent().next().children()).attr('dataopenid');
                                            //App.votecount = $($(this).parent().next().children()).attr('datanum');
                                            App.group = group;
                                            $("#myproreturn2").show();
                                            $("#myproreturn").hide();
                                            $('#rankpage2, #mypropage').fadeToggle('slow'); //前消失，后呈现
                                        });

                                    }

                                });
                            }



                        })

                    }


                    function getvotebyopenid() {
                        $.ajax({
                            type: "post",
                            url: "/Benz/Benz/GetBenzVoteCountbyopenid",
                            cache: false,
                            data: {
                            },
                            datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
                            success: function (data) {
                                $(".votenum").text(data[0].voteNamecount);
                            }
                        })

                    }

                    ///用户投票方法



                    ////验证手机号
                    function checkPhone(str) {
                        var re = /^1\d{10}$/
                        if (re.test(str)) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    ////初始化省份
                    function initpro() {
                        var p = getdealerinfo(0);
                        //App.pro = '';
                        App.pro += '<option selected>请选择</option >';
                        for (var i = 0; i < p.length; i++) {
                            App.pro += '<option data-id=' + p[i].OwnID + ' value="' + p[i].OwnName + '">' + p[i].OwnName + '</option> ';
                        }
                        $("#province").html(App.pro);
                        //$("#province2").html(App.pro);
                    }
                    /***************************************内部函数********************************************/
                    $(function () {
                        ////初始化UI，这里w，h，top，left都指的是原始界面当中的大小及位置
                        setLoc([
                            { 'ui': '.p1t', 'w': 561, 'h': 195, 'top': 205, 'left': 2 },
                            { 'ui': '.p2v', 'w': 580, 'h': 325, 'top': 200, 'left': 2 },///left 2代表中间没有具体的偏移量
                            { 'ui': '.p2v2', 'w': 580, 'h': 30, 'top': 565, 'left': 2 },///left 2代表中间没有具体的偏移量 *1.5 23px
                            { 'ui': '.p2t', 'w': 419, 'h': 243, 'top': 588, 'left': 2 },
                            { 'ui': '.p2font1', 'w': 291, 'h': 73, 'top': 645, 'left': 2 },
                            { 'ui': '.p2font2', 'w': 291, 'h': 69, 'top': 742, 'left': 2 },
                            //{ 'ui': '.p2font21', 'w': 291, 'h': 69, 'top': 742, 'left': 2 },
                            //joined
                            //{ 'ui': '#joined', 'w': 640, 'h': 1136, 'top': 0, 'left': 2 },
                            { 'ui': '.p2font3', 'w': 291, 'h': 71, 'top': 839, 'left': 2 },
                            { 'ui': '.p2font4', 'w': 291, 'h': 35, 'top': 935, 'left': 2 },
                            { 'ui': '.myproi', 'w': 400, 'h': 105, 'top': 865, 'left': 2 },
                            { 'ui': '.myprodiv', 'w': 380, 'h': 668, 'top': 155, 'left': 2 },
                            { 'ui': '.jointable', 'w': 550, 'h': 790, 'top': 185, 'left': 2 },
                            { 'ui': '.rank2div', 'w': 550, 'h': 790, 'top': 185, 'left': 2 },
                            { 'ui': '.loadingcemara', 'w': 148, 'h': 123, 'top': 406, 'left': 2 },
                            { 'ui': '.group', 'w': 611, 'h': 857, 'top': 128, 'left': 2 },
                            { 'ui': '.joindiv2', 'w': 550, 'h': 73, 'top': 980, 'left': 2 },
                            { 'ui': '.rulediv', 'w': 645, 'h': 948, 'top': 26, 'left': 2 },///*1.2    548  790 184
                            { 'ui': '.picdiv', 'w': 396, 'h': 705, 'top': 172, 'left': 2 },
                        ]);
                        /****************************************排行榜TAB********************************************/

                        $('div.tab-content').children('div:gt(0)').hide();
                        $('a').attr('hidefocus', 'true');
                        ///TAB点击
                        $("#gla").click(function () {
                            $("#glacontent").show();
                            getvote('gla');
                            $('#rankpage,#rankpage2').fadeToggle('fast');
                            $($('div.tab-title ul li')[0]).addClass('current').siblings('li[class="current"]').removeClass('current');
                            $('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[0]).index('div.tab-title ul li') + ')')
                                .show().siblings('div').hide();
                        });
                        //$("#gla2").click(function () {
                        //    getvote('gla');
                        //    if (App.glalabel == null || App.glalabel == 0 || App.glalabel == undefined) {
                        //        $("#glccontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glacontent").show();
                        //        getvote('gla');
                        //    }
                        //    else {
                        //        $("#glccontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glacontent").show();
                        //    }
                        //    $($('div.tab-title ul li')[0]).addClass('current').siblings('li[class="current"]').removeClass('current');
                        //    //$('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[0]).index('div.tab-title ul li') + ')')
                        //    //    .show().siblings('div').hide();
                        //});
                        $("#glc").click(function () {
                            $("#glccontent").show();
                            getvote('glc');
                            $('#rankpage,#rankpage2').fadeToggle('fast');
                            $($('div.tab-title ul li')[1]).addClass('current').siblings('li[class="current"]').removeClass('current');
                            $('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[1]).index('div.tab-title ul li') + ')')
                                .show().siblings('div').hide();
                        });
                        //$("#glc2").click(function () {
                        //    getvote('glc');
                        //    if (App.glclabel == null || App.glclabel == 0 || App.glclabel == undefined) {
                        //        $("#glacontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glccontent").show();
                        //        getvote('glc');
                        //    }
                        //    else {
                        //        $("#glacontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glccontent").show();
                        //    }
                        //    $($('div.tab-title ul li')[1]).addClass('current').siblings('li[class="current"]').removeClass('current');
                        //    //$('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[1]).index('div.tab-title ul li') + ')')
                        //    //    .show().siblings('div').hide();
                        //});

                        $("#gle").click(function () {
                            $("#glecontent").show();
                            getvote('gle');
                            $('#rankpage,#rankpage2').fadeToggle('fast');
                            $($('div.tab-title ul li')[2]).addClass('current').siblings('li[class="current"]').removeClass('current');
                            $('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[2]).index('div.tab-title ul li') + ')')
                                .show().siblings('div').hide();
                        });
                        //$("#gle2").click(function () {
                        //    getvote('gle');
                        //    if (App.glelabel == null || App.glelabel == 0 || App.glelabel == undefined) {
                        //        $("#glacontent").hide();
                        //        $("#glccontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glecontent").show();
                        //        getvote('gle');
                        //    }
                        //    else {
                        //        $("#glacontent").hide();
                        //        $("#glccontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glecontent").show();
                        //    }
                        //    $($('div.tab-title ul li')[2]).addClass('current').siblings('li[class="current"]').removeClass('current');
                        //    //$('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[2]).index('div.tab-title ul li') + ')')
                        //    //    .show().siblings('div').hide();
                        //});
                        $("#gles").click(function () {
                            $("#glescontent").show();
                            getvote('gles');
                            $('#rankpage,#rankpage2').fadeToggle('fast');
                            $($('div.tab-title ul li')[3]).addClass('current').siblings('li[class="current"]').removeClass('current');
                            $('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[3]).index('div.tab-title ul li') + ')')
                                .show().siblings('div').hide();
                        });
                        //$("#gles2").click(function () {
                        //    getvote('gles');
                        //    if (App.gleslabel == null || App.gleslabel == 0 || App.gleslabel == undefined) {
                        //        $("#glacontent").hide();
                        //        $("#glccontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glescontent").show();
                        //        getvote('gles');
                        //    }
                        //    else {
                        //        $("#glacontent").hide();
                        //        $("#glccontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glscontent").hide();
                        //        $("#glescontent").show();

                        //    }
                        //    $($('div.tab-title ul li')[3]).addClass('current').siblings('li[class="current"]').removeClass('current');
                        //    //$('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[3]).index('div.tab-title ul li') + ')')
                        //    //    .show().siblings('div').hide();
                        //});
                        $("#gls").click(function () {
                            $("#glscontent").show();
                            getvote('gls');
                            $('#rankpage,#rankpage2').fadeToggle('fast');
                            $($('div.tab-title ul li')[4]).addClass('current').siblings('li[class="current"]').removeClass('current');
                            $('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[4]).index('div.tab-title ul li') + ')')
                                .show().siblings('div').hide();
                        });
                        //$("#gls2").click(function () {
                        //    getvote('gls');
                        //    if (App.glslabel == null || App.glslabel == 0 || App.glslabel == undefined) {
                        //        $("#glacontent").hide();
                        //        $("#glccontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").show();
                        //        getvote('gls');
                        //    }
                        //    else {
                        //        $("#glacontent").hide();
                        //        $("#glccontent").hide();
                        //        $("#glecontent").hide();
                        //        $("#glescontent").hide();
                        //        $("#glscontent").show();
                        //    }
                        //    $($('div.tab-title ul li')[4]).addClass('current').siblings('li[class="current"]').removeClass('current');
                        //    //$('div.tab-content').children('div:eq(' + $($('div.tab-title ul li')[4]).index('div.tab-title ul li') + ')')
                        //    //    .show().siblings('div').hide();
                        //});
                        //$('div.tab-title ul li').click(function () {
                        //    getvote();
                        //    $(this).addClass('current').siblings('li[class="current"]').removeClass('current');
                        //    $('div.tab-content').children('div:eq(' + $(this).index('div.tab-title ul li') + ')')
                        //        .show().siblings('div').hide();
                        //});


                        ///点击图片跳转至作品页
                        /****************************************排行榜TAB********************************************/





                        /****************************************填写信息页********************************************/
                        initpro();
                        ////监听省份选择
                        $("#province").change(function () {
                            App.city = "";
                            App.dealer = "";
                            App.city += '<option selected>请选择</option >';
                            App.dealer += '<option selected>请选择</option >';
                            //$("#dealer").html("");
                            var c = getdealerinfo($("#province option:selected").attr("data-id"));
                            for (var i = 0; i < c.length; i++) {
                                if (c[i].ParentID == $("#province option:selected").attr("data-id")) {
                                    App.city += '<option data-id=' + c[i].OwnID + ' value="' + c[i].OwnName + '">' + c[i].OwnName + '</option> ';
                                }
                            }
                            $("#city").html(App.city);
                        });

                        $("#province2").change(function () {
                            App.city = "";
                            App.dealer = "";
                            //App.city += '<option selected>常州</option >';
                            $("#dealer2").html("");
                            var c = getdealerinfo($("#province2 option:selected").attr("data-id"));
                            for (var i = 0; i < c.length; i++) {
                                if (c[i].ParentID == $("#province2 option:selected").attr("data-id")) {
                                    App.city += '<option data-id=' + c[i].OwnID + ' value="' + c[i].OwnName + '">' + c[i].OwnName + '</option> ';
                                }
                            }
                            $("#city2").html(App.city);

                            var d = getdealerinfo($("#city2 option:selected").attr("data-id"));
                            for (var i = 0; i < d.length; i++) {
                                if (d[i].ParentID == $("#city2 option:selected").attr("data-id")) {
                                    App.dealer += d[i].OwnName + "\n地址:" + d[i].DisAddress + "\n总机:" + d[i].Phone + "\n\n";
                                }
                            }
                            $("#dealer2").html(App.dealer);



                        });

                        ////监听城市选择
                        $("#city").change(function () {
                            App.dealer = "";
                            App.dealer += '<option selected>请选择</option >';
                            var d = getdealerinfo($("#city option:selected").attr("data-id"));
                            for (var i = 0; i < d.length; i++) {
                                if (d[i].ParentID == $("#city option:selected").attr("data-id")) {
                                    App.dealer += '<option  data-id=' + d[i].OwnID + ' value="' + d[i].OwnName + '">' + d[i].OwnName + '</option> ';
                                }
                            }
                            $("#dealer").html(App.dealer);
                        });
                        $("#city2").change(function () {
                            App.dealer = "";
                            var d = getdealerinfo($("#city2 option:selected").attr("data-id"));
                            for (var i = 0; i < d.length; i++) {
                                if (d[i].ParentID == $("#city2 option:selected").attr("data-id")) {
                                    App.dealer += d[i].OwnName + "\n地址:" + d[i].DisAddress + "\n总机:" + d[i].Phone + "\n\n";
                                }
                            }
                            $("#dealer2").html(App.dealer);

                        });



                        ////旋转图片
                        $('#xz').click(function () {
                            App.xz++;
                            $('#cszp').css('-webkit-transform', 'rotate(' + 90 * App.xz + 'deg)')
                            //$('#pic').css('-webkit-transform', 'rotate(' + 90 * App.xz + 'deg)')
                            if (App.xz == 4) {
                                App.xz = 0;
                            }
                        });
                        ////保存图片
                        $('#picsubmit').click(function () {
                            if ($("#cszp").attr('src') == null || $("#cszp").attr('src') == undefined || $("#cszp").attr('src') == "" || $("#cszp").attr('src') == "../../Areas/Benz/img/isupdate.jpg") {
                                alert("未找到参赛作品");
                                return;
                            }
                            $("#loadinggif").show();
                            $.ajax({
                                //提交数据的类型 POST GET
                                type: "POST",
                                //提交的网址
                                url: "/Benz/Benz/UploadImg",
                                cache: false,
                                //提交的数据
                                data: {
                                    imgbase64: img,
                                    rotate: App.xz,
                                    w: App.imgw,
                                    h: App.imgh,
                                },
                                //返回数据的格式
                                datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".


                                //成功返回之后调用的函数
                                success: function (data) {
                                    if (data != null) {
                                        $("#tips2").text("");
                                        $("#tips2").text("上传成功");
                                        $('#joinpage, #submitpicpage').fadeToggle('fast'); //前消失，后呈现
                                        $("#tips2").text("");
                                        $("#tips").text("");
                                        $("#loadinggif").hide();
                                        App.imgurl = data;
                                        App.updatepic = $("#pic").attr("src", "/Areas/benz/uploadFile/" + data);///把这里改成服务器图片的地址
                                        // App.updatepic = $("#pic").attr("src", data);
                                        App.isupdatepic = true;
                                        //$("#cszp").attr("src", img);
                                        //$("#cszp").hide().attr("src", "");
                                        //$("#UpLoadForm").show();
                                        //$(".picdiv").css("border", " 2px solid #e0e0e0");
                                        $("#picPath").val('');
                                        $("#pic").show();
                                    }
                                },

                                //调用出错执行的函数
                                error: function (e) {
                                    //$("#tips2").text("只能上传jpg或png格式图片");
                                }
                            });
                        });


                        /****************************************填写信息页********************************************/


                    });
                }
            }
        }

    }
}


//预加载之前
var loadimg = [
        'loadingback.png',
        'loadingcemara.png',
        'logo.png',
        'crossscreen.png',
]
var imgc = (function () {
    var initalnum = 0;
    return {
        addOne: function () {
            initalnum++;
            return initalnum;
        }
    }
})();
for (i = 0; i < loadimg.length; i++) {
    img = new Image();
    img.src = "../../Areas/benz/img/" + loadimg[i];
    img.onload = function () {
        ////图片加载完毕
        var imgnum = imgc.addOne();
        if (imgnum == loadimg.length) {
            ///loading的div出现
            $(".loading").show();
            $(".loading_div").show();
            $(".loadingline2").show();
            $(".loadingcemara").show();
            $(".loadingline").show();
            ////初始化主函数
            var load = new Load();
        }
    }
}

/***************************************横屏监视********************************************/
var ishp = true;
function orientationChange() {
    switch (window.orientation) {
        ////正常
        case 0:
            $('.p2v').show();
            $(".hpts").hide();
            if (ishp) {
                ishp = false;
                var load = new Load();
            }
            App.ishpp = false;
            break;
            ////倒过来
        case 180:
            $('.p2v').show();
            App.ishpp = false;
            $(".hpts").hide();
            if (ishp) {
                ishp = false;
                var load = new Load();
            }
            break;
            ////右转
        case -90:
            $('.p2v').hide();
            App.ishpp = true;
            ishp = false;
            $(".hpts").show();
            $(".crossscreen").css({
                "top": (document.documentElement.clientHeight - 100) / 2 + "px"
            });
            break;
            ////左转
        case 90:
            $('.p2v').hide();
            $(".hpts").show();
            App.ishpp = true;
            ishp = false;
            $(".crossscreen").css({
                "top": (document.documentElement.clientHeight - 100) / 2 + "px"
            });
            break;
    }
}
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationChange, false);
////横屏状态
if (document.documentElement.clientHeight < document.documentElement.clientWidth) {
    $(".hpts").show();
    $(".crossscreen").css({
        "top": (document.documentElement.clientHeight - 100) / 2 + "px"
    });
    ishp = true;
    App.ishpp = true;
}
    ////竖屏状态
else {
    App.ishpp = false;
    //ishp = false;
    //var load = new Load();
    //$(".loading").show();
    //var img3 = new Image();
    //img3.src = "img/loadmain.png";
    //img3.onload = function () {
    //    var load = new Load();
    //    $('#loading_img').show();
    //}
}
/***************************************横屏监视********************************************/



