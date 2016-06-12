$(function(){
    var video=document.getElementById('player');    //视频主体
    var $videoBtn=$('.bottomBtn');                  //播放器控件主体
    var $playStopBtn=$('.playStopBtn');             //播放/暂停按钮
    var $videoBox=$('.videoBox');                   //播放器主体
    var $videoLine=$('.videoLine');                 //进度条
    var $videoDrag=$('.videoDrag');                 //进度条拖动按钮
    var $fullScreen=$('.fullScreen');               //全屏按钮
    // 视频播放控件显示隐藏
    $videoBox.hover(function(){
        var timer1=setTimeout(function(){
            clearTimeout(timer1)
            $videoBtn.animate({
                bottom:'0px'
            },400)
        },200)
    },function(){
        var timer1=setTimeout(function(){
            clearTimeout(timer1)
            $videoBtn.animate({
                bottom:'-50px'
            },400)
        },200)
    });
    // 视频播放暂停
    function playStop(){
        if(video.paused){
            video.play();
            $(this).html('stop');
        }else{
            video.pause();
            $(this).html('play');
        }
    }
    $playStopBtn.bind('click',playStop);
    $(video).bind('play',function(){
        clearInterval(timer1);
        var timer1=setInterval(function(){
            var currTime=video.currentTime/video.duration;     //当前播放百分比
            $videoDrag.width(+$videoLine.width()*currTime);
            // 播放时间与视频总长度
            var curr=Math.round(video.currentTime);
            $('.curr').html(getTime(curr));
        },1000)

    });
    $(video).bind('canplay',function(){
        var dura=video.duration;
        $('.dura').html(getTime(dura));
    })
    // 视频总长与播放时间函数
    console.log(getTime(8))
    function getTime(time){
        var timer;
        var h;
        var m;
        var s;
        if(time>3600){
            h=getFloat(parseInt(time/60/60));
            m=getFloat(parseInt((time-(h*3600))/60));
            s=getFloat(((time-(h*3600))%60));
        }else if(time>60&&time<3600){
            h=getFloat(0);
            m=getFloat(parseInt(time/60));
            s=getFloat(time%60);
        }else{
            h=getFloat(0);
            m=getFloat(0);
            s=getFloat(time);
        }
        timer=h+':'+m+":"+s;
        return timer;
    }
    // 时间格式函数
    function getFloat(num){
        if(num<10){
            return '0'+num;
        }else{
            return num;
        }
    }
    // 进度条
    playTime($videoLine,$videoDrag);
    // 播放进度函数
    function playTime(obj,objBtn){
        objBtn.bind('mousedown',function(){
            $(document).bind('mousemove',function(e){
                var disX=(e.pageX)-(objBtn.offset().left);
                var $num=objBtn.width()/obj.width()
                var B=video.duration;
                video.currentTime=Math.floor(B*$num);
                objBtn.width(disX);
                if(objBtn.width()==obj.width()||video.currentTime==video.duration){
                    objBtn.width(obj.width());
                    video.currentTime=0;
                    var timer=setTimeout(function(){
                        objBtn.width(5);
                    },2000);
                }
                return false;
            });
            $(document).bind('mouseup',function(){
                $(document).unbind();
            })
        });
    }
    // 音量条
    vlume($('.videoV'),$('.vDrag'))
    // 音量条函数
    function vlume(obj,objBtn){
        if(video.volume==1){
            objBtn.eq(0).css('left','45px');
        }
        objBtn.eq(0).bind('mousedown',function(e){
            var disX=e.clientX-objBtn.get(0).offsetLeft;
            $(document).bind('mousemove',function(ev){
                var boxWidth=obj.get(0).offsetWidth;
                var btnWidth=objBtn.get(0).offsetWidth;
                var btnLeft=objBtn.get(0).offsetLeft;
                var l=ev.clientX-disX;
                video.volume=btnLeft/boxWidth;
                console.log(video.volume);
                if(l<0){
                    l=0;
                }else if(l>(boxWidth-btnWidth)){
                    l=boxWidth-btnWidth;
                }
                objBtn.eq(0).css('left',l);
                // return false;
            });
            $(document).bind('mouseup',function(){
                $(document).unbind();
            });
            return false
        });
    }
    // 全屏函数
    $($fullScreen).bind('click',function(){
        fullScreen(video);
    })
    function fullScreen(obj){
        if($.isFunction(obj.webkitEnterFullscreen)){
            obj.webkitEnterFullscreen();
        }else if($.isFunction(obj.mozRequestFullScreen)){
            obj.mozRequestFullScreen();
        }else{
            alert('浏览器不支持全屏');
        }
    }
})
