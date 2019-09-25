/*******************************************全局变量******************************************/
var App = {
    height: document.documentElement.clientHeight,//浏览器高度
    globalH: 1136,//原始高度
    nowW: 640,//当前宽度
    ishd: true,
    isIphone: navigator.userAgent.toLowerCase().indexOf('iphone') >= 0,////是否是IPhone
    videoout: 0,////监听video长度和已缓存长度是否正常 >40s时放弃下载缓存，继续往下进行
    ishpp: false,
    vd: 0,
    indexmuisc: document.getElementById('mkf'),//首页音乐ymjmusic
    ymjmuisc: document.getElementById('ymjmusic'),//首页音乐
    jlsmuisc: document.getElementById('jlsmusic'),//首页音乐ymjmusic
    yd: true,
    scyd: true,////首次摇动
    agr: false,//是否同意隐私条款
}
/*******************************************全局变量******************************************/
/*******************************************内部函数******************************************/
////设置UI显示比例和位置
function setLoc(loclist, ww) {
    App.nowW = ww;
    for (var i = 0; i < loclist.length; i++) {
        $(loclist[i].ui).css({
            "width": App.height * loclist[i].w / App.globalH + "px",
            "height": App.height * loclist[i].h / App.globalH + "px",
            "top": App.height * loclist[i].top / App.globalH + "px",
            "left": (App.nowW - App.height * loclist[i].w / App.globalH) / loclist[i].left + "px"
        });
    }
}
////初始滚动条在屏幕顶端
function InitScroll() {
    window.scrollTo(0, 0);
}
////验证手机号
function checkPhone(str) {
    var re = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
////验证邮箱
function checkemail(input) {
    var re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!re.test(input)) {
        return false;
    }
    else {
        return true;
    }
}
var hd = true;
////禁止滑动
function mousemove(e) {
    if (hd) {
        e.preventDefault();
    }

}
////初始化
function Init() {
    $('.sy').show();
    /*翻页*/
    swiper = new Swiper('.sy', {
        direction: 'vertical',
        allowSwipeToPrev: false,
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 0,
        mousewheelControl: true,
        onSlideChangeEnd: function (swiper) {

            //初始化页面动画元素
            // AnimationInitial();

            switch (swiper.activeIndex) {
                case 0:

                    break;
                case 1:
                    $('.online_index_video').remove();
                    App.indexmuisc.pause();
                    $('.online_index_mkf').removeClass('online_index_mkf_sd');
                    clearInterval(indexm);
                    $('.online_yd_ydm').show();
                    swiper.lockSwipeToNext();
                    YYY();
                    break;

            }
        }
    });
    video = new tvp.VideoInfo();
    //向视频对象传入视频vid
    video.setVid("b0308dpvmqx");

    player = new tvp.Player(585, 332);
    //设置播放器初始化时加载的视频
    player.setCurVideo(video);
    player.addParam("showend", 0)//结束画面是否有广告画面，或者是该视频本身结束
    player.addParam("adplay", 0)//是否播放广告；1播放，0不播放，默认为1
    player.addParam("autoplay", 0)//是否自动播放；1自动播放，0不自动播放，默认是1
    player.addParam("type", "0");//设置播放器为直播状态，1表示直播，2表示点播，默认为2

    player.onended = function () {
        //player.play('i0308cn3e8k');
    };
    //输出播放器
    player.write("online_index_video_m");

    ////设置UI位置
    setLoc([
    { 'ui': '.online_yd_ckxq_txt', 'w': 288, 'h': 88, 'top': 600, 'left': 2 },
    { 'ui': '.online_yd_ckxq_txt_jdy', 'w': 456, 'h': 55, 'top': 600, 'left': 2 },
    { 'ui': '.online_yd_ckxq_audio', 'w': 362, 'h': 199, 'top': 743, 'left': 2 },
    { 'ui': '.online_yd_ckxq_audio1', 'w': 362, 'h': 199, 'top': 743, 'left': 2 },
    { 'ui': '.online_yd_ckxq_audio_bf', 'w': 128, 'h': 128, 'top': 749, 'left': 2 },
    { 'ui': '.online_yd_wzdp_dt', 'w': 151, 'h': 621, 'top': 62, 'left': 2 },
    { 'ui': '.online_yd_wzdp_dt1', 'w': 178, 'h': 593, 'top': 62, 'left': 2 },
    //{ 'ui': '#online_yd_wzdp_xtymj', 'w': 171, 'h': 621, 'top': 62, 'left': 2 },
    //{ 'ui': '.online_yd_wzdp_xt_xx_rq', 'w': 585, 'h': 647, 'top': 180, 'left': 2 },
    //{ 'ui': '.online_yd_yyxddp_js', 'w': 426, 'h': 749, 'top': 50, 'left': 2 },
    //{ 'ui': '.online_yd_yyxddp_js1', 'w': 329, 'h': 751, 'top': 50, 'left': 2 },
    { 'ui': '.online_yd_fx', 'w': 487, 'h': 892, 'top': 36, 'left': 2 },
    { 'ui': '.online_index_hdgz_m', 'w': 535, 'h': 889, 'top': 150, 'left': 2 },
    { 'ui': '.logo', 'w': 264, 'h': 75, 'top': 50, 'left': 2 },
    ], 585);
    setLoc([
    { 'ui': '.online_yd_fx', 'w': 487, 'h': 892, 'top': 100, 'left': 2 },
    ], 640);
    $('.sy').css('height', App.height + 'px');
    ////播放首页音乐
    if (App.indexmuisc.paused) {
        App.indexmuisc.play();
        $('.online_index_mkf').addClass('online_index_mkf_sd');
    }
    indexm = setInterval(function () {
        if (App.indexmuisc.ended) {
            $('.online_index_mkf').removeClass('online_index_mkf_sd');
        }
    }, 1000);
};
////摇一摇
function YYY() {
    var SHAKE_THRESHOLD = 1500;
    var last_update = 0;
    page = 2;
    pageid = 0;
    var x = y = z = last_x = last_y = last_z = 0;
    function init() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            alert('当前设备不支持摇一摇');
        }
    }
    function deviceMotionHandler(eventData) {
        var acceleration = eventData.accelerationIncludingGravity;
        var curTime = new Date().getTime();
        if ((curTime - last_update) > 100) {
            var diffTime = curTime - last_update;
            last_update = curTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
            ////摇动手机代码
            if ((speed > SHAKE_THRESHOLD) && App.yd) {
                pageid = 0;
                _czc.push(['_trackEvent', '摇一摇', '按钮']);
                if (App.scyd) {
                    App.yd = false;
                    App.scyd = false;
                    page == 2 && (page = 1) || (page = 2);
                    $('#online_yd').css({
                        "background": "url(../img/yd_bg" + page + ".jpg) no-repeat",
                        "background-size": "100% 100%"
                    });
                    $('.online_yd_ydm').hide();
                    $('.online_yd_ydwz').hide();
                    $('.online_yd_xccp').css({
                        "background": "url(../img/yd_xl" + page + ".png) no-repeat",
                        "background-size": "100% 100%"
                    });
                    $('.online_yd_xc').show();
                    $('.online_yd_zyyc').show();
                    d();
                    setTimeout(function () { App.yd = true; }, 500);
                }
                else {
                    page == 2 && (page = 1) || (page = 2);
                    $('.online_yd_xc').hide();
                    App.yd = false;
                    setTimeout(function () {
                        App.yd = true;
                        $('#online_yd').css({
                            "background": "url(../img/yd_bg" + page + ".jpg) no-repeat",
                            "background-size": "100% 100%"
                        });
                        $('.online_yd_xccp').css({
                            "background": "url(../img/yd_xl" + page + ".png) no-repeat",
                            "background-size": "100% 100%"
                        });

                        $('.online_yd_xc').show();
                    }, 500);
                }

            }
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }
    init();
    function d() {
        dd = setInterval(function () {
            if (App.yd && pageid == 2) {
                App.yd = false;
                clearInterval(dd);
                $('.online_yd_xc').hide();
                $('.online_yd_zyyc').hide();
                if (page == 1) {
                    $('#ymjxq').show();
                }
                else {
                    $('#jdyxq').show();
                }
            }
            pageid++;

        }, 1000);
    }

}
/*******************************************内部函数******************************************/
/*******************************************预加载图片******************************************/
var completed = 0, total = $('section img').length;

