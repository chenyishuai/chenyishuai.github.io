/**
 * Created by Administrator on 2016/11/6.
 */


// LOADING
// 用自调用函数表达式做闭包,返回一个对象,实现方法私有化,代码模块化,防止变量污染
var loadingRender = (function () {
    var ary = [ 'hr.png', 'me.png', 'zf_cubeBg.jpg', 'zf_cubeTip.png', 'zf_messageArrow1.png', 'zf_messageArrow2.png', 'zf_messageChat.png', 'zf_messageKeyboard.png', 'zf_return.png']
    var $loading = $('#loading'),
        $progressEm = $loading.find('em');
    var step = 0,
        total = ary.length;
    return{
        init:function () {
            // 循环加载所有图片,控制进度条的宽度
            $.each(ary,function (index,item) {
                //图片对象有了src后,就可以用onload事件执行图片加载后调用的内容
                var oImg = new  Image;
                oImg.src = 'imgs/'+item;
                oImg.onload = function () {
                    step++;
                    //加载一张增百分比,宽度到100%时进度条满
                    $progressEm.css('width',step/total*100+'%')
                    oImg = null;
                    //所以图片加载完毕,关闭loading区，显示message区
                    if(step===total){
                        window.setTimeout(function () {
                            // 左移一屏幕宽度,动画结束后消失
                            $loading.css('transform','translateX('+-document.documentElement.clientWidth+'px)').on('TransitionEnd',function () {
                                $loading.css('display','none');
                            });
                            messageRender.init();
                        },1000)
                    }
                }
            });
        }
    }
})();
loadingRender.init();

//MESSAGE
var messageRender = (function () {
        var $message = $('#message'),
            $messageList = $message.children('.messageList'),
            $list = $messageList.children('li'),
            $keyBoard = $message.children('.key-board'),
            $text = $keyBoard.children('.text'),
            $submit = $keyBoard.children('button');

    var autoTimer = null,
        step = -1,
        total = $list.length,
         bounceTop = 0;
    // console.log($keyBoard )

    //messageMove:消息列表发送
    function messageMove() {
        autoTimer = window.setInterval(function () {
            step++;
            // var $cur=$list.eq(step);
            $list.eq(step).css({
                opacity:1,
                transform:'translateY(0)'
            });
            //当发送完第三条,打开键盘
            if(step==2){
                window.clearInterval(autoTimer);
                window.setTimeout(function () {
                    $keyBoard.css('transform','translateY(0)');
                    $text.css('display','block');
                    textMove();
                },700)
            }
            //从第四条开始,每发送一条消息都让整个消息区往上移动10px
            if(step>2){
                bounceTop -= $list.eq(step).height()-10;
                // console.log($list.eq(step).height());
                $messageList.css('transform','translateY('+bounceTop+'px)');
                if (step==total-1){
                    window.clearInterval(autoTimer);
                    window.setTimeout(function () {
                        $message.css('transform','translateX('+-document.documentElement.clientWidth+'px)').on('TransitionEnd',function () {
                            $message.css('display','none');
                        });
                        cubeRander.init();
                    },1500)
                }
            }
        },1500);
    }

    // textMove:实现文字打印机效果
    function  textMove() {
        var text = 'show it to me',
            n = -1,
            result = '';
        var textTime = window.setInterval(function () {
            n++;
            result += text[n];
            $text.html(result);
            if(n==text.length-1){
                window.clearInterval(textTime);
                // 点击按钮收回键盘，继续执行消息发送
                $submit.css('display','block').singleTap(function () {
                    $text.css('display','none');
                    $keyBoard.css('transform','translateY(3.7rem)');
                    messageMove();
                })
            }
        },100)
    }

    return{
        init:function () {
            $message.css('display','block');
            messageMove();
        }
    }
})();

