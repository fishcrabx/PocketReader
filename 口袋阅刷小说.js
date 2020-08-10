auto.waitFor();

let timeNeed = 30 * 60 * 1000; //需要完成的时间，单位是毫秒
let pagesNeed = 300; //需要完成的翻页次数

let showToastInterval = 20 * 1000; //显示剩余完成额度的toast间隔时间,这里设置为20s左右显示一次
let refreshSettingFileInterval = 60 * 1000; //更新setting文件时间间隔，这里设置为1分钟左右更新一次

let settingFiles = '/sdcard/PocketReader/config';
//读取配置文件信息更新剩余时间和页数
readSetting();
//启动请求阅读
let pkn = 'com.yuewen.cooperate.ekreader';
app.launch(pkn);
waitForPackage(pkn); //等待应用启动完毕
toast('启动qq阅读');

sleep(5000);
//打开第一本小说
let firstBookCover = id('book_cover').findOne(3000); //找到第一本小说的封面控件
click(firstBookCover.bounds().centerX(), firstBookCover.bounds().centerY()); //点击进入第一本小说
toast('打开第一本小说');

sleep(3000);
//下面开始刷小说
let startTime = new Date().getTime();
let pages = 0;
let showToastTime = new Date().getTime();
let refreshSettingFileTime = new Date().getTime();
showRestWork();

shouldEnd(startTime, pages);

toast('目标达成，结束脚本');
console.log('目标达成，结束脚本');

function readSetting() {
    let today = new Date();
    let jsonKey = today.getFullYear() + '' + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ('0' + (today.getMonth() + 1))) + '' + (today.getDate() > 9 ? today.getDate() : '0' + today.getDate())

    files.createWithDirs(settingFiles); //创建文件，如果存在则直接返回false
    let fileContent = files.read(settingFiles, encoding = "UTF-8");
    if (fileContent) {
        //如果存在今天的数据，则直接更新，否则，创建今天的数据
        let json = JSON.parse(fileContent);
        if (json.hasOwnProperty(jsonKey)) {
            timeNeed = timeNeed - json[jsonKey].finishTime;
            pagesNeed = pagesNeed - json[jsonKey].finishPages;
            toast('读取配置文件完毕，剩余时长为:' + (timeNeed / 1000 / 60).toFixed(2) + '分钟，剩余页数为：' + pagesNeed + '页')
        } else {
            json[jsonKey] = {};
            json[jsonKey].finishTime = 0;
            json[jsonKey].finishPages = 0;
            files.write(settingFiles, JSON.stringify(json), encoding = "utf-8");
            console.log('新增今日配置选项成功')
            toast('新增今日配置选项成功')
        }
    } else {
        //不存在则创建一个新的，写入文件
        let data = {};
        data[jsonKey] = {};
        data[jsonKey].finishTime = 0;
        data[jsonKey].finishPages = 0;
        files.write(settingFiles, JSON.stringify(data), encoding = "utf-8");
        console.log('创建配置文件成功')
        toast('创建配置文件成功');
    }
}

function writeSetting() {
    let today = new Date();
    let jsonKey = today.getFullYear() + '' + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ('0' + (today.getMonth() + 1))) + '' + (today.getDate() > 9 ? today.getDate() : '0' + today.getDate());
    files.createWithDirs(settingFiles); //创建文件，如果存在则直接返回false
    let fileContent = files.read(settingFiles, encoding = "UTF-8");
    let json = JSON.parse(fileContent);
    if (json.hasOwnProperty(jsonKey)) {
        json[jsonKey].finishTime = json[jsonKey].finishTime + today.getTime() - startTime;
        json[jsonKey].finishPages = json[jsonKey].finishPages + pages;
        files.write(settingFiles, JSON.stringify(json), encoding = "utf-8");
        console.log('更新今日配置文件成功')
        toast('更新今日配置文件成功')
    } else {
        json[jsonKey] = {};
        json[jsonKey].finishTime = 0;
        json[jsonKey].finishPages = 0;
        files.write(settingFiles, JSON.stringify(json), encoding = "utf-8");
        console.log('新增今日配置选项成功')
        toast('新增今日配置选项成功')
    }
}

function shouldEnd() {
    sleep((Math.floor(Math.random() * 6) + 1) * 1000); //等待1-6秒
    swipe(device.width - 10, device.height / 2, 10, device.height, 1000); //1秒滑动一页
    let now = new Date().getTime();
    pages++;
    if (now - showToastTime > showToastInterval) {
        showRestWork();
        showToastTime = now;
    }
    if (now - refreshSettingFileTime > refreshSettingFileInterval) {
        writeSetting();
        refreshSettingFileTime = now;
    }
    if (now - startTime > timeNeed && pages > pagesNeed) {
        // return true;
    } else {
        shouldEnd();
    }
}

function showRestWork() {
    let now = new Date().getTime();
    let minute = ((now - startTime) / 1000 / 60).toFixed(2);
    toast('已完成' + minute + '分钟的阅读,完成页数' + pages + '页');
}