// 游戏主程序

function main(Target) {
    // 1、初始化游戏
    initGame(Target);

    // 2、绑定事件对象
    bindEvent();

}
main(gameLevelConfig.easy);

function initGame(Target) {
    // 1、确定雷的下标
    minePos = getMinePos(Target);

    // 数据提示
    $('allmine')[0].innerHTML = Target.mine;
    $('allflag')[0].innerHTML = flagCount;

    // 2、游戏区域绘制
    mineArea(Target);

}

// 确定雷的下标
function getMinePos(Target) {
    // 生成长度和游戏数量格相同的数组
    var arr = new Array(Target.row * Target.col);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = i;
    }
    // 随机
    arr.sort(() => 0.5 - Math.random());
    arr = arr.splice(0, Target.mine)
    return arr;
}

// 游戏区域绘制
function mineArea(Target) {
    // 生成游戏区域
    var table = $$$('table');
    for (var i = 0; i < Target.row; i++) {
        var tr = $$$('tr');
        tableDate[i] = [];
        for (var j = 0; j < Target.col; j++) {
            var td = $$$('td');
            var div = $$$('div');
            // 表格存储数据
            tableDate[i][j] = {
                row: i,//行
                col: j,//列
                index,//下标
                type: "number",//类型
                value: 0,//周围雷数量
                key: false,//是否被检验过
                ifMine: 0//0不是 1是
            }
            // div给标记
            div.setAttribute("class", "canflag");
            div.setAttribute("date-id", 0);
            // 判断div是否为地雷位置
            if (minePos.includes(tableDate[i][j].index)) {
                div.setAttribute("date-id", 1)
                div.classList.add(["iconfont"], ["mine"]);
                tableDate[i][j].type = "mine";
                tableDate[i][j].ifMine = 1;
            }
            td.setAttribute("date-id", index)
            td.appendChild(div);
            tr.appendChild(td);
            index++;
        }
        table.appendChild(tr);
    }
    $('minecontainer')[0].appendChild(table);
    $('minecontainer')[0].oncontextmenu = function (e) {
        cancelHandle(e);
        // stopBubble(e);
    }
}

function bindEvent() {
    var table = $$('table')[0];
    var div = table.getElementsByTagName('div');
    for (var i = 0; i < div.length; i++) {
        // 左键点击
        addClickEventL(div[i]);
        // 插旗绑定 右键
        addClickEventR(div[i]);
    }

    // 难度选择
    levelButton();

    $('answer')[0].onclick = function () {
        showAnswer();
        var table = $$('table')[0];
        var div = table.getElementsByTagName('div');
        for (var i = 0; i < div.length; i++) {
            div[i].onclick = function () { return false }
            div[i].oncontextmenu = function () { return false }
        }
    }

    $('again')[0].onclick = function () {
        var button = $('active')[0];
        var div = $('minecontainer')[0];
        div.innerHTML = "";
        minePos = null;
        flagCount = 0;
        tableDate = [];
        index = 0;
        if (button.nextElementSibling == null) {
            main(gameLevelConfig.hard);
        } else if (button.previousElementSibling == null) {
            main(gameLevelConfig.easy);
        } else {
            main(gameLevelConfig.normal);
        }
    }
}

// 左键点击
function addClickEventL(Target) {

    Target.onclick = function () {
        if (this.getAttribute("date-id") == 1 && !Target.classList.contains('false')) {
            Target.classList.add('error')
            showAnswer();
            next()
        } else {
            search(Target);
        }
    };
}

// 插旗绑定 右键
function addClickEventR(Target) {
    Target.oncontextmenu = function () {
        var count = Target.getAttribute("date-id");
        if (Target.classList.contains('canflag')) {
            Target.setAttribute("class", "iconfont icon-qizi");
            Target.classList.remove('canflag')
            Target.classList.add('false')
            flagCount++;
        } else if (Target.classList.contains('false')) {
            if (count === "1") {
                Target.setAttribute("class", "canflag iconfont mine");
                flagCount--;
            } else {
                Target.setAttribute("class", "canflag");
                flagCount--;
            }
        }
        $('allflag')[0].innerHTML = flagCount;
    };
}

