define(["require", "exports", "@syncfusion/ej2-lists", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-data", "@syncfusion/ej2-popups", "../base/constant", "../base/classes", "@syncfusion/ej2-buttons", "../common/operations", "../common/index", "../common/index", "../common/index", "../common/index", "../common/utility", "../common/utility", "../pop-up/dialog"], function (require, exports, ej2_lists_1, ej2_base_1, ej2_base_2, ej2_base_3, ej2_data_1, ej2_popups_1, events, CLS, ej2_buttons_1, operations_1, index_1, index_2, index_3, index_4, utility_1, utility_2, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * LargeIconsView module
     */
    var LargeIconsView = /** @class */ (function () {
        /**
         * Constructor for the LargeIcons module.
         *
         * @param {IFileManager} parent - specifies the parent element.
         * @hidden
         */
        function LargeIconsView(parent) {
            this.isInteraction = true;
            this.uploadOperation = false;
            this.count = 0;
            this.isRendered = true;
            this.tapCount = 0;
            this.isPasteOperation = false;
            this.isInteracted = true;
            this.parent = parent;
            this.element = ej2_base_1.select('#' + this.parent.element.id + CLS.LARGEICON_ID, this.parent.element);
            ej2_base_2.addClass([this.element], CLS.LARGE_ICONS);
            this.addEventListener();
            this.keyConfigs = {
                end: 'end',
                home: 'home',
                tab: 'tab',
                moveDown: 'downarrow',
                moveLeft: 'leftarrow',
                moveRight: 'rightarrow',
                moveUp: 'uparrow',
                ctrlEnd: 'ctrl+end',
                ctrlHome: 'ctrl+home',
                ctrlDown: 'ctrl+downarrow',
                ctrlLeft: 'ctrl+leftarrow',
                ctrlRight: 'ctrl+rightarrow',
                ctrlUp: 'ctrl+uparrow',
                shiftEnd: 'shift+end',
                shiftHome: 'shift+home',
                shiftDown: 'shift+downarrow',
                shiftLeft: 'shift+leftarrow',
                shiftRight: 'shift+rightarrow',
                shiftUp: 'shift+uparrow',
                csEnd: 'ctrl+shift+end',
                csHome: 'ctrl+shift+home',
                csDown: 'ctrl+shift+downarrow',
                csLeft: 'ctrl+shift+leftarrow',
                csRight: 'ctrl+shift+rightarrow',
                csUp: 'ctrl+shift+uparrow',
                space: 'space',
                ctrlSpace: 'ctrl+space',
                shiftSpace: 'shift+space',
                csSpace: 'ctrl+shift+space',
                ctrlA: 'ctrl+a',
                enter: 'enter',
                altEnter: 'alt+enter',
                esc: 'escape',
                del: 'delete',
                ctrlX: 'ctrl+x',
                ctrlC: 'ctrl+c',
                ctrlV: 'ctrl+v',
                f2: 'f2',
                shiftdel: 'shift+delete',
                back: 'backspace',
                ctrlD: 'ctrl+d'
            };
        }
        LargeIconsView.prototype.render = function (args) {
            this.parent.visitedItem = null;
            this.startItem = null;
            ej2_popups_1.showSpinner(this.parent.element);
            if (this.parent.view === 'LargeIcons') {
                this.resetMultiSelect();
                this.element.setAttribute('tabindex', '0');
                if (this.listObj) {
                    this.unWireEvents();
                    this.removeEventListener();
                }
                this.parent.notify(events.hideLayout, {});
                var iconsView = ej2_base_1.select('#' + this.parent.element.id + CLS.LARGEICON_ID, this.parent.element);
                var ul = ej2_base_1.select('ul', iconsView);
                if (ul) {
                    ej2_base_3.remove(ul);
                }
                this.listObj = {
                    ariaAttributes: {
                        itemRole: 'option', listRole: 'listbox', itemText: '',
                        groupItemRole: 'group', wrapperRole: ''
                    },
                    showIcon: true,
                    fields: { text: 'name', iconCss: '_fm_icon', imageUrl: '_fm_imageUrl', htmlAttributes: '_fm_htmlAttr' },
                    sortOrder: this.parent.sortOrder,
                    itemCreated: this.onItemCreated.bind(this),
                    enableHtmlSanitizer: this.parent.enableHtmlSanitizer
                };
                this.items = [];
                this.items = this.renderList(args);
                this.items = utility_1.getSortedData(this.parent, this.items);
                // eslint-disable-next-line
                this.listElements = ej2_lists_1.ListBase.createListFromJson(ej2_base_1.createElement, this.items, this.listObj);
                this.itemList = Array.prototype.slice.call(ej2_base_1.selectAll('.' + CLS.LIST_ITEM, this.listElements));
                this.element.appendChild(this.listElements);
                this.preventImgDrag();
                this.createDragObj();
                iconsView.classList.remove(CLS.DISPLAY_NONE);
                if (this.itemList.length === 0) {
                    var emptyList = this.element.querySelector('.' + CLS.LIST_PARENT);
                    this.element.removeChild(emptyList);
                    utility_2.createEmptyElement(this.parent, this.element, args);
                }
                else if (this.itemList.length !== 0 && this.element.querySelector('.' + CLS.EMPTY)) {
                    this.element.removeChild(this.element.querySelector('.' + CLS.EMPTY));
                }
                if (this.isPasteOperation === true) {
                    this.selectItems(this.parent.pasteNodes);
                    this.isPasteOperation = false;
                }
                /* istanbul ignore next */
                if (this.uploadOperation === true) {
                    this.selectItems(this.parent.uploadItem);
                    this.parent.setProperties({ selectedItems: [] }, true);
                    this.count++;
                    if (this.count === this.parent.uploadItem.length) {
                        this.uploadOperation = false;
                        this.parent.uploadItem = [];
                    }
                }
                var activeEle = this.element.querySelectorAll('.' + CLS.ACTIVE);
                if (activeEle.length !== 0) {
                    this.parent.activeModule = 'largeiconsview';
                }
                for (var i = 0; i < activeEle.length; i++) {
                    activeEle[i].setAttribute('aria-selected', 'true');
                }
                this.adjustHeight();
                this.element.style.maxHeight = '100%';
                this.getItemCount();
                this.addEventListener();
                this.wireEvents();
                this.isRendered = true;
                ej2_popups_1.hideSpinner(this.parent.element);
                if (this.parent.selectedItems.length) {
                    this.checkItem();
                }
            }
        };
        LargeIconsView.prototype.preventImgDrag = function () {
            var i = 0;
            while (i < this.itemList.length) {
                if (this.itemList[i].querySelector('img')) {
                    /* istanbul ignore next */
                    this.itemList[i].ondragstart = function () { return false; };
                }
                i++;
            }
        };
        LargeIconsView.prototype.createDragObj = function () {
            var _this = this;
            if (!this.parent.isMobile && this.listObj) {
                if (this.parent.allowDragAndDrop) {
                    if (this.dragObj) {
                        this.dragObj.destroy();
                    }
                    this.dragObj = new ej2_base_1.Draggable(this.listElements, {
                        enableTailMode: true,
                        distance: 5,
                        enableAutoScroll: true,
                        dragTarget: '.' + CLS.LARGE_ICON,
                        helper: this.dragHelper.bind(this),
                        cursorAt: this.parent.dragCursorPosition,
                        dragArea: this.parent.element,
                        dragStop: index_3.dragStopHandler.bind(this, this.parent),
                        drag: index_3.draggingHandler.bind(this, this.parent),
                        clone: true,
                        dragStart: function (args) {
                            index_3.dragStartHandler(_this.parent, args, _this.dragObj);
                        }
                    });
                }
                else if (this.dragObj && !this.parent.allowDragAndDrop) {
                    this.dragObj.destroy();
                }
            }
        };
        LargeIconsView.prototype.dragHelper = function (args) {
            var dragTarget = args.sender.target;
            var dragLi = ej2_base_1.closest(dragTarget, '.e-list-item');
            if (!dragLi) {
                return null;
            }
            if (dragLi && !dragLi.classList.contains('e-active')) {
                this.setFocus(dragLi);
            }
            var activeEle = this.element.querySelectorAll('.' + CLS.ACTIVE);
            this.parent.activeElements = [];
            this.parent.dragData = [];
            for (var i = 0; i < activeEle.length; i++) {
                // eslint-disable-next-line
                this.parent.dragData.push(this.getItemObject(activeEle[i]));
                this.parent.activeElements.push(activeEle[i]);
            }
            index_3.getModule(this.parent, dragLi);
            this.parent.dragPath = this.parent.path;
            index_3.createVirtualDragElement(this.parent);
            return this.parent.virtualDragElement;
        };
        LargeIconsView.prototype.onDropInit = function (args) {
            if (this.parent.targetModule === this.getModuleName()) {
                var dropLi = ej2_base_1.closest(args.target, '.e-list-item');
                // eslint-disable-next-line
                var cwdData = ej2_base_3.getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
                if (dropLi) {
                    // eslint-disable-next-line
                    var info = this.getItemObject(dropLi);
                    this.parent.dropPath = info.isFile ? this.parent.path : index_1.getFullPath(this.parent, info, this.parent.path);
                    this.parent.dropData = info.isFile ? cwdData : info;
                }
                else {
                    this.parent.dropPath = this.parent.path;
                    this.parent.dropData = cwdData;
                }
            }
        };
        /**
         * For internal use only - Get the module name.
         *
         * @returns {string} - returns the module name.
         * @private
         */
        LargeIconsView.prototype.getModuleName = function () {
            return 'largeiconsview';
        };
        LargeIconsView.prototype.adjustHeight = function () {
            var pane = ej2_base_1.select('#' + this.parent.element.id + CLS.CONTENT_ID, this.parent.element);
            var bar = ej2_base_1.select('#' + this.parent.element.id + CLS.BREADCRUMBBAR_ID, this.parent.element);
            this.element.style.height = (pane.offsetHeight - bar.offsetHeight) + 'px';
        };
        LargeIconsView.prototype.onItemCreated = function (args) {
            args.item.removeAttribute('aria-level');
            if (!this.parent.showFileExtension && ej2_base_3.getValue('isFile', args.curData)) {
                var textEle = args.item.querySelector('.' + CLS.LIST_TEXT);
                var txt = ej2_base_3.getValue('name', args.curData);
                var type = ej2_base_3.getValue('type', args.curData);
                textEle.innerHTML = txt.substr(0, txt.length - type.length);
            }
            this.renderCheckbox(args);
            var eventArgs = {
                element: args.item,
                fileDetails: args.curData,
                module: 'LargeIconsView'
            };
            this.parent.trigger('fileLoad', eventArgs);
        };
        LargeIconsView.prototype.renderCheckbox = function (args) {
            if (!this.parent.allowMultiSelection) {
                return;
            }
            var checkElement = ej2_buttons_1.createCheckBox(ej2_base_1.createElement, false, {
                checked: false,
                cssClass: 'e-small'
            });
            checkElement.setAttribute('role', 'checkbox');
            checkElement.setAttribute('aria-checked', 'false');
            args.item.firstElementChild.insertBefore(checkElement, args.item.firstElementChild.childNodes[0]);
        };
        LargeIconsView.prototype.onLayoutChange = function (args) {
            if (this.parent.view === 'LargeIcons') {
                this.destroy();
                this.render(args);
                /* istanbul ignore next */
                if (ej2_base_3.getValue('name', args) === 'layout-change' && this.parent.fileAction === 'move' &&
                    this.parent.isCut && this.parent.selectedNodes && this.parent.selectedNodes.length !== 0) {
                    var indexes = this.getIndexes(this.parent.selectedNodes);
                    var length_1 = 0;
                    while (length_1 < indexes.length) {
                        index_2.addBlur(this.itemList[indexes[length_1]]);
                        length_1++;
                    }
                }
                var activeEle = this.element.querySelectorAll('.' + CLS.ACTIVE);
                if (activeEle.length !== 0) {
                    this.element.focus();
                }
                this.checkItem();
                this.parent.isLayoutChange = false;
            }
            else {
                this.element.setAttribute('tabindex', '-1');
            }
        };
        LargeIconsView.prototype.checkItem = function () {
            var checkEle = this.element.querySelectorAll('.' + CLS.ACTIVE);
            if (checkEle) {
                var checkLength = 0;
                while (checkLength < checkEle.length) {
                    this.checkState(checkEle[checkLength], true);
                    checkLength++;
                }
            }
        };
        // eslint-disable-next-line
        LargeIconsView.prototype.renderList = function (args) {
            var i = 0;
            // eslint-disable-next-line
            var items = JSON.parse(JSON.stringify(args.files));
            while (i < items.length) {
                var icon = utility_1.fileType(items[i]);
                var name_1 = ej2_base_3.getValue('name', items[i]);
                var selected = index_1.getItemName(this.parent, items[i]);
                var className = ((this.parent.selectedItems &&
                    this.parent.selectedItems.indexOf(selected) !== -1)) ?
                    CLS.LARGE_ICON + ' e-active' : CLS.LARGE_ICON;
                if (!utility_2.hasEditAccess(items[i])) {
                    className += ' ' + index_1.getAccessClass(items[i]);
                }
                if (icon === CLS.ICON_IMAGE && this.parent.showThumbnail && utility_2.hasReadAccess(items[i])) {
                    var imgUrl = utility_1.getImageUrl(this.parent, items[i]);
                    ej2_base_3.setValue('_fm_imageUrl', imgUrl, items[i]);
                    ej2_base_3.setValue('_fm_imageAttr', { alt: name_1 }, items[i]);
                }
                else {
                    ej2_base_3.setValue('_fm_icon', icon, items[i]);
                }
                ej2_base_3.setValue('_fm_htmlAttr', { class: className, title: name_1 }, items[i]);
                i++;
            }
            return items;
        };
        LargeIconsView.prototype.onFinalizeEnd = function (args) {
            this.render(args);
        };
        LargeIconsView.prototype.onCreateEnd = function (args) {
            if (this.parent.view !== 'LargeIcons') {
                return;
            }
            this.onLayoutChange(args);
            this.clearSelect();
            this.selectItems([ej2_base_3.getValue(this.parent.hasId ? 'id' : 'name', this.parent.createdItem)]);
            this.parent.createdItem = null;
            this.parent.largeiconsviewModule.element.focus();
        };
        LargeIconsView.prototype.onSelectedData = function () {
            if (this.parent.activeModule === 'largeiconsview') {
                this.updateSelectedData();
            }
        };
        LargeIconsView.prototype.onDeleteInit = function () {
            if (this.parent.activeModule === 'largeiconsview') {
                operations_1.Delete(this.parent, this.parent.selectedItems, this.parent.path, 'delete');
            }
        };
        /* istanbul ignore next */
        LargeIconsView.prototype.onDeleteEnd = function (args) {
            if (this.parent.view !== 'LargeIcons') {
                return;
            }
            this.onLayoutChange(args);
            this.parent.setProperties({ selectedItems: [] }, true);
            this.clearSelect();
        };
        LargeIconsView.prototype.onRefreshEnd = function (args) {
            if (this.parent.view !== 'LargeIcons') {
                return;
            }
            this.onLayoutChange(args);
        };
        LargeIconsView.prototype.onRenameInit = function () {
            if (this.parent.activeModule === 'largeiconsview' && this.parent.selectedItems.length === 1) {
                this.updateRenameData();
            }
        };
        LargeIconsView.prototype.onPathChanged = function (args) {
            this.parent.isCut = false;
            /* istanbul ignore next */
            if (this.parent.breadcrumbbarModule.searchObj.element.value === '') {
                this.parent.searchedItems = [];
            }
            if (this.parent.view === 'LargeIcons') {
                index_2.removeBlur(this.parent);
                this.parent.setProperties({ selectedItems: [] }, true);
                this.onLayoutChange(args);
                if (this.parent.renamedItem) {
                    this.clearSelect();
                    this.addSelection(this.parent.renamedItem);
                    this.parent.renamedItem = null;
                }
            }
        };
        LargeIconsView.prototype.onOpenInit = function (args) {
            if (this.parent.activeModule === 'largeiconsview') {
                this.doOpenAction(args.target);
            }
        };
        LargeIconsView.prototype.onHideLayout = function () {
            if (this.parent.view !== 'LargeIcons' && this.element) {
                this.element.classList.add(CLS.DISPLAY_NONE);
            }
        };
        LargeIconsView.prototype.onSelectAllInit = function () {
            if (this.parent.view === 'LargeIcons') {
                this.startItem = this.getFirstItem();
                var lastItem = this.getLastItem();
                var eveArgs = { ctrlKey: true, shiftKey: true };
                this.doSelection(lastItem, eveArgs);
                this.isInteraction = true;
                this.isInteracted = true;
            }
        };
        LargeIconsView.prototype.onClearAllInit = function () {
            if (this.parent.view === 'LargeIcons') {
                this.clearSelection();
                this.isInteraction = true;
                this.isInteracted = true;
            }
        };
        LargeIconsView.prototype.onBeforeRequest = function () {
            this.isRendered = false;
        };
        LargeIconsView.prototype.onAfterRequest = function () {
            this.isRendered = true;
        };
        /* istanbul ignore next */
        LargeIconsView.prototype.onSearch = function (args) {
            if (this.parent.view === 'LargeIcons') {
                this.parent.setProperties({ selectedItems: [] }, true);
                this.parent.notify(events.selectionChanged, {});
                this.parent.searchedItems = args.files;
                this.onLayoutChange(args);
            }
        };
        LargeIconsView.prototype.onLayoutRefresh = function () {
            if (this.parent.view !== 'LargeIcons') {
                return;
            }
            this.adjustHeight();
        };
        LargeIconsView.prototype.onUpdateSelectionData = function () {
            if (this.parent.view !== 'LargeIcons') {
                return;
            }
            this.updateSelectedData();
        };
        LargeIconsView.prototype.onPathColumn = function () {
            if (this.parent.view === 'LargeIcons' && !ej2_base_2.isNullOrUndefined(this.listObj) &&
                this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered
                && this.parent.sortBy === 'filterPath') {
                this.parent.sortBy = 'name';
                this.parent.notify(events.sortByChange, {});
            }
        };
        LargeIconsView.prototype.removeEventListener = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.parent.off(events.pathColumn, this.onPathColumn);
            this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
            this.parent.off(events.createEnd, this.onCreateEnd);
            this.parent.off(events.selectedData, this.onSelectedData);
            this.parent.off(events.deleteInit, this.onDeleteInit);
            this.parent.off(events.deleteEnd, this.onDeleteEnd);
            this.parent.off(events.refreshEnd, this.onRefreshEnd);
            this.parent.off(events.pathChanged, this.onPathChanged);
            this.parent.off(events.layoutChange, this.onLayoutChange);
            this.parent.off(events.search, this.onSearch);
            this.parent.off(events.openInit, this.onOpenInit);
            this.parent.off(events.openEnd, this.onPathChanged);
            this.parent.off(events.modelChanged, this.onPropertyChanged);
            this.parent.off(events.methodCall, this.onMethodCall);
            this.parent.off(events.actionFailure, this.onActionFailure);
            this.parent.off(events.renameInit, this.onRenameInit);
            this.parent.off(events.renameEnd, this.onPathChanged);
            this.parent.off(events.hideLayout, this.onHideLayout);
            this.parent.off(events.selectAllInit, this.onSelectAllInit);
            this.parent.off(events.clearAllInit, this.onClearAllInit);
            this.parent.off(events.menuItemData, this.onMenuItemData);
            this.parent.off(events.beforeRequest, this.onBeforeRequest);
            this.parent.off(events.afterRequest, this.onAfterRequest);
            this.parent.off(events.splitterResize, this.splitterResizeHandler);
            this.parent.off(events.resizeEnd, this.resizeHandler);
            this.parent.off(events.pasteInit, this.onpasteInit);
            this.parent.off(events.pasteEnd, this.onpasteEnd);
            this.parent.off(events.cutCopyInit, this.oncutCopyInit);
            this.parent.off(events.dropInit, this.onDropInit);
            this.parent.off(events.detailsInit, this.onDetailsInit);
            this.parent.off(events.layoutRefresh, this.onLayoutRefresh);
            this.parent.off(events.dropPath, this.onDropPath);
            this.parent.off(events.updateSelectionData, this.onUpdateSelectionData);
            this.parent.off(events.filterEnd, this.onPathChanged);
        };
        LargeIconsView.prototype.addEventListener = function () {
            this.parent.on(events.pathColumn, this.onPathColumn, this);
            this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
            this.parent.on(events.createEnd, this.onCreateEnd, this);
            this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
            this.parent.on(events.selectedData, this.onSelectedData, this);
            this.parent.on(events.pathChanged, this.onPathChanged, this);
            this.parent.on(events.deleteInit, this.onDeleteInit, this);
            this.parent.on(events.pasteInit, this.onpasteInit, this);
            this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
            this.parent.on(events.layoutChange, this.onLayoutChange, this);
            this.parent.on(events.search, this.onSearch, this);
            this.parent.on(events.openInit, this.onOpenInit, this);
            this.parent.on(events.renameInit, this.onRenameInit, this);
            this.parent.on(events.renameEnd, this.onPathChanged, this);
            this.parent.on(events.openEnd, this.onPathChanged, this);
            this.parent.on(events.modelChanged, this.onPropertyChanged, this);
            this.parent.on(events.methodCall, this.onMethodCall, this);
            this.parent.on(events.actionFailure, this.onActionFailure, this);
            this.parent.on(events.hideLayout, this.onHideLayout, this);
            this.parent.on(events.selectAllInit, this.onSelectAllInit, this);
            this.parent.on(events.clearAllInit, this.onClearAllInit, this);
            this.parent.on(events.menuItemData, this.onMenuItemData, this);
            this.parent.on(events.beforeRequest, this.onBeforeRequest, this);
            this.parent.on(events.afterRequest, this.onAfterRequest, this);
            this.parent.on(events.dropInit, this.onDropInit, this);
            this.parent.on(events.detailsInit, this.onDetailsInit, this);
            this.parent.on(events.splitterResize, this.splitterResizeHandler, this);
            this.parent.on(events.resizeEnd, this.resizeHandler, this);
            this.parent.on(events.pasteEnd, this.onpasteEnd, this);
            this.parent.on(events.cutCopyInit, this.oncutCopyInit, this);
            this.parent.on(events.layoutRefresh, this.onLayoutRefresh, this);
            this.parent.on(events.dropPath, this.onDropPath, this);
            this.parent.on(events.updateSelectionData, this.onUpdateSelectionData, this);
            this.parent.on(events.filterEnd, this.onPathChanged, this);
        };
        LargeIconsView.prototype.onActionFailure = function () { this.isInteraction = true; this.isInteracted = true; };
        // eslint-disable-next-line
        LargeIconsView.prototype.onMenuItemData = function (args) {
            if (this.parent.activeModule === this.getModuleName()) {
                var ele = ej2_base_1.closest(args.target, 'li');
                this.parent.itemData = [this.getItemObject(ele)];
            }
        };
        LargeIconsView.prototype.onDetailsInit = function () {
            if (this.parent.activeModule === this.getModuleName()) {
                if (this.parent.selectedItems.length !== 0) {
                    this.updateSelectedData();
                }
                else {
                    this.parent.itemData = [ej2_base_3.getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
                }
            }
        };
        LargeIconsView.prototype.onpasteInit = function () {
            if (this.parent.activeModule === this.getModuleName()) {
                this.parent.itemData = (this.parent.folderPath === '') ? [index_1.getPathObject(this.parent)] :
                    [this.getItemObject(ej2_base_1.select('.e-active', this.element))];
            }
        };
        LargeIconsView.prototype.oncutCopyInit = function () {
            if (this.parent.activeModule === this.getModuleName()) {
                var activeEle = this.element.querySelectorAll('.' + CLS.ACTIVE);
                this.parent.activeRecords = [];
                this.parent.activeElements = [];
                for (var i = 0; i < activeEle.length; i++) {
                    this.parent.activeElements.push(activeEle[i]);
                    this.parent.activeRecords.push(this.getItemObject(activeEle[i]));
                }
            }
        };
        LargeIconsView.prototype.onpasteEnd = function (args) {
            if (this.parent.view === 'LargeIcons') {
                this.isPasteOperation = true;
                if (this.parent.path === this.parent.destinationPath || this.parent.path === index_1.getDirectoryPath(this.parent, args)) {
                    this.onPathChanged(args);
                }
            }
        };
        LargeIconsView.prototype.onDropPath = function (args) {
            if (this.parent.view === 'LargeIcons') {
                this.isPasteOperation = true;
                this.onPathChanged(args);
            }
        };
        LargeIconsView.prototype.onPropertyChanged = function (e) {
            var currentSelected;
            if (e.module !== this.getModuleName() && e.module !== 'common') {
                return;
            }
            for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'allowDragAndDrop':
                        this.createDragObj();
                        break;
                    case 'height':
                        this.adjustHeight();
                        break;
                    case 'selectedItems':
                        this.isInteraction = false;
                        this.isInteracted = false;
                        currentSelected = ej2_base_2.isNullOrUndefined(this.parent.selectedItems) ? [] : this.parent.selectedItems.slice(0);
                        currentSelected = this.parent.allowMultiSelection ? currentSelected :
                            currentSelected.slice(currentSelected.length - 1);
                        this.parent.setProperties({ selectedItems: [] }, true);
                        this.onClearAllInit();
                        if (currentSelected.length) {
                            this.selectItems(currentSelected);
                        }
                        this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                        this.isInteraction = true;
                        this.isInteracted = true;
                        break;
                    case 'showThumbnail':
                        utility_1.refresh(this.parent);
                        break;
                    case 'showFileExtension':
                        operations_1.read(this.parent, events.pathChanged, this.parent.path);
                        break;
                    case 'showHiddenItems':
                        operations_1.read(this.parent, events.pathChanged, this.parent.path);
                        break;
                    case 'allowMultiSelection':
                        if (this.parent.view !== 'LargeIcons') {
                            break;
                        }
                        utility_1.refresh(this.parent);
                        break;
                    case 'view':
                        utility_1.updateLayout(this.parent, 'LargeIcons');
                        break;
                }
            }
        };
        LargeIconsView.prototype.destroy = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.removeEventListener();
            if (this.listObj) {
                this.unWireEvents();
            }
        };
        LargeIconsView.prototype.wireEvents = function () {
            this.wireClickEvent(true);
            this.keyboardModule = new ej2_base_1.KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keyup'
            });
            this.keyboardDownModule = new ej2_base_1.KeyboardEvents(this.element, {
                keyAction: this.keydownActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
            ej2_base_1.EventHandler.add(this.element, 'mouseover', this.onMouseOver, this);
        };
        LargeIconsView.prototype.unWireEvents = function () {
            this.wireClickEvent(false);
            ej2_base_1.EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
            this.keyboardModule.destroy();
            this.keyboardDownModule.destroy();
        };
        /* istanbul ignore next */
        LargeIconsView.prototype.onMouseOver = function (e) {
            var targetEle = ej2_base_1.closest(e.target, '.e-list-item');
            index_2.removeBlur(this.parent, 'hover');
            if (targetEle !== null) {
                targetEle.classList.add(CLS.HOVER);
            }
        };
        LargeIconsView.prototype.wireClickEvent = function (toBind) {
            if (toBind) {
                // eslint-disable-next-line
                var proxy_1 = this;
                this.clickObj = new ej2_base_2.Touch(this.element, {
                    tap: function (eve) {
                        eve.originalEvent.preventDefault();
                        if (proxy_1.parent.isDevice) {
                            proxy_1.tapCount = eve.tapCount;
                            proxy_1.tapEvent = eve;
                            setTimeout(function () {
                                if (proxy_1.tapCount > 0) {
                                    proxy_1.doTapAction(proxy_1.tapEvent);
                                }
                                proxy_1.tapCount = 0;
                            }, 350);
                        }
                        else {
                            if (eve.tapCount === 2 && eve.originalEvent.which !== 3) {
                                proxy_1.dblClickHandler(eve);
                            }
                            else {
                                proxy_1.clickHandler(eve);
                            }
                        }
                    },
                    tapHold: function (e) {
                        if (proxy_1.parent.isDevice) {
                            proxy_1.multiSelect = proxy_1.parent.allowMultiSelection ? true : false;
                            if (proxy_1.parent.allowMultiSelection) {
                                ej2_base_2.addClass([proxy_1.parent.element], CLS.MULTI_SELECT);
                            }
                            proxy_1.clickHandler(e);
                        }
                    }
                });
            }
            else {
                if (this.clickObj) {
                    this.clickObj.destroy();
                }
            }
        };
        LargeIconsView.prototype.doTapAction = function (eve) {
            var target = eve.originalEvent.target;
            var item = ej2_base_1.closest(target, '.' + CLS.LIST_ITEM);
            if (this.multiSelect || target.classList.contains(CLS.LIST_PARENT) || ej2_base_2.isNullOrUndefined(item)) {
                this.clickHandler(eve);
            }
            else {
                this.parent.isFile = false;
                this.updateType(item);
                if (!this.parent.isFile) {
                    this.dblClickHandler(eve);
                }
                else if (eve.tapCount === 2) {
                    this.clickHandler(eve);
                    this.dblClickHandler(eve);
                }
                else {
                    this.clickHandler(eve);
                }
            }
        };
        LargeIconsView.prototype.clickHandler = function (e) {
            var target = e.originalEvent.target;
            index_2.removeBlur(this.parent, 'hover');
            this.doSelection(target, e.originalEvent);
            this.parent.activeModule = 'largeiconsview';
        };
        /**
         *
         * @param {Element} target - specifies the target element.
         * @param {TouchEventArgs | MouseEventArgs | KeyboardEventArgs} e - specifies event arguements.
         * @returns {void}
         * @hidden
         */
        LargeIconsView.prototype.doSelection = function (target, e) {
            var item = ej2_base_1.closest(target, '.' + CLS.LIST_ITEM);
            var cList = target.classList;
            this.parent.isFile = false;
            var action = 'select';
            if (e.which === 3 && !ej2_base_2.isNullOrUndefined(item) && item.classList.contains(CLS.ACTIVE)) {
                this.updateType(item);
                return;
            }
            else if (!ej2_base_2.isNullOrUndefined(item)) {
                if (this.parent.allowMultiSelection && item.classList.contains(CLS.ACTIVE)
                    && (e.ctrlKey || target.classList.contains(CLS.CHECK))) {
                    action = 'unselect';
                }
                var fileSelectionArgs = this.triggerSelection(action, item);
                if (fileSelectionArgs.cancel !== true) {
                    if ((!this.parent.allowMultiSelection || (!this.multiSelect && (e && !e.ctrlKey)))
                        && !cList.contains(CLS.FRAME)) {
                        this.updateType(item);
                        this.clearSelect();
                    }
                    if (this.parent.allowMultiSelection && e.shiftKey) {
                        if (!(e && e.ctrlKey)) {
                            this.clearSelect();
                        }
                        if (!this.startItem) {
                            this.startItem = item;
                        }
                        var startIndex = this.itemList.indexOf(this.startItem);
                        var endIndex = this.itemList.indexOf(item);
                        if (startIndex > endIndex) {
                            for (var i = startIndex; i >= endIndex; i--) {
                                this.addActive(this.itemList[i]);
                            }
                        }
                        else {
                            for (var i = startIndex; i <= endIndex; i++) {
                                this.addActive(this.itemList[i]);
                            }
                        }
                        this.addFocus(this.itemList[endIndex]);
                    }
                    else {
                        this.startItem = item;
                        if (this.parent.allowMultiSelection && item.classList.contains(CLS.ACTIVE)) {
                            this.removeActive(item);
                        }
                        else {
                            this.addActive(item);
                        }
                        this.addFocus(item);
                    }
                    if (this.parent.selectedItems.length === 0) {
                        this.resetMultiSelect();
                    }
                    this.parent.notify(events.selectionChanged, {});
                    this.triggerSelect(action, item);
                }
            }
            else {
                this.clearSelection();
            }
            if (!ej2_base_2.isNullOrUndefined(item)) {
                this.updateType(item);
            }
        };
        LargeIconsView.prototype.dblClickHandler = function (e) {
            this.parent.activeModule = 'largeiconsview';
            var target = e.originalEvent.target;
            this.doOpenAction(target);
        };
        LargeIconsView.prototype.clearSelection = function () {
            this.clearSelect();
            this.resetMultiSelect();
            this.parent.notify(events.selectionChanged, {});
        };
        LargeIconsView.prototype.resetMultiSelect = function () {
            this.multiSelect = false;
            ej2_base_2.removeClass([this.parent.element], CLS.MULTI_SELECT);
        };
        LargeIconsView.prototype.doOpenAction = function (target) {
            var _this = this;
            if (ej2_base_2.isNullOrUndefined(target)) {
                return;
            }
            var item = ej2_base_1.closest(target, '.' + CLS.LIST_ITEM);
            this.parent.isFile = false;
            if (!ej2_base_2.isNullOrUndefined(item)) {
                this.updateType(item);
                // eslint-disable-next-line
                var details_1 = this.getItemObject(item);
                if (!utility_2.hasReadAccess(details_1)) {
                    utility_1.createDeniedDialog(this.parent, details_1, events.permissionRead);
                    return;
                }
                var eventArgs = { cancel: false, fileDetails: details_1, module: 'LargeIconsView' };
                this.parent.trigger('fileOpen', eventArgs, function (fileOpenArgs) {
                    if (!fileOpenArgs.cancel) {
                        var text = ej2_base_3.getValue('name', details_1);
                        if (!_this.parent.isFile) {
                            var val = _this.parent.breadcrumbbarModule.searchObj.element.value;
                            if (val === '' && !_this.parent.isFiltered) {
                                var id = ej2_base_3.getValue('id', details_1);
                                var newPath = _this.parent.path + (ej2_base_2.isNullOrUndefined(id) ? text : id) + '/';
                                _this.parent.setProperties({ path: newPath }, true);
                                _this.parent.pathNames.push(text);
                                _this.parent.pathId.push(ej2_base_3.getValue('_fm_id', details_1));
                                _this.parent.itemData = [details_1];
                                utility_1.openAction(_this.parent);
                            }
                            else {
                                index_2.openSearchFolder(_this.parent, details_1);
                            }
                            _this.parent.isFiltered = false;
                            _this.parent.setProperties({ selectedItems: [] }, true);
                        }
                        else {
                            var icon = utility_1.fileType(details_1);
                            if (icon === CLS.ICON_IMAGE) {
                                var imgUrl = utility_1.getImageUrl(_this.parent, details_1);
                                dialog_1.createImageDialog(_this.parent, text, imgUrl);
                            }
                        }
                    }
                });
            }
        };
        LargeIconsView.prototype.updateType = function (item) {
            var folder = ej2_base_1.select('.' + CLS.FOLDER, item);
            this.parent.isFile = ej2_base_2.isNullOrUndefined(folder) ? true : false;
        };
        /* istanbul ignore next */
        // eslint:disable-next-line
        LargeIconsView.prototype.keydownActionHandler = function (e) {
            if (!this.isRendered) {
                return;
            }
            switch (e.action) {
                case 'end':
                case 'home':
                case 'moveDown':
                case 'moveLeft':
                case 'moveRight':
                case 'moveUp':
                case 'ctrlEnd':
                case 'shiftEnd':
                case 'csEnd':
                case 'ctrlHome':
                case 'shiftHome':
                case 'csHome':
                case 'ctrlDown':
                case 'shiftDown':
                case 'csDown':
                case 'ctrlLeft':
                case 'shiftLeft':
                case 'csLeft':
                case 'ctrlRight':
                case 'shiftRight':
                case 'csRight':
                case 'space':
                case 'ctrlSpace':
                case 'shiftSpace':
                case 'csSpace':
                case 'ctrlA':
                case 'enter':
                case 'altEnter':
                case 'esc':
                case 'del':
                case 'shiftdel':
                case 'ctrlC':
                case 'ctrlV':
                case 'ctrlX':
                case 'f2':
                case 'ctrlD':
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        };
        /* istanbul ignore next */
        // eslint:disable-next-line
        LargeIconsView.prototype.keyActionHandler = function (e) {
            if (!this.isRendered) {
                return;
            }
            var fItem = this.getFocusedItem();
            var firstItem = this.getFirstItem();
            var lastItem = this.getLastItem();
            switch (e.action) {
                case 'end':
                    this.navigateItem(lastItem);
                    break;
                case 'home':
                    this.navigateItem(firstItem);
                    break;
                case 'tab':
                    if (!ej2_base_2.isNullOrUndefined(fItem)) {
                        this.addFocus(fItem);
                    }
                    else if (!ej2_base_2.isNullOrUndefined(firstItem)) {
                        this.addFocus(firstItem);
                    }
                    break;
                case 'moveDown':
                    this.navigateDown(fItem, true);
                    break;
                case 'moveLeft':
                    this.navigateRight(fItem, false);
                    break;
                case 'moveRight':
                    this.navigateRight(fItem, true);
                    break;
                case 'moveUp':
                    this.navigateDown(fItem, false);
                    break;
                case 'ctrlEnd':
                case 'shiftEnd':
                case 'csEnd':
                    this.csEndKey(lastItem, e);
                    break;
                case 'ctrlHome':
                case 'shiftHome':
                case 'csHome':
                    this.csHomeKey(firstItem, e);
                    break;
                case 'ctrlDown':
                case 'shiftDown':
                case 'csDown':
                    this.csDownKey(fItem, e);
                    break;
                case 'ctrlLeft':
                case 'shiftLeft':
                case 'csLeft':
                    this.csLeftKey(fItem, e);
                    break;
                case 'ctrlRight':
                case 'shiftRight':
                case 'csRight':
                    this.csRightKey(fItem, e);
                    break;
                case 'ctrlUp':
                case 'shiftUp':
                case 'csUp':
                    this.csUpKey(fItem, e);
                    break;
                case 'space':
                    this.spaceKey(fItem);
                    break;
                case 'ctrlSpace':
                case 'shiftSpace':
                case 'csSpace':
                    if (!ej2_base_2.isNullOrUndefined(fItem)) {
                        this.doSelection(fItem, e);
                    }
                    break;
                case 'ctrlA':
                    this.ctrlAKey(firstItem, lastItem);
                    break;
                case 'enter':
                    this.doOpenAction(this.parent.visitedItem ? this.parent.visitedItem : this.getVisitedItem());
                    break;
                case 'altEnter':
                    this.parent.notify(events.detailsInit, {});
                    operations_1.GetDetails(this.parent, this.parent.selectedItems, this.parent.path, 'details');
                    break;
                case 'esc':
                    index_2.removeActive(this.parent);
                    break;
                case 'del':
                case 'shiftdel':
                    this.performDelete();
                    break;
                case 'ctrlC':
                    index_2.copyFiles(this.parent);
                    break;
                case 'ctrlV':
                    this.parent.folderPath = '';
                    index_2.pasteHandler(this.parent);
                    break;
                case 'ctrlX':
                    index_2.cutFiles(this.parent);
                    break;
                case 'f2':
                    this.performRename();
                    break;
                case 'ctrlD':
                    this.doDownload();
                    break;
            }
        };
        LargeIconsView.prototype.doDownload = function () {
            this.updateSelectedData();
            index_1.doDownload(this.parent);
        };
        LargeIconsView.prototype.performDelete = function () {
            if (this.parent.selectedItems && this.parent.selectedItems.length > 0) {
                this.updateSelectedData();
                // eslint-disable-next-line
                var data = this.parent.itemData;
                for (var i = 0; i < data.length; i++) {
                    if (!utility_2.hasEditAccess(data[i])) {
                        utility_1.createDeniedDialog(this.parent, data[i], events.permissionEdit);
                        return;
                    }
                }
                dialog_1.createDialog(this.parent, 'Delete');
            }
        };
        LargeIconsView.prototype.performRename = function () {
            if (this.parent.selectedItems.length === 1) {
                this.updateRenameData();
                index_1.doRename(this.parent);
            }
        };
        LargeIconsView.prototype.updateRenameData = function () {
            var item = ej2_base_1.select('.' + CLS.LIST_ITEM + '.' + CLS.ACTIVE, this.element);
            // eslint-disable-next-line
            var data = this.getItemObject(item);
            index_4.updateRenamingData(this.parent, data);
        };
        LargeIconsView.prototype.getVisitedItem = function () {
            var item = this.parent.selectedItems[this.parent.selectedItems.length - 1];
            var indexes = this.getIndexes([item], this.parent.hasId);
            return this.itemList[indexes[0]];
        };
        LargeIconsView.prototype.getFocusedItem = function () {
            return ej2_base_1.select('.' + CLS.LIST_ITEM + '.' + CLS.FOCUS, this.element);
        };
        LargeIconsView.prototype.getActiveItem = function () {
            return ej2_base_1.select('.' + CLS.LIST_ITEM + '.' + CLS.ACTIVE, this.element);
        };
        LargeIconsView.prototype.getFirstItem = function () {
            return this.itemList[0];
        };
        LargeIconsView.prototype.getLastItem = function () {
            return this.itemList[this.itemList.length - 1];
        };
        LargeIconsView.prototype.navigateItem = function (item) {
            this.setFocus(item);
        };
        LargeIconsView.prototype.navigateDown = function (fItem, isTowards) {
            var nItem = this.getNextItem(fItem, isTowards, this.perRow);
            this.setFocus(nItem);
        };
        LargeIconsView.prototype.navigateRight = function (fItem, isTowards) {
            var nItem = this.getNextItem(fItem, isTowards);
            this.setFocus(nItem);
        };
        LargeIconsView.prototype.getNextItem = function (li, isTowards, perRow) {
            if (ej2_base_2.isNullOrUndefined(li)) {
                return this.getFocusedItem() || this.getActiveItem() || this.getFirstItem();
            }
            var index = this.itemList.indexOf(li);
            var nextItem;
            do {
                if (isTowards) {
                    index = perRow ? index + perRow : index + 1;
                }
                else {
                    index = perRow ? index - perRow : index - 1;
                }
                nextItem = this.itemList[index];
                if (ej2_base_2.isNullOrUndefined(nextItem)) {
                    return li;
                }
            } while (!ej2_base_2.isVisible(nextItem));
            return nextItem;
        };
        LargeIconsView.prototype.setFocus = function (nextItem) {
            if (!ej2_base_2.isNullOrUndefined(nextItem)) {
                var fileSelectionArgs = this.triggerSelection('select', nextItem);
                if (fileSelectionArgs.cancel !== true) {
                    this.startItem = nextItem;
                    this.clearSelect();
                    this.addActive(nextItem);
                    this.addFocus(nextItem);
                    this.parent.notify(events.selectionChanged, {});
                    this.triggerSelect('select', nextItem);
                }
            }
        };
        LargeIconsView.prototype.spaceKey = function (fItem) {
            if (!ej2_base_2.isNullOrUndefined(fItem) && !fItem.classList.contains(CLS.ACTIVE)) {
                var fileSelectionArgs = this.triggerSelection('select', fItem);
                if (fileSelectionArgs.cancel !== true) {
                    this.addActive(fItem);
                    this.parent.notify(events.selectionChanged, {});
                    this.triggerSelect('select', fItem);
                }
            }
        };
        LargeIconsView.prototype.ctrlAKey = function (firstItem, lastItem) {
            if (this.parent.allowMultiSelection && !ej2_base_2.isNullOrUndefined(firstItem)) {
                this.startItem = firstItem;
                var eveArgs = { ctrlKey: true, shiftKey: true };
                var liParent = this.element.querySelector('.' + CLS.LIST_PARENT);
                var liScrPos = liParent.scrollTop;
                var getCurFocusedItem = this.getFocusedItem();
                this.doSelection(lastItem, eveArgs);
                liParent.scrollTop = liScrPos;
                if (!ej2_base_2.isNullOrUndefined(getCurFocusedItem)) {
                    this.addFocus(getCurFocusedItem);
                }
            }
        };
        LargeIconsView.prototype.csEndKey = function (lastItem, e) {
            if (!this.parent.allowMultiSelection) {
                this.navigateItem(lastItem);
            }
            else if (!ej2_base_2.isNullOrUndefined(lastItem)) {
                if (e.action === 'ctrlEnd') {
                    this.addFocus(lastItem);
                }
                else {
                    this.doSelection(lastItem, e);
                }
            }
        };
        LargeIconsView.prototype.csHomeKey = function (firstItem, e) {
            if (!this.parent.allowMultiSelection) {
                this.navigateItem(firstItem);
            }
            else if (!ej2_base_2.isNullOrUndefined(firstItem)) {
                if (e.action === 'ctrlHome') {
                    this.addFocus(firstItem);
                }
                else {
                    this.doSelection(firstItem, e);
                }
            }
        };
        LargeIconsView.prototype.csDownKey = function (fItem, e) {
            if (!this.parent.allowMultiSelection) {
                this.navigateDown(fItem, true);
            }
            else {
                var dItem = this.getNextItem(fItem, true, this.perRow);
                if (!ej2_base_2.isNullOrUndefined(dItem)) {
                    if (e.action === 'ctrlDown') {
                        this.addFocus(dItem);
                    }
                    else {
                        this.doSelection(dItem, e);
                    }
                }
            }
        };
        LargeIconsView.prototype.csLeftKey = function (fItem, e) {
            if (!this.parent.allowMultiSelection) {
                this.navigateRight(fItem, false);
            }
            else {
                var lItem = this.getNextItem(fItem, false);
                if (!ej2_base_2.isNullOrUndefined(lItem)) {
                    if (e.action === 'ctrlLeft') {
                        this.addFocus(lItem);
                    }
                    else {
                        this.doSelection(lItem, e);
                    }
                }
            }
        };
        LargeIconsView.prototype.csRightKey = function (fItem, e) {
            if (!this.parent.allowMultiSelection) {
                this.navigateRight(fItem, true);
            }
            else {
                var rItem = this.getNextItem(fItem, true);
                if (!ej2_base_2.isNullOrUndefined(rItem)) {
                    if (e.action === 'ctrlRight') {
                        this.addFocus(rItem);
                    }
                    else {
                        this.doSelection(rItem, e);
                    }
                }
            }
        };
        LargeIconsView.prototype.csUpKey = function (fItem, e) {
            if (!this.parent.allowMultiSelection) {
                this.navigateDown(fItem, false);
            }
            else {
                var uItem = this.getNextItem(fItem, false, this.perRow);
                if (!ej2_base_2.isNullOrUndefined(uItem)) {
                    if (e.action === 'ctrlUp') {
                        this.addFocus(uItem);
                    }
                    else {
                        this.doSelection(uItem, e);
                    }
                }
            }
        };
        LargeIconsView.prototype.addActive = function (nextItem) {
            if (!ej2_base_2.isNullOrUndefined(nextItem)) {
                if (!nextItem.classList.contains(CLS.ACTIVE)) {
                    this.parent.selectedItems.push(this.getDataName(nextItem));
                    this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                    ej2_base_2.addClass([nextItem], [CLS.ACTIVE]);
                    nextItem.setAttribute('aria-selected', 'true');
                    this.checkState(nextItem, true);
                }
                this.parent.visitedItem = nextItem;
            }
        };
        LargeIconsView.prototype.removeActive = function (preItem) {
            if (!ej2_base_2.isNullOrUndefined(preItem)) {
                ej2_base_2.removeClass([preItem], [CLS.ACTIVE]);
                if (this.parent.allowMultiSelection) {
                    preItem.setAttribute('aria-selected', 'false');
                }
                else {
                    preItem.removeAttribute('aria-selected');
                }
                this.checkState(preItem, false);
                var index = this.parent.selectedItems.indexOf(this.getDataName(preItem));
                if (index > -1) {
                    this.parent.selectedItems.splice(index, 1);
                    this.parent.setProperties({ selectedItems: this.parent.selectedItems }, true);
                }
                this.parent.visitedItem = null;
            }
        };
        LargeIconsView.prototype.getDataName = function (item) {
            // eslint-disable-next-line
            var data = this.getItemObject(item);
            return index_1.getItemName(this.parent, data);
        };
        LargeIconsView.prototype.addFocus = function (item) {
            this.element.setAttribute('tabindex', '-1');
            var fItem = this.getFocusedItem();
            if (fItem) {
                fItem.removeAttribute('tabindex');
                ej2_base_2.removeClass([fItem], [CLS.FOCUS]);
            }
            ej2_base_2.addClass([item], [CLS.FOCUS]);
            item.setAttribute('tabindex', '0');
            item.focus();
        };
        LargeIconsView.prototype.checkState = function (item, toCheck) {
            if (!this.parent.allowMultiSelection) {
                return;
            }
            var checkEle = ej2_base_1.select('.' + CLS.FRAME, item);
            if (ej2_base_2.isNullOrUndefined(checkEle)) {
                return;
            }
            if (toCheck) {
                if (!checkEle.classList.contains(CLS.CHECK)) {
                    ej2_base_2.addClass([checkEle], CLS.CHECK);
                    ej2_base_1.closest(checkEle, '.' + CLS.CB_WRAP).setAttribute('aria-checked', 'true');
                }
            }
            else {
                if (checkEle.classList.contains(CLS.CHECK)) {
                    ej2_base_2.removeClass([checkEle], CLS.CHECK);
                    ej2_base_1.closest(checkEle, '.' + CLS.CB_WRAP).setAttribute('aria-checked', 'false');
                }
            }
        };
        LargeIconsView.prototype.clearSelect = function () {
            var eles = Array.prototype.slice.call(ej2_base_1.selectAll('.' + CLS.ACTIVE, this.listElements));
            var fileSelectionArgs;
            if (eles.length !== 0) {
                fileSelectionArgs = this.triggerSelection('unselect', eles[0]);
                if (fileSelectionArgs.cancel !== true) {
                    for (var i = 0, len = eles.length; i < len; i++) {
                        this.removeActive(eles[i]);
                    }
                }
                this.triggerSelect('unselect', eles[0]);
            }
        };
        LargeIconsView.prototype.resizeHandler = function () {
            this.getItemCount();
            if (!ej2_base_2.isNullOrUndefined(this.listObj)) {
                this.adjustHeight();
            }
        };
        LargeIconsView.prototype.splitterResizeHandler = function () {
            this.getItemCount();
        };
        LargeIconsView.prototype.getItemCount = function () {
            var perRow = 1;
            if (this.itemList) {
                for (var i = 0, len = this.itemList.length - 1; i < len; i++) {
                    if (this.itemList[i].getBoundingClientRect().top === this.itemList[i + 1].getBoundingClientRect().top) {
                        perRow++;
                    }
                    else {
                        break;
                    }
                }
            }
            this.perRow = perRow;
        };
        LargeIconsView.prototype.triggerSelection = function (action, item) {
            // eslint-disable-next-line
            var data = this.getItemObject(item);
            var eventArgs = {
                action: action, fileDetails: data, isInteracted: this.isInteraction, cancel: false, target: item
            };
            this.parent.trigger('fileSelection', eventArgs);
            this.isInteraction = true;
            return eventArgs;
        };
        LargeIconsView.prototype.triggerSelect = function (action, item) {
            // eslint-disable-next-line
            var data = this.getItemObject(item);
            this.parent.visitedData = data;
            var eventArgs = { action: action, fileDetails: data, isInteracted: this.isInteracted };
            this.parent.trigger('fileSelect', eventArgs);
            this.isInteracted = true;
        };
        LargeIconsView.prototype.selectItems = function (items) {
            var indexes = this.getIndexes(items, this.parent.hasId);
            for (var j = 0, len = indexes.length; j < len; j++) {
                var eveArgs = { ctrlKey: true, shiftKey: false };
                this.doSelection(this.itemList[indexes[j]], eveArgs);
            }
        };
        LargeIconsView.prototype.getIndexes = function (items, byId) {
            var indexes = [];
            var filter = byId ? 'id' : 'name';
            for (var i = 0, len = this.items.length; i < len; i++) {
                if (items.indexOf(ej2_base_3.getValue(filter, this.items[i])) !== -1) {
                    indexes.push(i);
                }
            }
            return indexes;
        };
        // eslint-disable-next-line
        LargeIconsView.prototype.getItemObject = function (item) {
            var index = this.itemList.indexOf(item);
            return this.items[index];
        };
        // eslint-disable-next-line
        LargeIconsView.prototype.addSelection = function (data) {
            // eslint-disable-next-line
            var resultData = [];
            if (this.parent.hasId) {
                resultData = new ej2_data_1.DataManager(this.items).
                    executeLocal(new ej2_data_1.Query().where('id', 'equal', this.parent.renamedId, false));
            }
            else {
                // eslint-disable-next-line
                var newData = new ej2_data_1.DataManager(this.items).
                    executeLocal(new ej2_data_1.Query().where('name', 'equal', ej2_base_3.getValue('name', data), false));
                if (newData.length > 0) {
                    resultData = new ej2_data_1.DataManager(newData).
                        executeLocal(new ej2_data_1.Query().where('filterPath', 'equal', this.parent.filterPath, false));
                }
            }
            if (resultData.length > 0) {
                var index = this.items.indexOf(resultData[0]);
                var eveArgs = { ctrlKey: true, shiftKey: false };
                this.doSelection(this.itemList[index], eveArgs);
            }
        };
        LargeIconsView.prototype.updateSelectedData = function () {
            // eslint-disable-next-line
            var data = [];
            var items = ej2_base_1.selectAll('.' + CLS.LIST_ITEM + '.' + CLS.ACTIVE, this.element);
            for (var i = 0; i < items.length; i++) {
                data[i] = this.getItemObject(items[i]);
            }
            this.parent.itemData = data;
        };
        // eslint-disable-next-line
        LargeIconsView.prototype.onMethodCall = function (args) {
            if (this.parent.view !== 'LargeIcons') {
                return;
            }
            var action = ej2_base_3.getValue('action', args);
            switch (action) {
                case 'deleteFiles':
                    this.deleteFiles(ej2_base_3.getValue('ids', args));
                    break;
                case 'downloadFiles':
                    this.downloadFiles(ej2_base_3.getValue('ids', args));
                    break;
                case 'openFile':
                    this.openFile(ej2_base_3.getValue('id', args));
                    break;
                case 'renameFile':
                    this.isInteraction = false;
                    this.isInteracted = false;
                    this.renameFile(ej2_base_3.getValue('id', args), ej2_base_3.getValue('newName', args));
                    break;
                case 'createFolder':
                    this.isInteraction = false;
                    this.isInteracted = false;
                    break;
                case 'clearSelection':
                    this.isInteraction = false;
                    this.isInteracted = false;
                    this.onClearAllInit();
                    break;
                case 'selectAll':
                    this.isInteraction = false;
                    this.isInteracted = false;
                    this.onSelectAllInit();
                    break;
            }
        };
        LargeIconsView.prototype.getItemsIndex = function (items) {
            var indexes = [];
            var isFilter = (this.parent.breadcrumbbarModule.searchObj.element.value !== '' || this.parent.isFiltered) ? true : false;
            var filterName = this.parent.hasId ? 'id' : 'name';
            if (this.parent.hasId || !isFilter) {
                for (var i = 0, len = this.items.length; i < len; i++) {
                    if (items.indexOf(ej2_base_3.getValue(filterName, this.items[i])) !== -1) {
                        indexes.push(i);
                    }
                }
            }
            else {
                for (var i = 0, len = this.items.length; i < len; i++) {
                    var name_2 = ej2_base_3.getValue('filterPath', this.items[i]) + ej2_base_3.getValue('name', this.items[i]);
                    if (items.indexOf(name_2) !== -1) {
                        indexes.push(i);
                    }
                }
            }
            return indexes;
        };
        LargeIconsView.prototype.deleteFiles = function (ids) {
            this.parent.activeModule = 'largeiconsview';
            if (ej2_base_2.isNullOrUndefined(ids)) {
                this.performDelete();
                return;
            }
            var indexes = this.getItemsIndex(ids);
            if (indexes.length === 0) {
                return;
            }
            // eslint-disable-next-line
            var data = [];
            var newIds = [];
            for (var i = 0; i < indexes.length; i++) {
                data[i] = this.items[indexes[i]];
                newIds[i] = index_1.getItemName(this.parent, data[i]);
            }
            index_4.doDeleteFiles(this.parent, data, newIds);
        };
        LargeIconsView.prototype.downloadFiles = function (ids) {
            if (ej2_base_2.isNullOrUndefined(ids)) {
                this.doDownload();
                return;
            }
            var index = this.getItemsIndex(ids);
            if (index.length === 0) {
                return;
            }
            // eslint-disable-next-line
            var data = [];
            var newIds = [];
            for (var i = 0; i < index.length; i++) {
                data[i] = this.items[index[i]];
                newIds[i] = index_1.getItemName(this.parent, data[i]);
            }
            index_4.doDownloadFiles(this.parent, data, newIds);
        };
        LargeIconsView.prototype.openFile = function (id) {
            if (ej2_base_2.isNullOrUndefined(id)) {
                return;
            }
            var indexes = this.getItemsIndex([id]);
            if (indexes.length > 0) {
                this.doOpenAction(this.itemList[indexes[0]]);
            }
        };
        LargeIconsView.prototype.renameFile = function (id, name) {
            this.parent.activeModule = 'largeiconsview';
            if (ej2_base_2.isNullOrUndefined(id)) {
                this.performRename();
                return;
            }
            var indexes = this.getItemsIndex([id]);
            if (indexes.length > 0) {
                index_4.updateRenamingData(this.parent, this.items[indexes[0]]);
                if (ej2_base_2.isNullOrUndefined(name)) {
                    index_1.doRename(this.parent);
                }
                else {
                    if (!utility_2.hasEditAccess(this.parent.itemData[0])) {
                        utility_1.createDeniedDialog(this.parent, this.parent.itemData[0], events.permissionEdit);
                    }
                    else {
                        index_1.rename(this.parent, this.parent.path, name);
                    }
                }
            }
        };
        return LargeIconsView;
    }());
    exports.LargeIconsView = LargeIconsView;
});
