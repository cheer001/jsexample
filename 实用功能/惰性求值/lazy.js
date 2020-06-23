/**
 * 简易版lazy.js
 */
var MAX_ARRAY_LENGTH = 4294967295; // 最大的数组长度
var LAZY_FILTER_FLAG = 1; // filter方法的标记

// 缓存数据结构体
function LazyWrapper(value){
    this.__wrapped__ = value;//缓存数据
    this.__iteratees__ = [];//缓存数据管道中进行“裁决”的方法
    this.__takeCount__ = MAX_ARRAY_LENGTH;//记录需要拿的符合要求的数据集个数
}

// 惰性求值的入口
function lazy(value){
    return new LazyWrapper(value);
}

// 根据 筛选方法iteratee 筛选数据
function filter(iteratee){
    this.__iteratees__.push({
        'iteratee': iteratee,
        'type': LAZY_FILTER_FLAG
    });
    return this;
}

// 截取n个数据
function take(n){
    this.__takeCount__ = n;
    return this;
};

// 惰性求值
/**
 * 当前方法的数据管道实现，其实就是内层的while循环。通过取出缓存在iteratees中的裁决方法取出，对当前数据value进行裁决。
如果裁决结果是不符合，也即为false。那么这个时候，就没必要用后续的裁决方法进行判断了。而是应该跳出当前循环。
而如果用break跳出内层循环后，外层循环中的result[resIndex++] = value;还是会被执行，这是我们不希望看到的。
应该一次性跳出内外两层循环，并且继续外层循环，才是正确的。
标签语句，刚好可以满足这个要求。
 */
function lazyValue(){
    var array = this.__wrapped__;
    var length = array.length;
    var resIndex = 0;
    var takeCount = this.__takeCount__;
    var iteratees = this.__iteratees__;
    var iterLength = iteratees.length;
    var index = -1;
    var dir = 1;
    var result = [];

    // 标签语句
    outer:
    while(length-- && resIndex < takeCount){
        // 外层循环待处理的数组
        index += dir;

        var iterIndex = -1;
        var value = array[index];

        while(++iterIndex <　iterLength){
            // 内层循环处理链上的方法
            var data = iteratees[iterIndex];
            var iteratee = data.iteratee;
            var type = data.type;
            var computed = iteratee(value);

            // 处理数据不符合要求的情况
            if(!computed){
                if(type == LAZY_FILTER_FLAG){
                    continue outer;
                }else{
                    break outer;
                }
            }
        }

        // 经过内层循环，符合要求的数据
        result[resIndex++] = value;
    }

    return result;
}

// 绑定方法到原型链上
LazyWrapper.prototype.filter = filter;
LazyWrapper.prototype.take = take;
LazyWrapper.prototype.value = lazyValue;