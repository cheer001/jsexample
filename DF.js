function compile(node, vm) {
    var reg = /\{\{(.*)\}\}/;
    //节点类型为元素
    if (node.nodeType === 1) {
        var attr = node.attributes;
        //解析属性
        for (var i = 0; i < attr.length; i++) {
            if (attr[i].nodeName == 'v-model') {
                var name = attr[i].nodeValue; //获取v-model绑定的属性名

                node.addEventListener('input', function (e) {
                    vm[name] = e.target.value; //给相应的data属性赋值，进而触发该属性的set方法
                });

                node.value = vm.data[name]; //将data的值赋给node
                node.removeAttribute('v-model');
            }
        }
    }
    //节点类型为text
    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            var name = RegExp.$1; //获取匹配到的字符串
            name = name.trim();
            // node.nodeValue = vm.data[name]; //将data的值赋给该node
            new Watcher(vm, node, name);
        }

    }
}

function Watcher(vm, node, name) {
    Dep.target = this; //将自己赋给了一个全局变量 Dep.target；
    this.name = name;
    this.node = node;
    this.vm = vm;
    this.update();
    Dep.target = null;
}
Watcher.prototype = {
    update: function () {
        this.get();
        this.node.nodeValue = this.value;
    },
    //获取data中的属性值
    get: function () {
        this.value = this.vm[this.name]; //触发相应属性的get
    }
}

function nodeToFragment(node, vm) {
    var flag = document.createDocumentFragment();
    var child;
    while (child = node.firstChild) {
        compile(child, vm);
        flag.append(child); //将子节点劫持到文档片段中
    }
    return flag;
}

function defineReactive(obj, key, val) {

    var dep = new Dep();

    Object.defineProperty(obj, key, {
        get: function () {
            //添加订阅者watcher到主题对象Dep
            if (Dep.target) dep.addSub(Dep.target);
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal;
            //作为发布者发出通知
            dep.notify();
        }
    });
}

function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
}

function observe(obj, vm) {
    Object.keys(obj).forEach(function (key) {
        defineReactive(vm, key, obj[key]);
    });
}

function Vue(options) {
    this.data = options.data;
    var data = this.data;

    observe(data, this)

    var id = options.el;
    var dom = nodeToFragment(document.getElementById(id), this);
    //编译完成后，将dom返回到app中
    document.getElementById(id).appendChild(dom);
}



//发布者发布消息，主题对象执行notify方法,进而触发订阅者执行update方法
// var dep = new Dep();
// pub.publish();

// var pub = {
//     publish: function () {
//         dep.notify();
//     }
// }

//三个订阅者subscribers
// var sub1 = {
//     update: function () {
//         console.log(1);
//     }
// };
// var sub2 = {
//     update: function () {
//         console.log(2);
//     }
// };
// var sub3 = {
//     update: function () {
//         console.log(3);
//     }
// };

// function Dep() {
//     this.subs = [sub1, sub2, sub3];
// }
// Dep.prototype.notify = function () {
//     this.subs.forEach(function (sub) {
//         sub.update();
//     })
// }
// function nodeToFragment(node) {
//   var flag = document.createDocumentFragment();
//   var child;
//   while (child = node.firstChild) {
//     flag.append(child);
//   }
//   return flag;
// }

// var dom2 = document.getElementById('app').appendChild(dom);
// console.table(dom2);