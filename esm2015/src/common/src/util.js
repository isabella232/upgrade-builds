/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { element as angularElement } from './angular1';
import { $ROOT_ELEMENT, $ROOT_SCOPE, DOWNGRADED_MODULE_COUNT_KEY, UPGRADE_APP_TYPE_KEY } from './constants';
const DIRECTIVE_PREFIX_REGEXP = /^(?:x|data)[:\-_]/i;
const DIRECTIVE_SPECIAL_CHARS_REGEXP = /[:\-_]+(.)/g;
export function onError(e) {
    // TODO: (misko): We seem to not have a stack trace here!
    if (console.error) {
        console.error(e, e.stack);
    }
    else {
        // tslint:disable-next-line:no-console
        console.log(e, e.stack);
    }
    throw e;
}
/**
 * Clean the jqLite/jQuery data on the element and all its descendants.
 * Equivalent to how jqLite/jQuery invoke `cleanData()` on an Element when removed:
 *   https://github.com/angular/angular.js/blob/2e72ea13fa98bebf6ed4b5e3c45eaf5f990ed16f/src/jqLite.js#L349-L355
 *   https://github.com/jquery/jquery/blob/6984d1747623dbc5e87fd6c261a5b6b1628c107c/src/manipulation.js#L182
 *
 * NOTE:
 * `cleanData()` will also invoke the AngularJS `$destroy` DOM event on the element:
 *   https://github.com/angular/angular.js/blob/2e72ea13fa98bebf6ed4b5e3c45eaf5f990ed16f/src/Angular.js#L1932-L1945
 *
 * @param node The DOM node whose data needs to be cleaned.
 */
export function cleanData(node) {
    angularElement.cleanData([node]);
    if (isParentNode(node)) {
        angularElement.cleanData(node.querySelectorAll('*'));
    }
}
export function controllerKey(name) {
    return '$' + name + 'Controller';
}
/**
 * Destroy an AngularJS app given the app `$injector`.
 *
 * NOTE: Destroying an app is not officially supported by AngularJS, but try to do our best by
 *       destroying `$rootScope` and clean the jqLite/jQuery data on `$rootElement` and all
 *       descendants.
 *
 * @param $injector The `$injector` of the AngularJS app to destroy.
 */