// CUBE
var cubeRander = (function () {
    var $cube = $('#cube'),
        $cubeBox = $cube.children('.cube-box'),
        $cubeBoxLis = $('.cube-box li');
    // 滑动的处理,以第一个手指的滑动为准
    function start(ev) {
       var point = ev.touches[0];
        // console.log($cubeBox);
        // console.log($cubeBoxLis);
        $(this).attr({
            strX:point.clientX,
            strY:point.clientY,
            //清零不保存上次移动改变的值
            changeX:0,
            changeY:0
        });
        // console.log(point.clientX,point.clientY)
    }
    function move(ev) {
        var point = ev.touches[0];
        var changeX=point.clientX-$(this).attr('strX'),
            changeY=point.clientY-$(this).attr('strY');
        // console.log(point.clientX,point.clientY)
        $(this).attr({
            changeX:changeX/3,
            changeY:changeY/3
        });
    }
    function end(ev) {
        var rotateX=parseFloat($(this).attr('rotateX'))-parseFloat($(this).attr('changeY')),
            rotateY=parseFloat($(this).attr('rotateY'))+parseFloat($(this).attr('changeX'));
        // console.log(changeX,changeY)
        $(this).attr({
            //存储上次变化后的角度
            rotateX:rotateX,
            rotateY:rotateY
        }).css('transform','scale(0.6) rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)');
    }
    return{
        init:function () {
          $cube.css('display','block');
            // 正方体滑动
            $cubeBox.attr({
                rotateX:-35,
                rotateY:135
            }).on('touchstart',start).on('touchmove',move).on('touchend',end);
            // 正方体点击
            $cubeBoxLis.doubleTap(function () {
                var index = $(this).index();
                $cube.css('display','none');
                swiperRander.init(index);
                // console.log(index);
            })
        }
    }
})();

// SWIPER
var swiperRander = (function () {
    var $swiper = $('#swiper'),
        $makisu = $('#makisu'),
        $return = $swiper.children('.return'),
        $cube = $('#cube');
    return{
        init:function (index) {
            $swiper.css('display','block');
            // makisu对象提供的方法和属性
            $makisu.makisu({
                selector:'dd',
                overlap:0.6,
                speed:0.8
            });
            $makisu.makisu('open');

            // 初始化swiper实现六个页面之间的切换
            var swiperH = new Swiper('.swiper-container-h',{
                pagination : '.swiper-pagination', paginationClickable: true,
                paginationBulletRender: function (swiper, index, className) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                },onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
                    swiperAnimateCache(swiper); //隐藏动画元素
                    swiperAnimate(swiper); //初始化完成开始动画
                }, onSlideChangeEnd: function(swiper){
                    swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
                },onTransitionEnd: function(exam){
                    // console.log(exam.activeIndex)
                    //onTransitionEnd 的实例提供的activeIndex可以显示当前活动页的index
                    //修复切换到魔方后切换回来指示小球不动bug
                    $('.swiper-pagination span').removeClass('swiper-pagination-bullet-active')
                    $('.swiper-pagination span').eq(exam.activeIndex).addClass('swiper-pagination-bullet-active')
                }
            });

            // 去到指定的slide模块
            // console.log(index);
            swiperH.slideTo(index);

            // iscroll内嵌滚动设置
            var myScroll;
            myscroll=new IScroll("#wrapper1",{
                scrollbars: true,
                fadeScrollbars:true,
                // momentum:false,
                // bounce:false,
            });
            // $("#wrapper1").one("touchstart",function(){
            //     myscroll.refresh();
            // });
            document.addEventListener('touchmove',function (ev) {
                ev.preventDefault()
            },false)

            //相册双击图片放大
            var $page6 = $('#page6'),
                $mask = $page6.children('.mask'),
                $dialog = $page6.children('.dialog'),
                $digImg = $dialog.children('img')
                $clos = $dialog.children('.clos'),
                $li = $('#page6 li');

            $li.doubleTap(function () {
                $mask.css({
                    'display':'block',
                    'opacity':'0.7'
                });

                $dialog.css({
                    'transform':'translateY(-40%)',
                });
                $digImg.attr('src','imgs/'+($(this).index()+1)+'.jpg')
            });

            $clos.singleTap(function () {
                $page6.css('WebkitFilter','oPage.style.filter="blur(0)"');
                $dialog.css({
                    'transform':'translateY(-240%)',
                });
                $mask.css({
                    'display':'none'
                });

            })

            //RETURN按钮
            // console.log($return);
            $return.singleTap(function () {
                $swiper.css('display','none');
                $cube.css('display','block');
            });
        }
    }
})();