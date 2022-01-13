define(["require", "exports", "./ajax-settings", "./toolbar-settings", "./search-settings", "./details-view-settings", "./contextMenu-settings", "./navigation-pane-settings", "./upload-settings", "./column"], function (require, exports, ajax_settings_1, toolbar_settings_1, search_settings_1, details_view_settings_1, contextMenu_settings_1, navigation_pane_settings_1, upload_settings_1, column_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * FileExplorer common modules
     */
    __export(ajax_settings_1);
    __export(toolbar_settings_1);
    __export(search_settings_1);
    __export(details_view_settings_1);
    __export(contextMenu_settings_1);
    __export(navigation_pane_settings_1);
    __export(upload_settings_1);
    __export(column_1);
});