export function destroyApp($injector) {
    const $rootElement = $injector.get($ROOT_ELEMENT);
    const $rootScope = $injector.get($ROOT_SCOPE);
    $rootScope.$destroy();
    cleanData($rootElement[0]);
}
export function directiveNormalize(name) {
    return name.replace(DIRECTIVE_PREFIX_REGEXP, '')
        .replace(DIRECTIVE_SPECIAL_CHARS_REGEXP, (_, letter) => letter.toUpperCase());
}
export function getTypeName(type) {
    // Return the name of the type or the first line of its stringified version.
    return type.overriddenName || type.name || type.toString().split('\n')[0];
}
export function getDowngradedModuleCount($injector) {
    return $injector.has(DOWNGRADED_MODULE_COUNT_KEY) ? $injector.get(DOWNGRADED_MODULE_COUNT_KEY) :
        0;
}
export function getUpgradeAppType($injector) {
    return $injector.has(UPGRADE_APP_TYPE_KEY) ? $injector.get(UPGRADE_APP_TYPE_KEY) :
        0 /* None */;
}
export function isFunction(value) {
    return typeof value === 'function';
}
function isParentNode(node) {
    return isFunction(node.querySelectorAll);
}
export function validateInjectionKey($injector, downgradedModule, injectionKey, attemptedAction) {
    const upgradeAppType = getUpgradeAppType($injector);
    const downgradedModuleCount = getDowngradedModuleCount($injector);
    // Check for common errors.
    switch (upgradeAppType) {
        case 1 /* Dynamic */:
        case 2 /* Static */:
            if (downgradedModule) {
                throw new Error(`Error while ${attemptedAction}: 'downgradedModule' unexpectedly specified.\n` +
                    'You should not specify a value for \'downgradedModule\', unless you are downgrading ' +
                    'more than one Angular module (via \'downgradeModule()\').');
            }
            break;
        case 3 /* Lite */:
            if (!downgradedModule && (downgradedModuleCount >= 2)) {
                throw new Error(`Error while ${attemptedAction}: 'downgradedModule' not specified.\n` +
                    'This application contains more than one downgraded Angular module, thus you need to ' +
                    'always specify \'downgradedModule\' when downgrading components and injectables.');
            }
            if (!$injector.has(injectionKey)) {
                throw new Error(`Error while ${attemptedAction}: Unable to find the specified downgraded module.\n` +
                    'Did you forget to downgrade an Angular module or include it in the AngularJS ' +
                    'application?');
            }
            break;
        default:
            throw new Error(`Error while ${attemptedAction}: Not a valid '@angular/upgrade' application.\n` +
                'Did you forget to downgrade an Angular module or include it in the AngularJS ' +
                'application?');
    }
}
export class Deferred {
    constructor() {
        this.promise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
}
/**
 * @return Whether the passed-in component implements the subset of the
 *     `ControlValueAccessor` interface needed for AngularJS `ng-model`
 *     compatibility.
 */
function supportsNgModel(component) {
    return typeof component.writeValue === 'function' &&
        typeof component.registerOnChange === 'function';
}
/**
 * Glue the AngularJS `NgModelController` (if it exists) to the component
 * (if it implements the needed subset of the `ControlValueAccessor` interface).
 */
export function hookupNgModel(ngModel, component) {
    if (ngModel && supportsNgModel(component)) {
        ngModel.$render = () => {
            component.writeValue(ngModel.$viewValue);
        };
        component.registerOnChange(ngModel.$setViewValue.bind(ngModel));
        if (typeof component.registerOnTouched === 'function') {
            component.registerOnTouched(ngModel.$setTouched.bind(ngModel));
        }
    }
}
/**
 * Test two values for strict equality, accounting for the fact that `NaN !== NaN`.
 */
export function strictEquals(val1, val2) {
    return val1 === val2 || (val1 !== val1 && val2 !== val2);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3JjL2NvbW1vbi9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFJSCxPQUFPLEVBQUMsT0FBTyxJQUFJLGNBQWMsRUFBNEUsTUFBTSxZQUFZLENBQUM7QUFDaEksT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsMkJBQTJCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFMUcsTUFBTSx1QkFBdUIsR0FBRyxvQkFBb0IsQ0FBQztBQUNyRCxNQUFNLDhCQUE4QixHQUFHLGFBQWEsQ0FBQztBQUVyRCxNQUFNLFVBQVUsT0FBTyxDQUFDLENBQU07SUFDNUIseURBQXlEO0lBQ3pELElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtRQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7U0FBTTtRQUNMLHNDQUFzQztRQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7SUFDRCxNQUFNLENBQUMsQ0FBQztBQUNWLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUMsSUFBVTtJQUNsQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNqQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN0QixjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3REO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxhQUFhLENBQUMsSUFBWTtJQUN4QyxPQUFPLEdBQUcsR0FBRyxJQUFJLEdBQUcsWUFBWSxD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LElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDM0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdG9yLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtlbGVtZW50IGFzIGFuZ3VsYXJFbGVtZW50LCBJQXVnbWVudGVkSlF1ZXJ5LCBJSW5qZWN0b3JTZXJ2aWNlLCBJTmdNb2RlbENvbnRyb2xsZXIsIElSb290U2NvcGVTZXJ2aWNlfSBmcm9tICcuL2FuZ3VsYXIxJztcbmltcG9ydCB7JFJPT1RfRUxFTUVOVCwgJFJPT1RfU0NPUEUsIERPV05HUkFERURfTU9EVUxFX0NPVU5UX0tFWSwgVVBHUkFERV9BUFBfVFlQRV9LRVl9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgRElSRUNUSVZFX1BSRUZJWF9SRUdFWFAgPSAvXig/Onh8ZGF0YSlbOlxcLV9dL2k7XG5jb25zdCBESVJFQ1RJVkVfU1BFQ0lBTF9DSEFSU19SRUdFWFAgPSAvWzpcXC1fXSsoLikvZztcblxuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3IoZTogYW55KSB7XG4gIC8vIFRPRE86IChtaXNrbyk6IFdlIHNlZW0gdG8gbm90IGhhdmUgYSBzdGFjayB0cmFjZSBoZXJlIVxuICBpZiAoY29uc29sZS5lcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZSwgZS5zdGFjayk7XG4gIH0gZWxzZSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICBjb25zb2xlLmxvZyhlLCBlLnN0YWNrKTtcbiAgfVxuICB0aHJvdyBlO1xufVxuXG4vKipcbiAqIENsZWFuIHRoZSBqcUxpdGUvalF1ZXJ5IGRhdGEgb24gdGhlIGVsZW1lbnQgYW5kIGFsbCBpdHMgZGVzY2VuZGFudHMuXG4gKiBFcXVpdmFsZW50IHRvIGhvdyBqcUxpdGUvalF1ZXJ5IGludm9rZSBgY2xlYW5EYXRhKClgIG9uIGFuIEVsZW1lbnQgd2hlbiByZW1vdmVkOlxuICogICBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvMmU3MmVhMTNmYTk4YmViZjZlZDRiNWUzYzQ1ZWFmNWY5OTBlZDE2Zi9zcmMvanFMaXRlLmpzI0wzNDktTDM1NVxuICogICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzY5ODRkMTc0NzYyM2RiYzVlODdmZDZjMjYxYTViNmIxNjI4YzEwN2Mvc3JjL21hbmlwdWxhdGlvbi5qcyNMMTgyXG4gKlxuICogTk9URTpcbiAqIGBjbGVhbkRhdGEoKWAgd2lsbCBhbHNvIGludm9rZSB0aGUgQW5ndWxhckpTIGAkZGVzdHJveWAgRE9NIGV2ZW50IG9uIHRoZSBlbGVtZW50OlxuICogICBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2Jsb2IvMmU3MmVhMTNmYTk4YmViZjZlZDRiNWUzYzQ1ZWFmNWY5OTBlZDE2Zi9zcmMvQW5ndWxhci5qcyNMMTkzMi1MMTk0NVxuICpcbiAqIEBwYXJhbSBub2RlIFRoZSBET00gbm9kZSB3aG9zZSBkYXRhIG5lZWRzIHRvIGJlIGNsZWFuZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkRhdGEobm9kZTogTm9kZSk6IHZvaWQge1xuICBhbmd1bGFyRWxlbWVudC5jbGVhbkRhdGEoW25vZGVdKTtcbiAgaWYgKGlzUGFyZW50Tm9kZShub2RlKSkge1xuICAgIGFuZ3VsYXJFbGVtZW50LmNsZWFuRGF0YShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRyb2xsZXJLZXkobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICckJyArIG5hbWUgKyAnQ29udHJvbGxlcic7XG59XG5cbi8qKlxuICogRGVzdHJveSBhbiBBbmd1bGFySlMgYXBwIGdpdmVuIHRoZSBhcHAgYCRpbmplY3RvcmAuXG4gKlxuICogTk9URTogRGVzdHJveWluZyBhbiBhcHAgaXMgbm90IG9mZmljaWFsbHkgc3VwcG9ydGVkIGJ5IEFuZ3VsYXJKUywgYnV0IHRyeSB0byBkbyBvdXIgYmVzdCBieVxuICogICAgICAgZGVzdHJveWluZyBgJHJvb3RTY29wZWAgYW5kIGNsZWFuIHRoZSBqcUxpdGUvalF1ZXJ5IGRhdGEgb24gYCRyb290RWxlbWVudGAgYW5kIGFsbFxuICogICAgICAgZGVzY2VuZGFudHMuXG4gKlxuICogQHBhcmFtICRpbmplY3RvciBUaGUgYCRpbmplY3RvcmAgb2YgdGhlIEFuZ3VsYXJKUyBhcHAgdG8gZGVzdHJveS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lBcHAoJGluamVjdG9yOiBJSW5qZWN0b3JTZXJ2aWNlKTogdm9pZCB7XG4gIGNvbnN0ICRyb290RWxlbWVudDogSUF1Z21lbnRlZEpRdWVyeSA9ICRpbmplY3Rvci5nZXQoJFJPT1RfRUxFTUVOVCk7XG4gIGNvbnN0ICRyb290U2NvcGU6IElSb290U2NvcGVTZXJ2aWNlID0gJGluamVjdG9yLmdldCgkUk9PVF9TQ09QRSk7XG5cbiAgJHJvb3RTY29wZS4kZGVzdHJveSgpO1xuICBjbGVhbkRhdGEoJHJvb3RFbGVtZW50WzBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpcmVjdGl2ZU5vcm1hbGl6ZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbmFtZS5yZXBsYWNlKERJUkVDVElWRV9QUkVGSVhfUkVHRVhQLCAnJylcbiAgICAgIC5yZXBsYWNlKERJUkVDVElWRV9TUEVDSUFMX0NIQVJTX1JFR0VYUCwgKF8sIGxldHRlcikgPT4gbGV0dGVyLnRvVXBwZXJDYXNlKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHlwZU5hbWUodHlwZTogVHlwZTxhbnk+KTogc3RyaW5nIHtcbiAgLy8gUmV0dXJuIHRoZSBuYW1lIG9mIHRoZSB0eXBlIG9yIHRoZSBmaXJzdCBsaW5lIG9mIGl0cyBzdHJpbmdpZmllZCB2ZXJzaW9uLlxuICByZXR1cm4gKHR5cGUgYXMgYW55KS5vdmVycmlkZGVuTmFtZSB8fCB0eXBlLm5hbWUgfHwgdHlwZS50b1N0cmluZygpLnNwbGl0KCdcXG4nKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERvd25ncmFkZWRNb2R1bGVDb3VudCgkaW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UpOiBudW1iZXIge1xuICByZXR1cm4gJGluamVjdG9yLmhhcyhET1dOR1JBREVEX01PRFVMRV9DT1VOVF9LRVkpID8gJGluamVjdG9yLmdldChET1dOR1JBREVEX01PRFVMRV9DT1VOVF9LRVkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVcGdyYWRlQXBwVHlwZSgkaW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UpOiBVcGdyYWRlQXBwVHlwZSB7XG4gIHJldHVybiAkaW5qZWN0b3IuaGFzKFVQR1JBREVfQVBQX1RZUEVfS0VZKSA/ICRpbmplY3Rvci5nZXQoVVBHUkFERV9BUFBfVFlQRV9LRVkpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVXBncmFkZUFwcFR5cGUuTm9uZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWU6IGFueSk6IHZhbHVlIGlzIEZ1bmN0aW9uIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNQYXJlbnROb2RlKG5vZGU6IE5vZGV8UGFyZW50Tm9kZSk6IG5vZGUgaXMgUGFyZW50Tm9kZSB7XG4gIHJldHVybiBpc0Z1bmN0aW9uKChub2RlIGFzIHVua25vd24gYXMgUGFyZW50Tm9kZSkucXVlcnlTZWxlY3RvckFsbCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUluamVjdGlvbktleShcbiAgICAkaW5qZWN0b3I6IElJbmplY3RvclNlcnZpY2UsIGRvd25ncmFkZWRNb2R1bGU6IHN0cmluZywgaW5qZWN0aW9uS2V5OiBzdHJpbmcsXG4gICAgYXR0ZW1wdGVkQWN0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgdXBncmFkZUFwcFR5cGUgPSBnZXRVcGdyYWRlQXBwVHlwZSgkaW5qZWN0b3IpO1xuICBjb25zdCBkb3duZ3JhZGVkTW9kdWxlQ291bnQgPSBnZXREb3duZ3JhZGVkTW9kdWxlQ291bnQoJGluamVjdG9yKTtcblxuICAvLyBDaGVjayBmb3IgY29tbW9uIGVycm9ycy5cbiAgc3dpdGNoICh1cGdyYWRlQXBwVHlwZSkge1xuICAgIGNhc2UgVXBncmFkZUFwcFR5cGUuRHluYW1pYzpcbiAgICBjYXNlIFVwZ3JhZGVBcHBUeXBlLlN0YXRpYzpcbiAgICAgIGlmIChkb3duZ3JhZGVkTW9kdWxlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBFcnJvciB3aGlsZSAke2F0dGVtcHRlZEFjdGlvbn06ICdkb3duZ3JhZGVkTW9kdWxlJyB1bmV4cGVjdGVkbHkgc3BlY2lmaWVkLlxcbmAgK1xuICAgICAgICAgICAgJ1lvdSBzaG91bGQgbm90IHNwZWNpZnkgYSB2YWx1ZSBmb3IgXFwnZG93bmdyYWRlZE1vZHVsZVxcJywgdW5sZXNzIHlvdSBhcmUgZG93bmdyYWRpbmcgJyArXG4gICAgICAgICAgICAnbW9yZSB0aGFuIG9uZSBBbmd1bGFyIG1vZHVsZSAodmlhIFxcJ2Rvd25ncmFkZU1vZHVsZSgpXFwnKS4nKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgVXBncmFkZUFwcFR5cGUuTGl0ZTpcbiAgICAgIGlmICghZG93bmdyYWRlZE1vZHVsZSAmJiAoZG93bmdyYWRlZE1vZHVsZUNvdW50ID49IDIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBFcnJvciB3aGlsZSAke2F0dGVtcHRlZEFjdGlvbn06ICdkb3duZ3JhZGVkTW9kdWxlJyBub3Qgc3BlY2lmaWVkLlxcbmAgK1xuICAgICAgICAgICAgJ1RoaXMgYXBwbGljYXRpb24gY29udGFpbnMgbW9yZSB0aGFuIG9uZSBkb3duZ3JhZGVkIEFuZ3VsYXIgbW9kdWxlLCB0aHVzIHlvdSBuZWVkIHRvICcgK1xuICAgICAgICAgICAgJ2Fsd2F5cyBzcGVjaWZ5IFxcJ2Rvd25ncmFkZWRNb2R1bGVcXCcgd2hlbiBkb3duZ3JhZGluZyBjb21wb25lbnRzIGFuZCBpbmplY3RhYmxlcy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCEkaW5qZWN0b3IuaGFzKGluamVjdGlvbktleSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYEVycm9yIHdoaWxlICR7YXR0ZW1wdGVkQWN0aW9ufTogVW5hYmxlIHRvIGZpbmQgdGhlIHNwZWNpZmllZCBkb3duZ3JhZGVkIG1vZHVsZS5cXG5gICtcbiAgICAgICAgICAgICdEaWQgeW91IGZvcmdldCB0byBkb3duZ3JhZGUgYW4gQW5ndWxhciBtb2R1bGUgb3IgaW5jbHVkZSBpdCBpbiB0aGUgQW5ndWxhckpTICcgK1xuICAgICAgICAgICAgJ2FwcGxpY2F0aW9uPycpO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBFcnJvciB3aGlsZSAke2F0dGVtcHRlZEFjdGlvbn06IE5vdCBhIHZhbGlkICdAYW5ndWxhci91cGdyYWRlJyBhcHBsaWNhdGlvbi5cXG5gICtcbiAgICAgICAgICAnRGlkIHlvdSBmb3JnZXQgdG8gZG93bmdyYWRlIGFuIEFuZ3VsYXIgbW9kdWxlIG9yIGluY2x1ZGUgaXQgaW4gdGhlIEFuZ3VsYXJKUyAnICtcbiAgICAgICAgICAnYXBwbGljYXRpb24/Jyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlZmVycmVkPFI+IHtcbiAgcHJvbWlzZTogUHJvbWlzZTxSPjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHJlc29sdmUhOiAodmFsdWU/OiBSfFByb21pc2VMaWtlPFI+KSA9PiB2b2lkO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcmVqZWN0ITogKGVycm9yPzogYW55KSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlID0gcmVzO1xuICAgICAgdGhpcy5yZWplY3QgPSByZWo7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBMYXp5TW9kdWxlUmVmIHtcbiAgaW5qZWN0b3I/OiBJbmplY3RvcjtcbiAgcHJvbWlzZT86IFByb21pc2U8SW5qZWN0b3I+O1xufVxuXG5leHBvcnQgY29uc3QgZW51bSBVcGdyYWRlQXBwVHlwZSB7XG4gIC8vIEFwcCBOT1QgdXNpbmcgYEBhbmd1bGFyL3VwZ3JhZGVgLiAoVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuIGluIGFuIGBuZ1VwZ3JhZGVgIGFwcC4pXG4gIE5vbmUsXG5cbiAgLy8gQXBwIHVzaW5nIHRoZSBkZXByZWNhdGVkIGBAYW5ndWxhci91cGdyYWRlYCBBUElzIChhLmsuYS4gZHluYW1pYyBgbmdVcGdyYWRlYCkuXG4gIER5bmFtaWMsXG5cbiAgLy8gQXBwIHVzaW5nIGBAYW5ndWxhci91cGdyYWRlL3N0YXRpY2Agd2l0aCBgVXBncmFkZU1vZHVsZWAuXG4gIFN0YXRpYyxcblxuICAvLyBBcHAgdXNpbmcgQGFuZ3VsYXIvdXBncmFkZS9zdGF0aWNgIHdpdGggYGRvd25ncmFkZU1vZHVsZSgpYCAoYS5rLmEgYG5nVXBncmFkZWAtbGl0ZSApLlxuICBMaXRlLFxufVxuXG4vKipcbiAqIEByZXR1cm4gV2hldGhlciB0aGUgcGFzc2VkLWluIGNvbXBvbmVudCBpbXBsZW1lbnRzIHRoZSBzdWJzZXQgb2YgdGhlXG4gKiAgICAgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBpbnRlcmZhY2UgbmVlZGVkIGZvciBBbmd1bGFySlMgYG5nLW1vZGVsYFxuICogICAgIGNvbXBhdGliaWxpdHkuXG4gKi9cbmZ1bmN0aW9uIHN1cHBvcnRzTmdNb2RlbChjb21wb25lbnQ6IGFueSkge1xuICByZXR1cm4gdHlwZW9mIGNvbXBvbmVudC53cml0ZVZhbHVlID09PSAnZnVuY3Rpb24nICYmXG4gICAgICB0eXBlb2YgY29tcG9uZW50LnJlZ2lzdGVyT25DaGFuZ2UgPT09ICdmdW5jdGlvbic7XG59XG5cbi8qKlxuICogR2x1ZSB0aGUgQW5ndWxhckpTIGBOZ01vZGVsQ29udHJvbGxlcmAgKGlmIGl0IGV4aXN0cykgdG8gdGhlIGNvbXBvbmVudFxuICogKGlmIGl0IGltcGxlbWVudHMgdGhlIG5lZWRlZCBzdWJzZXQgb2YgdGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgaW50ZXJmYWNlKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhvb2t1cE5nTW9kZWwobmdNb2RlbDogSU5nTW9kZWxDb250cm9sbGVyLCBjb21wb25lbnQ6IGFueSkge1xuICBpZiAobmdNb2RlbCAmJiBzdXBwb3J0c05nTW9kZWwoY29tcG9uZW50KSkge1xuICAgIG5nTW9kZWwuJHJlbmRlciA9ICgpID0+IHtcbiAgICAgIGNvbXBvbmVudC53cml0ZVZhbHVlKG5nTW9kZWwuJHZpZXdWYWx1ZSk7XG4gICAgfTtcbiAgICBjb21wb25lbnQucmVnaXN0ZXJPbkNoYW5nZShuZ01vZGVsLiRzZXRWaWV3VmFsdWUuYmluZChuZ01vZGVsKSk7XG4gICAgaWYgKHR5cGVvZiBjb21wb25lbnQucmVnaXN0ZXJPblRvdWNoZWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbXBvbmVudC5yZWdpc3Rlck9uVG91Y2hlZChuZ01vZGVsLiRzZXRUb3VjaGVkLmJpbmQobmdNb2RlbCkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRlc3QgdHdvIHZhbHVlcyBmb3Igc3RyaWN0IGVxdWFsaXR5LCBhY2NvdW50aW5nIGZvciB0aGUgZmFjdCB0aGF0IGBOYU4gIT09IE5hTmAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdHJpY3RFcXVhbHModmFsMTogYW55LCB2YWwyOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHZhbDEgPT09IHZhbDIgfHwgKHZhbDEgIT09IHZhbDEgJiYgdmFsMiAhPT0gdmFsMik7XG59XG4iXX0=