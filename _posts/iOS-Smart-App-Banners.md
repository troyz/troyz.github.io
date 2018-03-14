---
title: iOS Smart App Banners
date: 2016-09-01 15:01:03
tags: [iOS]
---

### 简介
在`iOS6`之后，`Safari`增加了一项目功能：可以检测手机是否安装了某个App，并且在页面顶部显示一个Banner；
如果没有安装App，则Banner显示App的基本信息，点击后进入在`App Store`下载页面；
如果已经安装了App，则Banner显示App的基本信息，点击打开App。


![未安装App时Banner](http://upload-images.jianshu.io/upload_images/267318-3fdaf39a0df621e6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![已安装时Banner](http://upload-images.jianshu.io/upload_images/267318-fdbaa7336026fa6b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 配置
只需要在页面中配置一下：
```html
<meta name="apple-itunes-app" content="app-id=xxxxxxx"/>  
```

当然，也可以添加参数，点击打开App的时候，会将参数传递给App
```html
<meta name="apple-itunes-app" content="app-id=xxxxxxx, affiliate-data=myAffiliateData, app-argument=myURL">
```


> 参考：[Promoting Apps with Smart App Banners](https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html)