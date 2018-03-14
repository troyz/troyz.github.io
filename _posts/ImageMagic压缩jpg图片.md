---
title: ImageMagic压缩jpg图片
date: 2016-09-01 14:56:20
tags: [杂七杂八,media]
---

I use always:

- quality in 85
- progressive (comprobed compression)
- a very tiny gausssian blur to optimize the size (0.05 or 0.5 of radius) depends on the quality and size of the picture, this notably optimizes the size of the jpeg.
- Strip any comment or exif tag

in imagemagick should be
``` bash
convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85% source.jpg result.jpg
```
hope this be useful.

------------
> http://stackoverflow.com/questions/7261855/recommendation-for-compressing-jpg-files-with-imagemagick
