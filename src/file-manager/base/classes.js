define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Specifies the File Manager internal ID's
     */
    /** @hidden */
    exports.TOOLBAR_ID = '_toolbar';
    /** @hidden */
    exports.LAYOUT_ID = '_layout';
    /** @hidden */
    exports.NAVIGATION_ID = '_navigation';
    /** @hidden */
    exports.TREE_ID = '_tree';
    /** @hidden */
    exports.GRID_ID = '_grid';
    /** @hidden */
    exports.LARGEICON_ID = '_largeicons';
    /** @hidden */
    exports.DIALOG_ID = '_dialog';
    /** @hidden */
    exports.ALT_DIALOG_ID = '_alt_dialog';
    /** @hidden */
    exports.IMG_DIALOG_ID = '_img_dialog';
    /** @hidden */
    exports.EXTN_DIALOG_ID = '_extn_dialog';
    /** @hidden */
    exports.UPLOAD_DIALOG_ID = '_upload_dialog';
    /** @hidden */
    exports.RETRY_DIALOG_ID = '_retry_dialog';
    /** @hidden */
    exports.CONTEXT_MENU_ID = '_contextmenu';
    /** @hidden */
    exports.SORTBY_ID = '_sortby';
    /** @hidden */
    exports.VIEW_ID = '_view';
    /** @hidden */
    exports.SPLITTER_ID = '_splitter';
    /** @hidden */
    exports.CONTENT_ID = '_content';
    /** @hidden */
    exports.BREADCRUMBBAR_ID = '_breadcrumbbar';
    /** @hidden */
    exports.UPLOAD_ID = '_upload';
    /** @hidden */
    exports.RETRY_ID = '_retry';
    /** @hidden */
    exports.SEARCH_ID = '_search';
    /**
     * Specifies the File Manager internal class names
     */
    /** @hidden */
    exports.ROOT = 'e-filemanager';
    /** @hidden */
    exports.CONTROL = 'e-control';
    /** @hidden */
    exports.CHECK_SELECT = 'e-fe-cb-select';
    /** @hidden */
    exports.ROOT_POPUP = 'e-fe-popup';
    /** @hidden */
    exports.MOBILE = 'e-fe-mobile';
    /** @hidden */
    exports.MOB_POPUP = 'e-fe-popup e-fe-mobile';
    /** @hidden */
    exports.MULTI_SELECT = 'e-fe-m-select';
    /** @hidden */
    exports.FILTER = 'e-fe-m-filter';
    /** @hidden */
    exports.LAYOUT = 'e-layout';
    /** @hidden */
    exports.NAVIGATION = 'e-navigation';
    /** @hidden */
    exports.LAYOUT_CONTENT = 'e-layout-content';
    /** @hidden */
    exports.LARGE_ICONS = 'e-large-icons';
    /** @hidden */
    exports.TB_ITEM = 'e-toolbar-item';
    /** @hidden */
    exports.LIST_ITEM = 'e-list-item';
    /** @hidden */
    exports.LIST_TEXT = 'e-list-text';
    /** @hidden */
    exports.LIST_PARENT = 'e-list-parent';
    /** @hidden */
    exports.TB_OPTION_TICK = 'e-icons e-fe-tick';
    /** @hidden */
    exports.TB_OPTION_DOT = 'e-icons e-fe-dot';
    /** @hidden */
    exports.BLUR = 'e-blur';
    /** @hidden */
    exports.ACTIVE = 'e-active';
    /** @hidden */
    exports.HOVER = 'e-hover';
    /** @hidden */
    exports.FOCUS = 'e-focus';
    /** @hidden */
    exports.FOCUSED = 'e-focused';
    /** @hidden */
    exports.CHECK = 'e-check';
    /** @hidden */
    exports.FRAME = 'e-frame';
    /** @hidden */
    exports.CB_WRAP = 'e-checkbox-wrapper';
    /** @hidden */
    exports.ROW = 'e-row';
    /** @hidden */
    exports.ROWCELL = 'e-rowcell';
    /** @hidden */
    exports.EMPTY = 'e-empty';
    /** @hidden */
    exports.EMPTY_CONTENT = 'e-empty-content';
    /** @hidden */
    exports.EMPTY_INNER_CONTENT = 'e-empty-inner-content';
    /** @hidden */
    exports.CLONE = 'e-fe-clone';
    /** @hidden */
    exports.DROP_FOLDER = 'e-fe-drop-folder';
    /** @hidden */
    exports.DROP_FILE = 'e-fe-drop-file';
    /** @hidden */
    exports.FOLDER = 'e-fe-folder';
    /** @hidden */
    exports.ICON_IMAGE = 'e-fe-image';
    /** @hidden */
    exports.ICON_MUSIC = 'e-fe-music';
    /** @hidden */
    exports.ICON_VIDEO = 'e-fe-video';
    /** @hidden */
    exports.LARGE_ICON = 'e-large-icon';
    /** @hidden */
    exports.LARGE_EMPTY_FOLDER = 'e-empty-icon e-fe-folder';
    /** @hidden */
    exports.LARGE_EMPTY_FOLDER_TWO = 'e-empty-icon.e-fe-folder';
    /** @hidden */
    exports.LARGE_ICON_FOLDER = 'e-fe-folder';
    /** @hidden */
    exports.SELECTED_ITEMS = 'e-items';
    /** @hidden */
    exports.TEXT_CONTENT = 'e-text-content';
    /** @hidden */
    exports.GRID_HEADER = 'e-gridheader';
    /** @hidden */
    exports.TEMPLATE_CELL = 'e-templatecell';
    /** @hidden */
    exports.TREE_VIEW = 'e-treeview';
    /** @hidden */
    exports.MENU_ITEM = 'e-menu-item';
    /** @hidden */
    exports.MENU_ICON = 'e-menu-icon';
    /** @hidden */
    exports.SUBMENU_ICON = 'e-caret';
    /** @hidden */
    exports.GRID_VIEW = 'e-content';
    /** @hidden */
    exports.ICON_VIEW = 'e-list-parent';
    /** @hidden */
    exports.ICON_OPEN = 'e-icons e-fe-open';
    /** @hidden */
    exports.ICON_UPLOAD = 'e-icons e-fe-upload';
    /** @hidden */
    exports.ICON_CUT = 'e-icons e-fe-cut';
    /** @hidden */
    exports.ICON_COPY = 'e-icons e-fe-copy';
    /** @hidden */
    exports.ICON_PASTE = 'e-icons e-fe-paste';
    /** @hidden */
    exports.ICON_DELETE = 'e-icons e-fe-delete';
    /** @hidden */
    exports.ICON_RENAME = 'e-icons e-fe-rename';
    /** @hidden */
    exports.ICON_NEWFOLDER = 'e-icons e-fe-newfolder';
    /** @hidden */
    exports.ICON_DETAILS = 'e-icons e-fe-details';
    /** @hidden */
    exports.ICON_SHORTBY = 'e-icons e-fe-sort';
    /** @hidden */
    exports.ICON_REFRESH = 'e-icons e-fe-refresh';
    /** @hidden */
    exports.ICON_SELECTALL = 'e-icons e-fe-select';
    /** @hidden */
    exports.ICON_DOWNLOAD = 'e-icons e-fe-download';
    /** @hidden */
    exports.ICON_OPTIONS = 'e-icons e-fe-options';
    /** @hidden */
    exports.ICON_GRID = 'e-icons e-fe-grid';
    /** @hidden */
    exports.ICON_LARGE = 'e-icons e-fe-large';
    /** @hidden */
    exports.ICON_BREADCRUMB = 'e-icons e-fe-breadcrumb';
    /** @hidden */
    exports.ICON_CLEAR = 'e-icons e-fe-clear';
    /** @hidden */
    exports.ICON_DROP_IN = 'e-icons e-fe-drop-in';
    /** @hidden */
    exports.ICON_DROP_OUT = 'e-icons e-fe-drop-out';
    /** @hidden */
    exports.ICON_NO_DROP = 'e-icons e-fe-no-drop';
    /** @hidden */
    exports.ICONS = 'e-icons';
    /** @hidden */
    exports.DETAILS_LABEL = 'e-detailslabel';
    /** @hidden */
    exports.ERROR_CONTENT = 'e-fe-errorcontent';
    /** @hidden */
    exports.STATUS = 'e-status';
    /** @hidden */
    exports.BREADCRUMBS = 'e-address';
    /** @hidden */
    exports.RTL = 'e-rtl';
    /** @hidden */
    exports.DISPLAY_NONE = 'e-display-none';
    /** @hidden */
    exports.COLLAPSED = 'e-node-collapsed';
    /** @hidden */
    exports.FULLROW = 'e-fullrow';
    /** @hidden */
    exports.ICON_COLLAPSIBLE = 'e-icon-collapsible';
    /** @hidden */
    exports.SPLIT_BAR = 'e-split-bar';
    /** @hidden */
    exports.HEADER_CHECK = 'e-headercheck';
    /** @hidden */
    exports.OVERLAY = 'e-fe-overlay';
    /** @hidden */
    exports.VALUE = 'e-fe-value';
});
