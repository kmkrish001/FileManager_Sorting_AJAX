define(["require", "exports", "@syncfusion/ej2-navigations", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "./../common/operations", "./dialog", "./../common/utility", "./../common/utility", "./../common/utility", "./../base/constant", "../base/classes"], function (require, exports, ej2_navigations_1, ej2_base_1, ej2_base_2, operations_1, dialog_1, utility_1, utility_2, utility_3, events, CLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * ContextMenu module
     */
    var ContextMenu = /** @class */ (function () {
        /**
         * Constructor for the ContextMenu module
         *
         * @param {IFileManager} parent - Specifies the parent element.
         * @hidden
         */
        function ContextMenu(parent) {
            this.currentItems = [];
            this.currentElement = null;
            this.disabledItems = [];
            this.parent = parent;
            this.render();
        }
        ContextMenu.prototype.render = function () {
            this.keyConfigs = {
                downarrow: 'downarrow',
                uparrow: 'uparrown'
            };
            this.contextMenu = new ej2_navigations_1.ContextMenu({
                enableRtl: this.parent.enableRtl,
                locale: this.parent.locale,
                target: '#' + this.parent.element.id,
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                beforeItemRender: this.onBeforeItemRender.bind(this),
                select: this.onSelect.bind(this),
                beforeOpen: this.onBeforeOpen.bind(this),
                beforeClose: this.onBeforeClose.bind(this),
                cssClass: utility_2.getCssClass(this.parent, CLS.ROOT_POPUP)
            });
            this.contextMenu.isStringTemplate = true;
            this.contextMenu.appendTo('#' + this.parent.element.id + CLS.CONTEXT_MENU_ID);
            this.addEventListener();
        };
        /* istanbul ignore next */
        ContextMenu.prototype.onBeforeItemRender = function (args) {
            if (args.item.id === this.getMenuId('largeiconsview')) {
                var iconSpan = ej2_base_1.createElement('span');
                var element = args.element;
                element.insertBefore(iconSpan, this.parent.view === 'LargeIcons' ? element.childNodes[1] : element.childNodes[0]);
                iconSpan.setAttribute('class', CLS.ICON_LARGE + ' ' + CLS.MENU_ICON);
            }
            if (args.item.id === this.getMenuId('detailsview')) {
                var iconSpan = ej2_base_1.createElement('span');
                var element = args.element;
                element.insertBefore(iconSpan, this.parent.view === 'Details' ? element.childNodes[1] : element.childNodes[0]);
                iconSpan.setAttribute('class', CLS.ICON_GRID + ' ' + CLS.MENU_ICON);
            }
        };
        ContextMenu.prototype.onBeforeClose = function () {
            this.menuTarget = null;
        };
        /* istanbul ignore next */
        ContextMenu.prototype.onBeforeOpen = function (args) {
            var _this = this;
            this.disabledItems = [];
            var selected = false;
            var uid;
            // eslint-disable-next-line
            var data;
            var treeFolder = false;
            var target = args.event.target;
            this.menuTarget = target;
            this.currentElement = args.element;
            if (target.classList.contains('e-spinner-pane')) {
                target = this.parent.navigationpaneModule.activeNode.getElementsByClassName(CLS.FULLROW)[0];
                this.menuTarget = target;
            }
            if (target.classList.contains(CLS.FULLROW)) {
                this.parent.selectedItems.length = 0;
            }
            this.targetElement = this.parent.view === 'Details' ? ej2_base_1.closest(target, 'tr.e-row') : target;
            var view = this.getTargetView(target);
            this.updateActiveModule();
            /* istanbul ignore next */
            if (target.classList.contains(CLS.TREE_VIEW) || ej2_base_1.closest(target, 'th') ||
                (ej2_base_1.closest(target, '#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID)) ||
                (ej2_base_1.closest(target, '#' + this.parent.element.id + CLS.TOOLBAR_ID))) {
                args.cancel = true;
                // eslint:disable-next-line
            }
            else if (!(this.parent.view === 'LargeIcons') && this.targetElement &&
                this.targetElement.classList.contains('e-emptyrow')) {
                this.setLayoutItem(target);
                /* istanbul ignore next */
            }
            else if (ej2_base_1.closest(target, '.' + CLS.EMPTY)) {
                this.setLayoutItem(target);
                // eslint:disable-next-line
            }
            else if (!target.classList.contains(CLS.MENU_ITEM) &&
                !target.classList.contains(CLS.MENU_ICON) && !target.classList.contains(CLS.SUBMENU_ICON)) {
                /* istanbul ignore next */
                // eslint:disable-next-line
                if (this.parent.view === 'LargeIcons' && !ej2_base_1.isNullOrUndefined(ej2_base_1.closest(target, 'li')) && !ej2_base_1.closest(target, '#' + this.parent.element.id + CLS.TREE_ID)) {
                    var eveArgs = { ctrlKey: true, shiftKey: true };
                    if (!ej2_base_1.closest(target, 'li').classList.contains('e-active')) {
                        this.parent.largeiconsviewModule.doSelection(target, eveArgs);
                    }
                    // eslint-disable-next-line
                    data = this.parent.visitedData;
                    selected = true;
                }
                else if (!ej2_base_1.isNullOrUndefined(ej2_base_1.closest(target, 'tr.e-row'))) {
                    uid = this.targetElement.getAttribute('data-uid');
                    // eslint-disable-next-line
                    data = this.parent.detailsviewModule.gridObj.getRowObjectFromUID(uid).data;
                    if (ej2_base_1.isNullOrUndefined(this.targetElement.getAttribute('aria-selected'))) {
                        /* istanbul ignore next */
                        this.parent.detailsviewModule.gridObj.selectRows([parseInt(this.targetElement.getAttribute('aria-rowindex'), 10)]);
                    }
                    selected = true;
                    /* istanbul ignore next */
                }
                else if (ej2_base_1.closest(target, '#' + this.parent.element.id + CLS.TREE_ID)) {
                    uid = ej2_base_1.closest(target, 'li').getAttribute('data-uid');
                    treeFolder = true;
                }
                /* istanbul ignore next */
                if (selected) {
                    if (ej2_base_2.getValue('isFile', data) === true) {
                        this.setFileItem();
                    }
                    else {
                        this.setFolderItem(false);
                    }
                    /* istanbul ignore next */
                }
                else if (treeFolder) {
                    this.setFolderItem(true);
                    if (uid === this.parent.pathId[0]) {
                        this.disabledItems.push('Delete', 'Rename', 'Cut', 'Copy');
                    }
                    /* istanbul ignore next */
                    // eslint:disable-next-line
                }
                else if (view === 'TreeView' || view === 'GridView' || view === 'LargeIcon') {
                    this.setLayoutItem(target);
                    /* istanbul ignore next */
                }
                else {
                    args.cancel = true;
                }
            }
            var pasteEle = ej2_base_2.select('#' + this.getMenuId('Paste'), this.contextMenu.element);
            if (!args.cancel && !this.parent.enablePaste &&
                pasteEle && !pasteEle.classList.contains('e-disabled')) {
                this.disabledItems.push('Paste');
            }
            if (args.cancel) {
                this.menuTarget = this.currentElement = null;
                return;
            }
            this.contextMenu.dataBind();
            var isSubMenu = false;
            if (target.classList.contains(CLS.MENU_ITEM) ||
                target.classList.contains(CLS.MENU_ICON) || target.classList.contains(CLS.SUBMENU_ICON)) {
                isSubMenu = true;
            }
            this.menuItemData = isSubMenu ? this.menuItemData : this.getMenuItemData();
            var eventArgs = {
                fileDetails: [this.menuItemData],
                element: args.element,
                target: target,
                items: isSubMenu ? args.items : this.contextMenu.items,
                menuModule: this.contextMenu,
                cancel: false,
                menuType: this.menuType,
                isSubMenu: isSubMenu
            };
            this.currentItems = eventArgs.items;
            this.parent.trigger('menuOpen', eventArgs, function (menuOpenArgs) {
                if (!isSubMenu) {
                    _this.contextMenu.dataBind();
                    _this.contextMenu.items = menuOpenArgs.items;
                    _this.contextMenu.dataBind();
                }
                _this.enableItems(_this.disabledItems, false, true);
                args.cancel = menuOpenArgs.cancel;
                if (menuOpenArgs.cancel) {
                    _this.menuTarget = _this.currentElement = null;
                }
            });
        };
        ContextMenu.prototype.updateActiveModule = function () {
            this.parent.activeModule = ej2_base_1.closest(this.menuTarget, '#' + this.parent.element.id + CLS.TREE_ID) ?
                'navigationpane' : ej2_base_1.closest(this.menuTarget, '#' + this.parent.element.id + CLS.GRID_ID) ?
                'detailsview' : ej2_base_1.closest(this.menuTarget, '#' + this.parent.element.id + CLS.LARGEICON_ID) ?
                'largeiconsview' : this.parent.activeModule;
        };
        /* istanbul ignore next */
        /**
         *
         * @param {Element} target - specifies the target element.
         * @returns {string} -returns the target view.
         * @hidden
         */
        ContextMenu.prototype.getTargetView = function (target) {
            return target.classList.contains(CLS.TREE_VIEW) ?
                'TreeView' : target.classList.contains(CLS.GRID_VIEW) ?
                'GridView' : target.classList.contains(CLS.ICON_VIEW) ?
                'LargeIcon' : target.classList.contains(CLS.LARGE_ICONS) ?
                'LargeIcon' : '';
        };
        ContextMenu.prototype.getItemIndex = function (item) {
            var itemId = this.getMenuId(item);
            for (var i = 0; i < this.currentItems.length; i++) {
                if ((this.currentItems[i].id === itemId) || (this.currentItems[i].id === item)) {
                    return i;
                }
            }
            return -1;
        };
        ContextMenu.prototype.disableItem = function (items) {
            if (items.length !== 0) {
                this.disabledItems = this.disabledItems.concat(items);
            }
        };
        ContextMenu.prototype.enableItems = function (items, enable, isUniqueId) {
            for (var i = 0; i < items.length; i++) {
                if (this.checkValidItem(items[i]) === 1) {
                    this.contextMenu.enableItems([this.getMenuId(items[i])], enable, isUniqueId);
                }
                else if (this.checkValidItem(items[i]) === 2) {
                    this.contextMenu.enableItems([items[i]], enable, isUniqueId);
                }
            }
        };
        ContextMenu.prototype.setFolderItem = function (isTree) {
            this.menuType = 'folder';
            this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.folder.map(function (item) { return item.trim(); }));
            this.contextMenu.dataBind();
            if (isTree) {
                this.disabledItems.push('Open');
            }
            else if (this.parent.selectedItems.length !== 1) {
                this.disabledItems.push('Rename', 'Paste');
            }
        };
        ContextMenu.prototype.setFileItem = function () {
            this.menuType = 'file';
            this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.file.map(function (item) { return item.trim(); }));
            this.contextMenu.dataBind();
            if (this.parent.selectedItems.length !== 1) {
                this.disabledItems.push('Rename');
            }
        };
        ContextMenu.prototype.setLayoutItem = function (target) {
            this.menuType = 'layout';
            this.contextMenu.items = this.getItemData(this.parent.contextMenuSettings.layout.map(function (item) { return item.trim(); }));
            this.contextMenu.dataBind();
            if (!this.parent.allowMultiSelection || ((this.parent.view === 'LargeIcons' &&
                (ej2_base_1.closest(target, '#' + this.parent.element.id + CLS.LARGEICON_ID).getElementsByClassName(CLS.EMPTY).length !== 0))
                || (this.parent.view === 'Details' &&
                    (ej2_base_1.closest(target, '#' + this.parent.element.id + CLS.GRID_ID).getElementsByClassName(CLS.EMPTY).length !== 0)))) {
                this.disabledItems.push('SelectAll');
            }
            if (this.parent.selectedNodes.length === 0) {
                this.disabledItems.push('Paste');
            }
            this.contextMenu.dataBind();
        };
        ContextMenu.prototype.checkValidItem = function (nameEle) {
            if (!ej2_base_1.isNullOrUndefined(ej2_base_2.select('#' + this.getMenuId(nameEle), this.currentElement))) {
                return 1;
            }
            else if (!ej2_base_1.isNullOrUndefined(ej2_base_2.select('#' + nameEle, this.currentElement))) {
                return 2;
            }
            else {
                return -1;
            }
        };
        // eslint-disable-next-line
        ContextMenu.prototype.getMenuItemData = function () {
            if (this.menuType === 'layout') {
                return utility_1.getPathObject(this.parent);
            }
            else {
                // eslint-disable-next-line
                var args = { target: this.menuTarget };
                this.parent.notify(events.menuItemData, args);
                return this.parent.itemData[0];
            }
        };
        /* istanbul ignore next */
        ContextMenu.prototype.onSelect = function (args) {
            var _this = this;
            if (ej2_base_1.isNullOrUndefined(args.item) || !args.item.id) {
                return;
            }
            var itemText = args.item.id.substr((this.parent.element.id + '_cm_').length);
            // eslint-disable-next-line
            var details;
            if (itemText === 'refresh' || itemText === 'newfolder' || itemText === 'upload') {
                details = [utility_1.getPathObject(this.parent)];
                this.parent.itemData = details;
            }
            else {
                this.parent.notify(events.selectedData, {});
                details = this.parent.itemData;
            }
            var eventArgs = {
                cancel: false,
                element: args.element,
                fileDetails: details,
                item: args.item
            };
            this.parent.trigger('menuClick', eventArgs, function (menuClickArgs) {
                var sItems;
                if (!menuClickArgs.cancel) {
                    // eslint:disable-next-line
                    switch (itemText) {
                        case 'cut':
                            utility_1.cutFiles(_this.parent);
                            break;
                        case 'copy':
                            utility_1.copyFiles(_this.parent);
                            break;
                        case 'paste':
                            if (_this.menuType === 'folder') {
                                if ((_this.parent.activeModule === 'largeiconsview') || (_this.parent.activeModule === 'detailsview')) {
                                    _this.parent.folderPath = utility_1.getFullPath(_this.parent, _this.menuItemData, _this.parent.path);
                                }
                                else {
                                    _this.parent.folderPath = '';
                                }
                            }
                            else {
                                _this.parent.folderPath = '';
                            }
                            utility_2.pasteHandler(_this.parent);
                            break;
                        case 'delete':
                            for (var j = 0; j < details.length; j++) {
                                if (!utility_3.hasEditAccess(details[j])) {
                                    utility_3.createDeniedDialog(_this.parent, details[j], events.permissionEdit);
                                    return;
                                }
                            }
                            dialog_1.createDialog(_this.parent, 'Delete');
                            break;
                        /* istanbul ignore next */
                        case 'download':
                            for (var i = 0; i < details.length; i++) {
                                if (!utility_3.hasDownloadAccess(details[i])) {
                                    utility_3.createDeniedDialog(_this.parent, details[i], events.permissionDownload);
                                    return;
                                }
                            }
                            if (_this.parent.activeModule === 'navigationpane') {
                                _this.parent.notify(events.downloadInit, {});
                            }
                            else if (_this.parent.selectedItems.length > 0) {
                                operations_1.Download(_this.parent, _this.parent.path, _this.parent.selectedItems);
                            }
                            break;
                        case 'rename':
                            if (!utility_3.hasEditAccess(details[0])) {
                                utility_3.createDeniedDialog(_this.parent, details[0], events.permissionEdit);
                            }
                            else {
                                _this.parent.notify(events.renameInit, {});
                                dialog_1.createDialog(_this.parent, 'Rename');
                            }
                            break;
                        case 'selectall':
                            /* istanbul ignore next */
                            _this.parent.notify(events.selectAllInit, {});
                            break;
                        case 'refresh':
                            utility_1.refresh(_this.parent);
                            break;
                        case 'open':
                            if (_this.parent.visitedItem) {
                                _this.parent.notify(events.openInit, { target: _this.parent.visitedItem });
                            }
                            break;
                        case 'details':
                            _this.parent.notify(events.detailsInit, {});
                            sItems = _this.parent.selectedItems;
                            if (_this.parent.activeModule === 'navigationpane') {
                                sItems = [];
                            }
                            operations_1.GetDetails(_this.parent, sItems, _this.parent.path, 'details');
                            break;
                        case 'newfolder':
                            utility_3.createNewFolder(_this.parent);
                            break;
                        case 'upload':
                            utility_3.uploadItem(_this.parent);
                            break;
                        /* istanbul ignore next */
                        case 'name':
                        /* istanbul ignore next */
                        // eslint-disable-next-line no-fallthrough
                        case 'size':
                        /* istanbul ignore next */
                        // eslint-disable-next-line no-fallthrough
                        case 'date':
                        /* istanbul ignore next */
                        // eslint-disable-next-line no-fallthrough
                        case 'ascending':
                        /* istanbul ignore next */
                        // eslint-disable-next-line no-fallthrough
                        case 'descending':
                            /* istanbul ignore next */
                            utility_2.sortbyClickHandler(_this.parent, args);
                            break;
                        /* istanbul ignore next */
                        case 'none':
                            /* istanbul ignore next */
                            utility_2.sortbyClickHandler(_this.parent, args);
                            break;
                        /* istanbul ignore next */
                        // eslint:disable-next-line
                        case 'largeiconsview':
                            utility_1.updateLayout(_this.parent, 'LargeIcons');
                            break;
                        /* istanbul ignore next */
                        // eslint:disable-next-line
                        case 'detailsview':
                            utility_1.updateLayout(_this.parent, 'Details');
                            break;
                    }
                }
            });
        };
        ContextMenu.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName() && e.module !== 'common') {
                /* istanbul ignore next */
                return;
            }
            for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'cssClass':
                        this.contextMenu.cssClass = utility_2.getCssClass(this.parent, CLS.ROOT_POPUP);
                        break;
                }
            }
        };
        ContextMenu.prototype.addEventListener = function () {
            this.parent.on(events.destroy, this.destroy, this);
            this.parent.on(events.modelChanged, this.onPropertyChanged, this);
            this.keyboardModule = new ej2_base_1.KeyboardEvents(this.contextMenu.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        };
        ContextMenu.prototype.removeEventListener = function () {
            this.parent.off(events.destroy, this.destroy);
            this.parent.off(events.modelChanged, this.onPropertyChanged);
            this.keyboardModule.destroy();
        };
        ContextMenu.prototype.keyActionHandler = function (e) {
            switch (e.action) {
                case 'uparrow':
                case 'downarrow':
                    e.preventDefault();
            }
        };
        /**
         * For internal use only - Get the module name.
         *
         * @returns {string} - returns the module name.
         * @private
         */
        ContextMenu.prototype.getModuleName = function () {
            return 'contextmenu';
        };
        ContextMenu.prototype.destroy = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.removeEventListener();
            this.contextMenu.destroy();
        };
        /* istanbul ignore next */
        ContextMenu.prototype.getItemData = function (data) {
            var items = [];
            for (var i = 0; i < data.length; i++) {
                var item = void 0;
                var itemId = this.getMenuId(data[i]);
                var itemText = utility_1.getLocaleText(this.parent, data[i]);
                switch (data[i]) {
                    case '|':
                        item = { separator: true };
                        break;
                    case 'Open':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_OPEN };
                        break;
                    case 'Upload':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_UPLOAD };
                        break;
                    case 'Cut':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_CUT };
                        break;
                    case 'Copy':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_COPY };
                        break;
                    case 'Paste':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_PASTE };
                        break;
                    case 'Delete':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_DELETE };
                        break;
                    case 'Rename':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_RENAME };
                        break;
                    case 'NewFolder':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_NEWFOLDER };
                        break;
                    case 'Details':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_DETAILS };
                        break;
                    case 'SortBy':
                        item = {
                            id: itemId, text: itemText, iconCss: CLS.ICON_SHORTBY,
                            items: [
                                {
                                    id: this.getMenuId('Name'), text: utility_1.getLocaleText(this.parent, 'Name'),
                                    iconCss: this.parent.sortBy === 'name' ? CLS.TB_OPTION_DOT : null
                                },
                                {
                                    id: this.getMenuId('Size'), text: utility_1.getLocaleText(this.parent, 'Size'),
                                    iconCss: this.parent.sortBy === 'size' ? CLS.TB_OPTION_DOT : null
                                },
                                {
                                    id: this.getMenuId('Date'), text: utility_1.getLocaleText(this.parent, 'DateModified'),
                                    iconCss: this.parent.sortBy === '_fm_modified' ? CLS.TB_OPTION_DOT : null
                                },
                                { separator: true },
                                {
                                    id: this.getMenuId('Ascending'), text: utility_1.getLocaleText(this.parent, 'Ascending'),
                                    iconCss: this.parent.sortOrder === 'Ascending' ? CLS.TB_OPTION_TICK : null
                                },
                                {
                                    id: this.getMenuId('Descending'), text: utility_1.getLocaleText(this.parent, 'Descending'),
                                    iconCss: this.parent.sortOrder === 'Descending' ? CLS.TB_OPTION_TICK : null
                                },
                                {
                                    id: this.getMenuId('None'), text: utility_1.getLocaleText(this.parent, 'None'),
                                    iconCss: this.parent.sortOrder === 'None' ? CLS.TB_OPTION_TICK : null
                                }
                            ]
                        };
                        break;
                    /* istanbul ignore next */
                    case 'View':
                        item = {
                            id: itemId, text: itemText, iconCss: this.parent.view === 'Details' ? CLS.ICON_GRID : CLS.ICON_LARGE,
                            items: [
                                {
                                    id: this.getMenuId('largeiconsview'), text: utility_1.getLocaleText(this.parent, 'View-LargeIcons'),
                                    iconCss: this.parent.view === 'Details' ? null : CLS.TB_OPTION_TICK
                                },
                                {
                                    id: this.getMenuId('detailsview'), text: utility_1.getLocaleText(this.parent, 'View-Details'),
                                    iconCss: this.parent.view === 'Details' ? CLS.TB_OPTION_TICK : null
                                }
                            ]
                        };
                        break;
                    case 'Refresh':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_REFRESH };
                        break;
                    case 'SelectAll':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_SELECTALL };
                        break;
                    /* istanbul ignore next */
                    case 'Download':
                        item = { id: itemId, text: itemText, iconCss: CLS.ICON_DOWNLOAD };
                        break;
                    /* istanbul ignore next */
                    default:
                        item = { id: itemId, text: itemText };
                        break;
                }
                items.push(item);
            }
            return items;
        };
        ContextMenu.prototype.getMenuId = function (id) {
            return this.parent.element.id + '_cm_' + id.toLowerCase();
        };
        return ContextMenu;
    }());
    exports.ContextMenu = ContextMenu;
});