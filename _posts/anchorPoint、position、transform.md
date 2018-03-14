---
title: anchorPoint、position、transform
date: 2016-09-01 15:19:56
tags: [iOS]
---

# 简介
`anchorPoint`为`UIView`的中心点，它是一个比例值，默认是CGPointMake(0.5, 0.5)，即视图的中心点在长度、宽度的一半的位置。

`position`为`anchorPoint`点在其`superLayer`中的位置

``` objc
@interface CALayer
/* The position in the superlayer that the anchor point of the layer's
 * bounds rect is aligned to. Defaults to the zero point. Animatable. */
@property CGPoint position;

/* Defines the anchor point of the layer's bounds rect, as a point in
 * normalized layer coordinates - '(0, 0)' is the bottom left corner of
 * the bounds rect, '(1, 1)' is the top right corner. Defaults to
 * '(0.5, 0.5)', i.e. the center of the bounds rect. Animatable. */
@property CGPoint anchorPoint;
@end
```
# 默认anchorPoint演示

![默认情况绕中心点旋转](http://upload-images.jianshu.io/upload_images/267318-835daf3d9282e498.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/240)

``` objc
#define kScreenWidth                    [[UIScreen mainScreen] bounds].size.width
#define kScreenHeight                   [[UIScreen mainScreen] bounds].size.height

#define VIEW_WIDTH                      150     // 矩形视图的宽度
#define VIEW_HEIGHT                     80     // 矩形视图的高度
#define POINT_W_H                       5       // 中心点的宽、高

@implementation ViewController
- (void)viewDidLoad
{
    [super viewDidLoad];
    [self addView1];
}
- (void)addView1
{
    // 创建一个矩形视图
    UIView *view = [[UIView alloc] initWithFrame:CGRectMake((kScreenWidth - VIEW_WIDTH) / 2.0, 60, VIEW_WIDTH, VIEW_HEIGHT)];
    view.backgroundColor = [UIColor orangeColor];
    
    // 在上面矩形视图的anchorPoint位置添加一个黑色圆心
    CGPoint anchorPoint = view.layer.anchorPoint;
    UIView *pointView = [[UIView alloc] initWithFrame:CGRectMake(anchorPoint.x * VIEW_WIDTH - POINT_W_H / 2.0, anchorPoint.y * VIEW_HEIGHT - POINT_W_H / 2.0, POINT_W_H, POINT_W_H)];
    pointView.layer.cornerRadius = POINT_W_H / 2.0;
    pointView.clipsToBounds = YES;
    pointView.backgroundColor = [UIColor blackColor];
    [view addSubview:pointView];
    
    [self.view addSubview:view];
    
    // 旋转view，每次30度
    [self performSelector:@selector(rotateView:) withObject:view afterDelay:3];
}

- (void)rotateView:(UIView *)view
{
    view.transform = CGAffineTransformRotate(view.transform, M_PI / 6.0);
    [self performSelector:@selector(rotateView:) withObject:view afterDelay:0.5];
}
@end
```

# 修改archorPoint后旋转
![修改archorPoint为CGPoint(0.5,0)再旋转](http://upload-images.jianshu.io/upload_images/267318-233942fb3a0e68d0.jpg?imageMogr2/auto-orient/strip)

``` objc
- (void)addView2
{
    // 创建一个矩形视图
    UIView *view = [[UIView alloc] initWithFrame:CGRectMake((kScreenWidth - VIEW_WIDTH) / 2.0, 250, VIEW_WIDTH, VIEW_HEIGHT)];
    view.backgroundColor = [UIColor lightGrayColor];
    
    // 修改anchorPoint为顶端中心点
    view.layer.anchorPoint = CGPointMake(0.5, 0);
    
    // 在上面矩形视图的anchorPoint位置添加一个黑色圆心
    CGPoint anchorPoint = view.layer.anchorPoint;
    UIView *pointView = [[UIView alloc] initWithFrame:CGRectMake(anchorPoint.x * VIEW_WIDTH - POINT_W_H / 2.0, anchorPoint.y * VIEW_HEIGHT - POINT_W_H / 2.0, POINT_W_H, POINT_W_H)];
    pointView.layer.cornerRadius = POINT_W_H / 2.0;
    pointView.clipsToBounds = YES;
    pointView.backgroundColor = [UIColor blackColor];
    [view addSubview:pointView];
    
    [self.view addSubview:view];
    
    // 旋转view，每次30度
    [self performSelector:@selector(rotateView:) withObject:view afterDelay:3];
}
```

# 诡异动画演示
代码本身是期望点击button后，通过设置view的frame来让view发生位移，但却出现了诡异动画：
![诡异动画演示](http://upload-images.jianshu.io/upload_images/267318-5306a6ed20118a0d.jpg?imageMogr2/auto-orient/strip)

``` objc
- (void)addView3
{
    // 创建一个正方形视图
    squareView1 = [[UIView alloc] initWithFrame:CGRectMake((kScreenWidth - VIEW_HEIGHT) / 2.0, 430, VIEW_HEIGHT, VIEW_HEIGHT)];
    squareView1.backgroundColor = [UIColor magentaColor];
    [self.view addSubview:squareView1];
    
    // 旋转30度
    squareView1.transform = CGAffineTransformRotate(squareView1.transform, M_PI / 6.0);
    
    UIButton *btnView = [UIButton buttonWithType:UIButtonTypeSystem];
    [btnView setTitle:@"修改view的位置" forState:UIControlStateNormal];
    btnView.titleLabel.font = [UIFont systemFontOfSize:12.0];
    btnView.frame = CGRectMake(kScreenWidth - 120, squareView1.center.y - 22, 120, 44);
    [btnView addTarget:self action:@selector(updateViewOrigin) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btnView];
}

// 修改frame造成诡异动画
- (void)updateViewOrigin
{
    CGRect frame = squareView1.frame;
    frame.origin.y -= 15;
    frame.origin.x -= 15;
    squareView1.frame = frame;
}
```

出现如下诡异动画的原因是：如果view已经设置了`transform`动画，则不要再试图设置`frame`，而应该用`bounds`+`center`
> do not use frame if view is transformed since it will not correctly reflect the actual location of the view. use bounds + center instead.

``` objc
@interface UIView(UIViewGeometry)
// animatable. do not use frame if view is transformed since it will not correctly reflect the actual location of the view. use bounds + center instead.
@property(nonatomic) CGRect            frame;

// use bounds/center and not frame if non-identity transform. if bounds dimension is odd, center may be have fractional part
@property(nonatomic) CGRect            bounds;      // default bounds is zero origin, frame size. animatable
@property(nonatomic) CGPoint           center;      // center is center of frame. animatable
@property(nonatomic) CGAffineTransform transform;   // default is CGAffineTransformIdentity. animatable
@end
```

# 规避诡异动画
通过设置`center`来移动view：
![规避诡异动画](http://upload-images.jianshu.io/upload_images/267318-eb26138efc90a6e5.jpg?imageMogr2/auto-orient/strip)

``` objc
- (void)addView4
{
    // 创建一个正方形视图
    squareView2 = [[UIView alloc] initWithFrame:CGRectMake((kScreenWidth - VIEW_HEIGHT) / 2.0, 550, VIEW_HEIGHT, VIEW_HEIGHT)];
    squareView2.backgroundColor = [UIColor magentaColor];
    [self.view addSubview:squareView2];
    
    // 旋转30度
    squareView2.transform = CGAffineTransformRotate(squareView2.transform, M_PI / 6.0);
    
    UIButton *btnView = [UIButton buttonWithType:UIButtonTypeSystem];
    [btnView setTitle:@"修改view的位置" forState:UIControlStateNormal];
    btnView.titleLabel.font = [UIFont systemFontOfSize:12.0];
    btnView.frame = CGRectMake(kScreenWidth - 120, squareView2.center.y - 22, 120, 44);
    [btnView addTarget:self action:@selector(updateViewCenter) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btnView];
}

- (void)updateViewCenter
{
    CGPoint center = squareView2.center;
    center.x -= 15;
    center.y -= 15;
    squareView2.center = center;
}
```

参考文章：
[彻底理解position与anchorPoint](http://wonderffee.github.io/blog/2013/10/13/understand-anchorpoint-and-position/)
[Bug:iOS-改变view的frame后，设置transform，诡异画面](http://blog.csdn.net/ouyangtianhan/article/details/17510009)