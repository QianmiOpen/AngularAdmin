class ComponentEvent extends Event {

    triggerComplete(scope, ref, component) {
        scope[ref] = component;
        scope.$emit('componentComplete', {ref: ref, component: component});
    }

    getComponent(scope, element, defaultRef) {
        var ref = element.attr('ref') || defaultRef;
        return scope[ref];
    }

    remove() {
        this.element.remove();
        this.scope.$destroy();
        this.scope = this.element = this.attrs = this.transclude = null;
    }
}