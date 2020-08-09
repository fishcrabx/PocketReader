auto.waitFor();

const timeNeed = 30 * 60 * 1000;
const pagesNeed = 300;

//启动请求阅读
const pkn = 'com.yuewen.cooperate.ekreader';
app.launch(pkn);
waitForPackage(pkn);

sleep(5000);
//打开第一本小说
let firstBookCover = id('book_cover').findOne(3000);//第一本小说的封面
click(firstBookCover.bounds().centerX(), firstBookCover.bounds().centerY());//点击进入第一本小说

sleep(3000);
//下面开始刷小说
let startTime = new Date().getTime();
let pages = 0;

shouldEnd(startTime, pages);

toast('目标达成，结束脚本');
console.log('目标达成，结束脚本')

function shouldEnd(startTime, pages) {
    sleep((Math.floor(Math.random() * 6) + 1) * 1000);//等待1-6秒
    swipe(device.width - 10, device.height / 2, 10, device.height, 1000);//1秒滑动一页
    let now = new Date().getTime();
    pages++;
    if (now - startTime > timeNeed && pages > pagesNeed) {
        // return true;
    } else {
        shouldEnd(startTime, pages);
    }
}
