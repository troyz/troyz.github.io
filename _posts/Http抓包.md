---
title: Http抓包
date: 2016-08-31 16:38:12
tags: [http]
---

### 抓包工具

| 工具 | OS | 特点 | 教程 |
| - | - | - | - |
| [Fiddler](http://www.telerik.com/fiddler) | Windows | **监控**机器上发送的Http(s)请求<br> 模拟发送Get/Post请求<br>可作为**代理** | [Fiddler教程](http://cache.baiducontent.com/c?m=9f65cb4a8c8507ed4fece763105392230e54f73260878e482a958448e435061e5a00b0e77e484b578ed82f2750f51218bded367034033db59bd58a4ec0bb93292a8d273e671cf11b548c47bb8e1b65972fc401bff947b0fae732e2f494959d&p=8b2a97299fb111a05be6912a1e5e8b&newp=8b2a97128d821deb08e29775080789231610db2151d4d31f6b82c825d7331b001c3bbfb423231302d6c1796404ac495de8f436793d092ba3dda5c91d9fb4c57479df7c752c58&user=baidu&fm=sc&query=fiddler+http&qid=eed90de700111576&p1=9)<br>.<br>[SSL Certificates](http://docs.telerik.com/fiddler/Configure-Fiddler/Tasks/ConfigureForiOS) |
| [PostMan](http://www.getpostman.com/) | 跨平台 | 可模拟发送Get/Post请求<br>保存请求、重命名<br>环境变量、批量测试 | [API开发神器-Postman](http://www.jianshu.com/p/615f668d91a6) <br>.<br>[Testing Sandbox](https://www.getpostman.com/docs/sandbox) <br>.<br>[代理iPhone/Android设备](http://blog.getpostman.com/2016/06/26/using-postman-proxy-to-capture-and-inspect-api-calls-from-ios-or-android-devices/)|
| [Charles](https://www.charlesproxy.com/) | 跨平台 | **监控**机器上发送的Http(s)请求<br> 模拟发送Get/Post请求<br>可作为**代理** |[Charles 从入门到精通](http://blog.devtang.com/2015/11/14/charles-introduction/) <br>.<br> [Charles中文乱码](http://www.jianshu.com/p/7a332f6ccfbd)<br>.<br>[SSL Certificates](https://www.charlesproxy.com/documentation/using-charles/ssl-certificates/)|
> **代理**工具的用途：举个例子，你可以在iPhone上配置网络代理为你PC机器上`Fiddler`/`Charles`监听的IP、端口，然后`Fiddler`/`Charles`就可以监听到你iPhone设备上发送的Http(s)请求。
