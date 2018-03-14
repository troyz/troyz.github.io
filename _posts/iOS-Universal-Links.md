---
title: iOS Universal Links
date: 2016-09-01 15:01:46
tags: [iOS]
---
### `iOS Universal Links`功能简介
举个栗子：用户在手机上通过`Safari`浏览器查看`简书`的某篇文章时，会打开用户手机上的`简书App`并进入到这篇文章，从而实现了`从浏览器到App的无缝链接`

### 前提条件
要使用`iOS Universal Links`功能需要如下前提条件：
- `iOS` 9+
- 要有一个网站，并且支持`Https`

### 配置
##### JSON配置文件
命名为`apple-app-site-association`的JSON配置文件，放到网站的根目录，可以通过Https访问，以`简书`为例子[http://jianshu.com/apple-app-site-association](http://jianshu.com/apple-app-site-association)
``` javascript
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "KS7QAPBMXA.com.jianshu.Hugo",
        "paths": [ "/p/*", "/collection/*", "/users/*", "/notebooks/*" ]
      }
    ]
  }
}
```
简单解释一下：如果在浏览器中访问的某个简书页面的url匹配`paths`规则，则尝试打开`Team ID`为`KS7QAPBMXA`且`Bundle ID`为`com.jianshu.Hugo`的App，并且将url传递给App。

##### iOS App 配置
![Domains配置](http://upload-images.jianshu.io/upload_images/267318-b2affeb20ee0f58d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### iOS接收并处理url参数
`AppDelegate`

``` objc
import UIKit
 
extension AppDelegate {
    func application(application: UIApplication, continueUserActivity userActivity: NSUserActivity, restorationHandler: ([AnyObject]?) -> Void) -> Bool {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb {
            let webpageURL = userActivity.webpageURL! // Always exists
            if !handleUniversalLink(URL: webpageURL) {
                UIApplication.sharedApplication().openURL(webpageURL)
            }
        }
        return true
    }
     
    private func handleUniversalLink(URL url: NSURL) -> Bool {
        if let components = NSURLComponents(URL: url, resolvingAgainstBaseURL: true), let host = components.host, let pathComponents = components.path?.pathComponents {
            switch host {
            case "domain.com":
                if pathComponents.count >= 4 {
                    switch (pathComponents[0], pathComponents[1], pathComponents[2], pathComponents[3]) {
                    case ("/", "path", "to", let something):
                        if validateSomething(something) {
                            presentSomethingViewController(something)
                            return true
                        }
                    default:
                        return false
                    }
                }
            default:
                return false
            }
             
        }
        return false
    }
}
```

返回`true`表示处理成功，会打开App并进入到对应的页面；返回`false`表示处理失败，会停留在Safari页面。

> 参考：[iOS 9学习系列：打通 iOS 9 的通用链接（Universal Links）](http://www.cocoachina.com/ios/20150902/13321.html)