---
title: iOS自动打包ipa（shell脚本）
date: 2016-09-01 15:16:22
tags: [iOS]
---

### 系列
[iOS自动打包ipa（shell脚本）](http://www.jianshu.com/p/683f1bb610a4)
[iOS自动打包ipa（Python脚本）](http://www.jianshu.com/p/e55f76385ed9)

### 安装[xctool](https://github.com/facebook/xctool)
``` bash
brew install xctool
```

### shell脚本
``` bash
// 将脚本保存到iOS项目的根目录
$ cd $iOS项目目录
$ vim build_using_xctool.sh
```

``` bash
#!/bin/bash

if [[ $# < 1 ]]; then
  echo "请输入更新日志"
  exit 2
fi

#计时
SECONDS=0

#假设脚本放置在与项目相同的路径下
project_path=$(pwd)
#取当前时间字符串添加到文件结尾
now=$(date +"%Y_%m_%d_%H_%M_%S")

#指定项目的scheme名称
scheme="******"
#指定要打包的配置名
configuration="Release"
#指定打包所使用的provisioning profile名称
provisioning_profile='******'

#指定项目地址
workspace_path="$project_path/******.xcworkspace"
#指定输出路径
output_path="******"
#指定输出归档文件地址
archive_path="$output_path/******${now}.xcarchive"
#指定输出ipa地址
ipa_path="$output_path/******${now}.ipa"

#输出设定的变量值
echo "===workspace path: ${workspace_path}==="
echo "===archive path: ${archive_path}==="
echo "===ipa path: ${ipa_path}==="
echo "===profile: ${provisioning_profile}==="

#先清空前一次build
xctool clean -workspace ${workspace_path} -scheme ${scheme} -configuration ${configuration}

#根据指定的项目、scheme、configuration与输出路径打包出archive文件
xctool build -workspace ${workspace_path} -scheme ${scheme} -configuration ${configuration} archive -archivePath ${archive_path}

#使用指定的provisioning profile导出ipa
#我暂时没找到xctool指定provisioning profile的方法，所以这里用了xcodebuild
xcodebuild -exportArchive -archivePath ${archive_path} -exportPath ${ipa_path} -exportFormat ipa -exportProvisioningProfile "${provisioning_profile}"

echo "===upload .ipa to PGYER==="
#上传.ipa到蒲公英，参数`updateDescription`是更新日志
#参数请查阅：https://www.pgyer.com/doc/api#uploadApp
curl -F "file=@${ipa_path}" -F "uKey=******" -F "_api_key=******" -F "updateDescription=$1" http://www.pgyer.com/apiv1/app/upload

echo ""

#输出总用时
echo "===Finished. Total time: ${SECONDS}s==="

#通知
osascript -e 'display notification "打包上传蒲公英成功！" with title "任务完成"'
```

``` bash
//让脚本可以被执行
$ chmod a+x build_using_xctool.sh
```

### 打包
``` bash
$ cd $iOS项目目录

// 引号("")中的内容会被作为更新日志提交到蒲公英网站，如果希望日志换行，则在控制台键入Enter符
$ ./build_using_xctool.sh "2016年8月4号，
>1，修复部分页面bugs"
```

> 参考文章：http://www.jianshu.com/p/54ab07f2e63b