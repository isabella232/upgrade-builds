import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector, NgModule, NgZone, Testability } from '@angular/core';
import * as angular from '../common/angular1';
import { $$TESTABILITY, $DELEGATE, $INJECTOR, $INTERVAL, $PROVIDE, INJECTOR_KEY, LAZY_MODULE_REF, UPGRADE_APP_TYPE_KEY, UPGRADE_MODULE_NAME } from '../common/constants';
import { controllerKey } from '../common/util';
import { angular1Providers, setTempInjectorRef } from './angular1_providers';
import { NgAdapterInjector } from './util';
import * as i0 from "@angular/core";
/**
 * @description
 *
 * An `NgModule`, which you import to provide AngularJS core services,
 * and has an instance method used to bootstrap the hybrid upgrade application.
 *
 * *Part of the [upgrade/static](api?query=upgrade/static)
 * library for hybrid upgrade apps that support AoT compilation*
 *
 * The `upgrade/static` package contains helpers that allow AngularJS and Angular components
 * to be used together inside a hybrid upgrade application, which supports AoT compilation.
 *
 * Specifically, the classes and functions in the `upgrade/static` module allow the following:
 *
 * 1. Creation of an Angular directive that wraps and exposes an AngularJS component so
 *    that it can be used in an Angular template. See `UpgradeComponent`.
 * 2. Creation of an AngularJS directive that wraps and exposes an Angular component so
 *    that it can be used in an AngularJS template. See `downgradeComponent`.
 * 3. Creation of an Angular root injector provider that wraps and exposes an AngularJS
 *    service so that it can be injected into an Angular context. See
 *    {@link UpgradeModule#upgrading-an-angular-1-service Upgrading an AngularJS service} below.
 * 4. Creation of an AngularJS service that wraps and exposes an Angular injectable
 *    so that it can be injected into an AngularJS context. See `downgradeInjectable`.
 * 3. Bootstrapping of a hybrid Angular application which contains both of the frameworks
 *    coexisting in a single application.
 *
 * @usageNotes
 *
 * ```ts
 * import {UpgradeModule} from '@angular/upgrade/static';
 * ```
 *
 * See also the {@link UpgradeModule#examples examples} below.
 *
 * ### Mental Model
 *
 * When reasoning about how a hybrid application works it is useful to have a mental model which
 * describes what is happening and explains what is happening at the lowest level.
 *
 * 1. There are two independent frameworks running in a single application, each framework treats
 *    the other as a black box.
 * 2. Each DOM element on the page is owned exactly by one framework. Whichever framework
 *    instantiated the element is the owner. Each framework only updates/interacts with its own
 *    DOM elements and ignores others.
 * 3. AngularJS directives always execute inside the AngularJS framework codebase regardless of
 *    where they are instantiated.
 * 4. Angular components always execute inside the Angular framework codebase regardless of
 *    where they are instantiated.
 * 5. An AngularJS component can be "upgraded"" to an Angular component. This is achieved by
 *    defining an Angular directive, which bootstraps the AngularJS component at its location
 *    in the DOM. See `UpgradeComponent`.
 * 6. An Angular component can be "downgraded" to an AngularJS component. This is achieved by
 *    defining an AngularJS directive, which bootstraps the Angular component at its location
 *    in the DOM. See `downgradeComponent`.
 * 7. Whenever an "upgraded"/"downgraded" component is instantiated the host element is owned by
 *    the framework doing the instantiation. The other framework then instantiates and owns the
 *    view for that component.
 *    1. This implies that the component bindings will always follow the semantics of the
 *       instantiation framework.
 *    2. The DOM attributes are parsed by the framework that owns the current template. So
 *       attributes in AngularJS templates must use kebab-case, while AngularJS templates must use
 *       camelCase.
 *    3. However the template binding syntax will always use the Angular style, e.g. square
 *       brackets (`[...]`) for property binding.
 * 8. Angular is bootstrapped first; AngularJS is bootstrapped second. AngularJS always owns the
 *    root component of the application.
 * 9. The new application is running in an Angular zone, and therefore it no longer needs calls to
 *    `$apply()`.
 *
 * ### The `UpgradeModule` class
 *
 * This class is an `NgModule`, which you import to provide AngularJS core services,
 * and has an instance method used to bootstrap the hybrid upgrade application.
 *
 * * Core AngularJS services
 *   Importing this `NgModule` will add providers for the core
 *   [AngularJS services](https://docs.angularjs.org/api/ng/service) to the root injector.
 *
 * * Bootstrap
 *   The runtime instance of this class contains a {@link UpgradeModule#bootstrap `bootstrap()`}
 *   method, which you use to bootstrap the top level AngularJS module onto an element in the
 *   DOM for the hybrid upgrade app.
 *
 *   It also contains properties to access the {@link UpgradeModule#injector root injector}, the
 *   bootstrap `NgZone` and the
 *   [AngularJS $injector](https://docs.angularjs.org/api/auto/service/$injector).
 *
 * ### Examples
 *
 * Import the `UpgradeModule` into your top level {@link NgModule Angular `NgModule`}.
 *
 * {@example upgrade/static/ts/full/module.ts region='ng2-module'}
 *
 * Then inject `UpgradeModule` into your Angular `NgModule` and use it to bootstrap the top level
 * [AngularJS module](https://docs.angularjs.org/api/ng/type/angular.Module) in the
 * `ngDoBootstrap()` method.
 *
 * {@example upgrade/static/ts/full/module.ts region='bootstrap-ng1'}
 *
 * Finally, kick off the whole process, by bootstraping your top level Angular `NgModule`.
 *
 * {@example upgrade/static/ts/full/module.ts region='bootstrap-ng2'}
 *
 * {@a upgrading-an-angular-1-service}
 * ### Upgrading an AngularJS service
 *
 * There is no specific API for upgrading an AngularJS service. Instead you should just follow the
 * following recipe:
 *
 * Let's say you have an AngularJS service:
 *
 * {@example upgrade/static/ts/full/module.ts region="ng1-text-formatter-service"}
 *
 * Then you should define an Angular provider to be included in your `NgModule` `providers`
 * property.
 *
 * {@example upgrade/static/ts/full/module.ts region="upgrade-ng1-service"}
 *
 * Then you can use the "upgraded" AngularJS service by injecting it into an Angular component
 * or service.
 *
 * {@example upgrade/static/ts/full/module.ts region="use-ng1-upgraded-service"}
 *
 * @publicApi
 */
