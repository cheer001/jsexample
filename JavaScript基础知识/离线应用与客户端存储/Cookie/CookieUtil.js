var CookieUtil = {
  /**
   * CookieUril.get()方法：
   *      根据cookie的名字获取相应的值。它会在document.cookie字符串中查找cookie名加上等于号的位置。
   *      如果找到了，那么使用indexOf()查找该位置之后的第一个分号(表示了该cookie的结束位置)。
   *      如果没有找到分号，则表示该cookie是字符串的最后一个，则余下的字符串都是cookie的值。
   *      该值使用decodeURIComponent()进行解码并最后返回。
   *      如果没有发现cookie，则返回null。
   * **/
  get: function (name) {
    var cookieName = encodeURIComponent(name) + "=",
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null;
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      );
    }
    return cookieValue;
  },
  /**
   * CookieUtil.set()方法：
   *      在页面上设置一个cookie，接受如下几个参数：
   *          (1)cookie的名称，
   *          (2)cookie的值，
   *          (3)可选的用于指定cookie何时应被删除的Date对象，
   *          (4)cookie的可选的URL路径，
   *          (5)可选的域
   *          (6)以及可选的便是是否要添加secure标志的布尔值。
   *         参数是按照它们的使用频率排列的，只有头两个是必须的。
   *       在这个方法中名称和值都使用encodeURIComponent()进行了URL编码，并检查其他选项。
   *       如果expires参数是Date对象，那么会使用Date对象的toGMTString()方法正确格式化Date对象，
   *       并添加到expires选项上。
   *       方法其他部分就是构造cookie字符串并将其设置到document.cookie中。
   * **/
  set: function (name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += "; expires=" + expires.toGMTString();
    }
    if (path) {
      cookieText += "; path=" + path;
    }
    if (domain) {
      cookieText += "; domain=" + domain;
    }
    if (secure) {
      cookieText += "; secure";
    }
    console.log(cookieText);
    document.cookie = cookieText;
    console.log(document.cookie);
  },
  /**
   * 因为没有删除cookie的直接方法。
   * 所以，需要使用相同的路径、域和安全选项再次设置cookie，并将失效时间设置为过去的时间。
   *    CookieUtil.unset()方法：
   *        接受4个参数：
   *             (1)要删除的cookie名称，
   *             (2)可选的路径参数，
   *             (3)可选的域参数，
   *             (4)可选的安全参数。
   *            这些参数加上空白字符串并设置失效时间为1970年1月1日(初始化为0ms的Date对象的值)，
   *            传给Cookie.set()。这样就能确保删除cookie。
   * **/
  unset: function (name, path, domain, secure) {
    this.set(name, "", new Date(0), path, domain, secure);
  },
};
