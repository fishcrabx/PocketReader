auto.waitFor();

wakeUpDevice();

toast("注意：该脚本每次都是打开第一本小说，请确保剩余有足够页数可以翻动，否则会出现不计算页数的情况");
sleep(3000);

//下面两个参数可以自由更改，想多刷点可以调整哦（两项都满足脚本才会停止)
let timeNeed = 32 * 60 * 1000; //需要完成的时间，单位是毫秒，经测试，这里设置为32分钟是比较合理的时间
let pagesNeed = 300; //需要完成的翻页次数

let timeFinished = 0; //已完成的时间
let pagesFinished = 0; //已完成的页面数
let imei = ''; //设备的imei号，此处不需要配置，系统会自动读取

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
let showToastTime = new Date().getTime();
let refreshSettingFileTime = new Date().getTime();
showRestWork(); //显示剩余工作量

shouldEnd();

/**取消自动打卡功能 */
// gotoActivity();

toast('目标达成，结束脚本');
console.log('目标达成，结束脚本');


/**
 * 读取配置文件，主要记录了哪天看了多长时间，看了多少页
 */
function readSetting() {
    let today = new Date();
    let jsonKey = today.getFullYear() + '' + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ('0' + (today.getMonth() + 1))) + '' + (today.getDate() > 9 ? today.getDate() : '0' + today.getDate())

    files.createWithDirs(settingFiles); //创建文件，如果存在则直接返回false
    let fileContent = files.read(settingFiles, encoding = "UTF-8");
    if (fileContent) {
        //如果存在今天的数据，则直接更新，否则，创建今天的数据
        let json = JSON.parse(fileContent);
        if (json.hasOwnProperty(jsonKey)) {
            timeFinished = json[jsonKey].finishTime;
            pagesFinished = json[jsonKey].finishPages;
            if (timeFinished > timeNeed && pagesFinished > pagesNeed) {
                toast('今日任务已完成，去打卡吧');
                console.log('今日任务已完成，去打卡吧');
            }
            toast('读取配置文件完毕，剩余时长为:' + ((timeNeed - timeFinished) / 1000 / 60).toFixed(2) + '分钟，剩余页数为：' + (pagesNeed - pagesFinished) + '页')
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
    //获取IMEI信息
    getIMEI();
}

/**
 * 在翻页过程中，达到写入配置文件的时间间隔就更新配置文件
 */
function writeSetting() {
    let today = new Date();
    let jsonKey = today.getFullYear() + '' + ((today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : ('0' + (today.getMonth() + 1))) + '' + (today.getDate() > 9 ? today.getDate() : '0' + today.getDate());
    files.createWithDirs(settingFiles); //创建文件，如果存在则直接返回false
    let fileContent = files.read(settingFiles, encoding = "UTF-8");
    let json = JSON.parse(fileContent);
    if (json.hasOwnProperty(jsonKey)) {
        json[jsonKey].finishTime = timeFinished;
        json[jsonKey].finishPages = pagesFinished;
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

/**
 * 脚本主要执行函数：
 * 首先模拟看书等待时间，这里设置为1-6秒
 * 然后1秒的时间滑动一页
 * 判断是否达到显示剩余工作量时间间隔，达到的话就显示剩余工作量（剩余多长时间及剩余多少页需要执行）
 * 判断是否达到写入配置文件的时间间隔，达到就更新配置文件
 * 判断是否程序达到总体工作量（设置的30分钟阅读300页），达到就更新配置文件，没达到就继续执行
 */
function shouldEnd() {
    let sleepTime = (Math.floor(Math.random() * 6) + 1) * 1000;
    sleep(sleepTime); //等待1-6秒
    swipe(device.width - 10, device.height / 2, 10, device.height, 1000); //1秒滑动一页
    let now = new Date().getTime();
    pagesFinished++;
    timeFinished += (sleepTime + 1000);
    if (now - showToastTime > showToastInterval) {
        showRestWork();
        showToastTime = now;
    }
    if (now - refreshSettingFileTime > refreshSettingFileInterval) {
        writeSetting();
        refreshSettingFileTime = now;
    }
    if (timeFinished > timeNeed && pagesFinished > pagesNeed) {
        writeSetting();
    } else {
        shouldEnd();
    }
}

/**
 * toast方式显示剩余工作量（剩余时间及剩余页数）
 */
function showRestWork() {
    let minute = (timeFinished / 1000 / 60).toFixed(2);
    toast('已完成时间:' + minute + '分钟,已完成页数:' + pagesFinished + '页');
}

/**
 * 唤醒设备，这里主要用于定时任务,在脚本执行前执行
 */
function wakeUpDevice() {
    if (!device.isScreenOn()) {
        device.wakeUp()
    }
}

/**
 * 返回meid配置信息，首先判断配置文件中是否含有meid信息，如果没有则重新获取一次并向配置文件中写入meid信息
 * 获取meid信息，打开拨号界面输入：*#06#
 */
function getIMEI() {
    files.createWithDirs(settingFiles); //创建文件，如果存在则直接返回false
    let fileContent = files.read(settingFiles, encoding = "UTF-8");
    let json = JSON.parse(fileContent);
    if (json.hasOwnProperty('imei')) {
        imei = json['imei'];
    } else {
        app.launch('com.android.dialer');
        id('star').findOne().click();
        sleep(500);
        id('pound').findOne().click();
        sleep(500);
        id('zero').findOne().click();
        sleep(500);
        id('six').findOne().click();
        sleep(500);
        id('pound').findOne().click();
        sleep(3000);
        imei = className("android.widget.TextView").depth(6).clickable().findOne().getText();
        json['imei'] = imei;
        files.write(settingFiles, JSON.stringify(json), encoding = "utf-8");
    }
    toast('获取到的IMEI为：' + imei);
}

/**
 * 进入活动页面签到，此处还需优化
 */
function gotoActivity() {
    //进入活动页面
    app.launch('org.autojs.autojs');
    sleep(3000)
    home();
    sleep(3000);
    id('centerImg').findOne().click();
    sleep(8000);
    //经过上述操作应该已经进入了活动页面
    //进入打卡页面
    className("android.view.View").depth(11).clickable().findOne().click();
    sleep(5000);
    toast('等你打卡了，注意可能有验证码哦...');
    /**
     * 由于后面需要输入验证码打卡，现取消自动打卡功能（心在滴血...)
     */
    // let c = className("android.widget.Button").depth(12).clickable().findOne();
    // if (c.getText().trim() == '今日已打卡') {
    //     toast('今日打卡结束');
    // } else {
    //     className("android.widget.Button").depth(12).clickable().click();
    //     toast('已点击打卡');
    // }

}