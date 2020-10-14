# 口袋阅刷小说脚本（基于Auto.js)

## 写在最前面，如果你是一枚纯小白，建议你直接使用APP
APP安装方法参考下面的autojs安装方法
下载链接：https://download.csdn.net/download/xchl123/12923024

## 写在前面

微信公众号临时申请了一个，好久没玩都快忘记怎么做了，后面会每天在该公众号上提醒大家打卡，并且安利本人喜欢的一些小说   emmm  以及一些口袋阅可以做的别的事哦，VX 搜索公众号: 口袋阅打卡小助手

![口袋阅打卡助手公众号二维码](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg)

##### 打开口袋阅的开发者调试选项

* 打开拨号盘

![打开拨号盘](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B/1.png)

* 输入 `*#*#5858#*#*`

![输入*#*#5858#*#*](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B/2.png)

* 页面跳转到系统页，此时可以发现有开发者选项了

![点击开发者选项](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B/3.png)

* 点击开发者选项，打开USB调试即可，后续操作都需要打开USB调试才可以进行哦（安装应用必备，自带的应用市场辣鸡）

![点击开发者选项](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B/4.png)

##### PC端连接口袋阅手机

首先下载[adb套件](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%B7%A5%E5%85%B7/adb%E5%A5%97%E4%BB%B6.zip)，解压到D盘根目录下（比如），使用PowerShell打开（需与abd.exe文件在同一目录），输入 `.\adb.exe devices`

![启动adb服务](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B/5.png)

使用随机附赠的数据线将手机与电脑USB端口连接, 此时手机上会出现<u style='color:red; '>允许调试的弹框</u>的弹框（这里没有截图了），选择<u style='color:red; '>允许</u>即可
重新运行上面的指令会发现多了一个设备出来（笔者这里没有USB线，用的是网络连接的方式，有兴趣的童鞋也可搜索学习下，[Android 网络调试 adb tcpip 开启方法](https://www.cnblogs.com/clovershell/p/10684053.html)）

至此，你现在就可以用电脑给手机安装一些apk啦

## 1、autojs安装

（口袋阅机器要安装需要先开启开发者选项并且PC连接哦）
下载Autojs安装包：[Auto.js_4.0.4 Alpha11](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E8%BD%AF%E4%BB%B6/Auto.js_4.0.4%20Alpha11.apk)
使用adb工具连接手机后，用命令安装上面下载下来的apk文件（这里最好将apk文件和abd.exe文件放在同一目录下）
输入指令`.\adb.exe install '.\Auto.js_4.0.4 Alpha11.apk'`
![安装Autojs](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B/6.png)
回车安装完成后，打开应用中心，查看是否安装成功（神奇的彩色出现了）
![安装成功](https://pocketreader-1300557812.cos.ap-nanjing.myqcloud.com/%E5%8F%A3%E8%A2%8B%E9%98%85%E6%89%93%E5%8D%A1%E5%8A%A9%E6%89%8B/7.png)

## 2、脚本运行方法

下载js文件，导入autojs，点击运行即可（第一次运行会让你打开无障碍模式，点击autojs，选择打开即可，这里很简单，就不赘述了）

## 3、注意项

* 本脚本支持每天刷30分钟，300页，如有需要，请自行更改代码（改变变量即可）
* 支持第二次运行自动记忆上次完成的分钟数和页数
* 自动模拟阅读，翻页操作增加了1-6秒的随机阅读时间，避免被认为是机器人

## 4、后续计划

~~待满15天后完成自动打卡功能（写于20200810），计划将打卡信息（成功或者失败）以邮件形式发送提醒到个人~~

终于可以报名了，果然下订单20天即可报名，之前的担心多余了

已完成自动打卡功能，由于系统限制，需先跳转至autojs界面方可进入活动页面

~~邮件提醒功能待开发（想想好像不是那么容易，短信提醒又没有免费的API，好像坑有点难填呀）~~

## 5、补充通知

今天（2020-10-14）收到消息，部分读者在打卡的时候出现了验证码，故而本脚本决定去除自动打卡功能（哭哭）
有兴趣的童鞋可以关注下公众号，作者会每天分享自己打卡信息，只要持续地努力, 不懈地奋斗, 就没有征服不了的东西！！！
