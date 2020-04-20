/**
 * 简易版lazy.js
 */
var MAX_ARRAY_LENGTH = 4294967295; // 最大的数组长度
var LAZY_FILTER_FLAG = 1;

/**
 * 缓存数据结构体
 * @param {*} value 缓存数据
 */
function lazyWrapper(value) {
    this.__wrapper__ = value; //缓存数据
    this.__iteratees__ = []; //缓存数据管道中进行裁决的方法
    this.__takeCount__ = LAZY_FILTER_FLAG; //记录filter中过滤的数据集个数
}

/**
 * 惰性求值入口
 * @param {*} value 缓存的数据
 */
function lazy(value) {
    return new lazyWrapper(value);
}


/**
 * 筛选裁决方法中的条件
 * @param {*} iteratee 传入的裁决方法
 */
function filter(iteratee) {
    this.__iteratees__.push({
        'iteratee': iteratee,
        'type': LAZY_FILTER_FLAG
    });
    return this; //this指向调用者
}

/**
 * 采取方法
 * @param {*} n 需要截取的个数
 */
function take(n) {
    this.__takeCount__ = n;
    return this;
}

//惰性求值
function lazyValue() {
    var array = this.__wrapper__;
    var length = array.length;
    var resIndex = 0;
    var takeCount = this.__takeCount__;
    var iteratees = this.__iteratees__;
    var iterLength = iteratees.length;
    var index = -1;
    var dir = 1;
    var result = []; //存储满足所有条件的数据

    //outer用于---内层循环不满足条件时不往下执行
    outer:
        while (length-- && resIndex < takeCount) {
            index += dir;
            var iterIndex = -1;
            var value = array[index];
            while (++iterIndex < iterLength) {
                var data = iteratees[iterIndex];
                var iteratee = data.iteratee;
                var type = data.type;
                var computed = iteratee(value); //取裁决结果
                if (!computed) {
                    if (type == LAZY_FILTER_FLAG) {
                        continue outer;
                    } else {
                        break outer;
                    }
                }
            }
            result[resIndex++] = value;
        }
    return result;
}

lazyWrapper.prototype.filter = filter;
lazyWrapper.prototype.take = take;
lazyWrapper.prototype.value = lazyValue;