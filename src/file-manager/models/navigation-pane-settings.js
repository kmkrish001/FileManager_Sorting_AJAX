var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "@syncfusion/ej2-base"], function (require, exports, ej2_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Specifies the navigationpane settings of the File Manager.
     */
    var NavigationPaneSettings = /** @class */ (function (_super) {
        __extends(NavigationPaneSettings, _super);
        function NavigationPaneSettings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        __decorate([
            ej2_base_1.Property('650px')
        ], NavigationPaneSettings.prototype, "maxWidth", void 0);
        __decorate([
            ej2_base_1.Property('240px')
        ], NavigationPaneSettings.prototype, "minWidth", void 0);
        __decorate([
            ej2_base_1.Property(true)
        ], NavigationPaneSettings.prototype, "visible", void 0);
        return NavigationPaneSettings;
    }(ej2_base_1.ChildProperty));
    exports.NavigationPaneSettings = NavigationPaneSettings;
});
