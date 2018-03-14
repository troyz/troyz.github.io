---
title: 判断点击、触摸区域是否属于当前UIView
date: 2016-09-01 15:21:04
tags: [iOS]
---

### 简介
`UIView`提供了一个`pointInside:withEvent:`方法，用于判断用户点击的点是否属于当前这个视图，其定义如下：
``` objc
@interface UIView
// default returns YES if point is in bounds
- (BOOL)pointInside:(CGPoint)point withEvent:(nullable UIEvent *)event;
@end
```

### 用法示例
比如说美工给我们提供了一张圆形的底色透明的png图片，如下所示：
![圆形透明图片.png](http://upload-images.jianshu.io/upload_images/267318-cb186ae5d7c1cd73.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/120)
现在要求点击图片上圆形部分可以触发单击事件，点击图片的其它区域不做任何反应，这里有2种方案可以实现：

##### 方案1
把图片做成UIButton，并设置UIButton的`layer.cornerRadius`为圆形的半径：
``` objc
UIImage *image = [UIImage imageNamed:@"圆形透明图片.png"];

UIButton *btnView = [UIButton buttonWithType:UIButtonTypeCustom];
[btnView setImage:image forState:UIControlStateNormal];
btnView.frame = CGRectMake(0, 0, image.size.width, image.size.height);
// 设置UIButton为圆形，并且半径与图片半径一致
btnView.layer.cornerRadius = image.size.width / 2.0;
btnView.clipsToBounds = YES;
[btnView addTarget:self action:@selector(buttonTapped) 
              forControlEvents:UIControlEventTouchUpInside];
```

##### 方案2
用`pointInside:withEvent:`来实现
先为UIButton定义一个扩展`UIButton (Circle)`，用于设置圆形图片半径，并重写`pointInside:withEvent:`方法
``` objc
#import <UIKit/UIKit.h>
@interface UIButton (Circle)
// 设置图片的圆角半径
- (void)setCornerRadius:(CGFloat)cornerRadius;
@end


#import "UIButton+Circle.h"
#import "objc/runtime.h"
static char cornerRadiusKey;

@implementation UIButton (Circle)
- (void)setCornerRadius:(CGFloat)cornerRadius
{
    objc_setAssociatedObject(self, &cornerRadiusKey, [NSString stringWithFormat:@"%f", cornerRadius], OBJC_ASSOCIATION_COPY_NONATOMIC);
}
- (CGFloat)getCornerRadius
{
    NSString *str = objc_getAssociatedObject(self, &cornerRadiusKey);
    return (str && str.length) ? [str floatValue] : 0;
}
/**
 * 计算point点与center点的距离，
 * 如果 <= cornerRadius，则表示点击了图片的内容区域，视为有有效点击
 * 如果 > cornerRadius， 则表示点击了图片的空白区域，视为无效点击
 */
- (BOOL)pointInside:(CGPoint)point withEvent:(UIEvent *)event
{
    CGPoint center = CGPointMake(self.bounds.size.width / 2.0, self.bounds.size.height / 2.0);
    CGFloat distance = sqrt(pow(point.x - center.x, 2) + pow(point.y - center.y, 2));
    return distance <= [self getCornerRadius];
}
@end
```

下面是使用方式，：
``` objc
@implementation ViewController
- (void)viewDidLoad
{
    UIImage *image = [UIImage imageNamed:@"圆形透明图片.png"];
    UIButton *btnView = [UIButton buttonWithType:UIButtonTypeCustom];
    [btnView setImage:image forState:UIControlStateNormal];
    btnView.frame = CGRectMake(100, 100, image.size.width, image.size.height);
    // 设置半径
    [btnView setCornerRadius:image.size.width / 2.0];
    [btnView addTarget:self action:@selector(buttonTapped)
                  forControlEvents:UIControlEventTouchUpInside];
   
    [self.view addSubview:btnView];
}
- (void)buttonTapped
{
    NSLog(@"button tapped");
}
@end
```

运行后可以看到：
- 当点击了图片内容区域，则会触发`buttonTapped`方法
- 当点击了图片的空白区域，没有任何反应。

### 总结
|  | 方案1 | 方案2 |
| - | - | - |
| **优点** | 代码简单，适用广 | 处理比较灵活 |
| **缺点** | 有些特殊情况处理不了 | 稍显复杂，适用于一些特殊情况 |