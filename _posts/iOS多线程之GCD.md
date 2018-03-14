---
title: iOS多线程之GCD
date: 2016-09-01 16:06:19
tags: [iOS, thread]
---

相关文章：
[iOS多线程之NSThread](http://www.jianshu.com/p/1a511bbf97f7)
[iOS多线程之NSOperations](http://www.jianshu.com/p/29cffaf280b8)

### 队列
| 队列 | Api | 备注 |
| - | - | - |
| 主队列（main queue）| `dispatch_get_main_queue()` | 串行队列，可以操纵UI |
|全局调度队列（Global Dispatch Queues）|`dispatch_get_global_queue()` | 并行队列，按照执行优先级，分成4种global queue：<br>`DISPATCH_QUEUE_PRIORITY_HIGH`, `DISPATCH_QUEUE_PRIORITY_DEFAULT`, `DISPATCH_QUEUE_PRIORITY_LOW`, `DISPATCH_QUEUE_PRIORITY_BACKGROUND`|
|自创建队列|`dispatch_queue_create()`|可以创建：<br>串行（`DISPATCH_QUEUE_SERIAL`）、<br>并行（`DISPATCH_QUEUE_CONCURRENT`）队列|

| 并行队列 | 串行队列 |
| - | - |
| ![并行队列](http://upload-images.jianshu.io/upload_images/267318-a6708bac62b103a0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) | ![串行队列](http://upload-images.jianshu.io/upload_images/267318-d299f587c599abc4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) |

队列和线程是两个不同的概念。一个队列可以有多个线程。每个队列中的操作会在所属的线程中运行。举个例子你创建一个并行队列，然后添加三个操作到里面。队列会发起三个单独的线程，然后让所有操作在各自的线程中并发运行。

### 提交任务(block)到队列(queue)
| 提交方式 | 备注 |
| - | - |
| `dispatch_async`(dispatch_queue_t queue, dispatch_block_t block) | 异步提交block到queue|
|`dispatch_sync`(dispatch_queue_t queue, dispatch_block_t block)|同步地提交工作并在返回前**等待**它完成|
| `dispatch_after`(dispatch_time_t when, dispatch_queue_t queue, dispatch_block_t block) | 异步提交block到queue，并且延迟执行block，<br>`dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)) `表示3秒后|
| `dispatch_barrier_async`(dispatch_queue_t queue, dispatch_block_t block)|异步提交block，但是该block被执行时，队列中其它block不会被执行，即barrier相当于一个狭窄的通道 <br>**场景：**多线程读写竞态资源，多个读线程间可以并行，但读写、写写线程间只能串行，这时可以：<br>1）使用并发队列（为了防止`barrier`特性影响其它线程，不要使用`dispatch_get_global_queue`，而是使用`dispatch_queue_create`来创建新队列）<br>2）使用`dispatch_barrier_async`添加写block，保证队列中写block执行时不会有其它读写block正在执行|

![barrier执行模型](http://upload-images.jianshu.io/upload_images/267318-d3ead46676ea07c8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**注意：**
如果你调用 dispatch_sync 并放在你已运行着的当前**串行**队列。这会导致死锁，因为调用会一直等待直到 Block 完成，但 Block 不能完成（它甚至不会开始！），直到当前已经存在的任务完成，而当前任务无法完成！举个例子：
``` objc
@implementation ViewController1
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // dispatch_sync同步提交block到main队列（当前队列）并**等待**block执行完毕，而由于是串行队列，block需要等待当前任务执行完毕，双向等待造成死锁。
    dispatch_sync(dispatch_get_main_queue(), ^{
        NSLog(@"hello world");
    });
    // 下面这条NSLog不会被执行，因为线程已经死锁
    NSLog(@"here");
@end
```

``` objc
@implementation ViewController2
- (void)viewDidLoad
{
    [super viewDidLoad];
    // 创建一个并行队列，，，，（*注意：*如果将*DISPATCH_QUEUE_CONCURRENT*修改成*DISPATCH_QUEUE_SERIAL*，即创建串行队列，就会发生死锁！！！）
    dispatch_queue_t queue = dispatch_queue_create("abc", DISPATCH_QUEUE_CONCURRENT);
    dispatch_sync(queue, ^{
        NSLog(@"..1");
        // 因为是并行队列，下面的block不需要等待当前block执行完毕，就不会发生死锁。
        dispatch_sync(queue, ^{
            NSLog(@"..2");
        });
    });
    NSLog(@"here");
@end
```


### 单例
> dispatch_once() 以线程安全的方式执行且仅执行其代码块一次。试图访问临界区（即传递给 dispatch_once 的代码）的不同的线程会在临界区已有一个线程的情况下被阻塞，直到临界区完成为止。

``` objc
@implementation User
+ (instancetype)sharedUser
{
    static User *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[User alloc] init];
    });
    return instance;
}
@end
```

### 调度组
Dispatch Group 会在整个组的任务都完成时通知你。这些任务可以是同步的，也可以是异步的，即便在不同的队列也行。而且在整个组的任务都完成时，Dispatch Group 可以用同步的或者异步的方式通知你。

| 创建group Api | 备注 |
| - | - |
| dispatch_group_t `dispatch_group_create`(void) | 创建一个group |

| 将任务(block)添加到group | 备注 |
| - | - |
| `dispatch_group_async`(dispatch_group_t group,<br> dispatch_queue_t queue,<br> dispatch_block_t block) | 异步把block提交到queue，并且将block分配到指定的group |
| `dispatch_group_enter`(dispatch_group_t group)| 手动表明block进入group,`dispatch_group_enter`与`dispatch_group_leave`是成对出现的。 |
| `dispatch_group_leave`(dispatch_group_t group) | 手动表明block在group中执行完成 |

| 设置group完成时的通知/回调 | 备注 |
| - | - |
| `dispatch_group_wait`(dispatch_group_t group, dispatch_time_t timeout)| 阻塞当前线程，直到group里面所有的任务都完成或者等到某个超时发生 |
|`dispatch_group_notify`(dispatch_group_t group, <br> dispatch_queue_t queue, <br>dispatch_block_t block) | 异步设置group里所有任务都完成时，在queue队列中执行通知回调block |

多图片下载示例：
``` objc
dispatch_group_t group = dispatch_group_create();
dispatch_queue_t queue = dispatch_queue_create("test", DISPATCH_QUEUE_CONCURRENT);
dispatch_async(queue, ^{
    for(NSInteger i = 0; i < 10; i++)
    {
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"http://a/%zd.png", i]];
        // 表示block进入group
        dispatch_group_enter(group);
        [[SDWebImageDownloader sharedDownloader] downloadImageWithURL:url options:0 progress:nil completed:^(UIImage *image, NSData *data, NSError *error, BOOL finished) {
            // 表示block执行完成
            dispatch_group_leave(group);
        }];
    }
    // 设置等待3秒钟
    dispatch_time_t timeoutTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3  * NSEC_PER_SEC));
    if(dispatch_group_wait(group, timeoutTime))
    {
        NSLog(@"图片下载超时");
    }
    else
    {
        NSLog(@"所有图片都下载完成");
    }
});
```


### 信号量
信号量让你控制多个消费者对有限数量资源的访问
原则：当信号量小于等于0时，`dispatch_semaphore_wait`会阻塞线程，当`dispatch_semaphore_signal`时会让信号量加1，如果这时信号量大于0，则唤醒阻塞的线程。

| Api | 备注 |
| - | - |
| dispatch_semaphore_t `dispatch_semaphore_create`(long value) | 创建一个信号量，并且设置信号量的初始值 |
| `dispatch_semaphore_wait`(dispatch_semaphore_t dsema, dispatch_time_t timeout) | 等待一个信号量，如果当前信号量大于0，则信号量减1，线程往下执行。否则线程阻塞，直到被信号量大于0时被唤醒或者等待超时 |
| `dispatch_semaphore_signal`(dispatch_semaphore_t dsema) | 让信号量加1，如果当前信号量大于0，则唤醒一个waiting的线程 |

图片下载示例：
``` objc
// 创建信号量，并且初始化为0
dispatch_semaphore_t semaphore = dispatch_semaphore_create(0);
// 下载图片
[[SDWebImageDownloader sharedDownloader] downloadImageWithURL:[NSURL URLWithString:@"http://a/b.png"] options:0 progress:nil completed:^(UIImage *image, NSData *data, NSError *error, BOOL finished) {
    // 设置信号量+1，此时信号量大于0，会唤醒等待的线程。
    dispatch_semaphore_signal(semaphore);
}];
// 设置等待3秒钟
dispatch_time_t timeoutTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 \\* NSEC_PER_SEC));
// 此时线程会阻塞，只到图片下载完成或者等待超时
if(dispatch_semaphore_wait(semaphore, timeoutTime))
{
    NSLog(@"等待超时");
}
else
{
    NSLog(@"图片下载完毕");
}
```

参考：
[GCD 深入理解（一）](http://www.cocoachina.com/industry/20140428/8248.html)
[GCD 深入理解（二）](http://www.cocoachina.com/industry/20140515/8433.html)