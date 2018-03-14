---
title: iOS自动打包ipa（Python脚本）
date: 2016-09-01 15:15:14
tags: [iOS]
---

### 系列
[iOS自动打包ipa（shell脚本）](http://www.jianshu.com/p/683f1bb610a4)
[iOS自动打包ipa（Python脚本）](http://www.jianshu.com/p/e55f76385ed9)

### 安装Python库
``` bash
$ pip install requests
```

### Python脚本
``` bash
$ cd iOS项目目录
$ vim build_using_python.py
```

``` python
#! /usr/bin/python
#coding=utf-8
# -*- coding:utf8 -*-

from optparse import OptionParser
import subprocess
import requests
import os

#configuration for iOS build setting
CODE_SIGN_IDENTITY = "iPhone Distribution:************.,Ltd"
PROVISIONING_PROFILE = "************"
CONFIGURATION = "Release"
SDK = "iphoneos"
WORKSPACE = "******.xcworkspace"
TARGET = "******"
SCHEME = "******"

# configuration for pgyer
PGYER_UPLOAD_URL = "http://www.pgyer.com/apiv1/app/upload"
DOWNLOAD_BASE_URL = "http://www.pgyer.com"
USER_KEY = "************"
API_KEY = "************"

def cleanBuildDir(buildDir):
  cleanCmd = "rm -r %s" %(buildDir)
  process = subprocess.Popen(cleanCmd, shell = True)
  process.wait()
  print "cleaned buildDir: %s" %(buildDir)


def parserUploadResult(jsonResult):
  resultCode = jsonResult['code']
  if resultCode == 0:
    downUrl = DOWNLOAD_BASE_URL +"/"+jsonResult['data']['appShortcutUrl']
    print "Upload Success"
    print "DownUrl is:" + downUrl
    showNotification("任务完成!", "Upload Success!");
  else:
    print "Upload Fail!"
    print "Reason:"+jsonResult['message']
    showNotification("Upload failure!", "Reason:"+jsonResult['message']);

def uploadIpaToPgyer(ipaPath, comments):
    print "ipaPath:"+ipaPath
    files = {'file': open(ipaPath, 'rb')}
    headers = {'enctype':'multipart/form-data'}
    payload = {'uKey':USER_KEY,'_api_key':API_KEY,'updateDescription':comments}
    print "uploading...."
    r = requests.post(PGYER_UPLOAD_URL, data = payload ,files=files,headers=headers)
    if r.status_code == requests.codes.ok:
         result = r.json()
         parserUploadResult(result)
    else:
        print 'HTTPError,Code:'+r.status_code
        showNotification("Upload failure!", 'HTTPError,Code:'+r.status_code);

def buildProject(project, target, output, comments):
  buildCmd = 'xcodebuild -project %s -target %s -sdk %s -configuration %s build CODE_SIGN_IDENTITY="%s" PROVISIONING_PROFILE="%s"' %(project, target, SDK, CONFIGURATION, CODE_SIGN_IDENTITY, PROVISIONING_PROFILE)
  process = subprocess.Popen(buildCmd, shell = True)
  process.wait()

  signApp = "./build/%s-iphoneos/%s.app" %(CONFIGURATION, target)
  signCmd = "xcrun -sdk %s -v PackageApplication %s -o %s" %(SDK, signApp, output)
  process = subprocess.Popen(signCmd, shell=True)
  (stdoutdata, stderrdata) = process.communicate()

  uploadIpaToPgyer(output, comments)
  cleanBuildDir("./build")

def buildWorkspace(workspace, scheme, output, comments):
  cleanWorkspace()
  process = subprocess.Popen("pwd", stdout=subprocess.PIPE)
  (stdoutdata, stderrdata) = process.communicate()
  buildDir = stdoutdata.strip() + '/build'
  cleanBuildDir(buildDir)
  showNotification("Clean Success!", "Clean Success! Then Build.")
  print "buildDir: " + buildDir
  buildCmd = 'xcodebuild -workspace %s -scheme %s -sdk %s -configuration %s build CODE_SIGN_IDENTITY="%s" PROVISIONING_PROFILE="%s" SYMROOT=%s' %(workspace, scheme, SDK, CONFIGURATION, CODE_SIGN_IDENTITY, PROVISIONING_PROFILE, buildDir)
  process = subprocess.Popen(buildCmd, shell = True)
  process.wait()
  showNotification("Build Success!", "Build Success! Then Sign.");
  signApp = "./build/%s-iphoneos/%s.app" %(CONFIGURATION, scheme)
  signCmd = "xcrun -sdk %s -v PackageApplication %s -o %s" %(SDK, signApp, output)
  process = subprocess.Popen(signCmd, shell=True)
  (stdoutdata, stderrdata) = process.communicate()
  showNotification("Sign Success!", "Sign Success! Then upload to pgyer.");
  uploadIpaToPgyer(output, comments)
  cleanBuildDir(buildDir)

def showNotification(title, subtitle):
  os.system("osascript -e 'display notification \"" + subtitle + "\" with title \"" + title + "\"'")

def cleanWorkspace():
  buildCmd = 'xcodebuild clean -workspace ' + WORKSPACE + ' -scheme ' + SCHEME + ' -configuration ' + CONFIGURATION
  print "clean workspace: " + buildCmd
  process = subprocess.Popen(buildCmd, shell = True)
  process.wait()

def xcbuild(options):
  # project = options.project
  # workspace = options.workspace
  # target = options.target
  # scheme = options.scheme
  # output = options.output
  # ipa输出到桌面
  output = os.path.expanduser("~") + '/Desktop/' + TARGET + '.ipa'
  comments = options.comments

  if comments is None:
    print "请输入更新日志"
  # elif project is None and workspace is None:
  #   pass
  # elif project is not None:
  #   buildProject(project, target, output, comments)
  else:
    buildWorkspace(WORKSPACE, SCHEME, output, comments)

def main():
  
  parser = OptionParser()
  # parser.add_option("-w", "--workspace", help="Build the workspace name.xcworkspace.", metavar="name.xcworkspace")
  # parser.add_option("-p", "--project", help="Build the project name.xcodeproj.", metavar="name.xcodeproj")
  # parser.add_option("-s", "--scheme", help="Build the scheme specified by schemename. Required if building a workspace.", metavar="schemename")
  # parser.add_option("-t", "--target", help="Build the target specified by targetname. Required if building a project.", metavar="targetname")
  # parser.add_option("-o", "--output", help="specify output filename", metavar="output_filename")
  parser.add_option("-m", "--comments", help="specify the upgrade comments", metavar="upgrade_comments")

  (options, args) = parser.parse_args()

  print "options: %s, args: %s" % (options, args)

  xcbuild(options)

if __name__ == '__main__':
  main()
```

### 参数说明
其中，`CODE_SIGN_IDENTITY`
 为开发者证书标识，可以在 `Keychain Access` -> `Certificates`-> 选中证书右键弹出菜单 -> `Get Info` -> `Common Name` 获取，类似 **`iPhone Distribution: Company name Co. Ltd (xxxxxxxx9A)`**
, 包括括号内的内容。

`PROVISIONING_PROFILE`
: 这个是 `mobileprovision` 文件的 `identifier`，获取方式：
`Xcode` -> `Preferences` -> 选中申请开发者证书的 Apple ID -> 选中开发者证书 -> `View Details…` -> 根据 Provisioning Profiles 的名字选中打包所需的 mobileprovision 文件 -> 右键菜单 -> `Show in Finder` -> 找到该文件后，**除了该文件后缀名的字符串就是 `PROVISIONING_PROFILE`**
 字段的内容。

### 打包
``` bash
$ python build_using_python.py -m "更新日志"
```

> 参考：[iOS自动打包并发布脚本](http://liumh.com/2015/11/25/ios-auto-archive-ipa/)、[github](https://github.com/carya/Util.git)