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
    function parse(template,options){
        console.log(template)
    }

    function optimize(){
        
    }

    function generate(){
        
    }




    root.compileToFunctions = compileToFunctions

})(this)