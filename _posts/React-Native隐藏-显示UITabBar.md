---
title: React Native隐藏/显示UITabBar
date: 2016-09-01 14:15:35
tags: [react-native,mobile]
---

``` objc
// RCTTabBar.h
- (UITabBar *)tabBar;

// RCTTabBar.m
- (UITabBar *)tabBar
{
    return _tabController.tabBar;
}
```

``` objc
// RCTTabBarManager.m
RCT_EXPORT_METHOD(showTabBar:(nonnull NSNumber *)reactTag
                  animated:(BOOL)animated)
{
  [self.bridge.uiManager addUIBlock:
   ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry){
       RCTTabBar *rctTabBar = viewRegistry[reactTag];
       UITabBar *tabBar = [rctTabBar tabBar];
       [self toggleTabBar:tabBar withShow:YES withAnimated:animated];
   }];
}

RCT_EXPORT_METHOD(hideTabBar:(nonnull NSNumber *)reactTag
                  animated:(BOOL)animated)
{
    [self.bridge.uiManager addUIBlock:
     ^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry){
         RCTTabBar *rctTabBar = viewRegistry[reactTag];
         UITabBar *tabBar = [rctTabBar tabBar];
         [self toggleTabBar:tabBar withShow:NO withAnimated:animated];
     }];
}

- (void)toggleTabBar:(UITabBar *)tabBar withShow:(BOOL)isShow withAnimated:(BOOL)animated
{
    CGFloat screenWidth = [[UIScreen mainScreen] bounds].size.width;
    CGFloat screenHeight = [[UIScreen mainScreen] bounds].size.height;
    BOOL isCurrentShow = (tabBar.frame.origin.y == (screenHeight - 49));
    CGFloat y = isShow ? (screenHeight - 49) : screenHeight;
    CGRect frame = CGRectMake(0, y, screenWidth, 49);
    if(animated)
    {
        [UIView animateWithDuration:0.3 animations:^{
            tabBar.frame = frame;
        }];
    }
    else
    {
        tabBar.frame = frame;
    }
}
```

``` objc
// TabBarIOS.ios.js
var TabBarManager = require('NativeModules').TabBarManager;
var findNodeHandle = require('findNodeHandle');

var TabBarIOS = React.createClass({
    hideTabBar: function(animated=true)
    {
        TabBarManager.hideTabBar(findNodeHandle(global.tabBar), animated);
    },
    showTabBar: function(animated=true)
    {
        TabBarManager.showTabBar(findNodeHandle(global.tabBar), animated);
    },
});
```

``` html
// 使用
<TabBarIOS
    ref={(tabBar)=>{global.tabBar = tabBar;}}>
...
</TabBarIOS>

// 显示
global.tabBar.showTabBar();

// 隐藏
global.tabBar.hideTabBar();
```