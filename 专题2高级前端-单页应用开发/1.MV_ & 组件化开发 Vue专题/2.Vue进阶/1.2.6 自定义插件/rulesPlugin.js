const RulesPlugin = {
    install: Vue => {
        Vue.mixin({
            created() {
                const rules = this.$options.rules;
                if (rules) {
                    Object.keys(rules).forEach(key => {
                        const { validate, message } = rules[key]
                        this.$watch(key, newValue => {
                            const valid = validate(newValue)
                            if (!valid) {
                                console.error(message)
                            }
                        })
                    })
                }
            },
        })
    }
}