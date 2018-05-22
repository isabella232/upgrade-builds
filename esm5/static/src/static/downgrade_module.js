/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { platformBrowser } from '@angular/platform-browser';
import * as angular from '../common/angular1';
import { $INJECTOR, INJECTOR_KEY, LAZY_MODULE_REF, UPGRADE_MODULE_NAME } from '../common/constants';
import { isFunction } from '../common/util';
import { angular1Providers, setTempInjectorRef } from './angular1_providers';
import { NgAdapterInjector } from './util';
/** @experimental */
export function downgradeModule(moduleFactoryOrBootstrapFn) {
    var LAZY_MODULE_NAME = UPGRADE_MODULE_NAME + '.lazy';
    var bootstrapFn = isFunction(moduleFactoryOrBootstrapFn) ?
        moduleFactoryOrBootstrapFn :
        function (extraProviders) {
            return platformBrowser(extraProviders).bootstrapModuleFactory(moduleFactoryOrBootstrapFn);
        };
    var injector;
    // Create an ng1 module to bootstrap.
    angular.module(LAZY_MODULE_NAME, [])
        .factory(INJECTOR_KEY, function () {
        if (!injector) {
            throw new Error('Trying to get the Angular injector before bootstrapping an Angular module.');
        }
        return injector;
    })
        .factory(LAZY_MODULE_REF, [
        $INJECTOR,
        function ($injector) {
            setTempInjectorRef($injector);
            var result = {
                needsNgZone: true,
                promise: bootstrapFn(angular1Providers).then(function (ref) {
                    injector = result.injector = new NgAdapterInjector(ref.injector);
                    injector.get($INJECTOR);
                    return injector;
                })
            };
            return result;
        }
    ]);
    return LAZY_MODULE_NAME;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3NyYy9zdGF0aWMvZG93bmdyYWRlX21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBU0EsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRTFELE9BQU8sS0FBSyxPQUFPLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbEcsT0FBTyxFQUFnQixVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxRQUFRLENBQUM7O0FBSXpDLE1BQU0sMEJBQ0YsMEJBQytEO0lBQ2pFLElBQU0sZ0JBQWdCLEdBQUcsbUJBQW1CLEdBQUcsT0FBTyxDQUFDO0lBQ3ZELElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7UUFDeEQsMEJBQTBCLENBQUMsQ0FBQztRQUM1QixVQUFDLGNBQWdDO1lBQzdCLE9BQUEsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLDBCQUEwQixDQUFDO1FBQWxGLENBQWtGLENBQUM7SUFFM0YsSUFBSSxRQUFrQixDQUFDOztJQUd2QixPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQUUsQ0FBQztTQUMvQixPQUFPLENBQ0osWUFBWSxFQUNaO1FBQ0UsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE1BQU0sSUFBSSxLQUFLLENBQ1gsNEVBQTRFLENBQUMsQ0FBQztTQUNuRjtRQUNELE9BQU8sUUFBUSxDQUFDO0tBQ2pCLENBQUM7U0FDTCxPQUFPLENBQUMsZUFBZSxFQUFFO1FBQ3hCLFNBQVM7UUFDVCxVQUFDLFNBQW1DO1lBQ2xDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlCLElBQU0sTUFBTSxHQUFrQjtnQkFDNUIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLE9BQU8sRUFBRSxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxHQUFHO29CQUM5QyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDakUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFFeEIsT0FBTyxRQUFRLENBQUM7aUJBQ2pCLENBQUM7YUFDSCxDQUFDO1lBQ0YsT0FBTyxNQUFNLENBQUM7U0FDZjtLQUNGLENBQUMsQ0FBQztJQUVQLE9BQU8sZ0JBQWdCLENBQUM7Q0FDekIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0b3IsIE5nTW9kdWxlRmFjdG9yeSwgTmdNb2R1bGVSZWYsIFN0YXRpY1Byb3ZpZGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7cGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0ICogYXMgYW5ndWxhciBmcm9tICcuLi9jb21tb24vYW5ndWxhcjEnO1xuaW1wb3J0IHskSU5KRUNUT1IsIElOSkVDVE9SX0tFWSwgTEFaWV9NT0RVTEVfUkVGLCBVUEdSQURFX01PRFVMRV9OQU1FfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7TGF6eU1vZHVsZVJlZiwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuXG5pbXBvcnQge2FuZ3VsYXIxUHJvdmlkZXJzLCBzZXRUZW1wSW5qZWN0b3JSZWZ9IGZyb20gJy4vYW5ndWxhcjFfcHJvdmlkZXJzJztcbmltcG9ydCB7TmdBZGFwdGVySW5qZWN0b3J9IGZyb20gJy4vdXRpbCc7XG5cblxuLyoqIEBleHBlcmltZW50YWwgKi9cbmV4cG9ydCBmdW5jdGlvbiBkb3duZ3JhZGVNb2R1bGU8VD4oXG4gICAgbW9kdWxlRmFjdG9yeU9yQm9vdHN0cmFwRm46IE5nTW9kdWxlRmFjdG9yeTxUPnxcbiAgICAoKGV4dHJhUHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdKSA9PiBQcm9taXNlPE5nTW9kdWxlUmVmPFQ+PikpOiBzdHJpbmcge1xuICBjb25zdCBMQVpZX01PRFVMRV9OQU1FID0gVVBHUkFERV9NT0RVTEVfTkFNRSArICcubGF6eSc7XG4gIGNvbnN0IGJvb3RzdHJhcEZuID0gaXNGdW5jdGlvbihtb2R1bGVGYWN0b3J5T3JCb290c3RyYXBGbikgP1xuICAgICAgbW9kdWxlRmFjdG9yeU9yQm9vdHN0cmFwRm4gOlxuICAgICAgKGV4dHJhUHJvdmlkZXJzOiBTdGF0aWNQcm92aWRlcltdKSA9PlxuICAgICAgICAgIHBsYXRmb3JtQnJvd3NlcihleHRyYVByb3ZpZGVycykuYm9vdHN0cmFwTW9kdWxlRmFjdG9yeShtb2R1bGVGYWN0b3J5T3JCb290c3RyYXBGbik7XG5cbiAgbGV0IGluamVjdG9yOiBJbmplY3RvcjtcblxuICAvLyBDcmVhdGUgYW4gbmcxIG1vZHVsZSB0byBib290c3RyYXAuXG4gIGFuZ3VsYXIubW9kdWxlKExBWllfTU9EVUxFX05BTUUsIFtdKVxuICAgICAgLmZhY3RvcnkoXG4gICAgICAgICAgSU5KRUNUT1JfS0VZLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGlmICghaW5qZWN0b3IpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgJ1RyeWluZyB0byBnZXQgdGhlIEFuZ3VsYXIgaW5qZWN0b3IgYmVmb3JlIGJvb3RzdHJhcHBpbmcgYW4gQW5ndWxhciBtb2R1bGUuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gaW5qZWN0b3I7XG4gICAgICAgICAgfSlcbiAgICAgIC5mYWN0b3J5KExBWllfTU9EVUxFX1JFRiwgW1xuICAgICAgICAkSU5KRUNUT1IsXG4gICAgICAgICgkaW5qZWN0b3I6IGFuZ3VsYXIuSUluamVjdG9yU2VydmljZSkgPT4ge1xuICAgICAgICAgIHNldFRlbXBJbmplY3RvclJlZigkaW5qZWN0b3IpO1xuICAgICAgICAgIGNvbnN0IHJlc3VsdDogTGF6eU1vZHVsZVJlZiA9IHtcbiAgICAgICAgICAgIG5lZWRzTmdab25lOiB0cnVlLFxuICAgICAgICAgICAgcHJvbWlzZTogYm9vdHN0cmFwRm4oYW5ndWxhcjFQcm92aWRlcnMpLnRoZW4ocmVmID0+IHtcbiAgICAgICAgICAgICAgaW5qZWN0b3IgPSByZXN1bHQuaW5qZWN0b3IgPSBuZXcgTmdBZGFwdGVySW5qZWN0b3IocmVmLmluamVjdG9yKTtcbiAgICAgICAgICAgICAgaW5qZWN0b3IuZ2V0KCRJTkpFQ1RPUik7XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGluamVjdG9yO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gIHJldHVybiBMQVpZX01PRFVMRV9OQU1FO1xufVxuIl19