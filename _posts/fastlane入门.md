---
title: fastlane入门
date: 2016-09-01 14:59:25
tags: [iOS,fastlane]
---

### [Appfile](https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Appfile.md)
- 在Fastfile中读取`Appfile`中变量

### [Advanced](https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Advanced.md)
- 参数传递
- `lane`切换
- 环境变量
- 执行`shell`命令

### [match](https://github.com/fastlane/fastlane/tree/master/match)
只用预先创建一个空的`private git repo`即可，但是这里有一个坑，`git_url`必须是`ssh`协议的才行，`https`协议的貌似不行。

`match`会先去创建`Certificate`，就算你的`Team`下之前已经有证书了（是其他人创建的），`match`依然会为你创建一个新的证书，并且会创建一个新的`Provisioning Profile`，命名方式为`match AppStore <bundle id>`