// 难度选项
function levelButton() {
    var button = $$('button');
    for (var i = 0; i < button.length; i++) {
        (function (i) {
            button[i].onclick = function () {
                var button = $$('button');
                for (var j = 0; j < button.length; j++) {
                    button[j].className = '';
                }
                this.className = "active";
                var div = $('minecontainer')[0];
                div.innerHTML = "";
                minePos = null;
                flagCount = 0;
                tableDate = [];
                index = 0;
                switch (i) {
                    case 0:
                        main(gameLevelConfig.easy);
                        break;
                    case 1:
                        main(gameLevelConfig.normal);
                        break;
                    case 2:
                        main(gameLevelConfig.hard);
                        break;
                }
            }
        }(i))
    }
}

function showAnswer() {
    // 显示答案 
    // 1、把所有的地雷显示出来
    // 2、可能插旗子了 需要判断是否正确
    // 3、正确right 错误 error
    var mineArr = $('mine');
    var flagArr = $('icon-qizi');
    for (var i = 0; i < mineArr.length; i++) {
        mineArr[i].style.opacity = 1;

    }
    for (var j = 0; j < flagArr.length; j++) {
        if (flagArr[j].getAttribute("date-id") == 1) {
            flagArr[j].classList.add('right')
        } else {
            flagArr[j].classList.add('error')
        }
    }
}

// 选择是否继续游戏
function next() {
    if (confirm("BOOM！ 点击确定：立即下一把 点击取消：查看答案")) {
        var button = $('active')[0];
        var div = $('minecontainer')[0];
        div.innerHTML = "";
        minePos = null;
        flagCount = 0;
        tableDate = [];
        index = 0;
        if (button.nextElementSibling == null) {
            main(gameLevelConfig.hard);
        } else if (button.previousElementSibling == null) {
            main(gameLevelConfig.easy);
        } else {
            main(gameLevelConfig.normal);
        }
    } else {
        var table = $$('table')[0];
        var div = table.getElementsByTagName('div');
        for (var i = 0; i < div.length; i++) {
            div[i].onclick = function () { return false }
            div[i].oncontextmenu = function () { return false }
        }
    }
}

//查找地雷数
function search(Target) {
    // 获得对应的tableDate
    var tableObj = getTableDate(Target);
    var x = getBound(tableObj);
    var count = 0;
    // 遍历
    for (var i = x.rowTop; i <= x.rowBottom; i++) {
        for (var j = x.colLeft; j <= x.colRight; j++) {
            if (tableDate[i][j].type == "mine") {
                count++;
            }
        }
    }
    var arr = ['down', 'one', 'two', 'three', 'fore', 'five', 'six', 'seven', 'eight']
    if (Target.classList.contains('canflag')) {
        if (!count) {
            for (var i = x.rowTop; i <= x.rowBottom; i++) {
                for (var j = x.colLeft; j <= x.colRight; j++) {
                    // 判断是否检验过 在不断递归
                    if (!tableDate[i][j].key) {
                        tableDate[i][j].key = true;
                        Target.parentNode.style.border = "none"
                        search(getDomDate(tableDate[i][j]))
                        Target.classList.remove("canflag")
                    } else {
                        Target.parentNode.style.border = "none"
                        Target.classList.add(arr[0]);
                    }
                }
            }
        } else {
            Target.parentNode.style.border = "none"
            Target.innerHTML = count
            Target.classList.add(arr[0]);
            Target.classList.add(arr[count]);
            tableObj.key = true;
            tableObj.value = count;
            Target.classList.remove("canflag")
        }
    }
}

// 获得对应的tableDate
function getTableDate(Target) {
    var index = Target.parentNode.getAttribute("date-id");
    var flatTableDate = tableDate.flat();
    var i = flatTableDate.filter(item => item.index == index)[0];
    return i;
}

// 获得对应的DOM
function getDomDate(Target) {
    var index = Target.index;
    var table = $$('table')[0];
    var div = table.getElementsByTagName('div');
    return div[index];
}

// 获得边界
function getBound(tableObj) {
    var button = $('active')[0];
    if (button.nextElementSibling == null) {
        var Target1 = gameLevelConfig.hard;
    } else if (button.previousElementSibling == null) {
        var Target1 = gameLevelConfig.easy;
    } else {
        var Target1 = gameLevelConfig.normal;
    }
    var rowTop = tableObj.row - 1 < 0 ? 0 : tableObj.row - 1;
    var colLeft = tableObj.col - 1 < 0 ? 0 : tableObj.col - 1;
    var rowBottom = tableObj.row + 1 === Target1.row ? Target1.row - 1 : tableObj.row + 1;
    var colRight = tableObj.col + 1 === Target1.col ? Target1.col - 1 : tableObj.col + 1;
    return { rowTop, rowBottom, colLeft, colRight }
}


