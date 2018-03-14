---
title: Charles中文乱码
date: 2016-08-31 17:57:10
tags: [http]
---

### 前言
正常情况下，`Server`端提供给`Client`端的所有接口的`Response`中应该有字符集的`Header`设置：
```
Content-Type: application/json;charset=UTF-8
```
如果没有，可能造成某些平台的`Client`中文解析乱码。

很不幸，我们团队的`Server`端开发人员的意识不够，很多`JSON`接口都不规范，用[Charles](https://www.charlesproxy.com/)抓包中文乱码。

以下为解决[Charles](https://www.charlesproxy.com/)中文乱码的方案：

### 方案1：修改`Charles`的配置文件`Info.plist`

右键Charles->在Finder中显示->右键`Charles.app`->显示包内容->Contents->双击打开Info.plist


![修改JVMOptions: -Dfile.encoding=UTF-8](http://upload-images.jianshu.io/upload_images/267318-4d6343017c1deee1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

网上很多人都是用这种方式，但是我试了下，没有成功，我的[Charles](https://www.charlesproxy.com/)版本是`v3.11.1`

### 方案2：在`Charles`中`Rewrite` `Header`
打开`Charles`->Tool->Rewrite->勾选`Enable Rewrite`->点击`Sets`面板`Add`按钮->右侧`Locations`面板点击`Add`按钮输入url匹配规则(你server端的url规则)->右侧`Rules`面板点击`Add`按钮输入，详情如下图：

![Charles Rewrite规则配置](http://upload-images.jianshu.io/upload_images/267318-6f7d52c438b67551.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**注意**：这里需要根据你`Server`端返回数据的具体情况来，因为我的`Server`端并没有返回`Content-Type`这个Header，并且所有接口都返回了`Server: Apache-Coyote/1.1`这个Header，所以我这个`Rewrite`规则实际上是修改`Server: Apache-Coyote/1.1`为`Content-Type: application/json;charset=UTF-8`
