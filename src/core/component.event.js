class ComponentEvent extends Event {

    triggerComplete(scope, ref, component) {
        scope[ref] = component;
        scope.$emit('componentComplete', {ref: ref, component: component});
    }

    getComponent(scope, element, defaultRef) {
        var ref = element.attr('ref') || defaultRef;
        return scope[ref];
    }
}