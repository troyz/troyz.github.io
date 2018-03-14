---
title: iOS UITableView 刷新
date: 2016-09-01 15:17:14
tags: [iOS]
---

# UITableView常用的刷新方式
``` objc
// UITableView.h

// 方式1：刷新整个table
- (void)reloadData;

// 方式2：刷新指定的cells
- (void)reloadRowsAtIndexPaths:(NSArray<NSIndexPath *> *)indexPaths 
              withRowAnimation:(UITableViewRowAnimation)animation;

// 方式3：多个insert/delete批量事务处理
- (void)beginUpdates;   // allow multiple insert/delete of rows and sections to be animated simultaneously. Nestable
- (void)endUpdates;     // only call insert/delete/reload calls or change the editing state inside an update block.  otherwise things like row count, etc. may be invalid.
```
- `方式1`会刷新整个`table`，一般情况下不建议使用
- 当`cell`显示的数据需要发生变化时，通常采用`方式2`：只刷新指定的`cell(s)`，对`table`中的其它`cell`不会产生影响。
- 当`insert`/`delete` `cell`的时候，一般使用`方式3`，

# 单个Cell的局部刷新
### 案例

我们现在有一个cell，需要显示如下3类信息：

- 用户基本信息：昵称、性别、头像、
- 用户的粉丝数量
- 用户的关注数量
- *以上3类信息的数据由服务端提供了3个不同的接口调用。*

要将这个cell的数据显示完全，需要进行3次接口调用，如果按照`方式2`则需要将`cell`刷新3次！！！如下我将介绍一种`cell`局部刷新的方式：
### cell局部刷新
``` objc
// 更新用户基本信息
[cell updateBasicView];
[tableView beginUpdate];
[tableView endUpdate];

// 更新用户粉丝数量
[cell updateFansView];
[tableView beginUpdate];
[tableView endUpdate];

// 更新用户关注数量
[cell updateFollowView];
[tableView beginUpdate];
[tableView endUpdate];
```
这样`cell`就做到了局部刷新，是不是很简单？！