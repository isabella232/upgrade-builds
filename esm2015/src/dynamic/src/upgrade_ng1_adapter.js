/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, EventEmitter, Inject, Injector } from '@angular/core';
import { $SCOPE } from '../../common/src/constants';
import { UpgradeHelper } from '../../common/src/upgrade_helper';
import { isFunction, strictEquals } from '../../common/src/util';
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
const CAMEL_CASE = /([A-Z])/g;
/** @type {?} */
const INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
/** @type {?} */
const NOT_SUPPORTED = 'NOT_SUPPORTED';
export class UpgradeNg1ComponentAdapterBuilder {
    /**
     * @param {?} name
     */
    constructor(name) {
        this.name = name;
        this.inputs = [];
        this.inputsRename = [];
        this.outputs = [];
        this.outputsRename = [];
        this.propertyOutputs = [];
        this.checkProperties = [];
        this.propertyMap = {};
        this.directive = null;
        /** @type {?} */
        const selector = name.replace(CAMEL_CASE, (/**
         * @param {?} all
         * @param {?} next
         * @return {?}
         */
        (all, next) => '-' + next.toLowerCase()));
        /** @type {?} */
        const self = this;
        // Note: There is a bug in TS 2.4 that prevents us from
        // inlining this into @Directive
        // TODO(tbosch): find or file a bug against TypeScript for this.
        /** @type {?} */
        const directive = { selector: selector, inputs: this.inputsRename, outputs: this.outputsRename };
        class MyClass extends UpgradeNg1ComponentAdapter {
            /**
             * @param {?} scope
             * @param {?} injector
             * @param {?} elementRef
             */
            constructor(scope, injector, elementRef) {
                (/** @type {?} */ (super(new UpgradeHelper(injector, name, elementRef, self.directive || undefined), scope, self.template, self.inputs, self.outputs, self.propertyOutputs, self.checkProperties, self.propertyMap)));
            }
        }
        MyClass.decorators = [
            { type: Directive, args: [Object.assign({ jit: true }, directive),] },
        ];
        /** @nocollapse */
        MyClass.ctorParameters = () => [
            { type: undefined, decorators: [{ type: Inject, args: [$SCOPE,] }] },
            { type: Injector },
            { type: ElementRef }
        ];
        this.type = MyClass;
    }
    /**
     * @return {?}
     */
    extractBindings() {
        /** @type {?} */
        const btcIsObject = typeof (/** @type {?} */ (this.directive)).bindToController === 'object';
        if (btcIsObject && Object.keys((/** @type {?} */ ((/** @type {?} */ (this.directive)).scope))).length) {
            throw new Error(`Binding definitions on scope and controller at the same time are not supported.`);
        }
        /** @type {?} */
        const context = (btcIsObject) ? (/** @type {?} */ (this.directive)).bindToController : (/** @type {?} */ (this.directive)).scope;
        if (typeof context == 'object') {
            Object.keys(context).forEach((/**
             * @param {?} propName
             * @return {?}
             */
            propName => {
                /** @type {?} */
                const definition = context[propName];
                /** @type {?} */
                const bindingType = definition.charAt(0);
                /** @type {?} */
                const bindingOptions = definition.charAt(1);
                /** @type {?} */
                const attrName = definition.substring(bindingOptions === '?' ? 2 : 1) || propName;
                // QUESTION: What about `=*`? Ignore? Throw? Support?
                /** @type {?} */
                const inputName = `input_${attrName}`;
                /** @type {?} */
                const inputNameRename = `${inputName}: ${attrName}`;
                /** @type {?} */
                const outputName = `output_${attrName}`;
                /** @type {?} */
                const outputNameRename = `${outputName}: ${attrName}`;
                /** @type {?} */
                const outputNameRenameChange = `${outputNameRename}Change`;
                switch (bindingType) {
                    case '@':
                    case '<':
                        this.inputs.push(inputName);
                        this.inputsRename.push(inputNameRename);
                        this.propertyMap[inputName] = propName;
                        break;
                    case '=':
                        this.inputs.push(inputName);
                        this.inputsRename.push(inputNameRename);
                        this.propertyMap[inputName] = propName;
                        this.outputs.push(outputName);
                        this.outputsRename.push(outputNameRenameChange);
                        this.propertyMap[outputName] = propName;
                        this.checkProperties.push(propName);
                        this.propertyOutputs.push(outputName);
                        break;
                    case '&':
                        this.outputs.push(outputName);
                        this.outputsRename.push(outputNameRename);
                        this.propertyMap[outputName] = propName;
                        break;
                    default:
                        /** @type {?} */
                        let json = JSON.stringify(context);
                        throw new Error(`Unexpected mapping '${bindingType}' in '${json}' in '${this.name}' directive.`);
                }
            }));
        }
    }
    /**
     * Upgrade ng1 components into Angular.
     * @param {?} exportedComponents
     * @param {?} $injector
     * @return {?}
     */
    static resolve(exportedComponents, $injector) {
        /** @type {?} */
        const promises = Object.keys(exportedComponents).map((/**
         * @param {?} name
         * @return {?}
         */
        name => {
            /** @type {?} */
            const exportedComponent = exportedComponents[name];
            exportedComponent.directive = UpgradeHelper.getDirective($injector, name);
            exportedComponent.extractBindings();
            return Promise
                .resolve(UpgradeHelper.getTemplate($injector, exportedComponent.directive, true))
                .then((/**
             * @param {?} template
             * @return {?}
             */
            template => exportedComponent.template = template));
        }));
        return Promise.all(promises);
    }
}
if (false) {
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.type;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.inputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.inputsRename;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.outputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.outputsRename;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.propertyOutputs;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.checkProperties;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.propertyMap;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.directive;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.template;
    /** @type {?} */
    UpgradeNg1ComponentAdapterBuilder.prototype.name;
}
class UpgradeNg1ComponentAdapter {
    /**
     * @param {?} helper
     * @param {?} scope
     * @param {?} template
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} propOuts
     * @param {?} checkProperties
     * @param {?} propertyMap
     */
    constructor(helper, scope, template, inputs, outputs, propOuts, checkProperties, propertyMap) {
        this.helper = helper;
        this.template = template;
        this.inputs = inputs;
        this.outputs = outputs;
        this.propOuts = propOuts;
        this.checkProperties = checkProperties;
        this.propertyMap = propertyMap;
        this.controllerInstance = null;
        this.destinationObj = null;
        this.checkLastValues = [];
        this.$element = null;
        this.directive = helper.directive;
        this.element = helper.element;
        this.$element = helper.$element;
        this.componentScope = scope.$new(!!this.directive.scope);
        /** @type {?} */
        const controllerType = this.directive.controller;
        if (this.directive.bindToController && controllerType) {
            this.controllerInstance = this.helper.buildController(controllerType, this.componentScope);
            this.destinationObj = this.controllerInstance;
        }
        else {
            this.destinationObj = this.componentScope;
        }
        for (let i = 0; i < inputs.length; i++) {
            ((/** @type {?} */ (this)))[inputs[i]] = null;
        }
        for (let j = 0; j < outputs.length; j++) {
            /** @type {?} */
            const emitter = ((/** @type {?} */ (this)))[outputs[j]] = new EventEmitter();
            if (this.propOuts.indexOf(outputs[j]) === -1) {
                this.setComponentProperty(outputs[j], ((/**
                 * @param {?} emitter
                 * @return {?}
                 */
                emitter => (/**
                 * @param {?} value
                 * @return {?}
                 */
                (value) => emitter.emit(value))))(emitter));
            }
        }
        for (let k = 0; k < propOuts.length; k++) {
            this.checkLastValues.push(INITIAL_VALUE);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Collect contents, insert and compile template
        /** @type {?} */
        const attachChildNodes = this.helper.prepareTransclusion();
        /** @type {?} */
        const linkFn = this.helper.compileTemplate(this.template);
        // Instantiate controller (if not already done so)
        /** @type {?} */
        const controllerType = this.directive.controller;
        /** @type {?} */
        const bindToController = this.directive.bindToController;
        if (controllerType && !bindToController) {
            this.controllerInstance = this.helper.buildController(controllerType, this.componentScope);
        }
        // Require other controllers
        /** @type {?} */
        const requiredControllers = this.helper.resolveAndBindRequiredControllers(this.controllerInstance);
        // Hook: $onInit
        if (this.controllerInstance && isFunction(this.controllerInstance.$onInit)) {
            this.controllerInstance.$onInit();
        }
        // Linking
        /** @type {?} */
        const link = this.directive.link;
        /** @type {?} */
        const preLink = typeof link == 'object' && link.pre;
        /** @type {?} */
        const postLink = typeof link == 'object' ? link.post : link;
        /** @type {?} */
        const attrs = NOT_SUPPORTED;
        /** @type {?} */
        const transcludeFn = NOT_SUPPORTED;
        if (preLink) {
            preLink(this.componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        linkFn(this.componentScope, (/** @type {?} */ (null)), { parentBoundTranscludeFn: attachChildNodes });
        if (postLink) {
            postLink(this.componentScope, this.$element, attrs, requiredControllers, transcludeFn);
        }
        // Hook: $postLink
        if (this.controllerInstance && isFunction(this.controllerInstance.$postLink)) {
            this.controllerInstance.$postLink();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const ng1Changes = {};
        Object.keys(changes).forEach((/**
         * @param {?} name
         * @return {?}
         */
        name => {
            /** @type {?} */
            const change = changes[name];
            this.setComponentProperty(name, change.currentValue);
            ng1Changes[this.propertyMap[name]] = change;
        }));
        if (isFunction((/** @type {?} */ (this.destinationObj)).$onChanges)) {
            (/** @type {?} */ ((/** @type {?} */ (this.destinationObj)).$onChanges))(ng1Changes);
        }
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        /** @type {?} */
        const destinationObj = this.destinationObj;
        /** @type {?} */
        const lastValues = this.checkLastValues;
        /** @type {?} */
        const checkProperties = this.checkProperties;
        /** @type {?} */
        const propOuts = this.propOuts;
        checkProperties.forEach((/**
         * @param {?} propName
         * @param {?} i
         * @return {?}
         */
        (propName, i) => {
            /** @type {?} */
            const value = (/** @type {?} */ (destinationObj))[propName];
            /** @type {?} */
            const last = lastValues[i];
            if (!strictEquals(last, value)) {
                /** @type {?} */
                const eventEmitter = ((/** @type {?} */ (this)))[propOuts[i]];
                eventEmitter.emit(lastValues[i] = value);
            }
        }));
        if (this.controllerInstance && isFunction(this.controllerInstance.$doCheck)) {
            this.controllerInstance.$doCheck();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.helper.onDestroy(this.componentScope, this.controllerInstance); }
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    setComponentProperty(name, value) {
        (/** @type {?} */ (this.destinationObj))[this.propertyMap[name]] = value;
    }
}
/** @nocollapse */ UpgradeNg1ComponentAdapter.ɵfac = function UpgradeNg1ComponentAdapter_Factory(t) { i0.ɵɵinvalidFactory(); };
/** @nocollapse */ UpgradeNg1ComponentAdapter.ɵdir = i0.ɵɵdefineDirective({ type: UpgradeNg1ComponentAdapter, features: [i0.ɵɵNgOnChangesFeature()] });
if (false) {
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.controllerInstance;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.destinationObj;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.checkLastValues;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.directive;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.element;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.$element;
    /** @type {?} */
    UpgradeNg1ComponentAdapter.prototype.componentScope;
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.helper;
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.template;
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.inputs;
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.outputs;
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.propOuts;
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.checkProperties;
    /**
     * @type {?}
     * @private
     */
    UpgradeNg1ComponentAdapter.prototype.propertyMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9uZzFfYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL2R5bmFtaWMvc3JjL3VwZ3JhZGVfbmcxX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQVcsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFrRSxNQUFNLGVBQWUsQ0FBQztBQUc5SixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDbEQsT0FBTyxFQUEyQyxhQUFhLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUN4RyxPQUFPLEVBQUMsVUFBVSxFQUFFLFlBQVksRUFBQyxNQUFNLHVCQUF1QixDQUFDOzs7Ozs7Ozs7O01BR3pELFVBQVUsR0FBRyxVQUFVOztNQUN2QixhQUFhLEdBQUc7SUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtDQUN4Qjs7TUFDSyxhQUFhLEdBQVEsZUFBZTtBQUcxQyxNQUFNLE9BQU8saUNBQWlDOzs7O0lBYzVDLFlBQW1CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBWC9CLFdBQU0sR0FBYSxFQUFFLENBQUM7UUFDdEIsaUJBQVksR0FBYSxFQUFFLENBQUM7UUFDNUIsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUN2QixrQkFBYSxHQUFhLEVBQUUsQ0FBQztRQUM3QixvQkFBZSxHQUFhLEVBQUUsQ0FBQztRQUMvQixvQkFBZSxHQUFhLEVBQUUsQ0FBQztRQUMvQixnQkFBVyxHQUE2QixFQUFFLENBQUM7UUFDM0MsY0FBUyxHQUFvQixJQUFJLENBQUM7O2NBSzFCLFFBQVEsR0FDVixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVU7Ozs7O1FBQUUsQ0FBQyxHQUFXLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxF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LElBQUksSUFBSSxDQUFDLGtCQUFrQixJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDM0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQzs7OztJQUVELFdBQVcsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBRXRGLG9CQUFvQixDQUFDLElBQVksRUFBRSxLQUFVO1FBQzNDLG1CQUFBLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ3hELENBQUM7OzsrREF6SEcsMEJBQTBCOzs7Ozs7SUFDOUIsd0RBQTREOztJQUM1RCxvREFBZ0Q7O0lBQ2hELHFEQUE0Qjs7SUFDNUIsK0NBQXNCOztJQUN0Qiw2Q0FBaUI7O0lBQ2pCLDhDQUFxQjs7SUFDckIsb0RBQXVCOzs7OztJQUduQiw0Q0FBNkI7Ozs7O0lBQWlCLDhDQUF3Qjs7Ozs7SUFDdEUsNENBQXdCOzs7OztJQUFFLDZDQUF5Qjs7Ozs7SUFBRSw4Q0FBMEI7Ozs7O0lBQy9FLHFEQUFpQzs7Ozs7SUFBRSxpREFBNEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBEb0NoZWNrLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5qZWN0b3IsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcywgVHlwZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7SUF0dHJpYnV0ZXMsIElEaXJlY3RpdmUsIElEaXJlY3RpdmVQcmVQb3N0LCBJSW5qZWN0b3JTZXJ2aWNlLCBJTGlua0ZuLCBJU2NvcGUsIElUcmFuc2NsdWRlRnVuY3Rpb259IGZyb20gJy4uLy4uL2NvbW1vbi9zcmMvYW5ndWxhcjEnO1xuaW1wb3J0IHskU0NPUEV9IGZyb20gJy4uLy4uL2NvbW1vbi9zcmMvY29uc3RhbnRzJztcbmltcG9ydCB7SUJpbmRpbmdEZXN0aW5hdGlvbiwgSUNvbnRyb2xsZXJJbnN0YW5jZSwgVXBncmFkZUhlbHBlcn0gZnJvbSAnLi4vLi4vY29tbW9uL3NyYy91cGdyYWRlX2hlbHBlcic7XG5pbXBvcnQge2lzRnVuY3Rpb24sIHN0cmljdEVxdWFsc30gZnJvbSAnLi4vLi4vY29tbW9uL3NyYy91dGlsJztcblxuXG5jb25zdCBDQU1FTF9DQVNFID0gLyhbQS1aXSkvZztcbmNvbnN0IElOSVRJQUxfVkFMVUUgPSB7XG4gIF9fVU5JTklUSUFMSVpFRF9fOiB0cnVlXG59O1xuY29uc3QgTk9UX1NVUFBPUlRFRDogYW55ID0gJ05PVF9TVVBQT1JURUQnO1xuXG5cbmV4cG9ydCBjbGFzcyBVcGdyYWRlTmcxQ29tcG9uZW50QWRhcHRlckJ1aWxkZXIge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgdHlwZSAhOiBUeXBlPGFueT47XG4gIGlucHV0czogc3RyaW5nW10gPSBbXTtcbiAgaW5wdXRzUmVuYW1lOiBzdHJpbmdbXSA9IFtdO1xuICBvdXRwdXRzOiBzdHJpbmdbXSA9IFtdO1xuICBvdXRwdXRzUmVuYW1lOiBzdHJpbmdbXSA9IFtdO1xuICBwcm9wZXJ0eU91dHB1dHM6IHN0cmluZ1tdID0gW107XG4gIGNoZWNrUHJvcGVydGllczogc3RyaW5nW10gPSBbXTtcbiAgcHJvcGVydHlNYXA6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBkaXJlY3RpdmU6IElEaXJlY3RpdmV8bnVsbCA9IG51bGw7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICB0ZW1wbGF0ZSAhOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHNlbGVjdG9yID1cbiAgICAgICAgbmFtZS5yZXBsYWNlKENBTUVMX0NBU0UsIChhbGw6IHN0cmluZywgbmV4dDogc3RyaW5nKSA9PiAnLScgKyBuZXh0LnRvTG93ZXJDYXNlKCkpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gTm90ZTogVGhlcmUgaXMgYSBidWcgaW4gVFMgMi40IHRoYXQgcHJldmVudHMgdXMgZnJvbVxuICAgIC8vIGlubGluaW5nIHRoaXMgaW50byBARGlyZWN0aXZlXG4gICAgLy8gVE9ETyh0Ym9zY2gpOiBmaW5kIG9yIGZpbGUgYSBidWcgYWdhaW5zdCBUeXBlU2NyaXB0IGZvciB0aGlzLlxuICAgIGNvbnN0IGRpcmVjdGl2ZSA9IHtzZWxlY3Rvcjogc2VsZWN0b3IsIGlucHV0czogdGhpcy5pbnB1dHNSZW5hbWUsIG91dHB1dHM6IHRoaXMub3V0cHV0c1JlbmFtZX07XG5cbiAgICBARGlyZWN0aXZlKHtqaXQ6IHRydWUsIC4uLmRpcmVjdGl2ZX0pXG4gICAgY2xhc3MgTXlDbGFzcyBleHRlbmRzIFVwZ3JhZGVOZzFDb21wb25lbnRBZGFwdGVyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIERvQ2hlY2ssXG4gICAgICAgIE9uRGVzdHJveSB7XG4gICAgICBjb25zdHJ1Y3RvcihASW5qZWN0KCRTQ09QRSkgc2NvcGU6IElTY29wZSwgaW5qZWN0b3I6IEluamVjdG9yLCBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgICAgIHN1cGVyKFxuICAgICAgICAgICAgbmV3IFVwZ3JhZGVIZWxwZXIoaW5qZWN0b3IsIG5hbWUsIGVsZW1lbnRSZWYsIHNlbGYuZGlyZWN0aXZlIHx8IHVuZGVmaW5lZCksIHNjb3BlLFxuICAgICAgICAgICAgc2VsZi50ZW1wbGF0ZSwgc2VsZi5pbnB1dHMsIHNlbGYub3V0cHV0cywgc2VsZi5wcm9wZXJ0eU91dHB1dHMsIHNlbGYuY2hlY2tQcm9wZXJ0aWVzLFxuICAgICAgICAgICAgc2VsZi5wcm9wZXJ0eU1hcCkgYXMgYW55O1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnR5cGUgPSBNeUNsYXNzO1xuICB9XG5cbiAgZXh0cmFjdEJpbmRpbmdzKCkge1xuICAgIGNvbnN0IGJ0Y0lzT2JqZWN0ID0gdHlwZW9mIHRoaXMuZGlyZWN0aXZlICEuYmluZFRvQ29udHJvbGxlciA9PT0gJ29iamVjdCc7XG4gICAgaWYgKGJ0Y0lzT2JqZWN0ICYmIE9iamVjdC5rZXlzKHRoaXMuZGlyZWN0aXZlICEuc2NvcGUgISkubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEJpbmRpbmcgZGVmaW5pdGlvbnMgb24gc2NvcGUgYW5kIGNvbnRyb2xsZXIgYXQgdGhlIHNhbWUgdGltZSBhcmUgbm90IHN1cHBvcnRlZC5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZXh0ID0gKGJ0Y0lzT2JqZWN0KSA/IHRoaXMuZGlyZWN0aXZlICEuYmluZFRvQ29udHJvbGxlciA6IHRoaXMuZGlyZWN0aXZlICEuc2NvcGU7XG5cbiAgICBpZiAodHlwZW9mIGNvbnRleHQgPT0gJ29iamVjdCcpIHtcbiAgICAgIE9iamVjdC5rZXlzKGNvbnRleHQpLmZvckVhY2gocHJvcE5hbWUgPT4ge1xuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gY29udGV4dFtwcm9wTmFtZV07XG4gICAgICAgIGNvbnN0IGJpbmRpbmdUeXBlID0gZGVmaW5pdGlvbi5jaGFyQXQoMCk7XG4gICAgICAgIGNvbnN0IGJpbmRpbmdPcHRpb25zID0gZGVmaW5pdGlvbi5jaGFyQXQoMSk7XG4gICAgICAgIGNvbnN0IGF0dHJOYW1lID0gZGVmaW5pdGlvbi5zdWJzdHJpbmcoYmluZGluZ09wdGlvbnMgPT09ICc/JyA/IDIgOiAxKSB8fCBwcm9wTmFtZTtcblxuICAgICAgICAvLyBRVUVTVElPTjogV2hhdCBhYm91dCBgPSpgPyBJZ25vcmU/IFRocm93PyBTdXBwb3J0P1xuXG4gICAgICAgIGNvbnN0IGlucHV0TmFtZSA9IGBpbnB1dF8ke2F0dHJOYW1lfWA7XG4gICAgICAgIGNvbnN0IGlucHV0TmFtZVJlbmFtZSA9IGAke2lucHV0TmFtZX06ICR7YXR0ck5hbWV9YDtcbiAgICAgICAgY29uc3Qgb3V0cHV0TmFtZSA9IGBvdXRwdXRfJHthdHRyTmFtZX1gO1xuICAgICAgICBjb25zdCBvdXRwdXROYW1lUmVuYW1lID0gYCR7b3V0cHV0TmFtZX06ICR7YXR0ck5hbWV9YDtcbiAgICAgICAgY29uc3Qgb3V0cHV0TmFtZVJlbmFtZUNoYW5nZSA9IGAke291dHB1dE5hbWVSZW5hbWV9Q2hhbmdlYDtcblxuICAgICAgICBzd2l0Y2ggKGJpbmRpbmdUeXBlKSB7XG4gICAgICAgICAgY2FzZSAnQCc6XG4gICAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgICB0aGlzLmlucHV0cy5wdXNoKGlucHV0TmFtZSk7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1JlbmFtZS5wdXNoKGlucHV0TmFtZVJlbmFtZSk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TWFwW2lucHV0TmFtZV0gPSBwcm9wTmFtZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJz0nOlxuICAgICAgICAgICAgdGhpcy5pbnB1dHMucHVzaChpbnB1dE5hbWUpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNSZW5hbWUucHVzaChpbnB1dE5hbWVSZW5hbWUpO1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eU1hcFtpbnB1dE5hbWVdID0gcHJvcE5hbWU7XG5cbiAgICAgICAgICAgIHRoaXMub3V0cHV0cy5wdXNoKG91dHB1dE5hbWUpO1xuICAgICAgICAgICAgdGhpcy5vdXRwdXRzUmVuYW1lLnB1c2gob3V0cHV0TmFtZVJlbmFtZUNoYW5nZSk7XG4gICAgICAgICAgICB0aGlzLnByb3BlcnR5TWFwW291dHB1dE5hbWVdID0gcHJvcE5hbWU7XG5cbiAgICAgICAgICAgIHRoaXMuY2hlY2tQcm9wZXJ0aWVzLnB1c2gocHJvcE5hbWUpO1xuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eU91dHB1dHMucHVzaChvdXRwdXROYW1lKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgdGhpcy5vdXRwdXRzLnB1c2gob3V0cHV0TmFtZSk7XG4gICAgICAgICAgICB0aGlzLm91dHB1dHNSZW5hbWUucHVzaChvdXRwdXROYW1lUmVuYW1lKTtcbiAgICAgICAgICAgIHRoaXMucHJvcGVydHlNYXBbb3V0cHV0TmFtZV0gPSBwcm9wTmFtZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBsZXQganNvbiA9IEpTT04uc3RyaW5naWZ5KGNvbnRleHQpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBVbmV4cGVjdGVkIG1hcHBpbmcgJyR7YmluZGluZ1R5cGV9JyBpbiAnJHtqc29ufScgaW4gJyR7dGhpcy5uYW1lfScgZGlyZWN0aXZlLmApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBncmFkZSBuZzEgY29tcG9uZW50cyBpbnRvIEFuZ3VsYXIuXG4gICAqL1xuICBzdGF0aWMgcmVzb2x2ZShcbiAgICAgIGV4cG9ydGVkQ29tcG9uZW50czoge1tuYW1lOiBzdHJpbmddOiBVcGdyYWRlTmcxQ29tcG9uZW50QWRhcHRlckJ1aWxkZXJ9LFxuICAgICAgJGluamVjdG9yOiBJSW5qZWN0b3JTZXJ2aWNlKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIGNvbnN0IHByb21pc2VzID0gT2JqZWN0LmtleXMoZXhwb3J0ZWRDb21wb25lbnRzKS5tYXAobmFtZSA9PiB7XG4gICAgICBjb25zdCBleHBvcnRlZENvbXBvbmVudCA9IGV4cG9ydGVkQ29tcG9uZW50c1tuYW1lXTtcbiAgICAgIGV4cG9ydGVkQ29tcG9uZW50LmRpcmVjdGl2ZSA9IFVwZ3JhZGVIZWxwZXIuZ2V0RGlyZWN0aXZlKCRpbmplY3RvciwgbmFtZSk7XG4gICAgICBleHBvcnRlZENvbXBvbmVudC5leHRyYWN0QmluZGluZ3MoKTtcblxuICAgICAgcmV0dXJuIFByb21pc2VcbiAgICAgICAgICAucmVzb2x2ZShVcGdyYWRlSGVscGVyLmdldFRlbXBsYXRlKCRpbmplY3RvciwgZXhwb3J0ZWRDb21wb25lbnQuZGlyZWN0aXZlLCB0cnVlKSlcbiAgICAgICAgICAudGhlbih0ZW1wbGF0ZSA9PiBleHBvcnRlZENvbXBvbmVudC50ZW1wbGF0ZSA9IHRlbXBsYXRlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cbn1cblxuY2xhc3MgVXBncmFkZU5nMUNvbXBvbmVudEFkYXB0ZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgRG9DaGVjayB7XG4gIHByaXZhdGUgY29udHJvbGxlckluc3RhbmNlOiBJQ29udHJvbGxlckluc3RhbmNlfG51bGwgPSBudWxsO1xuICBkZXN0aW5hdGlvbk9iajogSUJpbmRpbmdEZXN0aW5hdGlvbnxudWxsID0gbnVsbDtcbiAgY2hlY2tMYXN0VmFsdWVzOiBhbnlbXSA9IFtdO1xuICBkaXJlY3RpdmU6IElEaXJlY3RpdmU7XG4gIGVsZW1lbnQ6IEVsZW1lbnQ7XG4gICRlbGVtZW50OiBhbnkgPSBudWxsO1xuICBjb21wb25lbnRTY29wZTogSVNjb3BlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBoZWxwZXI6IFVwZ3JhZGVIZWxwZXIsIHNjb3BlOiBJU2NvcGUsIHByaXZhdGUgdGVtcGxhdGU6IHN0cmluZyxcbiAgICAgIHByaXZhdGUgaW5wdXRzOiBzdHJpbmdbXSwgcHJpdmF0ZSBvdXRwdXRzOiBzdHJpbmdbXSwgcHJpdmF0ZSBwcm9wT3V0czogc3RyaW5nW10sXG4gICAgICBwcml2YXRlIGNoZWNrUHJvcGVydGllczogc3RyaW5nW10sIHByaXZhdGUgcHJvcGVydHlNYXA6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9KSB7XG4gICAgdGhpcy5kaXJlY3RpdmUgPSBoZWxwZXIuZGlyZWN0aXZlO1xuICAgIHRoaXMuZWxlbWVudCA9IGhlbHBlci5lbGVtZW50O1xuICAgIHRoaXMuJGVsZW1lbnQgPSBoZWxwZXIuJGVsZW1lbnQ7XG4gICAgdGhpcy5jb21wb25lbnRTY29wZSA9IHNjb3BlLiRuZXcoISF0aGlzLmRpcmVjdGl2ZS5zY29wZSk7XG5cbiAgICBjb25zdCBjb250cm9sbGVyVHlwZSA9IHRoaXMuZGlyZWN0aXZlLmNvbnRyb2xsZXI7XG5cbiAgICBpZiAodGhpcy5kaXJlY3RpdmUuYmluZFRvQ29udHJvbGxlciAmJiBjb250cm9sbGVyVHlwZSkge1xuICAgICAgdGhpcy5jb250cm9sbGVySW5zdGFuY2UgPSB0aGlzLmhlbHBlci5idWlsZENvbnRyb2xsZXIoY29udHJvbGxlclR5cGUsIHRoaXMuY29tcG9uZW50U2NvcGUpO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbk9iaiA9IHRoaXMuY29udHJvbGxlckluc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uT2JqID0gdGhpcy5jb21wb25lbnRTY29wZTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgKHRoaXMgYXMgYW55KVtpbnB1dHNbaV1dID0gbnVsbDtcbiAgICB9XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBvdXRwdXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBlbWl0dGVyID0gKHRoaXMgYXMgYW55KVtvdXRwdXRzW2pdXSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAgICAgaWYgKHRoaXMucHJvcE91dHMuaW5kZXhPZihvdXRwdXRzW2pdKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5zZXRDb21wb25lbnRQcm9wZXJ0eShcbiAgICAgICAgICAgIG91dHB1dHNbal0sIChlbWl0dGVyID0+ICh2YWx1ZTogYW55KSA9PiBlbWl0dGVyLmVtaXQodmFsdWUpKShlbWl0dGVyKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcHJvcE91dHMubGVuZ3RoOyBrKyspIHtcbiAgICAgIHRoaXMuY2hlY2tMYXN0VmFsdWVzLnB1c2goSU5JVElBTF9WQUxVRSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gQ29sbGVjdCBjb250ZW50cywgaW5zZXJ0IGFuZCBjb21waWxlIHRlbXBsYXRlXG4gICAgY29uc3QgYXR0YWNoQ2hpbGROb2RlczogSUxpbmtGbnx1bmRlZmluZWQgPSB0aGlzLmhlbHBlci5wcmVwYXJlVHJhbnNjbHVzaW9uKCk7XG4gICAgY29uc3QgbGlua0ZuID0gdGhpcy5oZWxwZXIuY29tcGlsZVRlbXBsYXRlKHRoaXMudGVtcGxhdGUpO1xuXG4gICAgLy8gSW5zdGFudGlhdGUgY29udHJvbGxlciAoaWYgbm90IGFscmVhZHkgZG9uZSBzbylcbiAgICBjb25zdCBjb250cm9sbGVyVHlwZSA9IHRoaXMuZGlyZWN0aXZlLmNvbnRyb2xsZXI7XG4gICAgY29uc3QgYmluZFRvQ29udHJvbGxlciA9IHRoaXMuZGlyZWN0aXZlLmJpbmRUb0NvbnRyb2xsZXI7XG4gICAgaWYgKGNvbnRyb2xsZXJUeXBlICYmICFiaW5kVG9Db250cm9sbGVyKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSA9IHRoaXMuaGVscGVyLmJ1aWxkQ29udHJvbGxlcihjb250cm9sbGVyVHlwZSwgdGhpcy5jb21wb25lbnRTY29wZSk7XG4gICAgfVxuXG4gICAgLy8gUmVxdWlyZSBvdGhlciBjb250cm9sbGVyc1xuICAgIGNvbnN0IHJlcXVpcmVkQ29udHJvbGxlcnMgPVxuICAgICAgICB0aGlzLmhlbHBlci5yZXNvbHZlQW5kQmluZFJlcXVpcmVkQ29udHJvbGxlcnModGhpcy5jb250cm9sbGVySW5zdGFuY2UpO1xuXG4gICAgLy8gSG9vazogJG9uSW5pdFxuICAgIGlmICh0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSAmJiBpc0Z1bmN0aW9uKHRoaXMuY29udHJvbGxlckluc3RhbmNlLiRvbkluaXQpKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZS4kb25Jbml0KCk7XG4gICAgfVxuXG4gICAgLy8gTGlua2luZ1xuICAgIGNvbnN0IGxpbmsgPSB0aGlzLmRpcmVjdGl2ZS5saW5rO1xuICAgIGNvbnN0IHByZUxpbmsgPSB0eXBlb2YgbGluayA9PSAnb2JqZWN0JyAmJiBsaW5rLnByZTtcbiAgICBjb25zdCBwb3N0TGluayA9IHR5cGVvZiBsaW5rID09ICdvYmplY3QnID8gbGluay5wb3N0IDogbGluaztcbiAgICBjb25zdCBhdHRyczogSUF0dHJpYnV0ZXMgPSBOT1RfU1VQUE9SVEVEO1xuICAgIGNvbnN0IHRyYW5zY2x1ZGVGbjogSVRyYW5zY2x1ZGVGdW5jdGlvbiA9IE5PVF9TVVBQT1JURUQ7XG4gICAgaWYgKHByZUxpbmspIHtcbiAgICAgIHByZUxpbmsodGhpcy5jb21wb25lbnRTY29wZSwgdGhpcy4kZWxlbWVudCwgYXR0cnMsIHJlcXVpcmVkQ29udHJvbGxlcnMsIHRyYW5zY2x1ZGVGbik7XG4gICAgfVxuXG4gICAgbGlua0ZuKHRoaXMuY29tcG9uZW50U2NvcGUsIG51bGwgISwge3BhcmVudEJvdW5kVHJhbnNjbHVkZUZuOiBhdHRhY2hDaGlsZE5vZGVzfSk7XG5cbiAgICBpZiAocG9zdExpbmspIHtcbiAgICAgIHBvc3RMaW5rKHRoaXMuY29tcG9uZW50U2NvcGUsIHRoaXMuJGVsZW1lbnQsIGF0dHJzLCByZXF1aXJlZENvbnRyb2xsZXJzLCB0cmFuc2NsdWRlRm4pO1xuICAgIH1cblxuICAgIC8vIEhvb2s6ICRwb3N0TGlua1xuICAgIGlmICh0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSAmJiBpc0Z1bmN0aW9uKHRoaXMuY29udHJvbGxlckluc3RhbmNlLiRwb3N0TGluaykpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlckluc3RhbmNlLiRwb3N0TGluaygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBuZzFDaGFuZ2VzOiBhbnkgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhjaGFuZ2VzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY29uc3QgY2hhbmdlOiBTaW1wbGVDaGFuZ2UgPSBjaGFuZ2VzW25hbWVdO1xuICAgICAgdGhpcy5zZXRDb21wb25lbnRQcm9wZXJ0eShuYW1lLCBjaGFuZ2UuY3VycmVudFZhbHVlKTtcbiAgICAgIG5nMUNoYW5nZXNbdGhpcy5wcm9wZXJ0eU1hcFtuYW1lXV0gPSBjaGFuZ2U7XG4gICAgfSk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbih0aGlzLmRlc3RpbmF0aW9uT2JqICEuJG9uQ2hhbmdlcykpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb25PYmogIS4kb25DaGFuZ2VzICEobmcxQ2hhbmdlcyk7XG4gICAgfVxuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uT2JqID0gdGhpcy5kZXN0aW5hdGlvbk9iajtcbiAgICBjb25zdCBsYXN0VmFsdWVzID0gdGhpcy5jaGVja0xhc3RWYWx1ZXM7XG4gICAgY29uc3QgY2hlY2tQcm9wZXJ0aWVzID0gdGhpcy5jaGVja1Byb3BlcnRpZXM7XG4gICAgY29uc3QgcHJvcE91dHMgPSB0aGlzLnByb3BPdXRzO1xuICAgIGNoZWNrUHJvcGVydGllcy5mb3JFYWNoKChwcm9wTmFtZSwgaSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBkZXN0aW5hdGlvbk9iaiAhW3Byb3BOYW1lXTtcbiAgICAgIGNvbnN0IGxhc3QgPSBsYXN0VmFsdWVzW2ldO1xuICAgICAgaWYgKCFzdHJpY3RFcXVhbHMobGFzdCwgdmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50RW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4gPSAodGhpcyBhcyBhbnkpW3Byb3BPdXRzW2ldXTtcbiAgICAgICAgZXZlbnRFbWl0dGVyLmVtaXQobGFzdFZhbHVlc1tpXSA9IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmNvbnRyb2xsZXJJbnN0YW5jZSAmJiBpc0Z1bmN0aW9uKHRoaXMuY29udHJvbGxlckluc3RhbmNlLiRkb0NoZWNrKSkge1xuICAgICAgdGhpcy5jb250cm9sbGVySW5zdGFuY2UuJGRvQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgdGhpcy5oZWxwZXIub25EZXN0cm95KHRoaXMuY29tcG9uZW50U2NvcGUsIHRoaXMuY29udHJvbGxlckluc3RhbmNlKTsgfVxuXG4gIHNldENvbXBvbmVudFByb3BlcnR5KG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuZGVzdGluYXRpb25PYmogIVt0aGlzLnByb3BlcnR5TWFwW25hbWVdXSA9IHZhbHVlO1xuICB9XG59XG4iXX0=