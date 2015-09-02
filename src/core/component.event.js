class ComponentEvent extends Event {

    triggerComplete(scope, ref, component) {
        scope[ref] = component;
        scope.$emit('componentComplete', {ref: ref, component: component});
    }
}