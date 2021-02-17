title: 如何避免outline被遮挡
tags: ['css']
createTime: 2021-01-06
publishTime: 2021-01-06
-----------------

最近在做一个项目的时候，需要实现选中元素之后边框高亮的效果。由于一些布局和样式上的原因，不能使用border，所以想用`outline`来实现。因为相比`border`，`outline`的最大特点就是不影响DOM元素的大小，所以不会对布局产生任何影响。但是在实际使用中，很容易出现`outline`被遮挡的情况，那么如何避免这种情况呢？

## 1. TL;DR

解决方案十分简单，就是使用`outline-offset`这个css属性，将其设为负值（-`outline-width`）。关于这个属性的详细说明参见[MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset)。而后文，我将简单说明为什么会出现`outline`被遮挡的情况。

## 2. 原因

首先，我们来看一下`outline`在盒模型中的位置，如下图所示：

![position of outline](outline-position.jpg?r=h)

默认情况下`outline`在`border`外侧，而又由于`outline`本身不占据任何空间，所以在布局时其他DOM元素会完全忽略`outline`，从而导致`outline`被遮挡，例如：

<p class="codepen" data-height="351" data-theme-id="dark" data-default-tab="html,result" data-user="alanwei0" data-slug-hash="xxEPbLX" style="height: 351px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="outline-offset">
  <span>See the Pen <a href="https://codepen.io/alanwei0/pen/xxEPbLX">
  outline-offset</a> by Alan Wei (<a href="https://codepen.io/alanwei0">@alanwei0</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

这时通过设置`outline-offset`为负数，则可把`outline`移动到元素内部，避免被遮挡。然而，`outline-offset`其实也不能完全解决这个问题，读者们可以考虑一下子元素遮挡住父元素`outline`的情况。

## 3. 后记

最后，`outline`虽然和`border`十分相似，但是在功能上实际比`border`要差一些，比如：不能单边设置`outline`，不支持其他形状（只能是矩形，虽然规范上说是不一定，但是没找到具体的实现方式），不支持复杂图案等，所以，大部分情况下`border`应该是首选的方案。

## 4. 扩展阅读

- border image: [https://developer.mozilla.org/en-US/docs/Web/CSS/border-image](https://developer.mozilla.org/en-US/docs/Web/CSS/border-image)