var UpgradeModule = /** @class */ (function () {
    function UpgradeModule(
    /** The root `Injector` for the upgrade application. */
    injector, 
    /** The bootstrap zone for the upgrade application */
    ngZone) {
        this.ngZone = ngZone;
        this.injector = new NgAdapterInjector(injector);
    }
    /**
     * Bootstrap an AngularJS application from this NgModule
     * @param element the element on which to bootstrap the AngularJS application
     * @param [modules] the AngularJS modules to bootstrap for this application
     * @param [config] optional extra AngularJS bootstrap configuration
     */
    UpgradeModule.prototype.bootstrap = function (element, modules, config /*angular.IAngularBootstrapConfig*/) {
        var _this = this;
        if (modules === void 0) { modules = []; }
        var INIT_MODULE_NAME = UPGRADE_MODULE_NAME + '.init';
        // Create an ng1 module to bootstrap
        var initModule = angular
            .module(INIT_MODULE_NAME, [])
            .constant(UPGRADE_APP_TYPE_KEY, 2 /* Static */)
            .value(INJECTOR_KEY, this.injector)
            .factory(LAZY_MODULE_REF, [
            INJECTOR_KEY,
            function (injector) { return ({ injector: injector, needsNgZone: false }); }
        ])
            .config([
            $PROVIDE, $INJECTOR,
            function ($provide, $injector) {
                if ($injector.has($$TESTABILITY)) {
                    $provide.decorator($$TESTABILITY, [
                        $DELEGATE,
                        function (testabilityDelegate) {
                            var originalWhenStable = testabilityDelegate.whenStable;
                            var injector = _this.injector;
                            // Cannot use arrow function below because we need the context
                            var newWhenStable = function (callback) {
                                originalWhenStable.call(testabilityDelegate, function () {
                                    var ng2Testability = injector.get(Testability);
                                    if (ng2Testability.isStable()) {
                                        callback();
                                    }
                                    else {
                                        ng2Testability.whenStable(newWhenStable.bind(testabilityDelegate, callback));
                                    }
                                });
                            };
                            testabilityDelegate.whenStable = newWhenStable;
                            return testabilityDelegate;
                        }
                    ]);
                }
                if ($injector.has($INTERVAL)) {
                    $provide.decorator($INTERVAL, [
                        $DELEGATE,
                        function (intervalDelegate) {
                            // Wrap the $interval service so that setInterval is called outside NgZone,
                            // but the callback is still invoked within it. This is so that $interval
                            // won't block stability, which preserves the behavior from AngularJS.
                            var wrappedInterval = function (fn, delay, count, invokeApply) {
                                var pass = [];
                                for (var _i = 4; _i < arguments.length; _i++) {
                                    pass[_i - 4] = arguments[_i];
                                }
                                return _this.ngZone.runOutsideAngular(function () {
                                    return intervalDelegate.apply(void 0, tslib_1.__spread([function () {
                                            var args = [];
                                            for (var _i = 0; _i < arguments.length; _i++) {
                                                args[_i] = arguments[_i];
                                            }
                                            // Run callback in the next VM turn - $interval calls
                                            // $rootScope.$apply, and running the callback in NgZone will
                                            // cause a '$digest already in progress' error if it's in the
                                            // same vm turn.
                                            setTimeout(function () { _this.ngZone.run(function () { return fn.apply(void 0, tslib_1.__spread(args)); }); });
                                        }, delay, count, invokeApply], pass));
                                });
                            };
                            wrappedInterval['cancel'] = intervalDelegate.cancel;
                            return wrappedInterval;
                        }
                    ]);
                }
            }
        ])
            .run([
            $INJECTOR,
            function ($injector) {
                _this.$injector = $injector;
                // Initialize the ng1 $injector provider
                setTempInjectorRef($injector);
                _this.injector.get($INJECTOR);
                // Put the injector on the DOM, so that it can be "required"
                angular.element(element).data(controllerKey(INJECTOR_KEY), _this.injector);
                // Wire up the ng1 rootScope to run a digest cycle whenever the zone settles
                // We need to do this in the next tick so that we don't prevent the bootup
                // stabilizing
                setTimeout(function () {
                    var $rootScope = $injector.get('$rootScope');
                    var subscription = _this.ngZone.onMicrotaskEmpty.subscribe(function () { return $rootScope.$digest(); });
                    $rootScope.$on('$destroy', function () { subscription.unsubscribe(); });
                }, 0);
            }
        ]);
        var upgradeModule = angular.module(UPGRADE_MODULE_NAME, [INIT_MODULE_NAME].concat(modules));
        // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
        var windowAngular = window['angular'];
        windowAngular.resumeBootstrap = undefined;
        // Bootstrap the AngularJS application inside our zone
        this.ngZone.run(function () { angular.bootstrap(element, [upgradeModule.name], config); });
        // Patch resumeBootstrap() to run inside the ngZone
        if (windowAngular.resumeBootstrap) {
            var originalResumeBootstrap_1 = windowAngular.resumeBootstrap;
            var ngZone_1 = this.ngZone;
            windowAngular.resumeBootstrap = function () {
                var _this = this;
                var args = arguments;
                windowAngular.resumeBootstrap = originalResumeBootstrap_1;
                return ngZone_1.run(function () { return windowAngular.resumeBootstrap.apply(_this, args); });
            };
        }
    };
    UpgradeModule.ngModuleDef = i0.ɵdefineNgModule({ type: UpgradeModule, bootstrap: [], declarations: [], imports: [], exports: [] });
    UpgradeModule.ngInjectorDef = i0.defineInjector({ factory: function UpgradeModule_Factory(t) { return new (t || UpgradeModule)(i0.inject(Injector), i0.inject(NgZone)); }, providers: [angular1Providers], imports: [] });
    return UpgradeModule;
}());
export { UpgradeModule };
/*@__PURE__*/ i0.ɵsetClassMetadata(UpgradeModule, [{
        type: NgModule,
        args: [{ providers: [angular1Providers] }]
    }], [{
        type: Injector
    }, {
        type: NgZone
    }], null);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZV9tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vIiwic291cmNlcyI6WyJwYWNrYWdlcy91cGdyYWRlL3N0YXRpYy9zcmMvc3RhdGljL3VwZ3JhZGVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXRFLE9BQU8sS0FBSyxPQUFPLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLGVBQWUsRUFBRSxvQkFBb0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3ZLLE9BQU8sRUFBZ0MsYUFBYSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUUsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDM0UsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sUUFBUSxDQUFDOztBQUd6Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRIRztBQUNIO0lBU0U7SUFDSSx1REFBdUQ7SUFDdkQsUUFBa0I7SUFDbEIscURBQXFEO0lBQzlDLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxpQ0FBUyxHQUFULFVBQ0ksT0FBZ0IsRUFBRSxPQUFzQixFQUFFLE1BQVksQ0FBQyxtQ0FBbUM7UUFEOUYsaUJBd0hDO1FBdkhxQix3QkFBQSxFQUFBLFlBQXNCO1FBQzFDLElBQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLEdBQUcsT0FBTyxDQUFDO1FBRXZELG9DQUFvQztRQUNwQyxJQUFNLFVBQVUsR0FDWixPQUFPO2FBQ0YsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQzthQUU1QixRQUFRLENBQUMsb0JBQW9CLGlCQUF3QjthQUVyRCxLQUFLLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7YUFFbEMsT0FBTyxDQUNKLGVBQWUsRUFDZjtZQUNFLFlBQVk7WUFDWixVQUFDLFFBQWtCLElBQUssT0FBQSxDQUFDLEVBQUUsUUFBUSxVQUFBLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBb0IsQ0FBQSxFQUFuRCxDQUFtRDtTQUM1RSxDQUFDO2FBRUwsTUFBTSxDQUFDO1lBQ04sUUFBUSxFQUFFLFNBQVM7WUFDbkIsVUFBQyxRQUFpQyxFQUFFLFNBQW1DO2dCQUNyRSxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQ2hDLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFO3dCQUNoQyxTQUFTO3dCQUNULFVBQUMsbUJBQWdEOzRCQUMvQyxJQUFNLGtCQUFrQixHQUFhLG1CQUFtQixDQUFDLFVBQVUsQ0FBQzs0QkFDcEUsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQzs0QkFDL0IsOERBQThEOzRCQUM5RCxJQUFNLGFBQWEsR0FBRyxVQUFTLFFBQWtCO2dDQUMvQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7b0NBQzNDLElBQU0sY0FBYyxHQUFnQixRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO29DQUM5RCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRTt3Q0FDN0IsUUFBUSxFQUFFLENBQUM7cUNBQ1o7eUNBQU07d0NBQ0wsY0FBYyxDQUFDLFVBQVUsQ0FDckIsYUFBYSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO3FDQUN4RDtnQ0FDSCxDQUFDLENBQUMsQ0FBQzs0QkFDTCxDQUFDLENBQUM7NEJBRUYsbUJBQW1CLENBQUMsVUFBVSxHQUFHLGFBQWEsQ0FBQzs0QkFDL0MsT0FBTyxtQkFBbUIsQ0FBQzt3QkFDN0IsQ0FBQztxQkFDRixDQUFDLENBQUM7aUJBQ0o7Z0JBRUQsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUM1QixRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTt3QkFDNUIsU0FBUzt3QkFDVCxVQUFDLGdCQUEwQzs0QkFDekMsMkVBQTJFOzRCQUMzRSx5RUFBeUU7NEJBQ3pFLHNFQUFzRTs0QkFDdEUsSUFBSSxlQUFlLEdBQ2YsVUFBQyxFQUFZLEVBQUUsS0FBYSxFQUFFLEtBQWMsRUFBRSxXQUFxQjtnQ0FDbEUsY0FBYztxQ0FBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29DQUFkLDZCQUFjOztnQ0FDYixPQUFPLEtBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7b0NBQ25DLE9BQU8sZ0JBQWdCLGlDQUFDOzRDQUFDLGNBQWM7aURBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztnREFBZCx5QkFBYzs7NENBQ3JDLHFEQUFxRDs0Q0FDckQsNkRBQTZEOzRDQUM3RCw2REFBNkQ7NENBQzdELGdCQUFnQjs0Q0FDaEIsVUFBVSxDQUFDLGNBQVEsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBTSxPQUFBLEVBQUUsZ0NBQUksSUFBSSxJQUFWLENBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQzVELENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsR0FBSyxJQUFJLEdBQUU7Z0NBQ3pDLENBQUMsQ0FBQyxDQUFDOzRCQUNMLENBQUMsQ0FBQzs0QkFFTCxlQUF1QixDQUFDLFFBQVEsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzs0QkFDN0QsT0FBTyxlQUFlLENBQUM7d0JBQ3pCLENBQUM7cUJBQ0YsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQztTQUNGLENBQUM7YUFFRCxHQUFHLENBQUM7WUFDSCxTQUFTO1lBQ1QsVUFBQyxTQUFtQztnQkFDbEMsS0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7Z0JBRTNCLHdDQUF3QztnQkFDeEMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlCLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUU3Qiw0REFBNEQ7Z0JBQzVELE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsRUFBRSxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRTVFLDRFQUE0RTtnQkFDNUUsMEVBQTBFO2dCQUMxRSxjQUFjO2dCQUNkLFVBQVUsQ0FBQztvQkFDVCxJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUMvQyxJQUFNLFlBQVksR0FDZCxLQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFwQixDQUFvQixDQUFDLENBQUM7b0JBQ3ZFLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLGNBQVEsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUM7U0FDRixDQUFDLENBQUM7UUFFWCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUU5RiwrRUFBK0U7UUFDL0UsSUFBTSxhQUFhLEdBQUksTUFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELGFBQWEsQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBRTFDLHNEQUFzRDtRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFRLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckYsbURBQW1EO1FBQ25ELElBQUksYUFBYSxDQUFDLGVBQWUsRUFBRTtZQUNqQyxJQUFNLHlCQUF1QixHQUFlLGFBQWEsQ0FBQyxlQUFlLENBQUM7WUFDMUUsSUFBTSxRQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMzQixhQUFhLENBQUMsZUFBZSxHQUFHO2dCQUFBLGlCQUkvQjtnQkFIQyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQ3JCLGFBQWEsQ0FBQyxlQUFlLEdBQUcseUJBQXVCLENBQUM7Z0JBQ3hELE9BQU8sUUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFNLE9BQUEsYUFBYSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLElBQUksQ0FBQyxFQUEvQyxDQUErQyxDQUFDLENBQUM7WUFDM0UsQ0FBQyxDQUFDO1NBQ0g7SUFDSCxDQUFDOzJEQTlJVSxhQUFhO29IQUFiLGFBQWEsWUFVVixRQUFRLGFBRUgsTUFBTSxrQkFiTCxDQUFDLGlCQUFpQixDQUFDO3dCQS9JekM7Q0ErUkMsQUFoSkQsSUFnSkM7U0EvSVksYUFBYTttQ0FBYixhQUFhO2NBRHpCLFFBQVE7ZUFBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEVBQUM7O2NBVzFCLFFBQVE7O2NBRUgsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RvciwgTmdNb2R1bGUsIE5nWm9uZSwgVGVzdGFiaWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJy4uL2NvbW1vbi9hbmd1bGFyMSc7XG5pbXBvcnQgeyQkVEVTVEFCSUxJVFksICRERUxFR0FURSwgJElOSkVDVE9SLCAkSU5URVJWQUwsICRQUk9WSURFLCBJTkpFQ1RPUl9LRVksIExBWllfTU9EVUxFX1JFRiwgVVBHUkFERV9BUFBfVFlQRV9LRVksIFVQR1JBREVfTU9EVUxFX05BTUV9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHtMYXp5TW9kdWxlUmVmLCBVcGdyYWRlQXBwVHlwZSwgY29udHJvbGxlcktleX0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuXG5pbXBvcnQge2FuZ3VsYXIxUHJvdmlkZXJzLCBzZXRUZW1wSW5qZWN0b3JSZWZ9IGZyb20gJy4vYW5ndWxhcjFfcHJvdmlkZXJzJztcbmltcG9ydCB7TmdBZGFwdGVySW5qZWN0b3J9IGZyb20gJy4vdXRpbCc7XG5cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBBbiBgTmdNb2R1bGVgLCB3aGljaCB5b3UgaW1wb3J0IHRvIHByb3ZpZGUgQW5ndWxhckpTIGNvcmUgc2VydmljZXMsXG4gKiBhbmQgaGFzIGFuIGluc3RhbmNlIG1ldGhvZCB1c2VkIHRvIGJvb3RzdHJhcCB0aGUgaHlicmlkIHVwZ3JhZGUgYXBwbGljYXRpb24uXG4gKlxuICogKlBhcnQgb2YgdGhlIFt1cGdyYWRlL3N0YXRpY10oYXBpP3F1ZXJ5PXVwZ3JhZGUvc3RhdGljKVxuICogbGlicmFyeSBmb3IgaHlicmlkIHVwZ3JhZGUgYXBwcyB0aGF0IHN1cHBvcnQgQW9UIGNvbXBpbGF0aW9uKlxuICpcbiAqIFRoZSBgdXBncmFkZS9zdGF0aWNgIHBhY2thZ2UgY29udGFpbnMgaGVscGVycyB0aGF0IGFsbG93IEFuZ3VsYXJKUyBhbmQgQW5ndWxhciBjb21wb25lbnRzXG4gKiB0byBiZSB1c2VkIHRvZ2V0aGVyIGluc2lkZSBhIGh5YnJpZCB1cGdyYWRlIGFwcGxpY2F0aW9uLCB3aGljaCBzdXBwb3J0cyBBb1QgY29tcGlsYXRpb24uXG4gKlxuICogU3BlY2lmaWNhbGx5LCB0aGUgY2xhc3NlcyBhbmQgZnVuY3Rpb25zIGluIHRoZSBgdXBncmFkZS9zdGF0aWNgIG1vZHVsZSBhbGxvdyB0aGUgZm9sbG93aW5nOlxuICpcbiAqIDEuIENyZWF0aW9uIG9mIGFuIEFuZ3VsYXIgZGlyZWN0aXZlIHRoYXQgd3JhcHMgYW5kIGV4cG9zZXMgYW4gQW5ndWxhckpTIGNvbXBvbmVudCBzb1xuICogICAgdGhhdCBpdCBjYW4gYmUgdXNlZCBpbiBhbiBBbmd1bGFyIHRlbXBsYXRlLiBTZWUgYFVwZ3JhZGVDb21wb25lbnRgLlxuICogMi4gQ3JlYXRpb24gb2YgYW4gQW5ndWxhckpTIGRpcmVjdGl2ZSB0aGF0IHdyYXBzIGFuZCBleHBvc2VzIGFuIEFuZ3VsYXIgY29tcG9uZW50IHNvXG4gKiAgICB0aGF0IGl0IGNhbiBiZSB1c2VkIGluIGFuIEFuZ3VsYXJKUyB0ZW1wbGF0ZS4gU2VlIGBkb3duZ3JhZGVDb21wb25lbnRgLlxuICogMy4gQ3JlYXRpb24gb2YgYW4gQW5ndWxhciByb290IGluamVjdG9yIHByb3ZpZGVyIHRoYXQgd3JhcHMgYW5kIGV4cG9zZXMgYW4gQW5ndWxhckpTXG4gKiAgICBzZXJ2aWNlIHNvIHRoYXQgaXQgY2FuIGJlIGluamVjdGVkIGludG8gYW4gQW5ndWxhciBjb250ZXh0LiBTZWVcbiAqICAgIHtAbGluayBVcGdyYWRlTW9kdWxlI3VwZ3JhZGluZy1hbi1hbmd1bGFyLTEtc2VydmljZSBVcGdyYWRpbmcgYW4gQW5ndWxhckpTIHNlcnZpY2V9IGJlbG93LlxuICogNC4gQ3JlYXRpb24gb2YgYW4gQW5ndWxhckpTIHNlcnZpY2UgdGhhdCB3cmFwcyBhbmQgZXhwb3NlcyBhbiBBbmd1bGFyIGluamVjdGFibGVcbiAqICAgIHNvIHRoYXQgaXQgY2FuIGJlIGluamVjdGVkIGludG8gYW4gQW5ndWxhckpTIGNvbnRleHQuIFNlZSBgZG93bmdyYWRlSW5qZWN0YWJsZWAuXG4gKiAzLiBCb290c3RyYXBwaW5nIG9mIGEgaHlicmlkIEFuZ3VsYXIgYXBwbGljYXRpb24gd2hpY2ggY29udGFpbnMgYm90aCBvZiB0aGUgZnJhbWV3b3Jrc1xuICogICAgY29leGlzdGluZyBpbiBhIHNpbmdsZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQge1VwZ3JhZGVNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL3VwZ3JhZGUvc3RhdGljJztcbiAqIGBgYFxuICpcbiAqIFNlZSBhbHNvIHRoZSB7QGxpbmsgVXBncmFkZU1vZHVsZSNleGFtcGxlcyBleGFtcGxlc30gYmVsb3cuXG4gKlxuICogIyMjIE1lbnRhbCBNb2RlbFxuICpcbiAqIFdoZW4gcmVhc29uaW5nIGFib3V0IGhvdyBhIGh5YnJpZCBhcHBsaWNhdGlvbiB3b3JrcyBpdCBpcyB1c2VmdWwgdG8gaGF2ZSBhIG1lbnRhbCBtb2RlbCB3aGljaFxuICogZGVzY3JpYmVzIHdoYXQgaXMgaGFwcGVuaW5nIGFuZCBleHBsYWlucyB3aGF0IGlzIGhhcHBlbmluZyBhdCB0aGUgbG93ZXN0IGxldmVsLlxuICpcbiAqIDEuIFRoZXJlIGFyZSB0d28gaW5kZXBlbmRlbnQgZnJhbWV3b3JrcyBydW5uaW5nIGluIGEgc2luZ2xlIGFwcGxpY2F0aW9uLCBlYWNoIGZyYW1ld29yayB0cmVhdHNcbiAqICAgIHRoZSBvdGhlciBhcyBhIGJsYWNrIGJveC5cbiAqIDIuIEVhY2ggRE9NIGVsZW1lbnQgb24gdGhlIHBhZ2UgaXMgb3duZWQgZXhhY3RseSBieSBvbmUgZnJhbWV3b3JrLiBXaGljaGV2ZXIgZnJhbWV3b3JrXG4gKiAgICBpbnN0YW50aWF0ZWQgdGhlIGVsZW1lbnQgaXMgdGhlIG93bmVyLiBFYWNoIGZyYW1ld29yayBvbmx5IHVwZGF0ZXMvaW50ZXJhY3RzIHdpdGggaXRzIG93blxuICogICAgRE9NIGVsZW1lbnRzIGFuZCBpZ25vcmVzIG90aGVycy5cbiAqIDMuIEFuZ3VsYXJKUyBkaXJlY3RpdmVzIGFsd2F5cyBleGVjdXRlIGluc2lkZSB0aGUgQW5ndWxhckpTIGZyYW1ld29yayBjb2RlYmFzZSByZWdhcmRsZXNzIG9mXG4gKiAgICB3aGVyZSB0aGV5IGFyZSBpbnN0YW50aWF0ZWQuXG4gKiA0LiBBbmd1bGFyIGNvbXBvbmVudHMgYWx3YXlzIGV4ZWN1dGUgaW5zaWRlIHRoZSBBbmd1bGFyIGZyYW1ld29yayBjb2RlYmFzZSByZWdhcmRsZXNzIG9mXG4gKiAgICB3aGVyZSB0aGV5IGFyZSBpbnN0YW50aWF0ZWQuXG4gKiA1LiBBbiBBbmd1bGFySlMgY29tcG9uZW50IGNhbiBiZSBcInVwZ3JhZGVkXCJcIiB0byBhbiBBbmd1bGFyIGNvbXBvbmVudC4gVGhpcyBpcyBhY2hpZXZlZCBieVxuICogICAgZGVmaW5pbmcgYW4gQW5ndWxhciBkaXJlY3RpdmUsIHdoaWNoIGJvb3RzdHJhcHMgdGhlIEFuZ3VsYXJKUyBjb21wb25lbnQgYXQgaXRzIGxvY2F0aW9uXG4gKiAgICBpbiB0aGUgRE9NLiBTZWUgYFVwZ3JhZGVDb21wb25lbnRgLlxuICogNi4gQW4gQW5ndWxhciBjb21wb25lbnQgY2FuIGJlIFwiZG93bmdyYWRlZFwiIHRvIGFuIEFuZ3VsYXJKUyBjb21wb25lbnQuIFRoaXMgaXMgYWNoaWV2ZWQgYnlcbiAqICAgIGRlZmluaW5nIGFuIEFuZ3VsYXJKUyBkaXJlY3RpdmUsIHdoaWNoIGJvb3RzdHJhcHMgdGhlIEFuZ3VsYXIgY29tcG9uZW50IGF0IGl0cyBsb2NhdGlvblxuICogICAgaW4gdGhlIERPTS4gU2VlIGBkb3duZ3JhZGVDb21wb25lbnRgLlxuICogNy4gV2hlbmV2ZXIgYW4gXCJ1cGdyYWRlZFwiL1wiZG93bmdyYWRlZFwiIGNvbXBvbmVudCBpcyBpbnN0YW50aWF0ZWQgdGhlIGhvc3QgZWxlbWVudCBpcyBvd25lZCBieVxuICogICAgdGhlIGZyYW1ld29yayBkb2luZyB0aGUgaW5zdGFudGlhdGlvbi4gVGhlIG90aGVyIGZyYW1ld29yayB0aGVuIGluc3RhbnRpYXRlcyBhbmQgb3ducyB0aGVcbiAqICAgIHZpZXcgZm9yIHRoYXQgY29tcG9uZW50LlxuICogICAgMS4gVGhpcyBpbXBsaWVzIHRoYXQgdGhlIGNvbXBvbmVudCBiaW5kaW5ncyB3aWxsIGFsd2F5cyBmb2xsb3cgdGhlIHNlbWFudGljcyBvZiB0aGVcbiAqICAgICAgIGluc3RhbnRpYXRpb24gZnJhbWV3b3JrLlxuICogICAgMi4gVGhlIERPTSBhdHRyaWJ1dGVzIGFyZSBwYXJzZWQgYnkgdGhlIGZyYW1ld29yayB0aGF0IG93bnMgdGhlIGN1cnJlbnQgdGVtcGxhdGUuIFNvXG4gKiAgICAgICBhdHRyaWJ1dGVzIGluIEFuZ3VsYXJKUyB0ZW1wbGF0ZXMgbXVzdCB1c2Uga2ViYWItY2FzZSwgd2hpbGUgQW5ndWxhckpTIHRlbXBsYXRlcyBtdXN0IHVzZVxuICogICAgICAgY2FtZWxDYXNlLlxuICogICAgMy4gSG93ZXZlciB0aGUgdGVtcGxhdGUgYmluZGluZyBzeW50YXggd2lsbCBhbHdheXMgdXNlIHRoZSBBbmd1bGFyIHN0eWxlLCBlLmcuIHNxdWFyZVxuICogICAgICAgYnJhY2tldHMgKGBbLi4uXWApIGZvciBwcm9wZXJ0eSBiaW5kaW5nLlxuICogOC4gQW5ndWxhciBpcyBib290c3RyYXBwZWQgZmlyc3Q7IEFuZ3VsYXJKUyBpcyBib290c3RyYXBwZWQgc2Vjb25kLiBBbmd1bGFySlMgYWx3YXlzIG93bnMgdGhlXG4gKiAgICByb290IGNvbXBvbmVudCBvZiB0aGUgYXBwbGljYXRpb24uXG4gKiA5LiBUaGUgbmV3IGFwcGxpY2F0aW9uIGlzIHJ1bm5pbmcgaW4gYW4gQW5ndWxhciB6b25lLCBhbmQgdGhlcmVmb3JlIGl0IG5vIGxvbmdlciBuZWVkcyBjYWxscyB0b1xuICogICAgYCRhcHBseSgpYC5cbiAqXG4gKiAjIyMgVGhlIGBVcGdyYWRlTW9kdWxlYCBjbGFzc1xuICpcbiAqIFRoaXMgY2xhc3MgaXMgYW4gYE5nTW9kdWxlYCwgd2hpY2ggeW91IGltcG9ydCB0byBwcm92aWRlIEFuZ3VsYXJKUyBjb3JlIHNlcnZpY2VzLFxuICogYW5kIGhhcyBhbiBpbnN0YW5jZSBtZXRob2QgdXNlZCB0byBib290c3RyYXAgdGhlIGh5YnJpZCB1cGdyYWRlIGFwcGxpY2F0aW9uLlxuICpcbiAqICogQ29yZSBBbmd1bGFySlMgc2VydmljZXNcbiAqICAgSW1wb3J0aW5nIHRoaXMgYE5nTW9kdWxlYCB3aWxsIGFkZCBwcm92aWRlcnMgZm9yIHRoZSBjb3JlXG4gKiAgIFtBbmd1bGFySlMgc2VydmljZXNdKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy9zZXJ2aWNlKSB0byB0aGUgcm9vdCBpbmplY3Rvci5cbiAqXG4gKiAqIEJvb3RzdHJhcFxuICogICBUaGUgcnVudGltZSBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGNvbnRhaW5zIGEge0BsaW5rIFVwZ3JhZGVNb2R1bGUjYm9vdHN0cmFwIGBib290c3RyYXAoKWB9XG4gKiAgIG1ldGhvZCwgd2hpY2ggeW91IHVzZSB0byBib290c3RyYXAgdGhlIHRvcCBsZXZlbCBBbmd1bGFySlMgbW9kdWxlIG9udG8gYW4gZWxlbWVudCBpbiB0aGVcbiAqICAgRE9NIGZvciB0aGUgaHlicmlkIHVwZ3JhZGUgYXBwLlxuICpcbiAqICAgSXQgYWxzbyBjb250YWlucyBwcm9wZXJ0aWVzIHRvIGFjY2VzcyB0aGUge0BsaW5rIFVwZ3JhZGVNb2R1bGUjaW5qZWN0b3Igcm9vdCBpbmplY3Rvcn0sIHRoZVxuICogICBib290c3RyYXAgYE5nWm9uZWAgYW5kIHRoZVxuICogICBbQW5ndWxhckpTICRpbmplY3Rvcl0oaHR0cHM6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvYXBpL2F1dG8vc2VydmljZS8kaW5qZWN0b3IpLlxuICpcbiAqICMjIyBFeGFtcGxlc1xuICpcbiAqIEltcG9ydCB0aGUgYFVwZ3JhZGVNb2R1bGVgIGludG8geW91ciB0b3AgbGV2ZWwge0BsaW5rIE5nTW9kdWxlIEFuZ3VsYXIgYE5nTW9kdWxlYH0uXG4gKlxuICoge0BleGFtcGxlIHVwZ3JhZGUvc3RhdGljL3RzL2Z1bGwvbW9kdWxlLnRzIHJlZ2lvbj0nbmcyLW1vZHVsZSd9XG4gKlxuICogVGhlbiBpbmplY3QgYFVwZ3JhZGVNb2R1bGVgIGludG8geW91ciBBbmd1bGFyIGBOZ01vZHVsZWAgYW5kIHVzZSBpdCB0byBib290c3RyYXAgdGhlIHRvcCBsZXZlbFxuICogW0FuZ3VsYXJKUyBtb2R1bGVdKGh0dHBzOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy90eXBlL2FuZ3VsYXIuTW9kdWxlKSBpbiB0aGVcbiAqIGBuZ0RvQm9vdHN0cmFwKClgIG1ldGhvZC5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPSdib290c3RyYXAtbmcxJ31cbiAqXG4gKiBGaW5hbGx5LCBraWNrIG9mZiB0aGUgd2hvbGUgcHJvY2VzcywgYnkgYm9vdHN0cmFwaW5nIHlvdXIgdG9wIGxldmVsIEFuZ3VsYXIgYE5nTW9kdWxlYC5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPSdib290c3RyYXAtbmcyJ31cbiAqXG4gKiB7QGEgdXBncmFkaW5nLWFuLWFuZ3VsYXItMS1zZXJ2aWNlfVxuICogIyMjIFVwZ3JhZGluZyBhbiBBbmd1bGFySlMgc2VydmljZVxuICpcbiAqIFRoZXJlIGlzIG5vIHNwZWNpZmljIEFQSSBmb3IgdXBncmFkaW5nIGFuIEFuZ3VsYXJKUyBzZXJ2aWNlLiBJbnN0ZWFkIHlvdSBzaG91bGQganVzdCBmb2xsb3cgdGhlXG4gKiBmb2xsb3dpbmcgcmVjaXBlOlxuICpcbiAqIExldCdzIHNheSB5b3UgaGF2ZSBhbiBBbmd1bGFySlMgc2VydmljZTpcbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwibmcxLXRleHQtZm9ybWF0dGVyLXNlcnZpY2VcIn1cbiAqXG4gKiBUaGVuIHlvdSBzaG91bGQgZGVmaW5lIGFuIEFuZ3VsYXIgcHJvdmlkZXIgdG8gYmUgaW5jbHVkZWQgaW4geW91ciBgTmdNb2R1bGVgIGBwcm92aWRlcnNgXG4gKiBwcm9wZXJ0eS5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwidXBncmFkZS1uZzEtc2VydmljZVwifVxuICpcbiAqIFRoZW4geW91IGNhbiB1c2UgdGhlIFwidXBncmFkZWRcIiBBbmd1bGFySlMgc2VydmljZSBieSBpbmplY3RpbmcgaXQgaW50byBhbiBBbmd1bGFyIGNvbXBvbmVudFxuICogb3Igc2VydmljZS5cbiAqXG4gKiB7QGV4YW1wbGUgdXBncmFkZS9zdGF0aWMvdHMvZnVsbC9tb2R1bGUudHMgcmVnaW9uPVwidXNlLW5nMS11cGdyYWRlZC1zZXJ2aWNlXCJ9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe3Byb3ZpZGVyczogW2FuZ3VsYXIxUHJvdmlkZXJzXX0pXG5leHBvcnQgY2xhc3MgVXBncmFkZU1vZHVsZSB7XG4gIC8qKlxuICAgKiBUaGUgQW5ndWxhckpTIGAkaW5qZWN0b3JgIGZvciB0aGUgdXBncmFkZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHB1YmxpYyAkaW5qZWN0b3I6IGFueSAvKmFuZ3VsYXIuSUluamVjdG9yU2VydmljZSovO1xuICAvKiogVGhlIEFuZ3VsYXIgSW5qZWN0b3IgKiovXG4gIHB1YmxpYyBpbmplY3RvcjogSW5qZWN0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICAvKiogVGhlIHJvb3QgYEluamVjdG9yYCBmb3IgdGhlIHVwZ3JhZGUgYXBwbGljYXRpb24uICovXG4gICAgICBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICAvKiogVGhlIGJvb3RzdHJhcCB6b25lIGZvciB0aGUgdXBncmFkZSBhcHBsaWNhdGlvbiAqL1xuICAgICAgcHVibGljIG5nWm9uZTogTmdab25lKSB7XG4gICAgdGhpcy5pbmplY3RvciA9IG5ldyBOZ0FkYXB0ZXJJbmplY3RvcihpbmplY3Rvcik7XG4gIH1cblxuICAvKipcbiAgICogQm9vdHN0cmFwIGFuIEFuZ3VsYXJKUyBhcHBsaWNhdGlvbiBmcm9tIHRoaXMgTmdNb2R1bGVcbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIGVsZW1lbnQgb24gd2hpY2ggdG8gYm9vdHN0cmFwIHRoZSBBbmd1bGFySlMgYXBwbGljYXRpb25cbiAgICogQHBhcmFtIFttb2R1bGVzXSB0aGUgQW5ndWxhckpTIG1vZHVsZXMgdG8gYm9vdHN0cmFwIGZvciB0aGlzIGFwcGxpY2F0aW9uXG4gICAqIEBwYXJhbSBbY29uZmlnXSBvcHRpb25hbCBleHRyYSBBbmd1bGFySlMgYm9vdHN0cmFwIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIGJvb3RzdHJhcChcbiAgICAgIGVsZW1lbnQ6IEVsZW1lbnQsIG1vZHVsZXM6IHN0cmluZ1tdID0gW10sIGNvbmZpZz86IGFueSAvKmFuZ3VsYXIuSUFuZ3VsYXJCb290c3RyYXBDb25maWcqLykge1xuICAgIGNvbnN0IElOSVRfTU9EVUxFX05BTUUgPSBVUEdSQURFX01PRFVMRV9OQU1FICsgJy5pbml0JztcblxuICAgIC8vIENyZWF0ZSBhbiBuZzEgbW9kdWxlIHRvIGJvb3RzdHJhcFxuICAgIGNvbnN0IGluaXRNb2R1bGUgPVxuICAgICAgICBhbmd1bGFyXG4gICAgICAgICAgICAubW9kdWxlKElOSVRfTU9EVUxFX05BTUUsIFtdKVxuXG4gICAgICAgICAgICAuY29uc3RhbnQoVVBHUkFERV9BUFBfVFlQRV9LRVksIFVwZ3JhZGVBcHBUeXBlLlN0YXRpYylcblxuICAgICAgICAgICAgLnZhbHVlKElOSkVDVE9SX0tFWSwgdGhpcy5pbmplY3RvcilcblxuICAgICAgICAgICAgLmZhY3RvcnkoXG4gICAgICAgICAgICAgICAgTEFaWV9NT0RVTEVfUkVGLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIElOSkVDVE9SX0tFWSxcbiAgICAgICAgICAgICAgICAgIChpbmplY3RvcjogSW5qZWN0b3IpID0+ICh7IGluamVjdG9yLCBuZWVkc05nWm9uZTogZmFsc2UgfSBhcyBMYXp5TW9kdWxlUmVmKVxuICAgICAgICAgICAgICAgIF0pXG5cbiAgICAgICAgICAgIC5jb25maWcoW1xuICAgICAgICAgICAgICAkUFJPVklERSwgJElOSkVDVE9SLFxuICAgICAgICAgICAgICAoJHByb3ZpZGU6IGFuZ3VsYXIuSVByb3ZpZGVTZXJ2aWNlLCAkaW5qZWN0b3I6IGFuZ3VsYXIuSUluamVjdG9yU2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgkaW5qZWN0b3IuaGFzKCQkVEVTVEFCSUxJVFkpKSB7XG4gICAgICAgICAgICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJCRURVNUQUJJTElUWSwgW1xuICAgICAgICAgICAgICAgICAgICAkREVMRUdBVEUsXG4gICAgICAgICAgICAgICAgICAgICh0ZXN0YWJpbGl0eURlbGVnYXRlOiBhbmd1bGFyLklUZXN0YWJpbGl0eVNlcnZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbFdoZW5TdGFibGU6IEZ1bmN0aW9uID0gdGVzdGFiaWxpdHlEZWxlZ2F0ZS53aGVuU3RhYmxlO1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluamVjdG9yID0gdGhpcy5pbmplY3RvcjtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBDYW5ub3QgdXNlIGFycm93IGZ1bmN0aW9uIGJlbG93IGJlY2F1c2Ugd2UgbmVlZCB0aGUgY29udGV4dFxuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1doZW5TdGFibGUgPSBmdW5jdGlvbihjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsV2hlblN0YWJsZS5jYWxsKHRlc3RhYmlsaXR5RGVsZWdhdGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZzJUZXN0YWJpbGl0eTogVGVzdGFiaWxpdHkgPSBpbmplY3Rvci5nZXQoVGVzdGFiaWxpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmcyVGVzdGFiaWxpdHkuaXNTdGFibGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmcyVGVzdGFiaWxpdHkud2hlblN0YWJsZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3V2hlblN0YWJsZS5iaW5kKHRlc3RhYmlsaXR5RGVsZWdhdGUsIGNhbGxiYWNrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICB0ZXN0YWJpbGl0eURlbGVnYXRlLndoZW5TdGFibGUgPSBuZXdXaGVuU3RhYmxlO1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXN0YWJpbGl0eURlbGVnYXRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJGluamVjdG9yLmhhcygkSU5URVJWQUwpKSB7XG4gICAgICAgICAgICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJElOVEVSVkFMLCBbXG4gICAgICAgICAgICAgICAgICAgICRERUxFR0FURSxcbiAgICAgICAgICAgICAgICAgICAgKGludGVydmFsRGVsZWdhdGU6IGFuZ3VsYXIuSUludGVydmFsU2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIFdyYXAgdGhlICRpbnRlcnZhbCBzZXJ2aWNlIHNvIHRoYXQgc2V0SW50ZXJ2YWwgaXMgY2FsbGVkIG91dHNpZGUgTmdab25lLFxuICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCB0aGUgY2FsbGJhY2sgaXMgc3RpbGwgaW52b2tlZCB3aXRoaW4gaXQuIFRoaXMgaXMgc28gdGhhdCAkaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICAgICAgICAvLyB3b24ndCBibG9jayBzdGFiaWxpdHksIHdoaWNoIHByZXNlcnZlcyB0aGUgYmVoYXZpb3IgZnJvbSBBbmd1bGFySlMuXG4gICAgICAgICAgICAgICAgICAgICAgbGV0IHdyYXBwZWRJbnRlcnZhbCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIChmbjogRnVuY3Rpb24sIGRlbGF5OiBudW1iZXIsIGNvdW50PzogbnVtYmVyLCBpbnZva2VBcHBseT86IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5wYXNzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJ2YWxEZWxlZ2F0ZSgoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUnVuIGNhbGxiYWNrIGluIHRoZSBuZXh0IFZNIHR1cm4gLSAkaW50ZXJ2YWwgY2FsbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJHJvb3RTY29wZS4kYXBwbHksIGFuZCBydW5uaW5nIHRoZSBjYWxsYmFjayBpbiBOZ1pvbmUgd2lsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYXVzZSBhICckZGlnZXN0IGFscmVhZHkgaW4gcHJvZ3Jlc3MnIGVycm9yIGlmIGl0J3MgaW4gdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhbWUgdm0gdHVybi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMubmdab25lLnJ1bigoKSA9PiBmbiguLi5hcmdzKSk7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZGVsYXksIGNvdW50LCBpbnZva2VBcHBseSwgLi4ucGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAod3JhcHBlZEludGVydmFsIGFzIGFueSlbJ2NhbmNlbCddID0gaW50ZXJ2YWxEZWxlZ2F0ZS5jYW5jZWw7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdyYXBwZWRJbnRlcnZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdKVxuXG4gICAgICAgICAgICAucnVuKFtcbiAgICAgICAgICAgICAgJElOSkVDVE9SLFxuICAgICAgICAgICAgICAoJGluamVjdG9yOiBhbmd1bGFyLklJbmplY3RvclNlcnZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLiRpbmplY3RvciA9ICRpbmplY3RvcjtcblxuICAgICAgICAgICAgICAgIC8vIEluaXRpYWxpemUgdGhlIG5nMSAkaW5qZWN0b3IgcHJvdmlkZXJcbiAgICAgICAgICAgICAgICBzZXRUZW1wSW5qZWN0b3JSZWYoJGluamVjdG9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluamVjdG9yLmdldCgkSU5KRUNUT1IpO1xuXG4gICAgICAgICAgICAgICAgLy8gUHV0IHRoZSBpbmplY3RvciBvbiB0aGUgRE9NLCBzbyB0aGF0IGl0IGNhbiBiZSBcInJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudCkuZGF0YSAhKGNvbnRyb2xsZXJLZXkoSU5KRUNUT1JfS0VZKSwgdGhpcy5pbmplY3Rvcik7XG5cbiAgICAgICAgICAgICAgICAvLyBXaXJlIHVwIHRoZSBuZzEgcm9vdFNjb3BlIHRvIHJ1biBhIGRpZ2VzdCBjeWNsZSB3aGVuZXZlciB0aGUgem9uZSBzZXR0bGVzXG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBkbyB0aGlzIGluIHRoZSBuZXh0IHRpY2sgc28gdGhhdCB3ZSBkb24ndCBwcmV2ZW50IHRoZSBib290dXBcbiAgICAgICAgICAgICAgICAvLyBzdGFiaWxpemluZ1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgJHJvb3RTY29wZSA9ICRpbmplY3Rvci5nZXQoJyRyb290U2NvcGUnKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUub25NaWNyb3Rhc2tFbXB0eS5zdWJzY3JpYmUoKCkgPT4gJHJvb3RTY29wZS4kZGlnZXN0KCkpO1xuICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRkZXN0cm95JywgKCkgPT4geyBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTsgfSk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0pO1xuXG4gICAgY29uc3QgdXBncmFkZU1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKFVQR1JBREVfTU9EVUxFX05BTUUsIFtJTklUX01PRFVMRV9OQU1FXS5jb25jYXQobW9kdWxlcykpO1xuXG4gICAgLy8gTWFrZSBzdXJlIHJlc3VtZUJvb3RzdHJhcCgpIG9ubHkgZXhpc3RzIGlmIHRoZSBjdXJyZW50IGJvb3RzdHJhcCBpcyBkZWZlcnJlZFxuICAgIGNvbnN0IHdpbmRvd0FuZ3VsYXIgPSAod2luZG93IGFzIGFueSlbJ2FuZ3VsYXInXTtcbiAgICB3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIEJvb3RzdHJhcCB0aGUgQW5ndWxhckpTIGFwcGxpY2F0aW9uIGluc2lkZSBvdXIgem9uZVxuICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7IGFuZ3VsYXIuYm9vdHN0cmFwKGVsZW1lbnQsIFt1cGdyYWRlTW9kdWxlLm5hbWVdLCBjb25maWcpOyB9KTtcblxuICAgIC8vIFBhdGNoIHJlc3VtZUJvb3RzdHJhcCgpIHRvIHJ1biBpbnNpZGUgdGhlIG5nWm9uZVxuICAgIGlmICh3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcCkge1xuICAgICAgY29uc3Qgb3JpZ2luYWxSZXN1bWVCb290c3RyYXA6ICgpID0+IHZvaWQgPSB3aW5kb3dBbmd1bGFyLnJlc3VtZUJvb3RzdHJhcDtcbiAgICAgIGNvbnN0IG5nWm9uZSA9IHRoaXMubmdab25lO1xuICAgICAgd2luZG93QW5ndWxhci5yZXN1bWVCb290c3RyYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHdpbmRvd0FuZ3VsYXIucmVzdW1lQm9vdHN0cmFwID0gb3JpZ2luYWxSZXN1bWVCb290c3RyYXA7XG4gICAgICAgIHJldHVybiBuZ1pvbmUucnVuKCgpID0+IHdpbmRvd0FuZ3VsYXIucmVzdW1lQm9vdHN0cmFwLmFwcGx5KHRoaXMsIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59XG4iXX0=