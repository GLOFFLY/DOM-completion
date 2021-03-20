window.dom = {
    //增
    create(string) {
        const container = document.createElement("template");
        //template标签:是专门用来容纳任意标签的
        container.innerHTML = string.trim();
        /*
        trim()消除string两边的空格，配合firstChild()使用。
        因为string字符串前面有空格时，firstChild()获取的是空格组成的文本，而想获取的确实后面的标签，所以消除一下空格
        */
        return container.content.firstChild;
        /* 
        return container.children[0];
        <table>这系列标签通过children[0]获取时，显示不出来，必须通过content.firstChild获取
        */
    },
    after(node, node2) {//将node2放在node的子节点前面
        node.parentNode.insertBefore(node2, node.nextSibling);
    },
    before(node, node2) {//将node2放在node前面
        node.parentNode.insertBefore(node2, node);
    },
    append(parent, node) {
        parent.appendChild(node);
    },
    wrap(node, parent) {
        dom.before(node, parent);//把parent放在node前面，此时parent和node是兄弟关系
        dom.append(parent, node);//再把node作为子节点连接到parent上，此时parent和node是父子关系 
    },

    //删
    remove(node) {
        node.parentNode.removeChild(node);
        return node;
    },
    empty(node) {
        /*
        新语法 const {childNodes} = node   以数组的形式获取node的子节点
        等价于 const childNodes = node.childNodes
        let array = []
        for(let i = 0;i<childNodes.length; i++){
            dom.remove(childNodes[i])
            array.push(childNodes[i])
        }！！！出现一个bug！！！ 删除节点时，length是实时变化的，所以这个for循环并不能依次遍历完节点
        这种情况下，i是不需要自增的，所以for循环并不适用，改用while
        */
        const array = []
        let x = node.firstChild
        while (x) {
            array.push(dom.remove(node.firstChild))
            x = node.firstChild
        }
        return array
    },

    //改
    attr(node, name, value) { //重载attribute 根据不同参数个数执行不同代码就叫重载  
        if (arguments.length === 3) {//给了三个参数时
            node.setAttribute(name, value)//将node的'name'属性的值改成'value'
        } else if (arguments.length === 2) {//给了两个参数时
            return node.getAttribute(name)//相当于查询一下
        }
    },
    text(node, string) { // 适配  根据某依据的有无而执行不同代码就叫适配
        if (arguments.length === 2) {
            if ('innerText' in node) {//innerText是ie支持的，textContent是chrome支持的
                node.innerText = string
            } else {
                node.textContent = string
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) {
                return node.innerText
            } else {
                return node.textContent
            }
        }
    },
    html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string
        } else if (arguments.length === 1) {
            return node.innerHTML
        }
    },
    style(node, name, value) {
        if (arguments.length === 3) {//三个参数时，将node的name属性的值改成value
            // dom.style(div, 'color', 'red')
            node.style[name] = value
        } else if (arguments.length === 2) {//两个参数时，分情况
            if (typeof name === 'string') {//name的类型为string时，获取node的name属性的值
                // dom.style(div, 'color')
                return node.style[name]
            } else if (name instanceof Object) {//name的类型为Object时，
                // dom.style(div, {color: 'red'})
                const object = name//只是给name一个别名，让代码看起来更符合常识
                for (let key in object) {//读object里面的所有key
                    node.style[key] = object[key]
                    //注:key是个变量，不能用.key获取，因为这样浏览器会将key变成字符串。
                }
            }
        }
    },
    class: {
        add(node, className) {
            node.classList.add(className)
        },
        remove(node, className) {
            node.classList.remove(className)
        },
        has(node, className) {
            return node.classList.contains(className)
        }
    },
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },

    //查
    find(selector, scope) {
        return (scope || document).querySelectorAll(selector)
        //(scope || document)是返回第一个真值，全假返回末尾值。翻译下就是，有scope执行scope，没有就执行document
    },
    parent(node) {
        return node.parentNode
    },
    children(node) {
        return node.children
    },
    siblings(node) {
        return Array.from(node.parentNode.children).filter(n => n !== node)
        //获取的children直接调用filter()行不行? 不行，因为children是伪数组，调用Array.from()把它变成数组才能用filter()
    },
    next(node) {
        let x = node.nextSibling
        while (x && x.nodeType === 3) {
            x = x.nextSibling
        }
        return x
    },
    previous(node) {
        let x = node.previousSibling
        while (x && x.nodeType === 3) {//nodeType === 3 是文本
            x = x.previousSibling
        }
        return x
    },
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i])
        }
    },
    index(node) {
        const list = dom.children(node.parentNode)
        let i
        for (i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break
            }
        }
        return i
    }
};