---
title: Mac与iPhone/iPad设备数据同步（基于USB）
date: 2016-08-31 17:57:47
tags: [Mac, iPhone]
---

### 背景
Mac与iPhone/iPad之间数据传输常见的有以下几种方式：
- AirDrop
- 蓝牙
- iCloud共享
- iTunes
- Mac上`照片`应用导入
以上几种方式都可以，而且前面3种不需要USB就可进行，后面2种需要借助iPhone电源线插入Mac的USB接口才能使用。

但是，这几种方式都不是我想要的，因为这几种方式都`需要在Mac、iPhone设备上来来回回的配置`，而我比较懒~~~。

我需要一种`自动化`的工具来帮我完成数据同步，当iPhone电源线接到Mac后，可以用命令行来完成数据的同步工作。

> **初衷：**iPhone版本的**`百度云盘App`不能免费同步视频**了，需要开通会员才行！（⊙o⊙）其实我写这篇文章的目的只是想把手机上的视频自动上传到百度云盘而已！

### MobileDevice
**[MobileDevice](https://github.com/mountainstorm/MobileDevice)**是一个Python的命令行工具，它封装了苹果的MobileDevice API（C）

##### 用法：
``` bash
$ python MobileDevice/ afc -h
```
可以看到它支持以下用法：
``` bash
    ls                  lists the contents of the directory
    mkdir               creates a directory
    rm                  remove directory/file
    rmdir               remove directory/file
    ln                  create a link (symbolic or hard)
    get                 retrieve a file from the device
    put                 upload a file from the device
    view                retrieve a file from the device and preview as txt
```
##### 简单使用一下
查看iPhone的`/var/mobile/Media/`的子目录信息：
``` bash
$ python MobileDevice/ afc ls /var/mobile/Media/
0: ******************** - "“issuser”的 iPhone"
afc:  /
d  102  04 Jan 08:18  AirFair/
d  306  10 Aug 02:28  Airlock/
d  238  23 Nov 01:42  Books/
d  136  10 Aug 02:34  DCIM/
d  170  10 Aug 02:42  Downloads/
d  170  23 Nov 04:42  MediaAnalysis/
d  850  10 Aug 02:47  PhotoData/
d   68  10 Aug 02:43  Photos/
d   68  10 Aug 03:00  PublicStaging/
d  102  04 Jan 08:18  Purchases/
d  170  31 Dec 08:54  Radio/
d   68  30 Dec 03:11  Recordings/
d  102  10 Aug 02:28  Safari/
d   68  04 Jan 08:07  general_storage/
d  204  04 Jan 08:18  iTunes_Control/
-  181  04 Jan 08:44  ifbfav.plist
```
`DCIM`就是iPhone的照片、视频保存的文件夹；没错，我们需要从这个目录获取(`get`)视频。

##### 列出iPhone下的照片、视频
``` bash
$ python MobileDevice/ afc ls /var/mobile/Media/DCIM/100APPLE
0: ******************** - "“issuser”的 iPhone"
afc:  /DCIM/100APPLE
-   6164996  10 Aug 02:32  IMG_0037.PNG
-     18738  10 Aug 02:44  IMG_0038.JPG
-  15705880  10 Aug 02:47  IMG_0039.MOV
```
`MOV`格式就是视频，

##### 拷贝iPhone视频到Mac
``` bash
$ python MobileDevice/ afc get /var/mobile/Media/DCIM/100APPLE/IMG_0039.MOV IMG_0039.MOV
```

### 自动化脚本
- 增量式拷贝iPhone的视频到Mac
- 如果某个视频文件在Mac上已经存在，则跳过。
**`movie.py`**

``` python
#! /usr/bin/python
#coding=utf-8
# -*- coding:utf8 -*-

from MobileDevice import *
import os
import shutil
import sys
reload(sys)

sys.setdefaultencoding('utf8')

def listIphoneMovies(afc, path):
    for name in afc.listdir(path):
        isdir = u''
        if afc.lstat(path + name).st_ifmt == stat.S_IFDIR:
            isdir = u'/'
        # print path + name + isdir
        if afc.lstat(path + name).st_ifmt == stat.S_IFDIR:
            listIphoneMovies(afc, path + name + isdir)
        else:
            (_,ext) = os.path.splitext(name)
            if ext.lower() == ".mov":
                copyMovieFileFromIphoneToMac(afc, path, name)

def copyMovieFileFromIphoneToMac(afc, path, name):
    spath = path + name
    dpath = os.path.join('/Users/issuser/百度云同步盘/iPhone视频', name)
    tmppath = os.path.join(os.getcwd(), name)
    if os.path.exists(dpath):
        print("Movie already exists on Mac: " + spath)
        return
    print("copy iPhone movie: " + path + name + " to Mac: " + dpath)
    s = afc.open(spath, u'r')
    d = open(tmppath, u'w+')
    len = 2048
    while True:
        buf = s.read(len)
        if not buf:
            break
        d.write(buf)
    # d.write(s.readall())
    d.close()
    s.close()
    shutil.move(tmppath, dpath)


dev = list_devices().values()[0]
dev.connect()
#afc = AFC(dev)
afc = afcmediadirectory.AFCMediaDirectory(dev)
#listIphoneMovies(afc, u'/var/mobile/Media') # recursive print of all files visible
listIphoneMovies(afc, u'/DCIM/100APPLE/') # recursive print of all files visible

afc.disconnect()
```

> **注意：**，[MobileDevice](https://github.com/mountainstorm/MobileDevice)的[README.md](https://github.com/mountainstorm/MobileDevice/blob/master/README.md)中的例子有问题，不能直接运行；编写脚本的时候可以参考[afcmediadirectory.py](https://github.com/mountainstorm/MobileDevice/blob/master/afcmediadirectory.py)中的`cmd_*`函数

##### 执行脚本
``` bash
$ python movie.py
```

```
Movie already exists on Mac: /DCIM/100APPLE/IMG_0038.MOV
copy iPhone movie: /DCIM/100APPLE/IMG_0039.MOV to Mac: /.../IMG_0039.MOV
```

##### 后续
现在我们已经将iPhone上的视频拷贝到Mac的目录了，下一步就设置百度云Mac客户端的默认同步目录为上面的Mac目录，视频就自动从Mac上传到百度云盘了。
