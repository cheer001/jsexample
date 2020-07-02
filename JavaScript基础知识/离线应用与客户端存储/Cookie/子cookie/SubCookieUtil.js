var SubCookieUtil = {
  /**
   * 获取cookie的方法有两个：get()和getAll()。
   *    get():获取单个子cookie的值。
   *    getAll():获取所有子cookie的值并把它们放入一个对象中返回，
   *            对象的属性为子cookie的名称，对应值为子cookie对应的值。
   *
   *    SubCookieUtil.getAll()方法和CookieUtil.get()在解析cookie值的方式上非常相似。
   *    区别在于cookie的值并非立即解码，而是先根据“&”字符将子cookie分割出来放在一个数组中，
   *    每个子cookie在根据等号分割，这样在parts数组中的
   *    前一部分便是子cookie名，
   *    后一部分则是子cookie值。
   *
   * 则两个项目都要使用decodeURIComponent()来解码，然后放入result对象中，最后作为方法的返回值。
   * 如果cookie不存在，则返回null。
   *
   * **/

  /**
   *    get():获取单个子cookie的值。
   *          接收两个参数：
   *            (1)cookie的名字
   *            (2)子cookie的名字
   *           它其实就是调用getAll()获取所有的子cookie，然后只返回所需的那一个(如果cookie不存在则返回null)。
   * **/
  get: function (name, subName) {
    var subCookies = this.getAll(name);
    if (subCookies) {
      return subCookies[subName];
    } else {
      return null;
    }
  },
  /**
   * getAll():接受一个参数:cookie的名字
   *    先根据“&”字符将子cookie分割出来放在一个数组中，
   *       每个子cookie在根据等号分割，这样在parts数组中的
   *       前一部分便是子cookie名，
   *       后一部分则是子cookie值。
   *
   * 例：document.cookie = data=name=Nicholas&book=Professional%20(空格)JavaScript
   * **/
  getAll: function (name) {
    var cookieName = encodeURIComponent(name) + "=",
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null,
      cookieEnd,
      subCookies,
      i,
      len,
      parts,
      result = {};
    if (cookieStart > -1) {
      cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = document.cookie.substring(
        cookieStart + cookieName.length,
        cookieEnd
      );
    }
    if (cookieValue.length > 0) {
      subCookies = cookieValue.split("&");
      for (i = 0, len = subCookies.length; i < len; i++) {
        parts = subCookies[i].split("=");
        result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
      }
      return result;
    }
  },
  /**
   * set()方法：
   *      接受7个参数：
   *            (1)cookie名称
   *            (2)子cookie名称
   *            (3)子cookie值
   *            (4)可选的cookie失效日期或时间的Date对象
   *            (5)可选的cookie路径
   *            (6)可选的cookie域
   *            (7)可选的布尔secure标志
   *          所有的可选参数都是作用于cookie本身而非子cookie。
   *       为了在同一个cookie中存储多个子cookie，路径、域和secure标志必须一致；
   *       针对整个cookie的失效日期则可以在任何一个单独的子cookie写入的时候同时设置。
   *      在这个方法中：
   *            第一步：获取指定的cookie名称对应的所有子cookie。
   *                   逻辑或操作符“||”用于当getAll()返回null时将subcookies设置为一个新对象。
   *                   然后，在subcookies对象上设置好子cookie值并传给setAll().
   * **/
  set: function (name, subNmae, value, expires, path, domain, secure) {
    var subcookies = this.getAll(name) || {};
    subcookies[subNmae] = value;
    this.setAll(name, subcookies, expires, path, domain, secure);
  },
  /**
   * setAll()方法：
   *        接受6个参数：
   *            cookie名称、包含所有子cookie对象以及和set()中一样的4个可选参数。
   *        这个方法使用for-in循环遍历第二个参数中的属性。
   *        为了确保确实是要保存的数据，使用了hasOwnProperty()(时候拥有此属性)方法，
   *        来确保只有实例属性被序列化到子cookie中。
   *        由于可能会存在熟悉名为空字符串的情况，所以在把属性名加入结果对象之前还要检查一下属性名的长度。
   *        将每个子cookie的名值对都存入subcookieParts数组中，以便稍后可以使用join()方法以“&”号组合起来。
   *        剩下的方法则和CookieUtil.set()一样。
   * **/
  setAll: function (name, subcookies, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + "=",
      subcookieParts = new Array(),
      subName;
    for (subName in subcookies) {
      if (subName.length > 0 && subcookies.hasOwnProperty(subName)) {
        subcookieParts.push(
          encodeURIComponent(subname) +
            "=" +
            encodeURIComponent(subcookies[subName])
        );
      }
    }
    if (subcookieParts.length > 0) {
      cookieText += subcookieParts.join("&");
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
    } else {
      cookieText += "; expires=" + new Date(0).toGMTString();
    }
    document.cookie = cookieText;
  },

  /**
   * unset()方法：用于删除某个cookie中的单个子cookie而不影响其他的
   * **/
  unset: function (name, subName, path, domain, secure) {
    var subcookies = this.getAll(name);
    if (subcookies) {
      delete subcookies[subName];
      this.setAll(name, subcookies, null, path, domain, secure);
    }
  },
  /**
   * unsetAll()方法：等同于CookieUtil.unset(),用于删除整个cookie。
   *                和set()及setAll()一样，
   *                路径、域和secure标志必须和之前创建的cookie包含的内容一致。
   * **/
  unsetAll: function (name, path, domain, secure) {
    this.setAll(name, null, new Date(0), path, domain, secure);
  },
};
