// 游戏配置

var gameLevelConfig = {
    easy: {
        row: 10,
        col: 10,
        mine: 10
    },
    normal: {
        row: 15,
        col: 15,
        mine: 30
    },
    hard: {
        row: 20,
        col: 20,
        mine: 60
    }
}

// 地雷下标
var minePos = null;

// 旗子数量
var flagCount = 0;

// 表格存储数据
var tableDate = []

// 下标 index
var index = 0; 
