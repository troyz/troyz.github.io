---
title: iOS UIAlertView消失后键盘重新弹出问题
date: 2016-09-01 15:18:07
tags: [iOS]
---

# 描述
最近在项目中发现一个小问题：手机当前界面有一些输入框，
- 1.点击确定按钮后->
- 2.代码隐藏键盘->
- 3.提交数据到服务端->
- 4.服务端返回结果->
- 5.弹出UIAlertView呈现结果->
- 6.用户点击UIAlertView中的按钮->
- 7.Dismiss UIAlertView->
- 8.**键盘诡异的又自动弹出来了**

简单来说是**过程2到过程7的时间太过短暂**造成的，无语了~~。

# 解决方案：
## iOS8+
```
But since iOS 8, I suggest to use the UIAlertController instead of UIAlertView.
```

## 继续用UIAlertView
``` objc
// you must put around .6 second gap in hiding keyboard and presenting alert
// 隐藏键盘后延迟0.6秒弹出UIAlertView
[YOUR_TEXT resignFirstResponder];
dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(.6 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      _alertVw = [[UIAlertView alloc] initWithTitle:@"" message:@"message." delegate:self cancelButtonTitle:@"Ok" otherButtonTitles:nil, nil];
      [_alertVw show];
});
```

> 参考 [Keyboard will appeared automatically in ios 8.3 while displaying alertview or alertcontroller](http://stackoverflow.com/questions/30498972/keyboard-will-appeared-automatically-in-ios-8-3-while-displaying-alertview-or-al)