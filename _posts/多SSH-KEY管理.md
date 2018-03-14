---
title: 多SSH KEY管理
date: 2016-08-31 17:55:51
tags: [ssh, linux]
---

### 背景
我的`Mac`要求既可以提交代码到`github`，也可以提交代码到`oschina`，提交的时候都走`ssh`协议，但是默认情况下只能有一个`ssh key`(~/ssh)

### 生成公钥、私钥
``` bash
$ ssh-keygen -t rsa -C "your_github_email@example.com"
保存到 `~/.ssh/id_rsa_github`

$ ssh-keygen -t rsa -C "your_oschina_email@example.com"
保存到 `~/.ssh/id_rsa_oschina`
```

### 配置`ssh`代理
``` bash
// 查看系统ssh-key代理
$ ssh-add -l

// 如果系统已经有ssh-key 代理 ,执行下面的命令可以删除
$ ssh-add -D

// 把 ~/.ssh 目录下的2个私钥添加的 ssh-agent
$ ssh-add ~/.ssh/id_rsa_github
$ ssh-add ~/.ssh/id_rsa_oschina

// 在 .ssh 目录创建 config 配置文件
$ vim ~/.ssh/config
#  github 配置
Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_github

# oschina配置
Host oschina
    HostName git.oschina.net
    User git
    IdentityFile ~/.ssh/id_rsa_oschina
```

把`github`公钥(`~/.ssh/id_rsa_github.pub`)配置到[github SSH keys](https://github.com/settings/keys)
把`oschina`公钥(`~/.ssh/id_rsa_oschina.pub`)配置到[oschina SSH 公钥管理](http://git.oschina.net/keys)

### 验证
``` bash
// 查看ssh-key代理，会看到2条记录
$ ssh-add -l

// 访问github
$ ssh -T git@github.com
Hi 用户名! You have successfully authenticated, but GitHub does not provide shell access.

// 访问oschina
$ ssh -T git@git.oschina.net
Welcome to Git@OSC, 用户名!
```

> 参考： 
[同一台电脑关于多个SSH KEY管理](http://yijiebuyi.com/blog/f18d38eb7cfee860c117d629fdb16faf.html)
[开源中国SSH Key](https://git.oschina.net/oschina/git-osc/wikis/%E5%B8%AE%E5%8A%A9#ssh-keys)