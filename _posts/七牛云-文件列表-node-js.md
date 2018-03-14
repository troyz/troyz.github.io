---
title: 七牛云-文件列表-node.js
date: 2016-08-31 17:59:35
tags: [杂七杂八]
---

如题，在七牛上放了一些文件，有的时候想查看文件列表
``` bash
$ npm install qiniu
```
``` javascript
$ vim file_list.js
var qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = '************';
qiniu.conf.SECRET_KEY = '************';
var bucket = 'YOUR_BUCKET';
qiniu.rsf.listPrefix(bucket, '', '', 1000, '', function(err, ret)
{
    if(err)
    {
        console.log(err);
    }
    else
    {
        console.log(ret);
    }
});
```

运行：
``` bash
$ node file_list.js
```
> // 输出结果：
{
  "marker": "xxx",
  "items": [
    {
      "key": "baicaopanjinqu/万年泉.jpg",
      "hash": "Fhyfof9FBr4P-BAnY-Y4W7FBSto5",
      "fsize": 432375,
      "mimeType": "image/jpeg",
      "putTime": 14695198342091094
    },
    {
      "key": "baicaopanjinqu/冰川杜鹃.jpg",
      "hash": "FqKT3TzLthFhMOVNUdy2JZV5ewI3",
      "fsize": 567102,
      "mimeType": "image/jpeg",
      "putTime": 14695198328191896
    }
  ]
}

---------------------------

> 参考：[七牛Node.js SDK 使用指南](http://developer.qiniu.com/code/v6/sdk/nodejs.html)、[Node.js SDK 源码地址](https://github.com/qiniu/nodejs-sdk)
