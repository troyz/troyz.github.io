title: git
speaker: Troy Zhang
transition: slide3
files: /js/demo.js,/css/demo.css,/js/zoom.js
theme: moon
usemathjax: yes

[slide]

# Git使用
<small>Troy Zhang</small>

[slide]
## Git简介
----
* 分布(/集中)式版本管理系统 {:&.rollIn}
* Linux
* branch
* tag
* GitHub, fork, pull request, issue, CI, comments

[slide]
## 特点
----
* 不需要联机 {:&.rollIn}
* 每台机器都是一个版本库，可提交到统一的服务器
* 本地包含完整的commit日志
* 可创建本地分支，在分支上开发

[slide]
## Git工作流
![工作流](https://github.com/troyz/blog-resources/blob/master/images/git_flow.png?raw=true)

[slide]
## [安装](https://git-scm.com/downloads)
----
* [Mac OS X](https://git-scm.com/download/mac) {:&.rollIn}
* [Windows](https://git-scm.com/download/win)

[slide]
## 配置
``` bash
# 查看配置列表
$ git config -l

# 配置git全局邮箱
$ git config --global user.email "xxxx@163.com"

# 配置git全局用户名
$ git config --global user.name "用户名"
```

[slide]
## 常用命令1-本地管理
``` bash
# 初始化项目--全新的项目
$ git init

# 初始化项目--已存在的项目
$ git clone ssh://xdzhangm@iss110301000305/LBTravel.git

# 添加新文件
$ git add .

# 提交代码到本地版本库
$ git commit -am "xxxx"

# 查看日志
$ git log

# 获取某个时间点的代码
$ git checkout 3286ea4

# 查看当前branch
$ git branch
```

[slide]
## .gitignore
``` bash
# 哪些文件是不需要版本管理的？
$ cat .gitignore

.svn
.svn/*
*svn*
.DS_Store
wc.db
build
build/*
```

[slide]
## 常用命令2-branch管理
``` bash
# 从当前分支创建新的分支
$ git checkout -b dev

# 提交代码
$ git commit -am "....."

# 切换分支
$ git checkout master

# 合并代码
$ git merge dev
```

[slide]
## tags
``` bash
# 创建tag
$ git tag -a v1.0.0 -m "......."

# 查看tag列表
$ git tag -l

# 提交tag到origin这台远程服务器
$ git push origin --tags

# 删除本地tag
$ git tag -d v1.0.0

# 删除远程tag
$ git push origin :refs/tags/v1.0.0
```

[slide]
## Gitlab
----
* 用户/组/权限 {:&.rollIn}
* Code Review / WIKI / 代码片断
* [待办](http://issmobile/dashboard/todos) / [待处理issues](http://issmobile/dashboard/issues?assignee_id=2) / [check list](http://issmobile/mobile/react-wechat/issues/9)
* README / [issues](http://issmobile/mobile/rn-travel-core/issues) / Change log / Release / milestone
* 邮件 / `@` notification
* 统计：提交次数/活跃度/[人员贡献](http://114.115.167.240/gitlab/mobile/rn-travel-core/graphs/master)/issues数量/代码行数/[代码语言](http://114.115.167.240/gitlab/mobile/rn-travel-core/graphs/master/charts)
* [转移项目](http://114.115.167.240/gitlab/mobile/rn-travel-core/edit)
* CI

[slide]
## SSH配置
``` bash
# 创建公钥、私钥
$ ssh-keygen -t rsa -C "xxx@isstech.com"

# 上传公钥（在github/gitlab服务器上配置，用户从本地推送代码的时候服务器会验证用户的身份）
$ cat ~/.ssh/id_rsa.pub

# 配置SSH密钥：http://114.115.167.240/gitlab/profile/keys
# 如果某用户有多台电脑，可配置多个SSH密钥
```

> <small> 键盘【N】键 </small> {:&.pull-right}

[note]
> 有 gitlab/github/gitee 多帐号，每个的帐号不一样怎么办？
``` bash
# 多ssh管理（一般不需要）
$ vim ~/.ssh/config
Host github
    HostName github.com
    User github_user
    IdentityFile ~/.ssh/id_rsa_github
$ ssh-add -l
```
[/note]

[slide]
## 常用命令3-推送代码到服务器

* [先新建项目](http://114.115.167.240/gitlab/projects/new)

``` bash
# 添加远程库
# origin：远程服务器别名，可添加多个
$ git remote add origin git@114.115.167.240:mobile/demo.git

# 查看远程库
$ git remote -v

# 提交到远程库
# master：分支名称   （把当前工作空间的master分支代码推送到origin这台远程服务器）
$ git push origin master
```

[slide]
## 常用命令4-从服务器更新代码
``` bash
# （可不用）从origin这台服务器拉取master分支的最新代码到本地，**但是不合并代码**
$ git fetch origin master

# （一步到位）从origin这台服务器拉取master分支的最新代码到本地，并且合并代码
$ git pull origin master

# 查看合并代码后是否有冲突
$ git status -s
```

[slide]
## merge / conflict
----
* 自动合并 {:&.rollIn}
* 手动解决

[slide]
## 常见案例-从服务器更新代码
![pull error](/images/git_pull_error.png)

[slide]
## 常见案例-向服务器推送代码
![pull error](/images/git_push_error.png)


[slide]
## Gitlab网站使用
----
* 权限/用户/组 {:&.rollIn}
* 新建项目/文件上传
* 创建issue / wiki / tag / release

[slide]
## 经验
----
* 陋习：开发工具格式化整个文件
* 不要大提交，尽量拆分成小提交
* 写代码前先`pull`
* 写代码前先看当前在哪个分支上
* 善用`branch`：master/develop
* 善用`tag`/`release`
* 用markdown写README/wiki/blog/...
* 按`组`/`项目`划分存储

[slide]
## 复杂？
| Tool | 适用人员 | 文件类型 |
| - | - | - |
| [gitlab](http://114.115.167.240/gitlab) | 开发人员 / 测试人员 | code / issues / wiki / ci |
| [wiki](http://114.115.167.240/doc) | 管理人员 / 美工 / 开发人员 | 项目文档 / 设计稿 / 效果图 / API 文档 / blog |

[slide]
## WIKI
* 空间 {:&.rollIn}
* 页面
* 评论/通知

[slide]
## 参考资料
----
* [Git官方教程](https://git-scm.com/book/zh/v2) {:&.rollIn}
* [廖雪峰Git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)