---
title: iOS多线程之NSThread
date: 2016-09-01 15:22:59
tags: [iOS,thread]
---

相关文章：
[iOS多线程之GCD](http://www.jianshu.com/p/7269be164cf0)
[iOS多线程之NSOperations](http://www.jianshu.com/p/29cffaf280b8)

### 案例1--图片下载
``` objc
#define kImageUrl   @"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png"
@implementation ViewController
- (void)viewDidLoad
{
    [super viewDidLoad];
    // 首先启动一个线程去下载图片
    // 方式1
    NSThread *thread = [[NSThread alloc] initWithTarget:self selector:@selector(downloadImage:) object:kImageUrl];
    [thread start];
    // 方式2，会隐式的创建一个NSThread
    // [NSThread detachNewThreadSelector:@selector(downloadImage:) toTarget:self withObject:kImageUrl];
}
// 下载图片
- (void)downloadImage:(NSString *)imageUrl
{
    NSData *data = [[NSData alloc] initWithContentsOfURL:[NSURL URLWithString:imageUrl]];
    if(data)
    {
        UIImage *image = [[UIImage alloc] initWithData:data];
        if(image)
        {
            [self performSelectorOnMainThread:@selector(updateUI:) withObject:image waitUntilDone:YES];
        }
    }
}
// 在主线程刷新UI
- (void)updateUI:(UIImage *)image
{
    imgView.image = image;
}
@end
```

------------------------------

### 案例2--多售票窗口同时售票
**说明：**票源是共享数据，每个售票窗口相当于一个线程，为了保证数据的一致性，需要在每次售票时对票源加锁，票售出后释放锁

``` objc
@interface ViewController ()
{
    NSThread *thread1;
    NSThread *thread2;
    NSLock *lock;
    NSInteger ticket;
}
@end
@implementation ViewController
- (void)viewDidLoad
{
    [super viewDidLoad];
    lock = [[NSLock alloc] init];
    ticket = 20; //总共20张票
    thread1 = [[NSThread alloc] initWithTarget:self selector:@selector(saleTickets) object:nil];
    [thread1 setName:@"窗口1"];
    thread2 = [[NSThread alloc] initWithTarget:self selector:@selector(saleTickets) object:nil];
    [thread2 setName:@"窗口2"];
    [thread1 start];
    [thread2 start];
}
- (void)saleTickets
{
    while (TRUE)
    {
        //售票前加锁
        [lock lock];
        if(ticket <= 0)
        {
            [lock unlock];
            NSLog(@"没有票源了...");
            break;
        }
        ticket--;
        NSLog(@"%@ 当前余票:%zd,系统已售出:%zd", [[NSThread currentThread] name], ticket, (20 - ticket));
        //票售出后释放锁
        [lock unlock];
        //每售出一张票后，售票员需要休息一下下
        [NSThread sleepForTimeInterval:arc4random() % 3];
    }
}
@end
```

输出：（实际输出结果可能每次不一样，因为售票员休息时间随机）
> 窗口1 当前余票:19,系统已售出:1
窗口2 当前余票:18,系统已售出:2
窗口2 当前余票:17,系统已售出:3
窗口1 当前余票:16,系统已售出:4
窗口2 当前余票:15,系统已售出:5
窗口1 当前余票:14,系统已售出:6
窗口2 当前余票:13,系统已售出:7
窗口1 当前余票:12,系统已售出:8
窗口1 当前余票:11,系统已售出:9
窗口2 当前余票:10,系统已售出:10
窗口1 当前余票:9,系统已售出:11
窗口2 当前余票:8,系统已售出:12
窗口2 当前余票:7,系统已售出:13
窗口2 当前余票:6,系统已售出:14
窗口2 当前余票:5,系统已售出:15
窗口1 当前余票:4,系统已售出:16
窗口1 当前余票:3,系统已售出:17
窗口1 当前余票:2,系统已售出:18
窗口1 当前余票:1,系统已售出:19
窗口2 当前余票:0,系统已售出:20
窗口1 没有票源了...
窗口2 没有票源了...

------------------------------

### 案例3--生产者、消费者
**说明：**生来看看`NSConditionLock`的定义
``` objc
@interface NSConditionLock : NSObject <NSLocking> 
{
// 初始化with condition
- (instancetype)initWithCondition:(NSInteger)condition NS_DESIGNATED_INITIALIZER;
// 注意是只读的
@property (readonly) NSInteger condition;
// 如果满足条件(*成员变量condition*==*参数变量condition*)则成功获取锁
- (void)lockWhenCondition:(NSInteger)condition;
// 释放锁，并且让**设置新的condition值**
- (void)unlockWithCondition:(NSInteger)condition;
@end
```

样例代码：
``` objc
@interface ViewController ()
{
    NSThread *producerThread;
    NSThread *consumerThread;
    NSConditionLock *plock;
}
@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    producerThread = [[NSThread alloc] initWithTarget:self selector:@selector(producerRun) object:nil];
    consumerThread = [[NSThread alloc] initWithTarget:self selector:@selector(consumerRun) object:nil];
    plock = [[NSConditionLock alloc] initWithCondition:0];
    
    [producerThread start];
    [consumerThread start];
}

- (void)producerRun
{
    while (TRUE)
    {
        [plock lockWhenCondition:0];
        [NSThread sleepForTimeInterval:1];
        NSLog(@"制造了一个产品");
        [plock unlockWithCondition:1];
    }
}

- (void)consumerRun
{
    while(TRUE)
    {
        [plock lockWhenCondition:1];
        [NSThread sleepForTimeInterval:1];
        NSLog(@"消费了一个产品");
        [plock unlockWithCondition:0];
    }
}
@end
```

输出：
>制造了一个产品
消费了一个产品
制造了一个产品
消费了一个产品
制造了一个产品
消费了一个产品