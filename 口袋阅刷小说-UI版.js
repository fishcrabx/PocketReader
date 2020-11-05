"ui";
 
ui.layout(
 
    <vertical>
        <appbar>
            <toolbar id="headTitle" title="口袋阅小助手" />
        </appbar>
        <card margin="10 10 10 5">
            <text text="本软件只用于学习讨论，请下载后24小时内删除" margin="10 15 5 15" textColor="red" />
        </card>
        <card margin="10 10 10 5">
            <text text="请先开启无障碍服务权限再使用口袋阅小助手" margin="10 15 5 15" />
        </card>
        <card margin="10 10 10 5">
            <vertical>
                <Switch id="accessibleService" text="无障碍服务" checked="{{auto.serivce != null}}" margin="10 10 5 10" />
                <Switch id="floatingWindow" text="悬窗权限" layout_gravity="center" margin="10 10 8 10" />
            </vertical>
        </card>
        <card margin="10 10 10 5">
            <horizontal>
                <text text="看小说时间" marginLeft="10" />
                <input id="setTime" text="33" textColor="grey" w="40" gravity="center" />
                <text text="分钟" />
                <text text="看小说页数" marginLeft="50"/>
                <input id="setPage" text="330" textColor="grey" w="40" gravity="center" />
                <text text="页" />
            </horizontal>
        </card>
        <button id="starts" text="开始阅读" style="Widget.AppCompat.Button.Colored" margin="6 0 6 0" padding="18" />
    </vertical>
);

/* 无障碍服务 */
ui.accessibleService.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});
/* 根据无障碍服务的开启情况，同步开关的状态 */
ui.emitter.on("resume", function () {
    ui.accessibleService.checked = auto.service != null;
});
/* 悬浮窗权限 */
ui.floatingWindow.on("check", function (checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if (auto.service != null) {
        if (checked) {
            int = app.startActivity({
                packageName: "com.android.settings",
                className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
                data: "package:" + auto.service.getPackageName().toString()
            });
        }
    } else {
        toastLog("请先开启无障碍服务");
        ui.floatingWindow.checked = false;
    }
});

var getDeviceWidth = device.width;//获取设备的宽度
var getDeviceHeight = device.height;//获取设备的高度

setScreenMetrics(getDeviceWidth, getDeviceHeight);//按设备的宽、高度适配



/* 开始执行 */
ui.starts.on("click", function () {

    threads.start(function () {
        console.show();
        console.setPosition(getDeviceWidth / 2.8, getDeviceHeight / 100);//按设备分辨率设置控制台在右上角
        start();
        log("已完成阅读任务");
    })

    threads.start(function () {
        //判断当前时间和页数是否达到结束程序标准
        while(!isEnded){
            let sleepTime = (Math.floor(Math.random() * 30) + 10) * 1000;
            sleep(sleepTime); //等待10-40秒
            showRestWork();
            writeSetting();
            if (timeFinished > timeNeed && pagesFinished > pagesNeed) {
                writeSetting();
                toastLog('恭喜您,完成今日阅读任务，记得手动去打卡呀！！！');
                isEnded=true;
            }
        }
    })

});

//下面两个参数可以自由更改，想多刷点可以调整哦（两项都满足脚本才会停止)
let timeNeed = 33 * 60 * 1000; //需要完成的时间，单位是毫秒，经测试，这里设置为33分钟是比较合理的时间
let pagesNeed = 330; //需要完成的翻页次数
let timeFinished = 0; //已完成的时间
let pagesFinished = 0; //已完成的页面数
let showToastInterval = 20 * 1000; //显示剩余完成额度的toast间隔时间,这里设置为20s左右显示一次
let refreshSettingFileInterval = 60 * 1000; //更新setting文件时间间隔，这里设置为1分钟左右更新一次
let settingFiles = '/sdcard/PocketReader/config';
let pkn = 'com.yuewen.cooperate.ekreader';
//下面开始刷小说

let isEnded=false;

function start(){
    // auto.waitFor();
    toastLog("注意：该脚本每次都是打开第一本小说，请确保剩余有足够页数可以翻动，否则会出现不计算页数的情况");
    timeNeed = ui.setTime.text() * 60 * 1000; //需要完成的时间，单位是毫秒，经测试，这里设置为33分钟是比较合理的时间
    pagesNeed = ui.setPage.text(); //需要完成的翻页次数，默认设置是330页
    //读取配置文件信息更新剩余时间和页数
    readSetting();
    //启动请求阅读
    app.launch(pkn);
    waitForPackage(pkn); //等待应用启动完毕
    toastLog('启动qq阅读');

    sleep(5000);
    //打开第一本小说
    let firstBookCover = id('book_cover').findOne(3000); //找到第一本小说的封面控件
    click(firstBookCover.bounds().centerX(), firstBookCover.bounds().centerY()); //点击进入第一本小说
    toastLog('打开第一本小说');

    sleep(3000);
    //下面开始刷小说

    while(!isEnded){
        shouldEnd();
    }
    
}

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
            // if (timeFinished > timeNeed && pagesFinished > pagesNeed) {
            //     toastLog('今日任务已完成，去打卡吧');
            // }
            toastLog('读取配置文件完毕，剩余时长为:' + ((timeNeed - timeFinished) / 1000 / 60).toFixed(2) + '分钟，剩余页数为：' + (pagesNeed - pagesFinished) + '页')
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
        toastLog('创建配置文件成功');
    }
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
        toastLog('更新今日配置文件成功')
    } else {
        json[jsonKey] = {};
        json[jsonKey].finishTime = 0;
        json[jsonKey].finishPages = 0;
        files.write(settingFiles, JSON.stringify(json), encoding = "utf-8");
        toastLog('新增今日配置选项成功')
    }
}

/**
 * 脚本主要执行函数：
 * 首先模拟看书等待时间，这里设置为1-6秒
 * 然后随机1-3秒的时间滑动一页
 * 判断是否达到显示剩余工作量时间间隔，达到的话就显示剩余工作量（剩余多长时间及剩余多少页需要执行）
 * 判断是否达到写入配置文件的时间间隔，达到就更新配置文件
 * 判断是否程序达到总体工作量（设置的30分钟阅读300页），达到就更新配置文件，没达到就继续执行
 */
function shouldEnd() {
    let sleepTime = (Math.floor(Math.random() * 6) + 1) * 1000;
    sleep(sleepTime); //等待1-6秒
    let fanyeTime=(Math.floor(Math.random() * 3) + 1) * 1000;
    let rightX=device.width - (Math.floor(Math.random() * 50) + 1);
    let rightY=device.height / 2 +(Math.floor(Math.random() * 50) + 1);
    let leftX= (Math.floor(Math.random() * 50) + 1);
    let leftY=device.height / 3 +(Math.floor(Math.random() * 50) + 1);
    swipe(rightX,rightY, leftX, leftY, fanyeTime); //随机秒滑动一页
    pagesFinished++;
    timeFinished += (sleepTime + fanyeTime);
}

/**
 * toast方式显示剩余工作量（剩余时间及剩余页数）
 */
function showRestWork() {
    let minute = (timeFinished / 1000 / 60).toFixed(2);
    toastLog('已完成时间:' + minute + '分钟,已完成页数:' + pagesFinished + '页');
}