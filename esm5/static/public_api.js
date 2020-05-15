/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { getAngularJSGlobal, getAngularLib, setAngularJSGlobal, setAngularLib } from '../src/common/src/angular1';
export { downgradeComponent } from '../src/common/src/downgrade_component';
export { downgradeInjectable } from '../src/common/src/downgrade_injectable';
export { VERSION } from '../src/common/src/version';
export { downgradeModule } from './src/downgrade_module';
export { UpgradeComponent } from './src/upgrade_component';
export { UpgradeModule } from './src/upgrade_module';
// This file only re-exports items to appear in the public api. Keep it that way.
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX2FwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3VwZ3JhZGUvc3RhdGljL3B1YmxpY19hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxhQUFhLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNoSCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUN6RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx3Q0FBd0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUduRCxpRkFBaUYiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCB7Z2V0QW5ndWxhckpTR2xvYmFsLCBnZXRBbmd1bGFyTGliLCBzZXRBbmd1bGFySlNHbG9iYWwsIHNldEFuZ3VsYXJMaWJ9IGZyb20gJy4uL3NyYy9jb21tb24vc3JjL2FuZ3VsYXIxJztcbmV4cG9ydCB7ZG93bmdyYWRlQ29tcG9uZW50fSBmcm9tICcuLi9zcmMvY29tbW9uL3NyYy9kb3duZ3JhZGVfY29tcG9uZW50JztcbmV4cG9ydCB7ZG93bmdyYWRlSW5qZWN0YWJsZX0gZnJvbSAnLi4vc3JjL2NvbW1vbi9zcmMvZG93bmdyYWRlX2luamVjdGFibGUnO1xuZXhwb3J0IHtWRVJTSU9OfSBmcm9tICcuLi9zcmMvY29tbW9uL3NyYy92ZXJzaW9uJztcbmV4cG9ydCB7ZG93bmdyYWRlTW9kdWxlfSBmcm9tICcuL3NyYy9kb3duZ3JhZGVfbW9kdWxlJztcbmV4cG9ydCB7VXBncmFkZUNvbXBvbmVudH0gZnJvbSAnLi9zcmMvdXBncmFkZV9jb21wb25lbnQnO1xuZXhwb3J0IHtVcGdyYWRlTW9kdWxlfSBmcm9tICcuL3NyYy91cGdyYWRlX21vZHVsZSc7XG5cblxuLy8gVGhpcyBmaWxlIG9ubHkgcmUtZXhwb3J0cyBpdGVtcyB0byBhcHBlYXIgaW4gdGhlIHB1YmxpYyBhcGkuIEtlZXAgaXQgdGhhdCB3YXkuXG4iXX0=