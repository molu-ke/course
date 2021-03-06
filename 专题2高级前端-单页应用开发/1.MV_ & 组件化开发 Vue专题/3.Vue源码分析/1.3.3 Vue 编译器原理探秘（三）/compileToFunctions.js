(function (root) {
    // 默认配置项
    var baseOptions = {
        // expectHTML: true,
        // modules: modules$1,
        // directives: directives$1,
        // isPreTag: isPreTag,
        // isUnaryTag: isUnaryTag,
        // mustUseProp: mustUseProp,
        // canBeLeftOpenTag: canBeLeftOpenTag,
        // isReservedTag: isReservedTag,
        // getTagNamespace: getTagNamespace,
        // staticKeys: genStaticKeys(modules$1)
    };

    // 渲染函数
    function createFunction(code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({ err: err, code: code });
            return noop
        }
    }

    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to
    }

    function createCompileToFunctionFn(compile) {
        var cache = Object.create(null);
        return function compileToFunctions(template, options, vm) {
            options = extend({}, options);
            // 渲染函数用到
            {
                try {
                    new Function('return 1');
                } catch (e) {
                    if (e.toString().match(/unsafe-eval|CSP/)) {
                        warn$$1(
                            'It seems you are using the standalone build of Vue.js in an ' +
                            'environment with Content Security Policy that prohibits unsafe-eval. ' +
                            'The template compiler cannot work in this environment. Consider ' +
                            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
                            'templates into render functions.'
                        );
                    }
                }
            }

            // check cache
            var key = options.delimiters
                ? String(options.delimiters) + template
                : template;
            if (cache[key]) { // 缓存对象中是否有这个模板字符串的字段
                return cache[key]
            }

            // 开始去编译  且编译结果(信息)给到compiled
            var compiled = compile(template, options);

            // check compilation errors/tips
            {
                if (compiled.errors && compiled.errors.length) {
                    warn$$1(
                        "Error compiling template:\n\n" + template + "\n\n" +
                        compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
                        vm
                    );
                }
                if (compiled.tips && compiled.tips.length) {
                    compiled.tips.forEach(function (msg) { return tip(msg, vm); });
                }
            }


            var res = {};
            var fnGenErrors = [];
            // 当前模板对应的渲染函数
            res.render = createFunction(compiled.render, fnGenErrors);
            // 当前模板静态结点函数
            res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
                return createFunction(code, fnGenErrors)
            });

            // 生成渲染函数的错误 
            {
                if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
                    warn$$1(
                        "Failed to generate render function:\n\n" +
                        fnGenErrors.map(function (ref) {
                            var err = ref.err;
                            var code = ref.code;

                            return ((err.toString()) + " in\n\n" + code + "\n");
                        }).join('\n'),
                        vm
                    );
                }
            }


            return (cache[key] = res)

        }
    }

    function createCompilerCreator(baseCompile) {
        return function createCompiler(baseOptions) {
            function compile(template, options) { // 编译器的入口函数
                var finalOptions = Object.create(baseOptions);
                var errors = [];
                var tips = [];
                finalOptions.warn = function (msg, tip) { //  warn("xxxxxxx",true)  收集 错误  警告信息 
                    (tip ? tips : errors).push(msg);
                };

                if (options) {
                    // 动态的绑定
                    if (options.modules) {
                        finalOptions.modules =
                            (baseOptions.modules || []).concat(options.modules);
                    }
                    // 合并指令
                    if (options.directives) {
                        finalOptions.directives = extend(
                            Object.create(baseOptions.directives),
                            options.directives
                        );
                    }
                    // 合并+整合   extend
                    for (var key in options) {
                        if (key !== 'modules' && key !== 'directives') {
                            finalOptions[key] = options[key];
                        }
                    }
                }


                // ast  render  staticRenderFns
                var compiled = baseCompile(template, finalOptions); // 真正编译器入口
                {
                    errors.push.apply(errors, detectErrors(compiled.ast));
                }
                compiled.errors = errors;
                compiled.tips = tips;
                return compiled
            }
            return {
                compile: compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }




    var createCompiler = createCompilerCreator(function baseCompile(
        template,
        options
    ) {
        var ast = parse(template.trim(), options); // 解析模析  产出AST对象（描述对象）
        console.log(ast)
        optimize(ast, options);  // 标注静态节点
        var code = generate(ast, options); // 产出渲染函数所需的字符串
        return {
            ast: ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        }
    });



    var ref$1 = createCompiler(baseOptions);
    var compileToFunctions = ref$1.compileToFunctions;

    // 解析模块  怎么去生成AST对象的
    var no = function () {
        return false
    }

    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase
            ? function (val) { return map[val.toLowerCase()]; }
            : function (val) { return map[val]; }
    }

    var isPlainTextElement = makeMap('script,style,textarea', true);

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var ncname = '[a-zA-Z_][\\w\\-\\.]*';
    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
    var startTagOpen = new RegExp(("^<" + qnameCapture));
    var startTagClose = /^\s*(\/?)>/;
    var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
    var doctype = /^<!DOCTYPE [^>]+>/i;
    var comment = /^<!--/;
    var conditionalComment = /^<!\[/;

    function makeAttrsMap(attrs) {
        var map = {};
        for (var i = 0, l = attrs.length; i < l; i++) {
            if (
                "development" !== 'production' &&
                map[attrs[i].name] && !isIE && !isEdge
            ) {
                warn$2('duplicate attribute: ' + attrs[i].name);
            }
            map[attrs[i].name] = attrs[i].value;
        }
        return map
    }


    function createASTElement(tag, attrs, parent) {
        return {
            type: 1,
            tag: tag,
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs), // id=app ==>  {id:'app'}
            parent: parent,
            children: []
        }
    }

    function parse(template, options) {
        // 第一次  root,currentParent  = 根节点的描述对象   stack = [根节点的描述对象]
        var currentParent,stack = [],root;
        parseHTML(template, {
            // 解析开始标签调用的钩子函数
            start: function (tag, attrs, unary) {
               
                var element = createASTElement(tag, attrs, currentParent);

                function checkRootConstraints (el) {
                    {
                      if (el.tag === 'slot' || el.tag === 'template') {
                        warnOnce(
                          "Cannot use <" + (el.tag) + "> as component root element because it may " +
                          'contain multiple nodes.'
                        );
                      }
                      if (el.attrsMap.hasOwnProperty('v-for')) {
                        warnOnce(
                          'Cannot use v-for on stateful component root element because ' +
                          'it renders multiple elements.'
                        );
                      }
                    }
                  }
            
                  // tree management  root 存储根节点的描述对象
                  if (!root) {
                    root = element;
                    checkRootConstraints(root); // 检测根节点的规范性
                  } else if (!stack.length) {
                    // allow root elements with v-if, v-else-if and v-else
                    if (root.if && (element.elseif || element.else)) {
                      checkRootConstraints(element);
                      addIfCondition(root, {
                        exp: element.elseif,
                        block: element
                      });
                    } else {
                      warnOnce(
                        "Component template should contain exactly one root element. " +
                        "If you are using v-if on multiple elements, " +
                        "use v-else-if to chain them instead."
                      );
                    }
                  }

                  if (currentParent && !element.forbidden) { //  !element.forbidden => true
                    if (element.elseif || element.else) {
                      processIfConditions(element, currentParent);
                    } else if (element.slotScope) { // scoped slot
                      currentParent.plain = false;
                      var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
                    } else {
                      currentParent.children.push(element); // 描述html字符串的子父级关系
                      element.parent = currentParent;
                    }
                  }
       

                  if (!unary) {
                    currentParent = element;
                    stack.push(element);
                  } else {
                    // endPre(element);
                  }
            },
             // 解析结束标签的钩子函数
            end: function () {
                //  删除尾随空格  <div>     </div>
                var element = stack[stack.length - 1];
                var lastNode = element.children[element.children.length - 1];
                if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
                    element.children.pop();
                }
                // 修正后续解析的开始标签的父标签描述对象引用
                stack.length -= 1;
                currentParent = stack[stack.length - 1];
             
            },
            // 解析文本调用的钩子函数
            chars: function (text) {
                // 静态文本  动态文本
                var children = currentParent.children;
                children.push({
                    type: 3,
                    text: text
                });
              
            },
            comment: function () {
                console.log('解析注释的钩子函数')
            },
        })

        return root; // 跟节点的描述对象

    }

    function parseHTML(html, options) {
        var stack = []; // 检测一个非一元标签 是否缺少闭合标签
        var expectHTML = options.expectHTML; // 编译器内置配置   布尔值   false 
        var isUnaryTag$$1 = options.isUnaryTag || no; //  检测一个标签是否为一元标签
        var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no; // 编译器内置配置  检测一个标签是否是可以省略闭合标签的非一元标签
        var index = 0; // 解析html字符串时字符流读入的位置
        var last, lastTag; // last存储还未解析的html字符串   lastTag始终存储stack栈顶的元素

        while (html) {
            last = html;
            if (!lastTag || !isPlainTextElement(lastTag)) { // 第一次进入循环   根元素的开始标签
                var textEnd = html.indexOf('<');  // 1：等于0   2：小于0   3：大于0   
                if (textEnd === 0) {
                    // End tag:
                    var endTagMatch = html.match(endTag);
                    if (endTagMatch) {
                        var curIndex = index; // 结束标签的字符起始位置
                        advance(endTagMatch[0].length);
                        parseEndTag(endTagMatch[1], curIndex, index); // 处理标签相关的异常情况
                        continue
                    }

                    // Start tag:
                    var startTagMatch = parseStartTag();
                    if (startTagMatch) {
                        handleStartTag(startTagMatch);
                        // 先不考虑  忽略 <pre>和<textare>标签的内容中第一个换行符
                        // if (shouldIgnoreFirstNewline(lastTag, html)) {
                        //     advance(1);
                        // }
                        continue
                    }
                }

                // {{ message }}</div>
                var text = (void 0), rest = (void 0), next = (void 0);
                if (textEnd >= 0) {
                    rest = html.slice(textEnd); // 剩余需要解析的文本 </div>  
                    while ( // 当rest不是文本、标签、注释
                        !endTag.test(rest) &&
                        !startTagOpen.test(rest) &&
                        !comment.test(rest) &&
                        !conditionalComment.test(rest)
                    ) {
                        next = rest.indexOf('<', 1);
                        if (next < 0) {
                            break
                        }
                        textEnd += next;
                        rest = html.slice(textEnd);
                    }
                    text = html.substring(0, textEnd); // {{message}}
                    advance(textEnd);
                }


                if (textEnd < 0) {
                    text = html;
                    html = '';
                }

                if (options.chars && text) {
                    options.chars(text);
                }
            }
        }


        function advance(n) {
            index += n;
            html = html.substring(n);
        }

        function parseStartTag() {
            var start = html.match(startTagOpen); // 匹配开始标签
            if (start) {
                var match = {
                    tagName: start[1],
                    attrs: [],
                    start: index // 解析开始标签的字符流起始位置
                };
                advance(start[0].length);
                var end, attr; // 属性   end 分析当前标签是否一元标签
                // startTagClose  去匹配开始标签的右尖括号  >  />
                // attribute
                while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                    advance(attr[0].length);
                    match.attrs.push(attr);
                }
                if (end) {
                    match.unarySlash = end[1]; //   /> =>  /  一元标签   > => ''   非一元标签
                    advance(end[0].length);
                    match.end = index;
                    return match
                }
            }
        }

        // 辅助函数
        function handleStartTag(match) {
            var tagName = match.tagName;
            var unarySlash = match.unarySlash;

            // 先不管
            // if (expectHTML) {
            //     if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
            //         parseEndTag(lastTag);
            //     }
            //     if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
            //         parseEndTag(tagName);
            //     }
            // }

            var unary = isUnaryTag$$1(tagName) || !!unarySlash;
            var l = match.attrs.length;
            var attrs = new Array(l);

            for (var i = 0; i < l; i++) {
                var args = match.attrs[i];
                var value = args[3] || args[4] || args[5] || '';
                attrs[i] = {
                    name: args[1],
                    value: value
                };
            }

            if (!unary) { // 非一元标签
                stack.push({
                    tag: tagName,
                    lowerCasedTag: tagName.toLowerCase(),
                    attrs: attrs
                });
                lastTag = tagName;
            }

            if (options.start) {
                options.start(tagName, attrs, unary, match.start, match.end);
            }
        }

        function parseEndTag(tagName, start, end) {
            var pos, lowerCasedTagName;
            if (start == null) { start = index; }
            if (end == null) { end = index; }

            if (tagName) {
                lowerCasedTagName = tagName.toLowerCase();
                for (pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                        break
                    }
                }
            } else {
                pos = 0;
            }

            if (pos >= 0) {
                for (var i = stack.length - 1; i >= pos; i--) {
                    if ((i > pos || !tagName) && options.warn) {
                        options.warn(
                            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
                        );
                    }
                    if (options.end) {
                        options.end(stack[i].tag, start, end);
                    }
                }
                stack.length = pos;
                lastTag = pos && stack[pos - 1].tag;

            } else if (lowerCasedTagName === 'br') {
                if (options.start) {
                    options.start(tagName, [], true, start, end);
                }
            } else if (lowerCasedTagName === 'p') {
                if (options.start) {
                    options.start(tagName, [], false, start, end);
                }
                if (options.end) {
                    options.end(tagName, start, end);
                }
            }
        }
    }

    function optimize() {

    }

    function generate() {

    }




    root.compileToFunctions = compileToFunctions

})(this)