/* 接下来我们处理图片预加载，并且和进度有序的组织起来 */
$('section').imagesLoaded().done(function (instance) {
    setTimeout(function () {
        $('.loading').remove();
        Init();
    }, 500);
}).progress(function (instance, image) {
    completed++; //添加计数器
    var imgprogress = completed / total; //生成进度数值
    $(".load_jd").text(parseInt(imgprogress * 100) + "%");
});
/*******************************************预加载图片******************************************/
/*******************************************事件注册******************************************/
////播放视频
$('.online_index_btn').click(function () {
    $('.online_index_video').show();
    App.indexmuisc.pause();
    $('.online_index_mkf').removeClass('online_index_mkf_sd');
    document.addEventListener("touchmove",
                         function (e) {
                             mousemove(e)
                         });
    _czc.push(['_trackEvent', '播放视频', '播放']);

});
////关闭视频页
$('.online_index_video_close').click(function () {
    $(this).parent().hide();
    player.pause();
    _czc.push(['_trackEvent', '关闭视频页', '按钮']);
});

/*******************************************事件注册******************************************/
/*******************************************测试******************************************/
//////模拟摇一摇
//$('.online_yd_ydm').on('touchend',function () {
//    $(this).hide();
//    $('.online_yd_ydwz').hide();
//    $('.online_yd_xc').show();
//    $('.online_yd_zyyc').show();
//});
////查看产品详情
//$('.online_yd_xccp').click(function () {
//    $(this).parent().hide();
//    $('.online_yd_zyyc').hide();
//    if (page == 1) {
//        $('#ymjxq').show();
//    }
//    else {
//        $('#jdyxq').show();
//    }
//});
//查看完整单品
$('.online_yd_ckxq_b2').click(function () {
    _czc.push(['_trackEvent', '查看完整单品', '按钮']);
    if (page == 1) {
        $('#ymjdp').show();
        var swiper2 = new Swiper('#online_yd_wzdp_xtymj', {
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            slidesPerView: 3,
            initialSlide: 2,
            centeredSlides: true,
        });
    }
    else {
        $('#jdydp').show();
        var swiper4 = new Swiper('#online_yd_wzdp_xtjdy', {
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            slidesPerView: 3,
            initialSlide: 2,
            centeredSlides: true,
        });
    }
    $(this).parent().hide();


});
var swipe3 = null;
////牙买加
$('.online_yd_wzdp_xtl').click(function () {
    var index = $(this).attr('data-id');
    $('#ymjdp').hide();
    $('#ymjdt').show();
    if (swipe3 == null) {
        swipe3 = new Swiper('#online_yd_wzdp_xt_xx_rq_ymj', {
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            slidesPerView: 1,
            centeredSlides: true,

            onSlideChangeEnd: function (swipe3) {

                //初始化页面动画元素
                // AnimationInitial();

                switch (swipe3.activeIndex) {
                    case 0:
                        _czc.push(['_trackEvent', '牙买加单品-缎面夹克', '浏览']);
                        break;
                    case 1:
                        _czc.push(['_trackEvent', '牙买加单品-衬衫式外套', '浏览']);
                        break;
                    case 2:
                        _czc.push(['_trackEvent', '牙买加单品-棉质衬衫', '浏览']);
                        break;
                    case 3:
                        _czc.push(['_trackEvent', '牙买加单品-包', '浏览']);
                        break;
                    case 4:
                        _czc.push(['_trackEvent', '牙买加单品-鞋', '浏览']);
                        break;
                }
            }
        });
        swipe3.slideTo(index, 1000, false);//切换到第一个slide，速度为1秒
    }
    else {
        swipe3.slideTo(index, 1000, false);//切换到第一个slide，速度为1秒
    }
});
var swipe6 = null;
////军大衣
$('.online_yd_wzdp_xt2').click(function () {
    var index = $(this).attr('data-id');
    $('#jdydp').hide();
    $('#jdydt').show();
    if (swipe6 == null) {
        swipe6 = new Swiper('#online_yd_wzdp_xt_xx_rq_jdy', {
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            slidesPerView: 1,
            centeredSlides: true,
            onSlideChangeEnd: function (swipe6) {

                //初始化页面动画元素
                // AnimationInitial();

                switch (swipe6.activeIndex) {
                    case 0:
                        _czc.push(['_trackEvent', '军绿色单品-蝴蝶夹克', '浏览']);
                        break;
                    case 1:
                        _czc.push(['_trackEvent', '军绿色单品-防风外套', '浏览']);
                        break;
                    case 2:
                        _czc.push(['_trackEvent', '军绿色单品-衬衫式外套', '浏览']);
                        break;
                    case 3:
                        _czc.push(['_trackEvent', '军绿色单品-衬衫蝴蝶', '浏览']);
                        break;
                    case 4:
                        _czc.push(['_trackEvent', '军绿色单品-双肩包', '浏览']);
                        break;
                    case 5:
                        _czc.push(['_trackEvent', '军绿色单品-鞋', '浏览']);
                        break;
                }
            }
        });
        swipe6.slideTo(index, 1000, false);//切换到第一个slide，速度为1秒
    }
    else {
        swipe6.slideTo(index, 1000, false);//切换到第一个slide，速度为1秒
    }
});
////返回杨洋牙买加
$('.online_yd_wzdp_xt_xx_close').click(function () {
    $(this).parent().hide();
    if (page == 1) {
        $('#ymjdp').show();
    }
    else {
        $('#jdydp').show();
    }
});
////查看杨洋心动单品
$('.online_yd_ckxq_b1').click(function () {
    _czc.push(['_trackEvent', '查看杨洋心动单品', '按钮']);
    $(this).parent().hide();
    $('.online_yd_yyxddp').show();
    $('.online_yd_yyxddp_js1').hide();
    $('.online_yd_yyxddp_js').show();
    if (page == 1) {

        swipe16 = new Swiper('.online_yd_yyxddp_js', {
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            slidesPerView: 1,
            centeredSlides: true,
            onSlideChangeEnd: function (swipe16) {

                //初始化页面动画元素
                // AnimationInitial();

                switch (swipe16.activeIndex) {
                    case 0:
                        _czc.push(['_trackEvent', '牙买加心动单品-衬衫式外套', '浏览']);
                        break;
                    case 1:
                        _czc.push(['_trackEvent', '牙买加心动单品-鞋', '浏览']);
                        break;
                }
            }
        });
    }
    else {
        $('.online_yd_yyxddp_js1').show();
        $('.online_yd_yyxddp_js').hide();
        _czc.push(['_trackEvent', '军绿色心动单品-蝴蝶夹克', '浏览']);
    }

});
////查看完整单品
$('.online_yd_yyxddp_btn').click(function () {
    _czc.push(['_trackEvent', '查看完整单品', '按钮']);
    $(this).parent().hide();
    if (page == 1) {
        $('#ymjdp').show();
        var swiper2 = new Swiper('#online_yd_wzdp_xtymj', {
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            slidesPerView: 3,
            initialSlide: 2,
            centeredSlides: true,
        });
    }
    else {
        $('#jdydp').show();
        var swiper4 = new Swiper('#online_yd_wzdp_xtjdy', {
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            slidesPerView: 3,
            initialSlide: 2,
            centeredSlides: true,
        });
    }
});
////查看其它系列
$('.online_yd_wzdp_qtxl').click(function () {
    $(this).parent().hide();
    App.yd = true;
    App.scyd = true;
    $('.online_yd_ydm').show();
    $('.online_yd_ydwz').show();
    App.yd = true;
    App.ymjmuisc.pause();
    App.jlsmuisc.pause();
    _czc.push(['_trackEvent', '查看其它系列', '按钮']);

});
////分享
$('.online_yd_wzdp_xt_xx_btn').click(function () {
    $(this).parent().hide();
    $('.online_yd_fx').show();
    _czc.push(['_trackEvent', '分享', '按钮']);
});
////播放音乐
$('.online_index_mkf').click(function () {
    if (App.indexmuisc.paused) {
        App.indexmuisc.currentTime = 0;
        App.indexmuisc.play();
        $('.online_index_mkf').addClass('online_index_mkf_sd');
      
    }
    else {
        App.indexmuisc.pause();
        $('.online_index_mkf').removeClass('online_index_mkf_sd');
    }
    _czc.push(['_trackEvent', '首页音乐', '按钮']);
});
$('#online_yd_ckxq_audio_bf_ymj').click(function () {
    if (App.ymjmuisc.paused) {
        $('#online_yd_ckxq_audio_bf_ymj').addClass('online_index_mkf_sd');
        App.ymjmuisc.currentTime = 0;
        App.ymjmuisc.play();
    }
    else {
        $('#online_yd_ckxq_audio_bf_ymj').removeClass('online_index_mkf_sd');
        App.ymjmuisc.currentTime = 0;
        App.ymjmuisc.pause();
    }
    _czc.push(['_trackEvent', '牙买加音乐', '按钮']);
});
$('#online_yd_ckxq_audio_bf_jls').click(function () {
    if (App.jlsmuisc.paused) {
        $('#online_yd_ckxq_audio_bf_jls').addClass('online_index_mkf_sd');
        App.jlsmuisc.currentTime = 0;
        App.jlsmuisc.play();
    }
    else {
        $('#online_yd_ckxq_audio_bf_jls').removeClass('online_index_mkf_sd');
        App.jlsmuisc.currentTime = 0;
        App.jlsmuisc.pause();
    }
    _czc.push(['_trackEvent', '军绿色音乐', '按钮']);
});
$('.online_index_btn1').click(function () {
    $('.online_index_hdgz').show();
    document.addEventListener("touchmove",
                        function (e) {
                            mousemove(e)
                        });
    _czc.push(['_trackEvent', '活动规则', '按钮']);
});
////赢取心动单品
$('.online_yd_wzdp_xdlp').click(function () {
    _czc.push(['_trackEvent', '赢取心动单品', '按钮']);
    $(this).parent().hide();
    $('.online_tjxx').show().css('height', App.height * 0.95 + 'px');
    swiper.unlockSwipeToNext();
});
////同意隐私条款
$('.online_tjxx_tk_dh').click(function () {
    if (!App.agr) {
        App.agr = true;
        $(this).html('✓');
    }
    else {
        App.agr = false;
        $(this).html('');
    }
    _czc.push(['_trackEvent', '同意隐私条款', '按钮']);

});
////提交信息
var kg = true;
$('.online_tjxx_sub').click(function () {

    if (!kg) {
        return;
    }
    kg = false;
    ////验证姓名
    if ($('#name').val() == '') {
        alert('请输入您的姓名');
        kg = true;
        return;
    }
    ////验证手机号
    if (!checkPhone($('#tel').val())) {
        alert('请输入正确的手机号');
        kg = true;
        return;
    }
    ////验证邮箱
    if (!checkemail($('#email').val())) {
        alert('请输入正确的邮箱');
        kg = true;
        return;
    }
    if (!App.agr) {
        alert('未同意活动规则');
        kg = true;
        return;
    }
    $.ajax({
        //提交数据的类型 POST GET
        type: "POST",
        //提交的网址
        url: "Action/HLTN.ashx",
        async: false,
        cache: false,
        //提交的数据
        data: {
            name: $('#name').val(),
            sex: $('#sex').val(),
            tel: $('#tel').val(),
            email: $('#email').val(),
        },
        //返回数据的格式
        datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".


        //成功返回之后调用的函数
        success: function (data) {
            kg = true;
            if (data) {
                $('.online_tjxx_cg').show();
                setTimeout(function () {
                    $('.online_tjxx').hide();
                    $('.online_tjxx_cg').hide();
                    $('.online_yd_fx').show();
                    swiper.lockSwipeToNext();
                }, 3000);
            }
            else {
                alert("请重试！");
            }

        },

        //调用出错执行的函数
        error: function (e) {
            kg = true;
            alert('服务器繁忙！');
        }
    });
});

$('#sex').change(function () {
    $('#sexc').val($(this).val());
});

/*******************************************测试******************************************/
