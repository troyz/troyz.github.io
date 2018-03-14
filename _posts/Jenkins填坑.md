---
title: Jenkins填坑
date: 2016-09-01 15:00:21
tags: [iOS,CI]
---

### 前言
记录使用`Jenkins`打包`iOS`过程中所遇到的各种问题

### There are no schemes in workspace
```
$ xcodebuild -list -workspace ***.xcworkspace
There are no schemes in workspace "***".
```

解决方案：
![There are no schemes in workspace](http://upload-images.jianshu.io/upload_images/267318-c3dc0eb262074cad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### ResourceRules.plist: cannot read resources
解决方案：
```
$(SDKROOT)/ResourceRules.plist
```
![ResourceRules.plist: cannot read resources](http://upload-images.jianshu.io/upload_images/267318-880bd71f0c5fc034.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
