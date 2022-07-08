var moushClass = {
    svg_distinguish_isDrag: false, //是否开始拖动图纸  【false 不拖拽】

    // 拖动图纸专用变量 ，拖动图纸时的点的坐标
    svg_distinguish_disX: null,
    svg_distinguish_disY: null,//图片相对于图片的位置
    imageId4Root: null,

    imageId4Container: null,

    imageId4Img: null,
    initialized: false,
    rootId: "id_document_img",
    ImageViewer: function (url, elementId, callback) {

        this.url = url;

        //获取外框的尺寸

        var width4Panel = $("#" + elementId).width();

        var height4Panel = $("#" + elementId).height();

        // 外框边界的坐标，获取页面某一元素的绝对X,Y坐标

        var minx = $('#' + elementId).offset().left;

        var miny = $('#' + elementId).offset().top;

        //alert(minx+"--"+miny);

        var maxx = minx + width4Panel;

        var maxy = miny + height4Panel;

        //必须预留出一片空白区域，不然拖动的状态(svg_distinguish_isDrag)无法监听到了

        minx = minx + 20;

        miny = miny + 20;

        maxx = maxx - 20;

        maxy = maxy - 20;

        //alert(maxx+"--"+maxy);

        //追加html.只初始化一次

        moushClass.imageId4Root = moushClass.rootId + "_root";

        moushClass.imageId4Container = moushClass.rootId + "_container";

        moushClass.imageId4Img = moushClass.rootId + "_img";

        //console.log(width4Panel+"---"+height4Panel);

        //图片加载后，自动居中

        $('#' + moushClass.imageId4Img).on("load", function () {

            var imgWidth = $('#' + moushClass.imageId4Img).width();

            var imgHeight = $('#' + moushClass.imageId4Img).height();

            var centerTop = (height4Panel - imgHeight) / 2;

            var centerLeft = (width4Panel - imgWidth) / 2;

            $("#" + moushClass.imageId4Img).css({

                top: centerTop,

                left: centerLeft

            });

            //回调

            callback();

        });

        $('#' + moushClass.imageId4Img).attr("src", url);

        /*
        
         * 绑定滚轮和右击事件
        
         */

        var imgRoot = document.getElementById(moushClass.imageId4Root);

        var image_container = document.getElementById(moushClass.imageId4Container);

        if (document.addEventListener) {

            //js添加鼠标滚轮监听事件

            imgRoot.addEventListener('DOMMouseScroll', moushClass.img_scrollFunc, false);

            //鼠标右击

            imgRoot.addEventListener('contextmenu',moushClass.svg_distinguish_contextmenuFunc);

        }

        imgRoot.onmousewheel =moushClass.img_scrollFunc;

        //初始化移动事件

        moushClass.init_img_moveFunc(imgRoot, image_container, {

            minx: minx,

            miny: miny,

            maxx: maxx,

            maxy: maxy

        });

        /**
        
         * 空格绑定P&ID图纸复位功能
        
         */

        if (!moushClass.initialized) {

            $(document).keydown(function (e) {

                if (e.which === 32) {

                    // this.zoomExtents();

                }

            });

            moushClass.initialized = true;

        }

    },
    init_img_moveFunc: function (imgRoot, image_container, borderPosition) {
        

        //鼠标按下时

        image_container.onmousedown = function (e) {

            moushClass.svg_distinguish_isDrag = true;

            this.style.cursor = 'pointer'; //move

            e = e || window.event; //兼容性写法

            e.preventDefault();

            //鼠标位置

            var x = e.clientX;

            var y = e.clientY;

            //鼠标相对于图片的位置

           moushClass.svg_distinguish_disX = x - this.offsetLeft;

           moushClass.svg_distinguish_disY = y - this.offsetTop;

        }

        //鼠标移动时

        imgRoot.onmousemove = function (e) {

            e = e || window.event; //兼容性写法

            e.preventDefault();

            //鼠标位置

            var x = e.clientX;

            var y = e.clientY;

            console.log('x:' + x + ',y:' + y);

            if (moushClass.svg_distinguish_isDrag) {

                if (x > borderPosition.minx && x < borderPosition.maxx && y > borderPosition.miny && y < borderPosition.maxy) {

                    //修改图片位置

                    image_container.style.left = x - moushClass.svg_distinguish_disX + 'px';

                    image_container.style.top = y - moushClass.svg_distinguish_disY + 'px';

                } else {

                    moushClass.svg_distinguish_isDrag = false;

                }

            }

        }

        //鼠标抬起时

        imgRoot.onmouseup = function (e) {

            e = e || window.event; //兼容性写法

            e.preventDefault();

            moushClass.svg_distinguish_isDrag = false;

            image_container.style.cursor = 'default';

        }

    },
    svg_distinguish_contextmenuFunc: function (event) {

        event = event || window.event; //兼容性写法

        event.preventDefault();

        console.log("left: " + event.pageX + ";" + "top:  " + event.pageY);
    },
    showErrorMessage: function (msg) {

        alert(msg);

    }
}