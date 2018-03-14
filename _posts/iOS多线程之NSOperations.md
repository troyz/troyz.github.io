---
title: iOS多线程之NSOperations
date: 2016-09-01 16:05:13
tags: [iOS, thread]
---

相关文章：
[iOS多线程之NSThread](http://www.jianshu.com/p/1a511bbf97f7)
[iOS多线程之GCD](http://www.jianshu.com/p/7269be164cf0)

`NSOperation`(任务)与`NSOperationQueue`(队列)是在GCD之上构建的，但是相较于GCD它具有如下特点：

- 采用面向对象的方式
- 任务、队列可以被cancel/suspend
- `NSOperation`(任务)之间可以添加依赖(dependency)

### NSOperationQueue（队列）
| Api | 备注 |
| - | - |
| - (void)`addOperation`:(NSOperation *)op;<br>- (void)`addOperationWithBlock`:(void (^)(void))block; | 添加任务到queue |
| @property NSInteger `maxConcurrentOperationCount`;| 设置queue的并发数，如果为1则相当于是`串行队列` |
| @property (getter=isSuspended) BOOL `suspended` | 挂起或者取消挂起 |
| @property (nullable, copy) NSString *name | 设置队列的名称 |
| - (void)`cancelAllOperations` | 取消所有任务，<br>**注意**：这个方法只会将队列中所有任务(`NSOperation`)的状态属性字段`cancelled`设置为YES，并不会真正的kill掉这个任务的线程，通常需要在自定义的`NSOperation`内部重写`main`方法（任务代码），并在`main`方法中时不时的判断任务是否`isCancelled`，如果是则主动中止任务并返回|
| `+` (nullable NSOperationQueue *)`currentQueue` | 获取当前队列，注意是类方法 |
| `+` (NSOperationQueue *)`mainQueue` | 获取main队列 |

### NSOperation （任务）
| Api | 备注 |
| - | - |
| - (void)`start`; <br>- (void)`main`; | 一般我们不需要重载`start`方法。<br>1）当我们将任务添加到队列的时候，会自动调用这个任务的`start`方法 进行一些准备工作，之后执行`main`方法(核心任务代码)，|
| @property (readonly, getter=`isCancelled`) BOOL `cancelled`; <br>- (void)`cancel`;| 设置任务状态为取消、判断任务是否被取消，<br>**注意：**`cancel`并不会主动取消任务，需要在`main`中根据`isCancelled`获取状态并进行相应的处理。 |
| @property (readonly, getter=isExecuting) BOOL `executing` | 任务是否正在执行 |
| @property (readonly, getter=isFinished) BOOL `finished` |  以下情况时为`YES`:<br>1）任务完成<br>2）任务被取消<br>3）任务被暂停|
| - (void)`addDependency`:(NSOperation *)op; | 添加任务依赖，当前任务依赖于任务op，只有任务op执行完成后当前任务才会开始执行 |
| - (void)`removeDependency`:(NSOperation *)op; | 删除任务依赖 |
| @property NSOperationQueuePriority `queuePriority`; | 任务优先级 |
| @property (nullable, copy) void (^completionBlock)(void); | 设置任务完成后执行block |
| @property (nullable, copy) NSString *`name` | 任务名称 |

##### NSOperation的2个子类
``` objc
@interface `NSBlockOperation` : NSOperation 
// 根据block返回NSBlockOperation实例
+ (instancetype)blockOperationWithBlock:(void (^)(void))block;

// 添加新的任务，这些任务会并行执行
- (void)addExecutionBlock:(void (^)(void))block;
@property (readonly, copy) NSArray<void (^)(void)> *executionBlocks;

@end
```

``` objc
@interface `NSInvocationOperation` : NSOperation 
// 用selector的方式创建任务
- (nullable instancetype)initWithTarget:(id)target selector:(SEL)sel object:(nullable id)arg;
@end
```

参考：
[How To Use NSOperations and NSOperationQueues](http://www.raywenderlich.com/19788/how-to-use-nsoperations-and-nsoperationqueues)