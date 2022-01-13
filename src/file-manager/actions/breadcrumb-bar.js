define(["require", "exports", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-inputs", "@syncfusion/ej2-splitbuttons", "../common/operations", "../common/utility", "../base/constant", "../base/classes"], function (require, exports, ej2_base_1, ej2_base_2, ej2_inputs_1, ej2_splitbuttons_1, operations_1, utility_1, events, CLS) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * BreadCrumbBar module
     */
    var BreadCrumbBar = /** @class */ (function () {
        /**
         * constructor for addressbar module
         *
         * @hidden
         * @param {IFileManager} parent - specifies parent element.
         * @private
         *
         */
        function BreadCrumbBar(parent) {
            this.addressPath = '';
            this.addressBarLink = '';
            this.searchTimer = null;
            this.searchWrapWidth = null;
            this.parent = parent;
            this.keyConfigs = {
                enter: 'enter'
            };
            this.render();
        }
        BreadCrumbBar.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName() && e.module !== 'common') {
                return;
            }
            for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                var value = e.newProp.searchSettings;
                switch (prop) {
                    case 'searchSettings':
                        if (!ej2_base_1.isNullOrUndefined(value.allowSearchOnTyping)) {
                            this.searchEventBind(value.allowSearchOnTyping);
                        }
                        if (this.parent.breadcrumbbarModule.searchObj.value && this.parent.breadcrumbbarModule.searchObj.value !== '' &&
                            !(!ej2_base_1.isNullOrUndefined(value.allowSearchOnTyping) && ej2_base_1.isNullOrUndefined(value.filterType) &&
                                ej2_base_1.isNullOrUndefined(value.ignoreCase))) {
                            utility_1.searchWordHandler(this.parent, this.parent.breadcrumbbarModule.searchObj.value, false);
                        }
                        break;
                }
            }
        };
        BreadCrumbBar.prototype.render = function () {
            this.addEventListener();
        };
        BreadCrumbBar.prototype.onPathChange = function () {
            var pathNames = this.parent.pathNames;
            var paths = this.parent.path.split('/');
            var addressbarUL = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
            var addressbarLI = null;
            var pathNamesLen = pathNames.length;
            if (pathNames.length > 0) {
                var id = '';
                for (var i = 0; i < pathNamesLen; i++) {
                    var addressATag = null;
                    addressbarLI = this.parent.createElement('li', { className: 'e-address-list-item' });
                    for (var j = 0; j <= i; j++) {
                        id = id + paths[j] + '/';
                    }
                    addressbarLI.setAttribute('data-utext', id);
                    if (i !== 0) {
                        var icon = ej2_base_2.createElement('span', { className: CLS.ICONS });
                        addressbarLI.appendChild(icon);
                    }
                    if (pathNamesLen - i !== 1) {
                        addressATag = ej2_base_2.createElement('a', { className: CLS.LIST_TEXT });
                        addressbarLI.setAttribute('tabindex', '0');
                    }
                    else {
                        addressATag = ej2_base_2.createElement('span', { className: CLS.LIST_TEXT });
                    }
                    id = '';
                    addressATag.innerText = pathNames[i];
                    addressbarLI.appendChild(addressATag);
                    addressbarUL.appendChild(addressbarLI);
                }
                var ulElement = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
                if (!ej2_base_1.isNullOrUndefined(ulElement)) {
                    if (!ej2_base_1.isNullOrUndefined(this.subMenuObj)) {
                        this.subMenuObj.destroy();
                    }
                    ej2_base_2.remove(ulElement);
                }
                var searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
                if (!searchWrap) {
                    this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
                }
                else {
                    this.parent.breadCrumbBarNavigation.appendChild(addressbarUL);
                }
                this.updateBreadCrumbBar(addressbarUL);
            }
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.updateBreadCrumbBar = function (addresBarUL) {
            var liElements = addresBarUL.querySelectorAll('li');
            var ulElement = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
            var style = window.getComputedStyle(ulElement, null);
            var pRight = parseFloat(style.getPropertyValue('padding-right'));
            var pLeft = parseFloat(style.getPropertyValue('padding-left'));
            var breadCrumbBarWidth = ulElement.offsetWidth - pRight - pLeft;
            var addressbarUL = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
            var liElementsWidth = 0;
            var liElementsWidths = [];
            for (var i = 0; i < liElements.length; i++) {
                var width = liElements[i].clientWidth;
                liElementsWidths.push(width);
                liElementsWidth = liElementsWidth + width;
            }
            if (!ej2_base_1.isNullOrUndefined(ulElement)) {
                ej2_base_2.remove(ulElement);
            }
            var searchContainer = this.parent.createElement('div');
            searchContainer.setAttribute('class', 'e-search-wrap');
            var id = this.parent.element.id + CLS.SEARCH_ID;
            var searchInput = ej2_base_2.createElement('input', { id: id,
                attrs: { autocomplete: 'off', 'aria-label': utility_1.getLocaleText(this.parent, 'Search') } });
            searchContainer.appendChild(searchInput);
            var searchEle = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap .e-input');
            if (ej2_base_1.isNullOrUndefined(searchEle)) {
                this.parent.breadCrumbBarNavigation.appendChild(searchContainer);
                var span = ej2_base_2.createElement('span', { className: 'e-icons e-fe-search' });
                ej2_base_1.EventHandler.add(span, 'click', this.onShowInput, this);
                searchInput.parentElement.insertBefore(span, searchInput);
                this.searchObj = new ej2_inputs_1.TextBox({
                    value: '',
                    showClearButton: true,
                    placeholder: utility_1.getLocaleText(this.parent, 'Search'),
                    focus: this.onFocus.bind(this),
                    blur: this.onBlur.bind(this)
                });
                this.searchObj.appendTo('#' + this.parent.element.id + CLS.SEARCH_ID);
                this.searchEventBind(this.parent.searchSettings.allowSearchOnTyping);
                var search = this.searchObj.element.nextElementSibling;
                ej2_base_1.EventHandler.add(search, 'mousedown', this.searchChangeHandler.bind(this), this);
                ej2_base_1.EventHandler.add(this.searchObj.element, 'keyup', this.onKeyUp.bind(this), this);
            }
            var searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
            breadCrumbBarWidth = breadCrumbBarWidth - (this.searchWrapWidth ? this.searchWrapWidth : searchWrap.offsetWidth);
            if (liElementsWidth > breadCrumbBarWidth) {
                var i = liElements.length;
                while (i--) {
                    var diff = breadCrumbBarWidth - liElementsWidths[i];
                    if (diff > 40) {
                        addressbarUL.insertBefore(liElements[i], addressbarUL.querySelector('li'));
                        breadCrumbBarWidth = diff;
                    }
                    else {
                        // eslint-disable-next-line
                        var items = [];
                        for (var j = 0; j <= i; j++) {
                            var liElement = liElements[j];
                            items.push({
                                text: liElement.innerText,
                                utext: liElement.getAttribute('data-utext')
                            });
                        }
                        var subMenuLi = this.parent.createElement('li', { className: 'e-breadcrumb-menu' });
                        // eslint-disable-next-line
                        var attributes = { className: 'e-breadcrumb-submenu' };
                        var subMenuSpan = this.parent.createElement('button', attributes);
                        subMenuLi.appendChild(subMenuSpan);
                        addressbarUL.insertBefore(subMenuLi, addressbarUL.querySelector('li'));
                        this.subMenuObj = new ej2_splitbuttons_1.DropDownButton({
                            items: items,
                            cssClass: 'e-caret-hide e-submenu',
                            iconCss: CLS.ICON_BREADCRUMB,
                            iconPosition: 'Top',
                            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                            beforeItemRender: this.addSubMenuAttributes.bind(this),
                            select: this.subMenuSelectOperations.bind(this)
                        });
                        this.subMenuObj.isStringTemplate = true;
                        this.subMenuObj.appendTo(subMenuSpan);
                        break;
                    }
                }
                this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
            }
            else {
                this.parent.breadCrumbBarNavigation.insertBefore(addresBarUL, searchWrap);
            }
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.onFocus = function () {
            var wrap = ej2_base_1.closest(this.searchObj.element, '.e-search-wrap');
            wrap.classList.add('e-focus');
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.onKeyUp = function () {
            this.parent.notify(events.pathColumn, { args: this.parent });
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.onBlur = function () {
            var wrap = ej2_base_1.closest(this.searchObj.element, '.e-search-wrap');
            wrap.classList.remove('e-focus');
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.subMenuSelectOperations = function (event) {
            // eslint-disable-next-line
            var args = { target: event.element };
            this.addressPathClickHandler(args);
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.addSubMenuAttributes = function (args) {
            args.element.setAttribute('data-utext', ej2_base_2.getValue('utext', args.item));
            var anchor = this.parent.createElement('a', { className: 'e-list-text' });
            args.element.appendChild(anchor);
        };
        BreadCrumbBar.prototype.searchEventBind = function (allow) {
            if (allow) {
                this.searchObj.input = this.searchChangeHandler.bind(this);
                this.searchObj.change = null;
            }
            else {
                this.searchObj.change = this.searchChangeHandler.bind(this);
                this.searchObj.input = null;
            }
        };
        BreadCrumbBar.prototype.searchChangeHandler = function (args) {
            var _this = this;
            if (!ej2_base_1.isNullOrUndefined(args.value)) {
                this.parent.isFiltered = false;
                if (this.parent.searchSettings.allowSearchOnTyping) {
                    window.clearTimeout(this.searchTimer);
                    this.searchTimer = window.setTimeout(function () { utility_1.searchWordHandler(_this.parent, args.value, false); }, 300);
                }
                else {
                    utility_1.searchWordHandler(this.parent, args.value, false);
                }
            }
        };
        BreadCrumbBar.prototype.addressPathClickHandler = function (e) {
            var li = e.target;
            if (li.nodeName === 'LI' || li.nodeName === 'A') {
                var node = li.nodeName === 'LI' ? li.children[0] : li;
                if (!ej2_base_1.isNullOrUndefined(node)) {
                    this.parent.isFiltered = false;
                    var currentPath = this.updatePath(node);
                    this.parent.itemData = [ej2_base_2.getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
                    this.triggerFileOpen(this.parent.itemData[0]);
                    operations_1.read(this.parent, events.pathChanged, currentPath);
                    var treeNodeId = this.parent.pathId[this.parent.pathId.length - 1];
                    this.parent.notify(events.updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
                }
            }
        };
        // eslint-disable-next-line
        BreadCrumbBar.prototype.triggerFileOpen = function (data) {
            var eventArgs = { cancel: false, fileDetails: data, module: 'BreadCrumbBar' };
            delete eventArgs.cancel;
            this.parent.trigger('fileOpen', eventArgs);
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.onShowInput = function () {
            if (this.parent.isMobile) {
                if (this.parent.element.classList.contains(CLS.FILTER)) {
                    ej2_base_2.removeClass([this.parent.element], CLS.FILTER);
                    this.searchWrapWidth = null;
                }
                else {
                    var searchWrap = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
                    this.searchWrapWidth = searchWrap.offsetWidth;
                    ej2_base_2.addClass([this.parent.element], CLS.FILTER);
                    this.searchObj.element.focus();
                }
            }
        };
        BreadCrumbBar.prototype.updatePath = function (list) {
            var li = ej2_base_1.closest(list, 'li');
            var liElementId = li.getAttribute('data-utext');
            this.addressBarLink = liElementId;
            var link = this.addressBarLink.split('/');
            var ids = this.parent.pathId;
            var names = this.parent.pathNames;
            this.parent.pathId = [];
            this.parent.pathNames = [];
            var newpath = '';
            for (var i = 0, len = link.length - 1; i < len; i++) {
                this.parent.pathId.push(ids[i]);
                this.parent.pathNames.push(names[i]);
                newpath += link[i] + '/';
            }
            this.parent.setProperties({ path: newpath }, true);
            return newpath;
        };
        BreadCrumbBar.prototype.onUpdatePath = function () {
            this.onPathChange();
            this.removeSearchValue();
        };
        BreadCrumbBar.prototype.onCreateEnd = function () {
            this.onPathChange();
        };
        BreadCrumbBar.prototype.onRenameEnd = function () {
            this.onPathChange();
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.onDeleteEnd = function () {
            this.onUpdatePath();
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.removeSearchValue = function () {
            this.parent.isFiltered = false;
            if (this.searchObj && (this.searchObj.value !== '' || this.searchObj.element.value !== '')) {
                this.searchObj.value = '';
                this.searchObj.element.value = '';
                this.searchObj.dataBind();
            }
        };
        BreadCrumbBar.prototype.onResize = function () {
            this.onPathChange();
        };
        BreadCrumbBar.prototype.onPasteEnd = function () {
            this.onPathChange();
        };
        BreadCrumbBar.prototype.addEventListener = function () {
            this.keyboardModule = new ej2_base_1.KeyboardEvents(this.parent.breadCrumbBarNavigation, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
            this.parent.on(events.modelChanged, this.onPropertyChanged, this);
            ej2_base_1.EventHandler.add(this.parent.breadCrumbBarNavigation, 'click', this.addressPathClickHandler, this);
            this.parent.on(events.destroy, this.destroy, this);
            this.parent.on(events.pathChanged, this.onUpdatePath, this);
            this.parent.on(events.finalizeEnd, this.onUpdatePath, this);
            this.parent.on(events.refreshEnd, this.onUpdatePath, this);
            this.parent.on(events.openEnd, this.onUpdatePath, this);
            this.parent.on(events.createEnd, this.onCreateEnd, this);
            this.parent.on(events.renameEnd, this.onRenameEnd, this);
            this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
            this.parent.on(events.splitterResize, this.onResize, this);
            this.parent.on(events.pasteEnd, this.onPasteEnd, this);
            this.parent.on(events.resizeEnd, this.onResize, this);
            this.parent.on(events.searchTextChange, this.onSearchTextChange, this);
            this.parent.on(events.dropInit, this.onDropInit, this);
            this.parent.on(events.layoutRefresh, this.onResize, this);
            this.parent.on(events.dropPath, this.onPathChange, this);
        };
        BreadCrumbBar.prototype.keyActionHandler = function (e) {
            switch (e.action) {
                case 'enter':
                    this.addressPathClickHandler(e);
                    break;
            }
        };
        BreadCrumbBar.prototype.removeEventListener = function () {
            this.keyboardModule.destroy();
            this.parent.off(events.pathChanged, this.onUpdatePath);
            this.parent.off(events.finalizeEnd, this.onUpdatePath);
            this.parent.off(events.refreshEnd, this.onUpdatePath);
            this.parent.off(events.openEnd, this.onUpdatePath);
            this.parent.off(events.pasteEnd, this.onPasteEnd);
            this.parent.off(events.createEnd, this.onCreateEnd);
            this.parent.off(events.renameEnd, this.onRenameEnd);
            this.parent.off(events.deleteEnd, this.onDeleteEnd);
            this.parent.off(events.splitterResize, this.onResize);
            this.parent.off(events.resizeEnd, this.onResize);
            this.parent.off(events.searchTextChange, this.onSearchTextChange);
            this.parent.off(events.dropInit, this.onDropInit);
            this.parent.off(events.layoutRefresh, this.onResize);
            this.parent.off(events.dropPath, this.onPathChange);
        };
        /* istanbul ignore next */
        BreadCrumbBar.prototype.onDropInit = function (args) {
            if (this.parent.targetModule === this.getModuleName()) {
                var liEle = args.target.closest('li');
                this.parent.dropPath = this.updatePath((liEle.children[0]));
                this.parent.dropData = ej2_base_2.getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
                this.triggerFileOpen(this.parent.dropData);
                var treeNodeId = this.parent.pathId[this.parent.pathId.length - 1];
                this.parent.notify(events.updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
            }
        };
        /**
         * For internal use only - Get the module name.
         *
         * @returns {string} - returns the module name
         * @private
         */
        BreadCrumbBar.prototype.getModuleName = function () {
            return 'breadcrumbbar';
        };
        BreadCrumbBar.prototype.destroy = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.removeEventListener();
            /* istanbul ignore next */
            if (!ej2_base_1.isNullOrUndefined(this.subMenuObj)) {
                this.subMenuObj.destroy();
            }
            if (!ej2_base_1.isNullOrUndefined(this.searchObj)) {
                this.searchObj.destroy();
            }
        };
        BreadCrumbBar.prototype.onSearchTextChange = function (args) {
            this.searchObj.element.placeholder = (this.parent.searchSettings.placeholder != null) ? this.parent.searchSettings.placeholder : utility_1.getLocaleText(this.parent, 'Search') + ' ' + args.cwd.name;
        };
        return BreadCrumbBar;
    }());
    exports.BreadCrumbBar = BreadCrumbBar;
});
