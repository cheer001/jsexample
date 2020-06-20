/**
 *事件流：
 *      例：单击按钮的同时，也单击了按钮的容器元素，甚至也单击了整个页面。
 *事件流描述的是：
    从页面中接受事件的顺序：

        IE的事件流是事件冒泡(event bubbling)流：
            即事件开始时由最具体的元素(文档中嵌套层次最深的那个节点)接受，然后逐级向上传播到较为不具体的节点(文档)
        Netscape Communicator的事件流是事件捕获(event capturing)流:
            思想:不太具体的节点应该更早接受到事件，而最具体的节点应该最后接受到事件。
            用意:在事件到达预定目标之前捕获它。
        由于老版本的浏览器不支持，因此很少有人使用事件捕获。
        建议开发人员放心的使用事件冒泡。
 */

/**
 * “DOM0级”事件处理程序(通过JavaScript指定事件处理程序的传统方式)： 
        以这种方式添加的事件处理程序会在事件流的冒泡阶段被处理
 *将一个函数赋值给 事件处理程序属性
 *前提首先不许要取得一个要操作的对象的引用(
    每个元素[包括window和document]都有自己的事件处理程序属性,
    这些属性通常全部小写，例:onclick,
    将这种属性设置为一个函数，就可以指定事件处理程序)
 *删除通过“DOM0级”方法指定的事件处理程序:将事件处理程序的值设置为null.即可(例:btn.onclick=null)
 */
/**
 * “DOM2级”事件处理程序
 *addEventListener():
 *三个参数:
 (1)要处理的事件名("click",不是 事件处理程序名称(以“on”开头，例“onclick，onload...”))
 (2)作为事件处理程序的函数
 (3)boolean值(
     true:表示在捕获阶段(即,从document往目标元素方向传播)调用事件处理程序，
     false:表示在冒泡阶段(即,从目标元素往document方向传播)处理事件处理程序)
 *removeEventListener():三个参数:与addEventListener()接收的参数一样
 */
/**
 * “IE”事件处理程序:
        由于IE8及更早版本只支持事件冒泡，所以通过attactEvent()添加的事件处理程序都会被添加到冒泡阶段
 *attchEvent():  
 *两个参数:   
 (1)事件处理程序名称(以“on”开头，例“onclick，onload...”)
 (2)事件处理程序函数
 *detachEvent():两个参数:attchEvent()接收的参数一样
 */
/**
 *把以上三种事件处理程序组合成：
 * 跨浏览器的事件处理程序
 */
//-------------------------------------事件对象--------------------------------------
/**
 *DOM中的事件对象：
 *    兼容DOM的浏览器会将一个event传入事件处理程序中。
 *    无论指定事件处理程序是使用什么方法(DOM0级或DOM2级)，都会传入event对象。
 *  target:事件的目标
 *  preventDefault():取消事件的默认行为
 *  stopPropagetion():取消事件的进一步捕获或冒泡，同时阻止任何事件处理程序被调用
 */
/**
 *IE中的事件对象：
 *    在使用DOM0级方法添加事件处理程序时，event对象作为window的一个属性存在(window.event)
 *  srcEvent:事件的目标
 *  returnValue:默认值为true，但将其设置为false就可以 取消事件的默认行为
 *  cancelBubble:默认值为false,但将其设置为true就可以 取消事件冒泡
 */
var EventUtil = {
  addHandler: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  getEvent: function (event) {
    return event ? event : window.event;
  },
  getTarget: function (event) {
    return event.target || event.srcElement;
  },
  preventDefault: function (event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
  removeHandler: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  },
  stopPropagation: function (event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },
};
