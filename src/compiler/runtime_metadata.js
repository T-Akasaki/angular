'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var di_1 = require('angular2/src/core/di');
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var cpl = require('./directive_metadata');
var md = require('angular2/src/core/metadata/directives');
var directive_resolver_1 = require('angular2/src/core/linker/directive_resolver');
var view_resolver_1 = require('angular2/src/core/linker/view_resolver');
var directive_lifecycle_reflector_1 = require('angular2/src/core/linker/directive_lifecycle_reflector');
var interfaces_1 = require('angular2/src/core/linker/interfaces');
var reflection_1 = require('angular2/src/core/reflection/reflection');
var di_2 = require('angular2/src/core/di');
var platform_directives_and_pipes_1 = require('angular2/src/core/platform_directives_and_pipes');
var util_1 = require('./util');
var RuntimeMetadataResolver = (function () {
    function RuntimeMetadataResolver(_directiveResolver, _viewResolver, _platformDirectives) {
        this._directiveResolver = _directiveResolver;
        this._viewResolver = _viewResolver;
        this._platformDirectives = _platformDirectives;
        this._cache = new Map();
    }
    RuntimeMetadataResolver.prototype.getMetadata = function (directiveType) {
        var meta = this._cache.get(directiveType);
        if (lang_1.isBlank(meta)) {
            var dirMeta = this._directiveResolver.resolve(directiveType);
            var moduleUrl = calcModuleUrl(directiveType, dirMeta);
            var templateMeta = null;
            var changeDetectionStrategy = null;
            if (dirMeta instanceof md.ComponentMetadata) {
                var cmpMeta = dirMeta;
                var viewMeta = this._viewResolver.resolve(directiveType);
                templateMeta = new cpl.CompileTemplateMetadata({
                    encapsulation: viewMeta.encapsulation,
                    template: viewMeta.template,
                    templateUrl: viewMeta.templateUrl,
                    styles: viewMeta.styles,
                    styleUrls: viewMeta.styleUrls
                });
                changeDetectionStrategy = cmpMeta.changeDetection;
            }
            meta = cpl.CompileDirectiveMetadata.create({
                selector: dirMeta.selector,
                exportAs: dirMeta.exportAs,
                isComponent: lang_1.isPresent(templateMeta),
                dynamicLoadable: true,
                type: new cpl.CompileTypeMetadata({ name: lang_1.stringify(directiveType), moduleUrl: moduleUrl, runtime: directiveType }),
                template: templateMeta,
                changeDetection: changeDetectionStrategy,
                inputs: dirMeta.inputs,
                outputs: dirMeta.outputs,
                host: dirMeta.host,
                lifecycleHooks: interfaces_1.LIFECYCLE_HOOKS_VALUES.filter(function (hook) { return directive_lifecycle_reflector_1.hasLifecycleHook(hook, directiveType); })
            });
            this._cache.set(directiveType, meta);
        }
        return meta;
    };
    RuntimeMetadataResolver.prototype.getViewDirectivesMetadata = function (component) {
        var _this = this;
        var view = this._viewResolver.resolve(component);
        var directives = flattenDirectives(view, this._platformDirectives);
        for (var i = 0; i < directives.length; i++) {
            if (!isValidDirective(directives[i])) {
                throw new exceptions_1.BaseException("Unexpected directive value '" + lang_1.stringify(directives[i]) + "' on the View of component '" + lang_1.stringify(component) + "'");
            }
        }
        return directives.map(function (type) { return _this.getMetadata(type); });
    };
    RuntimeMetadataResolver = __decorate([
        di_2.Injectable(),
        __param(2, di_2.Optional()),
        __param(2, di_2.Inject(platform_directives_and_pipes_1.PLATFORM_DIRECTIVES)), 
        __metadata('design:paramtypes', [directive_resolver_1.DirectiveResolver, view_resolver_1.ViewResolver, Array])
    ], RuntimeMetadataResolver);
    return RuntimeMetadataResolver;
})();
exports.RuntimeMetadataResolver = RuntimeMetadataResolver;
function flattenDirectives(view, platformDirectives) {
    var directives = [];
    if (lang_1.isPresent(platformDirectives)) {
        flattenArray(platformDirectives, directives);
    }
    if (lang_1.isPresent(view.directives)) {
        flattenArray(view.directives, directives);
    }
    return directives;
}
function flattenArray(tree, out) {
    for (var i = 0; i < tree.length; i++) {
        var item = di_1.resolveForwardRef(tree[i]);
        if (lang_1.isArray(item)) {
            flattenArray(item, out);
        }
        else {
            out.push(item);
        }
    }
}
function isValidDirective(value) {
    return lang_1.isPresent(value) && (value instanceof lang_1.Type);
}
function calcModuleUrl(type, dirMeta) {
    if (lang_1.isPresent(dirMeta.moduleId)) {
        return "package:" + dirMeta.moduleId + util_1.MODULE_SUFFIX;
    }
    else {
        return reflection_1.reflector.importUri(type);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZV9tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb21waWxlci9ydW50aW1lX21ldGFkYXRhLnRzIl0sIm5hbWVzIjpbIlJ1bnRpbWVNZXRhZGF0YVJlc29sdmVyIiwiUnVudGltZU1ldGFkYXRhUmVzb2x2ZXIuY29uc3RydWN0b3IiLCJSdW50aW1lTWV0YWRhdGFSZXNvbHZlci5nZXRNZXRhZGF0YSIsIlJ1bnRpbWVNZXRhZGF0YVJlc29sdmVyLmdldFZpZXdEaXJlY3RpdmVzTWV0YWRhdGEiLCJmbGF0dGVuRGlyZWN0aXZlcyIsImZsYXR0ZW5BcnJheSIsImlzVmFsaWREaXJlY3RpdmUiLCJjYWxjTW9kdWxlVXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG1CQUFnQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQ3ZELHFCQU9PLDBCQUEwQixDQUFDLENBQUE7QUFDbEMsMkJBQTRCLGdDQUFnQyxDQUFDLENBQUE7QUFDN0QsSUFBWSxHQUFHLFdBQU0sc0JBQXNCLENBQUMsQ0FBQTtBQUM1QyxJQUFZLEVBQUUsV0FBTSx1Q0FBdUMsQ0FBQyxDQUFBO0FBQzVELG1DQUFnQyw2Q0FBNkMsQ0FBQyxDQUFBO0FBQzlFLDhCQUEyQix3Q0FBd0MsQ0FBQyxDQUFBO0FBRXBFLDhDQUErQix3REFBd0QsQ0FBQyxDQUFBO0FBQ3hGLDJCQUFxRCxxQ0FBcUMsQ0FBQyxDQUFBO0FBQzNGLDJCQUF3Qix5Q0FBeUMsQ0FBQyxDQUFBO0FBQ2xFLG1CQUEyQyxzQkFBc0IsQ0FBQyxDQUFBO0FBQ2xFLDhDQUFrQyxpREFBaUQsQ0FBQyxDQUFBO0FBQ3BGLHFCQUE0QixRQUFRLENBQUMsQ0FBQTtBQUVyQztJQUlFQSxpQ0FBb0JBLGtCQUFxQ0EsRUFBVUEsYUFBMkJBLEVBQ2pDQSxtQkFBMkJBO1FBRHBFQyx1QkFBa0JBLEdBQWxCQSxrQkFBa0JBLENBQW1CQTtRQUFVQSxrQkFBYUEsR0FBYkEsYUFBYUEsQ0FBY0E7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Q0EsZ0JBQVNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLFlBQVlBLFdBQUlBLENBQUNBLENBQUNBO0FBQ3JEQSxDQUFDQTtBQUVELHVCQUF1QixJQUFVLEVBQUUsT0FBNkI7SUFDOURDLEVBQUVBLENBQUNBLENBQUNBLGdCQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNoQ0EsTUFBTUEsQ0FBQ0EsYUFBV0EsT0FBT0EsQ0FBQ0EsUUFBUUEsR0FBR0Esb0JBQWVBLENBQUNBO0lBQ3ZEQSxDQUFDQTtJQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNOQSxNQUFNQSxDQUFDQSxzQkFBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDbkNBLENBQUNBO0FBQ0hBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtyZXNvbHZlRm9yd2FyZFJlZn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGknO1xuaW1wb3J0IHtcbiAgVHlwZSxcbiAgaXNCbGFuayxcbiAgaXNQcmVzZW50LFxuICBpc0FycmF5LFxuICBzdHJpbmdpZnksXG4gIFJlZ0V4cFdyYXBwZXJcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7QmFzZUV4Y2VwdGlvbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIGNwbCBmcm9tICcuL2RpcmVjdGl2ZV9tZXRhZGF0YSc7XG5pbXBvcnQgKiBhcyBtZCBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS9kaXJlY3RpdmVzJztcbmltcG9ydCB7RGlyZWN0aXZlUmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9kaXJlY3RpdmVfcmVzb2x2ZXInO1xuaW1wb3J0IHtWaWV3UmVzb2x2ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3X3Jlc29sdmVyJztcbmltcG9ydCB7Vmlld01ldGFkYXRhfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9tZXRhZGF0YS92aWV3JztcbmltcG9ydCB7aGFzTGlmZWN5Y2xlSG9va30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL2RpcmVjdGl2ZV9saWZlY3ljbGVfcmVmbGVjdG9yJztcbmltcG9ydCB7TGlmZWN5Y2xlSG9va3MsIExJRkVDWUNMRV9IT09LU19WQUxVRVN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9pbnRlcmZhY2VzJztcbmltcG9ydCB7cmVmbGVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3QsIE9wdGlvbmFsfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1BMQVRGT1JNX0RJUkVDVElWRVN9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL3BsYXRmb3JtX2RpcmVjdGl2ZXNfYW5kX3BpcGVzJztcbmltcG9ydCB7TU9EVUxFX1NVRkZJWH0gZnJvbSAnLi91dGlsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFJ1bnRpbWVNZXRhZGF0YVJlc29sdmVyIHtcbiAgcHJpdmF0ZSBfY2FjaGUgPSBuZXcgTWFwPFR5cGUsIGNwbC5Db21waWxlRGlyZWN0aXZlTWV0YWRhdGE+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZGlyZWN0aXZlUmVzb2x2ZXI6IERpcmVjdGl2ZVJlc29sdmVyLCBwcml2YXRlIF92aWV3UmVzb2x2ZXI6IFZpZXdSZXNvbHZlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChQTEFURk9STV9ESVJFQ1RJVkVTKSBwcml2YXRlIF9wbGF0Zm9ybURpcmVjdGl2ZXM6IFR5cGVbXSkge31cblxuICBnZXRNZXRhZGF0YShkaXJlY3RpdmVUeXBlOiBUeXBlKTogY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSB7XG4gICAgdmFyIG1ldGEgPSB0aGlzLl9jYWNoZS5nZXQoZGlyZWN0aXZlVHlwZSk7XG4gICAgaWYgKGlzQmxhbmsobWV0YSkpIHtcbiAgICAgIHZhciBkaXJNZXRhID0gdGhpcy5fZGlyZWN0aXZlUmVzb2x2ZXIucmVzb2x2ZShkaXJlY3RpdmVUeXBlKTtcbiAgICAgIHZhciBtb2R1bGVVcmwgPSBjYWxjTW9kdWxlVXJsKGRpcmVjdGl2ZVR5cGUsIGRpck1ldGEpO1xuICAgICAgdmFyIHRlbXBsYXRlTWV0YSA9IG51bGw7XG4gICAgICB2YXIgY2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kgPSBudWxsO1xuXG4gICAgICBpZiAoZGlyTWV0YSBpbnN0YW5jZW9mIG1kLkNvbXBvbmVudE1ldGFkYXRhKSB7XG4gICAgICAgIHZhciBjbXBNZXRhID0gPG1kLkNvbXBvbmVudE1ldGFkYXRhPmRpck1ldGE7XG4gICAgICAgIHZhciB2aWV3TWV0YSA9IHRoaXMuX3ZpZXdSZXNvbHZlci5yZXNvbHZlKGRpcmVjdGl2ZVR5cGUpO1xuICAgICAgICB0ZW1wbGF0ZU1ldGEgPSBuZXcgY3BsLkNvbXBpbGVUZW1wbGF0ZU1ldGFkYXRhKHtcbiAgICAgICAgICBlbmNhcHN1bGF0aW9uOiB2aWV3TWV0YS5lbmNhcHN1bGF0aW9uLFxuICAgICAgICAgIHRlbXBsYXRlOiB2aWV3TWV0YS50ZW1wbGF0ZSxcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogdmlld01ldGEudGVtcGxhdGVVcmwsXG4gICAgICAgICAgc3R5bGVzOiB2aWV3TWV0YS5zdHlsZXMsXG4gICAgICAgICAgc3R5bGVVcmxzOiB2aWV3TWV0YS5zdHlsZVVybHNcbiAgICAgICAgfSk7XG4gICAgICAgIGNoYW5nZURldGVjdGlvblN0cmF0ZWd5ID0gY21wTWV0YS5jaGFuZ2VEZXRlY3Rpb247XG4gICAgICB9XG4gICAgICBtZXRhID0gY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YS5jcmVhdGUoe1xuICAgICAgICBzZWxlY3RvcjogZGlyTWV0YS5zZWxlY3RvcixcbiAgICAgICAgZXhwb3J0QXM6IGRpck1ldGEuZXhwb3J0QXMsXG4gICAgICAgIGlzQ29tcG9uZW50OiBpc1ByZXNlbnQodGVtcGxhdGVNZXRhKSxcbiAgICAgICAgZHluYW1pY0xvYWRhYmxlOiB0cnVlLFxuICAgICAgICB0eXBlOiBuZXcgY3BsLkNvbXBpbGVUeXBlTWV0YWRhdGEoXG4gICAgICAgICAgICB7bmFtZTogc3RyaW5naWZ5KGRpcmVjdGl2ZVR5cGUpLCBtb2R1bGVVcmw6IG1vZHVsZVVybCwgcnVudGltZTogZGlyZWN0aXZlVHlwZX0pLFxuICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVNZXRhLFxuICAgICAgICBjaGFuZ2VEZXRlY3Rpb246IGNoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgICAgICBpbnB1dHM6IGRpck1ldGEuaW5wdXRzLFxuICAgICAgICBvdXRwdXRzOiBkaXJNZXRhLm91dHB1dHMsXG4gICAgICAgIGhvc3Q6IGRpck1ldGEuaG9zdCxcbiAgICAgICAgbGlmZWN5Y2xlSG9va3M6IExJRkVDWUNMRV9IT09LU19WQUxVRVMuZmlsdGVyKGhvb2sgPT4gaGFzTGlmZWN5Y2xlSG9vayhob29rLCBkaXJlY3RpdmVUeXBlKSlcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fY2FjaGUuc2V0KGRpcmVjdGl2ZVR5cGUsIG1ldGEpO1xuICAgIH1cbiAgICByZXR1cm4gbWV0YTtcbiAgfVxuXG4gIGdldFZpZXdEaXJlY3RpdmVzTWV0YWRhdGEoY29tcG9uZW50OiBUeXBlKTogY3BsLkNvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdIHtcbiAgICB2YXIgdmlldyA9IHRoaXMuX3ZpZXdSZXNvbHZlci5yZXNvbHZlKGNvbXBvbmVudCk7XG4gICAgdmFyIGRpcmVjdGl2ZXMgPSBmbGF0dGVuRGlyZWN0aXZlcyh2aWV3LCB0aGlzLl9wbGF0Zm9ybURpcmVjdGl2ZXMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlyZWN0aXZlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFpc1ZhbGlkRGlyZWN0aXZlKGRpcmVjdGl2ZXNbaV0pKSB7XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKFxuICAgICAgICAgICAgYFVuZXhwZWN0ZWQgZGlyZWN0aXZlIHZhbHVlICcke3N0cmluZ2lmeShkaXJlY3RpdmVzW2ldKX0nIG9uIHRoZSBWaWV3IG9mIGNvbXBvbmVudCAnJHtzdHJpbmdpZnkoY29tcG9uZW50KX0nYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGl2ZXMubWFwKHR5cGUgPT4gdGhpcy5nZXRNZXRhZGF0YSh0eXBlKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmxhdHRlbkRpcmVjdGl2ZXModmlldzogVmlld01ldGFkYXRhLCBwbGF0Zm9ybURpcmVjdGl2ZXM6IGFueVtdKTogVHlwZVtdIHtcbiAgbGV0IGRpcmVjdGl2ZXMgPSBbXTtcbiAgaWYgKGlzUHJlc2VudChwbGF0Zm9ybURpcmVjdGl2ZXMpKSB7XG4gICAgZmxhdHRlbkFycmF5KHBsYXRmb3JtRGlyZWN0aXZlcywgZGlyZWN0aXZlcyk7XG4gIH1cbiAgaWYgKGlzUHJlc2VudCh2aWV3LmRpcmVjdGl2ZXMpKSB7XG4gICAgZmxhdHRlbkFycmF5KHZpZXcuZGlyZWN0aXZlcywgZGlyZWN0aXZlcyk7XG4gIH1cbiAgcmV0dXJuIGRpcmVjdGl2ZXM7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5BcnJheSh0cmVlOiBhbnlbXSwgb3V0OiBBcnJheTxUeXBlIHwgYW55W10+KTogdm9pZCB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdHJlZS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gcmVzb2x2ZUZvcndhcmRSZWYodHJlZVtpXSk7XG4gICAgaWYgKGlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIGZsYXR0ZW5BcnJheShpdGVtLCBvdXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQucHVzaChpdGVtKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNWYWxpZERpcmVjdGl2ZSh2YWx1ZTogVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNQcmVzZW50KHZhbHVlKSAmJiAodmFsdWUgaW5zdGFuY2VvZiBUeXBlKTtcbn1cblxuZnVuY3Rpb24gY2FsY01vZHVsZVVybCh0eXBlOiBUeXBlLCBkaXJNZXRhOiBtZC5EaXJlY3RpdmVNZXRhZGF0YSk6IHN0cmluZyB7XG4gIGlmIChpc1ByZXNlbnQoZGlyTWV0YS5tb2R1bGVJZCkpIHtcbiAgICByZXR1cm4gYHBhY2thZ2U6JHtkaXJNZXRhLm1vZHVsZUlkfSR7TU9EVUxFX1NVRkZJWH1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByZWZsZWN0b3IuaW1wb3J0VXJpKHR5cGUpO1xuICB9XG59XG4iXX0=