---
title: React Native全屏背景图片
date: 2016-09-01 14:18:05
tags: [react-native,mobile]
---

[What's the best way to add a full screen background image in React Native](http://stackoverflow.com/questions/29322973/whats-the-best-way-to-add-a-full-screen-background-image-in-react-native)

``` javascript
class ReactStrap extends React.Component {
  render() {
    return (
      <Image source={require('image!background')} style={styles.container}>
        ... Your Content ...
      </Image>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  }
};
```