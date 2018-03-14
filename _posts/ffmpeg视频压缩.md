---
title: ffmpeg视频压缩
date: 2016-09-01 14:57:26
tags: [杂七杂八,media]
---

[How do I reduce the size of a huge MP4 video?](http://superuser.com/questions/4244/how-do-i-reduce-the-size-of-a-huge-mp4-video)

You can try using something such as [ffmpeg](http://ffmpeg.org/) or [mencoder](http://www.mplayerhq.hu/design7/news.html) to reencode it with a lower bitrate, e.g.:
Calculate the bitrate you need by dividing 1 GB by the video length in seconds. So, for a video of length 16:40 (1000 seconds), use a bitrate of 1000000 bytes/sec:
> ffmpeg -i input.mp4 -b 1000000 output.mp4

Additional options that might be worth considering is setting the [Constant Rate Factor](https://trac.handbrake.fr/wiki/CRFGuide), which lowers the average bit rate, but retains better quality. Vary the CRF between around 18 and 24 — the lower, the higher the bitrate.
> ffmpeg -i input.mp4 -vcodec libx264 -crf 20 output.mp4