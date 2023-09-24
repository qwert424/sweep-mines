// 滚动条距离首屏幕距离
// window.pageXOffset 和 window.pageYOffset
// IE8和IE8以下的浏览器 
// document.body.scrollLeft/Top
// document.documentElement.scrollLeft/Top

function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

// 可视区窗口的尺寸
// window.innerWidth 和 window.innerHeight
// IE8和IE8以下的浏览器 
// document.documentElement.clientHeight/clientWidth
// document.body.clientHeight/clientWidth
// 标准模式下，任意浏览器都兼容
// document.documentElement.clientHeight/clientWidth
// 怪异模式下的浏览器
// document.body.clientWidth/clientHeight

// document.compatMode 查看什么模式渲染

function getViewportOffset() {
    if (window.innerWidth) {
        return {
            x: window.innerWidth,
            y: window.innerHeight
        }
    } else {
        if (document.compatMode === "BackCompat") {
            return {
                x: document.body.clientWidth,
                y: document.body.clientHeight
            }
        } else {
            return {
                x: document.documentElement.clientWidth,
                y: document.documentElement.clientHeight
            }
        }

    }
}

// 获得元素相对于文档的位置 getElementPosition
Element.prototype.getElementPosition = function () {
    var parent = this.offsetParent;
    if (parent.nodeName == 'BODY') {
        return {
            x: this.offsetLeft,
            y: this.offsetTop
        }
    } else {
        return {
            x: this.offsetLeft + parent.getElementPosition().x,
            y: this.offsetTop + parent.getElementPosition().y
        }
    }
}

// 获取样式 getStyle 解决兼容性问题
function getStyle(elem, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null)[prop]
    } else {
        return elem.currentStyle[prop]
    }
}

// 事件绑定 解决this指向问题
function addEvent(elem, type, handle) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent('on' + type, function () {
            handle.call(elem);
        })
    } else {
        elem['on' + type] = handle;
    }
}

//事件解绑 
function delEvent(elem, type, handle) {
    if (elem.addEventListener) {
        elem.removeEventListener(type, handle, false);
    } else {
        elem['on' + type] = false;
    }
    // else if (elem.attachEvent) {
    //     elem.detachEvent('on' + type, function () {
    //         handle.call(elem); //要多层嵌套才可以 实用性不大？ 
    //     })
    // } 
}

// 取消冒泡事件处理方式
function stopBubble(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

// 阻止默认事件的函数
function cancelHandle(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

//鼠标拖拽方法
function drag(elem) {
    var disX,
        disY;
    addEvent(elem, 'mousedown', function (e) {
        var event = e || window.event;
        disX = event.pageX - parseInt(getStyle(elem, 'left'));
        disY = event.pageY - parseInt(getStyle(elem, 'top'));
        addEvent(document, 'mousemove', moveMouse);
        addEvent(document, 'mouseup', upMouse);
        stopBubble(event);
        cancelHandle(event);
    })
    function moveMouse(e) {
        var event = e || window.event;
        elem.style.left = event.pageX - disX + "px";
        elem.style.top = event.pageY - disY + "px";
    }
    function upMouse(e) {
        // var event = e || window.event;
        delEvent(document, 'mousemove', moveMouse);
        delEvent(document, 'mouseup', upMouse)
    }
}

//封装script 异步加载 加载完成提示 callback回调函数
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = "text/javascript";
    // script.src = url;//如果下载内容 在加载事件前 可能还没加载事件 就下载完了 就不触发script.readyState变化 就没有意义
    if (script.readyState) {
        script.onreadystatechange = function () {//IE
            if (script.readyState == "complete" || script.readyState == "loaded") {
                callback();
                // obj[callback]();
            }
        }
    } else {
        script.onload = function () {//Safari chrome firefix opera
            callback();
            // obj[callback]();
        }
    }
    script.src = url;//所以在绑定好事件后再去下载这个内容 确保万无一失
    document.head.appendChild(script);
}

function $(Target) {
    return document.getElementsByClassName(Target);
}

function $$(Target) {
    return document.getElementsByTagName(Target);
}

function $$$(Target) {
    return document.createElement(Target);
}