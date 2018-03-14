---
title: iOS打包错误集锦
date: 2016-09-01 14:58:47
tags: [iOS]
---

### ERROR ITMS-90034
[fix for xcode ERROR ITMS-90034 – Missing or invalid signature](http://blog.frumar.com/fix-for-xcode-error-itms-90034-missing-or-invalid-signature/)

![ERROR ITMS-90034](http://upload-images.jianshu.io/upload_images/267318-496e8492b6180702.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![`始终信任`改为`使用系统默认`](http://upload-images.jianshu.io/upload_images/267318-e6d2f219504860ca.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### ERROR ITMS-90339
[This bundle is invalid . The info.plist contains an invalid key 'CFBundleResourceSpecification’ in app bundle](http://stackoverflow.com/questions/32504355/error-itms-90339-this-bundle-is-invalid-the-info-plist-contains-an-invalid-ke)

Project settings under `Build Settings` > `Code Signing` > `Code Signing Resource Rules Path` - Delete the value for Code Signing Resource Rules Path. That fixed issue for me