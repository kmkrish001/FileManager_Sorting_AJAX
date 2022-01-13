define(["require", "exports", "../base/classes", "../base/constant", "../common/operations", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-data", "../pop-up/dialog"], function (require, exports, CLS, events, operations_1, ej2_base_1, ej2_base_2, ej2_data_1, dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Utility file for common actions
     *
     * @param {HTMLLIElement} node - specifies the node.
     * @param {Object} data - specifies the data.
     * @param {IFileManager} instance - specifies the control instance.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    function updatePath(node, data, instance) {
        var text = ej2_base_1.getValue('name', data);
        var id = node.getAttribute('data-id');
        var newText = ej2_base_1.isNullOrUndefined(id) ? text : id;
        instance.setProperties({ path: getPath(node, newText, instance.hasId) }, true);
        instance.pathId = getPathId(node);
        instance.pathNames = getPathNames(node, text);
    }
    exports.updatePath = updatePath;
    /**
     * Functions for get path in FileManager
     *
     * @param {Element | Node} element - specifies the element.
     * @param {string} text - specifies the text.
     * @param {boolean} hasId - specifies the id.
     * @returns {string} returns the path.
     * @private
     */
    function getPath(element, text, hasId) {
        var matched = getParents(element, text, false, hasId);
        var path = hasId ? '' : '/';
        var len = matched.length - (hasId ? 1 : 2);
        for (var i = len; i >= 0; i--) {
            path += matched[i] + '/';
        }
        return path;
    }
    exports.getPath = getPath;
    /**
     * Functions for get path id in FileManager
     *
     * @param {Element} node - specifies the node element.
     * @returns {string[]} returns the path ids.
     * @private
     */
    function getPathId(node) {
        var matched = getParents(node, node.getAttribute('data-uid'), true);
        var ids = [];
        for (var i = matched.length - 1; i >= 0; i--) {
            ids.push(matched[i]);
        }
        return ids;
    }
    exports.getPathId = getPathId;
    /**
     * Functions for get path names in FileManager
     *
     * @param {Element} element - specifies the node element.
     * @param {string} text - specifies the text.
     * @returns {string[]} returns the path names.
     * @private
     */
    function getPathNames(element, text) {
        var matched = getParents(element, text, false);
        var names = [];
        for (var i = matched.length - 1; i >= 0; i--) {
            names.push(matched[i]);
        }
        return names;
    }
    exports.getPathNames = getPathNames;
    /**
     * Functions for get path id in FileManager
     *
     * @param {Element} element - specifies the node element.
     * @param {string} text - specifies the text.
     * @param {boolean} isId - specifies the id.
     * @param {boolean} hasId - checks the id exists.
     * @returns {string[]} returns parent element.
     * @private
     */
    function getParents(element, text, isId, hasId) {
        var matched = [text];
        var el = element.parentNode;
        while (!ej2_base_1.isNullOrUndefined(el)) {
            if (ej2_base_1.matches(el, '.' + CLS.LIST_ITEM)) {
                var parentText = isId ? el.getAttribute('data-uid') : (hasId ? el.getAttribute('data-id') :
                    ej2_base_1.select('.' + CLS.LIST_TEXT, el).textContent);
                matched.push(parentText);
            }
            el = el.parentNode;
            if (el.classList.contains(CLS.TREE_VIEW)) {
                break;
            }
        }
        return matched;
    }
    exports.getParents = getParents;
    /**
     * Functions for generate path
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function generatePath(parent) {
        var key = parent.hasId ? 'id' : 'name';
        var newPath = parent.hasId ? '' : '/';
        var i = parent.hasId ? 0 : 1;
        for (i; i < parent.pathId.length; i++) {
            // eslint-disable-next-line
            var data = ej2_base_1.getValue(parent.pathId[i], parent.feParent);
            newPath += ej2_base_1.getValue(key, data) + '/';
        }
        parent.setProperties({ path: newPath }, true);
    }
    exports.generatePath = generatePath;
    /**
     * Functions for remove active element
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function removeActive(parent) {
        if (parent.isCut) {
            removeBlur(parent);
            parent.selectedNodes = [];
            parent.actionRecords = [];
            parent.enablePaste = false;
            parent.notify(events.hidePaste, {});
        }
    }
    exports.removeActive = removeActive;
    /**
     * Selects active element in File Manager
     *
     * @param {string} action - specifies the action.
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {boolean} - returns active element.
     * @private
     */
    function activeElement(action, parent) {
        parent.isSearchCut = false;
        parent.actionRecords = [];
        parent.activeElements = [];
        parent.notify(events.cutCopyInit, {});
        if (parent.activeElements.length === 0) {
            return false;
        }
        removeBlur(parent);
        var blurEle = parent.activeElements;
        if (parent.activeModule !== 'navigationpane') {
            parent.targetPath = parent.path;
        }
        else {
            parent.targetPath = getParentPath(parent.path);
        }
        var i = 0;
        if (blurEle) {
            getModule(parent, blurEle[0]);
            if (action === 'cut') {
                while (i < blurEle.length) {
                    addBlur(blurEle[i]);
                    i++;
                }
            }
        }
        i = 0;
        parent.selectedNodes = [];
        parent.enablePaste = true;
        parent.notify(events.showPaste, {});
        while (i < parent.activeRecords.length) {
            parent.actionRecords.push(parent.activeRecords[i]);
            parent.selectedNodes.push(ej2_base_1.getValue('name', parent.activeRecords[i]));
            i++;
        }
        if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) &&
            parent.activeModule !== 'navigationpane') {
            parent.selectedNodes = [];
            parent.isSearchCut = true;
            var i_1 = 0;
            while (i_1 < parent.selectedItems.length) {
                parent.selectedNodes.push(parent.selectedItems[i_1]);
                i_1++;
            }
        }
        return true;
    }
    exports.activeElement = activeElement;
    /**
     * Adds blur to the elements
     *
     * @param {Element} nodes - specifies the nodes.
     * @returns {void}
     * @private
     */
    function addBlur(nodes) {
        nodes.classList.add(CLS.BLUR);
    }
    exports.addBlur = addBlur;
    /**
     * Removes blur from elements
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {string} hover - specifies the hover string.
     * @returns {void}
     * @private
     */
    function removeBlur(parent, hover) {
        var blurEle = (!hover) ? parent.element.querySelectorAll('.' + CLS.BLUR) :
            parent.element.querySelectorAll('.' + CLS.HOVER);
        var i = 0;
        while (i < blurEle.length) {
            blurEle[i].classList.remove((!hover) ? CLS.BLUR : CLS.HOVER);
            i++;
        }
    }
    exports.removeBlur = removeBlur;
    /**
     * Gets module name
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {Element} element - specifies the element.
     * @returns {void}
     * @private
     */
    function getModule(parent, element) {
        if (element) {
            if (element.classList.contains(CLS.ROW)) {
                parent.activeModule = 'detailsview';
            }
            else if (ej2_base_2.closest(element, '.' + CLS.LARGE_ICON)) {
                parent.activeModule = 'largeiconsview';
            }
            else {
                parent.activeModule = 'navigationpane';
            }
        }
    }
    exports.getModule = getModule;
    /**
     * Gets module name
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {string} value - specifies the value.
     * @param {boolean} isLayoutChange - specifies the layout change.
     * @returns {void}
     * @private
     */
    function searchWordHandler(parent, value, isLayoutChange) {
        var searchWord;
        if (value.length === 0 && !parent.isFiltered) {
            parent.notify(events.pathColumn, { args: parent });
        }
        if (parent.searchSettings.filterType === 'startsWith') {
            searchWord = value + '*';
        }
        else if (parent.searchSettings.filterType === 'endsWith') {
            searchWord = '*' + value;
        }
        else {
            searchWord = '*' + value + '*';
        }
        parent.searchWord = searchWord;
        parent.itemData = [getPathObject(parent)];
        if (value.length > 0) {
            var caseSensitive = parent.searchSettings.ignoreCase;
            var hiddenItems = parent.showHiddenItems;
            operations_1.Search(parent, isLayoutChange ? events.layoutChange : events.search, parent.path, searchWord, hiddenItems, !caseSensitive);
        }
        else {
            if (!parent.isFiltered) {
                if (parent.isSortByClicked) {
                    parent.notify(events.layoutChange, { files: parent.largeiconsviewModule.items });
                    parent.isSortByClicked = false;
                }
                else {
                    operations_1.read(parent, isLayoutChange ? events.layoutChange : events.search, parent.path);
                }
            }
            else {
                operations_1.filter(parent, events.layoutChange);
            }
        }
    }
    exports.searchWordHandler = searchWordHandler;
    /**
     * Gets updated layout
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {string} view - specifies the view.
     * @returns {void}
     * @private
     */
    function updateLayout(parent, view) {
        parent.setProperties({ view: view }, true);
        if (parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) {
            parent.layoutSelectedItems = parent.selectedItems;
        }
        var searchWord = '';
        if (parent.breadcrumbbarModule.searchObj.element.value) {
            searchWord = parent.breadcrumbbarModule.searchObj.element.value;
        }
        parent.isLayoutChange = true;
        searchWordHandler(parent, searchWord, true);
    }
    exports.updateLayout = updateLayout;
    /* istanbul ignore next */
    /**
     * Gets updated layout
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {Element} element - specifies the element.
     * @returns {void}
     * @private
     */
    function getTargetModule(parent, element) {
        var tartgetModule = '';
        if (element) {
            if (ej2_base_2.closest(element, '.e-gridcontent')) {
                tartgetModule = 'detailsview';
            }
            else if (ej2_base_2.closest(element, '.' + CLS.LARGE_ICONS)) {
                tartgetModule = 'largeiconsview';
            }
            else if (element.classList.contains('e-fullrow') ||
                element.classList.contains('e-icon-expandable')) {
                tartgetModule = 'navigationpane';
            }
            else if (ej2_base_2.closest(element, '.e-address-list-item')) {
                tartgetModule = 'breadcrumbbar';
            }
            else {
                tartgetModule = '';
            }
        }
        parent.targetModule = tartgetModule;
    }
    exports.getTargetModule = getTargetModule;
    /* istanbul ignore next */
    /**
     * refresh the layout
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function refresh(parent) {
        parent.itemData = [getPathObject(parent)];
        if (!hasReadAccess(parent.itemData[0])) {
            createDeniedDialog(parent, parent.itemData[0], events.permissionRead);
        }
        else {
            operations_1.read(parent, events.refreshEnd, parent.path);
        }
    }
    exports.refresh = refresh;
    /**
     * open action in the layout
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function openAction(parent) {
        operations_1.read(parent, events.openEnd, parent.path);
    }
    exports.openAction = openAction;
    /**
     * open action in the layout
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {Object} - returns the path data.
     * @private
     */
    // eslint-disable-next-line
    function getPathObject(parent) {
        return ej2_base_1.getValue(parent.pathId[parent.pathId.length - 1], parent.feParent);
    }
    exports.getPathObject = getPathObject;
    /**
     * Copy files
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function copyFiles(parent) {
        if (!activeElement('copy', parent)) {
            return;
        }
        else {
            parent.fileAction = 'copy';
        }
    }
    exports.copyFiles = copyFiles;
    /**
     * Cut files
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function cutFiles(parent) {
        if (!activeElement('cut', parent)) {
            return;
        }
        else {
            parent.isCut = true;
            parent.fileAction = 'move';
        }
    }
    exports.cutFiles = cutFiles;
    /**
     * To add class for fileType
     *
     * @param {Object} file - specifies the file.
     * @returns {string} - returns the file type.
     * @private
     */
    // eslint-disable-next-line
    function fileType(file) {
        var isFile = ej2_base_1.getValue('isFile', file);
        if (!isFile) {
            return CLS.FOLDER;
        }
        var imageFormat = ['bmp', 'dib', 'jpg', 'jpeg', 'jpe', 'jfif', 'gif', 'tif', 'tiff', 'png', 'ico'];
        var audioFormat = ['mp3', 'wav', 'aac', 'ogg', 'wma', 'aif', 'fla', 'm4a'];
        var videoFormat = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'ogg', 'avi', 'wmv', 'mp4', '3gp'];
        var knownFormat = ['css', 'exe', 'html', 'js', 'msi', 'pdf', 'pptx', 'ppt', 'rar', 'zip', 'txt', 'docx', 'doc',
            'xlsx', 'xls', 'xml', 'rtf', 'php'];
        var filetype = ej2_base_1.getValue('type', file);
        filetype = filetype.toLowerCase();
        if (filetype.indexOf('.') !== -1) {
            filetype = filetype.split('.').join('');
        }
        var iconType;
        if (imageFormat.indexOf(filetype) !== -1) {
            iconType = CLS.ICON_IMAGE;
        }
        else if (audioFormat.indexOf(filetype) !== -1) {
            iconType = CLS.ICON_MUSIC;
        }
        else if (videoFormat.indexOf(filetype) !== -1) {
            iconType = CLS.ICON_VIDEO;
        }
        else if (knownFormat.indexOf(filetype) !== -1) {
            iconType = 'e-fe-' + filetype;
        }
        else {
            iconType = 'e-fe-unknown e-fe-' + filetype;
        }
        return iconType;
    }
    exports.fileType = fileType;
    /* istanbul ignore next */
    /**
     * To get the image URL
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {Object} item - specifies the item.
     * @returns {string} - returns the image url.
     * @private
     */
    // eslint-disable-next-line
    function getImageUrl(parent, item) {
        var baseUrl = parent.ajaxSettings.getImageUrl ? parent.ajaxSettings.getImageUrl : parent.ajaxSettings.url;
        var imgUrl;
        var fileName = encodeURIComponent(ej2_base_1.getValue('name', item));
        var fPath = ej2_base_1.getValue('filterPath', item);
        if (parent.hasId) {
            var imgId = ej2_base_1.getValue('id', item);
            imgUrl = baseUrl + '?path=' + parent.path + '&id=' + imgId;
        }
        else if (!ej2_base_1.isNullOrUndefined(fPath)) {
            imgUrl = baseUrl + '?path=' + fPath.replace(/\\/g, '/') + fileName;
        }
        else {
            imgUrl = baseUrl + '?path=' + parent.path + fileName;
        }
        imgUrl = imgUrl + '&time=' + (new Date().getTime()).toString();
        var eventArgs = {
            fileDetails: [item],
            imageUrl: imgUrl
        };
        parent.trigger('beforeImageLoad', eventArgs);
        return eventArgs.imageUrl;
    }
    exports.getImageUrl = getImageUrl;
    /* istanbul ignore next */
    /**
     * Gets the full path
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {Object} data - specifies the data.
     * @param {string} path - specifies the path.
     * @returns {string} - returns the image url.
     * @private
     */
    // eslint-disable-next-line
    function getFullPath(parent, data, path) {
        var filePath = ej2_base_1.getValue(parent.hasId ? 'id' : 'name', data) + '/';
        var fPath = ej2_base_1.getValue(parent.hasId ? 'filterId' : 'filterPath', data);
        if (!ej2_base_1.isNullOrUndefined(fPath)) {
            return fPath.replace(/\\/g, '/') + filePath;
        }
        else {
            return path + filePath;
        }
    }
    exports.getFullPath = getFullPath;
    /**
     * Gets the name
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {Object} data - specifies the data.
     * @returns {string} - returns the name.
     * @private
     */
    // eslint-disable-next-line
    function getName(parent, data) {
        var name = ej2_base_1.getValue('name', data);
        var fPath = ej2_base_1.getValue('filterPath', data);
        if ((parent.breadcrumbbarModule.searchObj.element.value !== '' || parent.isFiltered) && !ej2_base_1.isNullOrUndefined(fPath)) {
            fPath = fPath.replace(/\\/g, '/');
            name = fPath.replace(parent.path, '') + name;
        }
        return name;
    }
    exports.getName = getName;
    /**
     * Gets the name
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {Object[]} items - specifies the item elements.
     * @returns {Object[]} - returns the sorted data.
     * @private
     */
    // eslint-disable-next-line
    function getSortedData(parent, items) {
        if (items.length === 0) {
            return items;
        }
        var query;
        if (parent.sortOrder !== 'None') {
            query = new ej2_data_1.Query().sortBy(parent.sortBy, parent.sortOrder.toLowerCase(), true).group('isFile');
        }
        else {
            query = new ej2_data_1.Query().group('isFile');
        }
        // eslint-disable-next-line
        var lists = new ej2_data_1.DataManager(items).executeLocal(query);
        return ej2_base_1.getValue('records', lists);
    }
    exports.getSortedData = getSortedData;
    /**
     * Gets the data object
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {string} key - specifies the key.
     * @param {string} value - specifies the value.
     * @returns {Object} - returns the sorted data.
     * @private
     */
    // eslint-disable-next-line
    function getObject(parent, key, value) {
        // eslint-disable-next-line
        var currFiles = ej2_base_1.getValue(parent.pathId[parent.pathId.length - 1], parent.feFiles);
        var query = new ej2_data_1.Query().where(key, 'equal', value);
        // eslint-disable-next-line
        var lists = new ej2_data_1.DataManager(currFiles).executeLocal(query);
        return lists[0];
    }
    exports.getObject = getObject;
    /**
     * Creates empty element
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {HTMLElement} element - specifies the element.
     * @param {ReadArgs | SearchArgs} args - specifies the args.
     * @returns {void}
     * @private
     */
    function createEmptyElement(parent, element, args) {
        var top;
        var layoutElement = ej2_base_1.select('#' + parent.element.id + CLS.LAYOUT_ID, parent.element);
        var addressBarHeight = ej2_base_1.select('#' + parent.element.id + CLS.BREADCRUMBBAR_ID, layoutElement).offsetHeight;
        top = layoutElement.offsetHeight - addressBarHeight;
        if (parent.view === 'Details') {
            top = top - ej2_base_1.select('.' + CLS.GRID_HEADER, layoutElement).offsetHeight;
        }
        if (ej2_base_1.isNullOrUndefined(element.querySelector('.' + CLS.EMPTY))) {
            var emptyDiv = ej2_base_1.createElement('div', { className: CLS.EMPTY });
            var emptyFolder = ej2_base_1.createElement('div', { className: CLS.LARGE_EMPTY_FOLDER });
            var emptyEle = ej2_base_1.createElement('div', { className: CLS.EMPTY_CONTENT });
            var dragFile = ej2_base_1.createElement('div', { className: CLS.EMPTY_INNER_CONTENT });
            if (parent.view === 'Details') {
                element.querySelector('.' + CLS.GRID_VIEW).appendChild(emptyDiv);
            }
            else {
                element.appendChild(emptyDiv);
            }
            emptyDiv.appendChild(emptyFolder);
            emptyDiv.appendChild(emptyEle);
            emptyDiv.appendChild(dragFile);
        }
        if (element.querySelector('.' + CLS.EMPTY)) {
            if (!ej2_base_1.isNullOrUndefined(args.error)) {
                element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Access-Denied');
                element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Access-Details');
            }
            else if (parent.isFiltered) {
                element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Empty');
                element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Filter-Key');
            }
            else if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
                element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Search-Empty');
                element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'Search-Key');
            }
            else {
                element.querySelector('.' + CLS.EMPTY_CONTENT).innerHTML = getLocaleText(parent, 'Folder-Empty');
                element.querySelector('.' + CLS.EMPTY_INNER_CONTENT).innerHTML = getLocaleText(parent, 'File-Upload');
            }
        }
        var eDiv = ej2_base_1.select('.' + CLS.EMPTY, element);
        top = (top - eDiv.offsetHeight) / 2;
        eDiv.style.marginTop = top + 'px';
    }
    exports.createEmptyElement = createEmptyElement;
    /**
     * Gets the directories
     *
     * @param {Object[]} files - specifies the file object.
     * @returns {Object[]} - returns the sorted data.
     * @private
     */
    // eslint-disable-next-line
    function getDirectories(files) {
        return new ej2_data_1.DataManager(files).executeLocal(new ej2_data_1.Query().where(events.isFile, 'equal', false, false));
    }
    exports.getDirectories = getDirectories;
    /**
     * set the Node ID
     *
     * @param {ReadArgs} result - specifies the result.
     * @param {string} rootId - specifies the rootId.
     * @returns {void}
     * @private
     */
    function setNodeId(result, rootId) {
        // eslint-disable-next-line
        var dirs = getDirectories(result.files);
        for (var i = 0, len = dirs.length; i < len; i++) {
            ej2_base_1.setValue('_fm_id', rootId + '_' + i, dirs[i]);
        }
    }
    exports.setNodeId = setNodeId;
    /**
     * set the date object
     *
     * @param {Object[]} args - specifies the file object.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    function setDateObject(args) {
        for (var i = 0; i < args.length; i++) {
            ej2_base_1.setValue('_fm_created', new Date(ej2_base_1.getValue('dateCreated', args[i])), args[i]);
            ej2_base_1.setValue('_fm_modified', new Date(ej2_base_1.getValue('dateModified', args[i])), args[i]);
        }
    }
    exports.setDateObject = setDateObject;
    /**
     * get the locale text
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {string} text - specifies the text.
     * @returns {string} - returns the locale text.
     * @private
     */
    function getLocaleText(parent, text) {
        var locale = parent.localeObj.getConstant(text);
        return (locale === '') ? text : locale;
    }
    exports.getLocaleText = getLocaleText;
    /**
     * get the CSS class
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {string} css - specifies the css.
     * @returns {string} - returns the css classes.
     * @private
     */
    function getCssClass(parent, css) {
        var cssClass = parent.cssClass;
        cssClass = (ej2_base_1.isNullOrUndefined(cssClass) || cssClass === '') ? css : (cssClass + ' ' + css);
        return cssClass;
    }
    exports.getCssClass = getCssClass;
    /**
     * sort on click
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {MenuEventArgs} args - specifies the menu event arguements.
     * @returns {void}
     * @private
     */
    function sortbyClickHandler(parent, args) {
        var tick;
        parent.isSortByClicked = true;
        if (args.item.id.indexOf('ascending') !== -1 || args.item.id.indexOf('descending') !== -1 || args.item.id.indexOf('none') !== -1) {
            tick = true;
        }
        else {
            tick = false;
        }
        if (!tick) {
            parent.sortBy = getSortField(args.item.id);
        }
        else {
            parent.sortOrder = getSortField(args.item.id);
        }
        parent.itemData = [getPathObject(parent)];
        if (parent.view === 'Details') {
            if (parent.isMobile) {
                updateLayout(parent, 'Details');
            }
            else {
                parent.notify(events.sortColumn, { module: 'detailsview' });
            }
        }
        if (parent.view === 'LargeIcons') {
            updateLayout(parent, 'LargeIcons');
        }
        parent.notify(events.sortByChange, {});
    }
    exports.sortbyClickHandler = sortbyClickHandler;
    /**
     * Gets the sorted fields
     *
     * @param {string} id - specifies the id.
     * @returns {string} - returns the sorted fields
     * @private
     */
    function getSortField(id) {
        var text = id.substring(id.lastIndexOf('_') + 1);
        var field = text;
        switch (text) {
            case 'date':
                field = '_fm_modified';
                break;
            case 'ascending':
                field = 'Ascending';
                break;
            case 'descending':
                field = 'Descending';
                break;
            case 'none':
                field = 'None';
                break;
        }
        return field;
    }
    exports.getSortField = getSortField;
    /**
     * Sets the next path
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {string} path - specifies the path.
     * @returns {void}
     * @private
     */
    function setNextPath(parent, path) {
        var currfolders = path.split('/');
        var folders = parent.originalPath.split('/');
        // eslint-disable-next-line
        var root = ej2_base_1.getValue(parent.pathId[0], parent.feParent);
        var key = ej2_base_1.isNullOrUndefined(ej2_base_1.getValue('id', root)) ? 'name' : 'id';
        for (var i = currfolders.length - 1, len = folders.length - 1; i < len; i++) {
            var eventName = (folders[i + 1] === '') ? events.finalizeEnd : events.initialEnd;
            var newPath = (folders[i] === '') ? '/' : (parent.path + folders[i] + '/');
            // eslint-disable-next-line
            var data = getObject(parent, key, folders[i]);
            var id = ej2_base_1.getValue('_fm_id', data);
            parent.setProperties({ path: newPath }, true);
            parent.pathId.push(id);
            parent.itemData = [data];
            parent.pathNames.push(ej2_base_1.getValue('name', data));
            operations_1.read(parent, eventName, parent.path);
            break;
        }
    }
    exports.setNextPath = setNextPath;
    /**
     * Opens the searched folder
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {Object} data - specifies the data
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    function openSearchFolder(parent, data) {
        parent.notify(events.clearPathInit, { selectedNode: parent.pathId[parent.pathId.length - 1] });
        parent.originalPath = getFullPath(parent, data, parent.path);
        operations_1.read(parent, (parent.path !== parent.originalPath) ? events.initialEnd : events.finalizeEnd, parent.path);
    }
    exports.openSearchFolder = openSearchFolder;
    /**
     * Paste handling function
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function pasteHandler(parent) {
        parent.isDragDrop = false;
        if (parent.selectedNodes.length !== 0 && parent.enablePaste) {
            var path = (parent.folderPath === '') ? parent.path : parent.folderPath;
            // eslint-disable-next-line
            var subFolder = validateSubFolder(parent, parent.actionRecords, path, parent.path);
            if (!subFolder) {
                if ((parent.fileAction === 'move' && parent.targetPath !== path) || parent.fileAction === 'copy') {
                    parent.notify(events.pasteInit, {});
                    operations_1.paste(parent, parent.targetPath, parent.selectedNodes, path, parent.fileAction, [], parent.actionRecords);
                }
                else {
                    parent.enablePaste = false;
                    parent.notify(events.hidePaste, {});
                    removeBlur(parent);
                }
            }
        }
    }
    exports.pasteHandler = pasteHandler;
    /**
     * Validates the sub folders
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @param {'{ [key: string]: Object; }[]'} data - specifies the data.
     * @param {string} dropPath - specifies the drop path.
     * @param {string} dragPath - specifies the drag path.
     * @returns {boolean} - returns the validated sub folder.
     * @private
     */
    // eslint-disable-next-line
    function validateSubFolder(parent, data, dropPath, dragPath) {
        var subFolder = false;
        for (var i = 0; i < data.length; i++) {
            if (!ej2_base_1.getValue('isFile', data[i])) {
                var tempTarget = getFullPath(parent, data[i], dragPath);
                if (dropPath.indexOf(tempTarget) === 0) {
                    var result = {
                        files: null,
                        error: {
                            code: '402',
                            message: getLocaleText(parent, 'Sub-Folder-Error'),
                            fileExists: null
                        }
                    };
                    dialog_1.createDialog(parent, 'Error', result);
                    subFolder = true;
                    break;
                }
            }
            else {
                var srcData = parent.dragNodes[i];
                var len = 0;
                if (srcData) {
                    len = srcData.lastIndexOf('/');
                }
                var path = '';
                if (len > 0) {
                    path = dragPath + srcData.substring(0, len + 1);
                }
                if (path === dropPath) {
                    var result = {
                        files: null,
                        error: {
                            code: '402',
                            message: getLocaleText(parent, 'Same-Folder-Error'),
                            fileExists: null
                        }
                    };
                    dialog_1.createDialog(parent, 'Error', result);
                    subFolder = true;
                    break;
                }
            }
        }
        return subFolder;
    }
    exports.validateSubFolder = validateSubFolder;
    /**
     * Validates the drop handler
     *
     * @param {IFileManager} parent - specifies the parent element.
     * @returns {void}
     * @private
     */
    function dropHandler(parent) {
        parent.isDragDrop = true;
        if (parent.dragData.length !== 0) {
            parent.dragPath = parent.dragPath.replace(/\\/g, '/');
            parent.dropPath = parent.dropPath.replace(/\\/g, '/');
            var subFolder = validateSubFolder(parent, parent.dragData, parent.dropPath, parent.dragPath);
            if (!subFolder && (parent.dragPath !== parent.dropPath)) {
                parent.itemData = [parent.dropData];
                operations_1.paste(parent, parent.dragPath, parent.dragNodes, parent.dropPath, 'move', [], parent.dragData);
                parent.notify(events.pasteInit, {});
            }
        }
    }
    exports.dropHandler = dropHandler;
    /**
     * Gets the parent path
     *
     * @param {string} oldPath - specifies the old path.
     * @returns {string} - returns the parent path.
     * @private
     */
    function getParentPath(oldPath) {
        var path = oldPath.split('/');
        var newPath = path[0] + '/';
        for (var i = 1; i < path.length - 2; i++) {
            newPath += path[i] + '/';
        }
        return newPath;
    }
    exports.getParentPath = getParentPath;
    /**
     * Gets the directory path
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {ReadArgs} args - returns the read arguements.
     * @returns {string} - returns the directory path
     * @private
     */
    function getDirectoryPath(parent, args) {
        var filePath = ej2_base_1.getValue(parent.hasId ? 'id' : 'name', args.cwd) + '/';
        var fPath = ej2_base_1.getValue(parent.hasId ? 'filterId' : 'filterPath', args.cwd);
        if (!ej2_base_1.isNullOrUndefined(fPath)) {
            if (fPath === '') {
                return parent.hasId ? filePath : '/';
            }
            return fPath.replace(/\\/g, '/') + filePath;
        }
        else {
            return parent.path + filePath;
        }
    }
    exports.getDirectoryPath = getDirectoryPath;
    /**
     * Gets the do paste path
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {string} operation - specifies the operations.
     * @param {ReadArgs} result - returns the result.
     * @returns {void}
     * @private
     */
    function doPasteUpdate(parent, operation, result) {
        if (operation === 'move') {
            if (!parent.isDragDrop) {
                parent.enablePaste = false;
                parent.notify(events.hidePaste, {});
                parent.notify(events.cutEnd, result);
            }
            else {
                parent.notify(events.dragEnd, result);
            }
        }
        if (parent.duplicateItems.length === 0) {
            parent.pasteNodes = [];
        }
        var flag = false;
        for (var count = 0; (count < result.files.length) && !flag; count++) {
            parent.pasteNodes.push(result.files[count][parent.hasId ? 'id' : 'name']);
            if (parent.isDragDrop) {
                parent.droppedObjects.push(result.files[count]);
            }
        }
        parent.duplicateItems = [];
        parent.duplicateRecords = [];
        if (parent.isDragDrop && !parent.isPasteError) {
            parent.isDropEnd = true;
        }
        else {
            parent.isDropEnd = false;
        }
        if (!parent.isDragDrop || (parent.path === parent.dragPath) || (parent.path === parent.dropPath)
            || parent.isSearchDrag) {
            parent.isPathDrag = false;
            operations_1.read(parent, events.pasteEnd, parent.path);
        }
        else {
            readDropPath(parent);
        }
        parent.trigger('success', { action: operation, result: result });
    }
    exports.doPasteUpdate = doPasteUpdate;
    /**
     * Reads the drop path
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function readDropPath(parent) {
        var pathId = ej2_base_1.getValue('_fm_id', parent.dropData);
        parent.expandedId = pathId;
        parent.itemData = [parent.dropData];
        if (parent.isPathDrag) {
            parent.notify(events.pathDrag, parent.itemData);
        }
        else {
            if (parent.navigationpaneModule) {
                var node = ej2_base_1.select('[data-uid="' + pathId + '"]', parent.navigationpaneModule.treeObj.element);
                updatePath(node, parent.dropData, parent);
            }
            operations_1.read(parent, events.dropPath, parent.dropPath);
        }
    }
    exports.readDropPath = readDropPath;
    /**
     * Gets the duplicated path
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {string} name - specifies the name.
     * @returns {object} - returns the duplicated path.
     * @private
     */
    // eslint-disable-next-line
    function getDuplicateData(parent, name) {
        // eslint-disable-next-line
        var data = null;
        // eslint-disable-next-line
        var records = parent.isDragDrop ? parent.dragData : parent.actionRecords;
        for (var i = 0; i < records.length; i++) {
            if (ej2_base_1.getValue('name', records[i]) === name) {
                data = records[i];
                break;
            }
        }
        return data;
    }
    exports.getDuplicateData = getDuplicateData;
    /**
     * Gets the create the virtual drag element
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function createVirtualDragElement(parent) {
        parent.isSearchDrag = false;
        if (parent.breadcrumbbarModule.searchObj.element.value !== '') {
            parent.isSearchDrag = true;
        }
        if (parent.activeModule !== 'navigationpane') {
            parent.dragNodes = [];
            var i = 0;
            while (i < parent.selectedItems.length) {
                parent.dragNodes.push(parent.selectedItems[i]);
                i++;
            }
            if (parent.selectedItems.length === 0 && parent.dragData && parent.dragData.length === 1) {
                parent.dragNodes.push(getItemName(parent, parent.dragData[0]));
            }
        }
        var cloneIcon = parent.createElement('div', {
            className: 'e-fe-icon ' + fileType(parent.dragData[0])
        });
        var cloneName = parent.createElement('div', {
            className: 'e-fe-name',
            innerHTML: parent.dragData[0].name
        });
        var virtualEle = parent.createElement('div', {
            className: 'e-fe-content'
        });
        virtualEle.appendChild(cloneIcon);
        virtualEle.appendChild(cloneName);
        var ele = parent.createElement('div', {
            className: CLS.CLONE
        });
        ele.appendChild(virtualEle);
        if (parent.dragNodes.length > 1) {
            var badge = parent.createElement('span', {
                className: 'e-fe-count',
                innerHTML: (parent.dragNodes.length).toString(10)
            });
            ele.appendChild(badge);
        }
        parent.virtualDragElement = ele;
        parent.element.appendChild(parent.virtualDragElement);
    }
    exports.createVirtualDragElement = createVirtualDragElement;
    /**
     * Drops the stop handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {DragEventArgs} args - specifies the drag event arguements.
     * @returns {void}
     * @private
     */
    function dragStopHandler(parent, args) {
        var dragArgs = args;
        dragArgs.cancel = false;
        if (parent.treeExpandTimer != null) {
            window.clearTimeout(parent.treeExpandTimer);
            parent.treeExpandTimer = null;
        }
        removeDropTarget(parent);
        parent.element.classList.remove('e-fe-drop', 'e-no-drop');
        removeBlur(parent);
        parent.uploadObj.dropArea = ej2_base_1.select('#' + parent.element.id + CLS.CONTENT_ID, parent.element);
        var virtualEle = ej2_base_1.select('.' + CLS.CLONE, parent.element);
        if (virtualEle) {
            ej2_base_2.detach(virtualEle);
        }
        getTargetModule(parent, args.target);
        parent.notify(events.dropInit, args);
        removeBlur(parent, 'hover');
        dragArgs.fileDetails = parent.dragData;
        parent.trigger('fileDragStop', dragArgs, function (dragArgs) {
            if (!dragArgs.cancel && !ej2_base_1.isNullOrUndefined(parent.targetModule) && parent.targetModule !== '' && parent.dragCount > 2) {
                dropHandler(parent);
            }
            parent.dragCount = 0;
        });
    }
    exports.dragStopHandler = dragStopHandler;
    /**
     * Drag the start handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {'DragEventArgs'} args - specifies the drag event arguements.
     * @param {Draggable} dragObj - specifies the drag event arguements.
     * @returns {void}
     * @private
     */
    function dragStartHandler(parent, args, dragObj) {
        var dragArgs = args;
        dragArgs.cancel = false;
        dragArgs.fileDetails = parent.dragData;
        parent.dragCount = 0;
        parent.droppedObjects = [];
        if (!parent.allowDragAndDrop || ((parent.activeModule === 'navigationpane') &&
            (ej2_base_2.closest(args.element, 'li').getAttribute('data-uid') === parent.pathId[0]))) {
            dragArgs.cancel = true;
        }
        if ((parent.activeModule === 'navigationpane') &&
            (parent.pathId.indexOf(ej2_base_2.closest(args.element, 'li').getAttribute('data-uid')) !== -1)) {
            parent.isPathDrag = true;
        }
        else {
            parent.isPathDrag = false;
        }
        removeBlur(parent);
        if (dragArgs.cancel) {
            dragObj.intDestroy(args.event);
            dragCancel(parent);
        }
        else if (!dragArgs.cancel) {
            var i = 0;
            while (i < parent.activeElements.length) {
                addBlur(parent.activeElements[i]);
                i++;
            }
            parent.trigger('fileDragStart', dragArgs, function (dragArgs) {
                if (dragArgs.cancel) {
                    dragObj.intDestroy(args.event);
                    dragCancel(parent);
                }
                else {
                    parent.uploadObj.dropArea = null;
                }
            });
        }
    }
    exports.dragStartHandler = dragStartHandler;
    /**
     * Drag the cancel handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function dragCancel(parent) {
        removeBlur(parent);
        var virtualEle = ej2_base_1.select('.' + CLS.CLONE, parent.element);
        if (virtualEle) {
            ej2_base_2.detach(virtualEle);
        }
    }
    exports.dragCancel = dragCancel;
    /**
     * Remove drop target handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function removeDropTarget(parent) {
        removeItemClass(parent, CLS.DROP_FOLDER);
        removeItemClass(parent, CLS.DROP_FILE);
    }
    exports.removeDropTarget = removeDropTarget;
    /**
     * Remove item class handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {string} value - specifies the value.
     * @returns {void}
     * @private
     */
    function removeItemClass(parent, value) {
        var ele = parent.element.querySelectorAll('.' + value);
        for (var i = 0; i < ele.length; i++) {
            ele[i].classList.remove(value);
        }
    }
    exports.removeItemClass = removeItemClass;
    /**
     * Dragging handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {DragEventArgs} args - specifies the arguements.
     * @returns {void}
     * @private
     */
    function draggingHandler(parent, args) {
        var dragArgs = args;
        dragArgs.fileDetails = parent.dragData;
        var canDrop = false;
        getTargetModule(parent, args.target);
        removeDropTarget(parent);
        if (parent.treeExpandTimer != null) {
            window.clearTimeout(parent.treeExpandTimer);
            parent.treeExpandTimer = null;
        }
        removeBlur(parent, 'hover');
        var node = null;
        if (parent.targetModule === 'navigationpane') {
            node = ej2_base_2.closest(args.target, 'li');
            node.classList.add(CLS.HOVER, CLS.DROP_FOLDER);
            canDrop = true;
            /* istanbul ignore next */
            parent.treeExpandTimer = window.setTimeout(function () { parent.notify(events.dragging, args); }, 800);
        }
        else if (parent.targetModule === 'detailsview') {
            node = ej2_base_2.closest(args.target, 'tr');
            if (node && node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
                node.classList.add(CLS.DROP_FOLDER);
            }
            else if (node && !node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
                node.classList.add(CLS.DROP_FILE);
            }
            canDrop = true;
        }
        else if (parent.targetModule === 'largeiconsview') {
            node = ej2_base_2.closest(args.target, 'li');
            if (node && node.querySelector('.' + CLS.FOLDER) && !node.classList.contains(CLS.BLUR)) {
                node.classList.add(CLS.HOVER, CLS.DROP_FOLDER);
            }
            canDrop = true;
            /* istanbul ignore next */
        }
        else if (parent.targetModule === 'breadcrumbbar') {
            canDrop = true;
        }
        parent.element.classList.remove('e-fe-drop', 'e-no-drop');
        parent.element.classList.add(canDrop ? 'e-fe-drop' : 'e-no-drop');
        parent.dragCount = parent.dragCount + 1;
        parent.trigger('fileDragging', dragArgs);
    }
    exports.draggingHandler = draggingHandler;
    /**
     * Object to string handler
     *
     * @param {Object} data - specifies the data.
     * @returns {string} returns string converted from Object.
     * @private
     */
    // Ignored the message key value in permission object
    // eslint-disable-next-line
    function objectToString(data) {
        var str = '';
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== 'message') {
                str += (i === 0 ? '' : ', ') + keys[i] + ': ' + ej2_base_1.getValue(keys[i], data);
            }
        }
        return str;
    }
    exports.objectToString = objectToString;
    /**
     * Get item name handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {Object} data - specifies the data.
     * @returns {string} returns the item name.
     * @private
     */
    // eslint-disable-next-line
    function getItemName(parent, data) {
        if (parent.hasId) {
            return ej2_base_1.getValue('id', data);
        }
        return getName(parent, data);
    }
    exports.getItemName = getItemName;
    /**
     * Get item name handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {Object} data - specifies the data.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    function updateRenamingData(parent, data) {
        parent.itemData = [data];
        parent.currentItemText = ej2_base_1.getValue('name', data);
        parent.isFile = ej2_base_1.getValue('isFile', data);
        parent.filterPath = ej2_base_1.getValue('filterPath', data);
    }
    exports.updateRenamingData = updateRenamingData;
    /**
     * Get item name handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function doRename(parent) {
        if (!hasEditAccess(parent.itemData[0])) {
            createDeniedDialog(parent, parent.itemData[0], events.permissionEdit);
        }
        else {
            dialog_1.createDialog(parent, 'Rename');
        }
    }
    exports.doRename = doRename;
    /* istanbul ignore next */
    /**
     * Download handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function doDownload(parent) {
        // eslint-disable-next-line
        var items = parent.itemData;
        for (var i = 0; i < items.length; i++) {
            if (!hasDownloadAccess(items[i])) {
                createDeniedDialog(parent, items[i], events.permissionDownload);
                return;
            }
        }
        if (parent.selectedItems.length > 0) {
            operations_1.Download(parent, parent.path, parent.selectedItems);
        }
    }
    exports.doDownload = doDownload;
    /**
     * Delete Files handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {Object[]} data - specifies the data.
     * @param {string[]} newIds - specifies the new Ids.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    function doDeleteFiles(parent, data, newIds) {
        for (var i = 0; i < data.length; i++) {
            if (!hasEditAccess(data[i])) {
                createDeniedDialog(parent, data[i], events.permissionEdit);
                return;
            }
        }
        parent.itemData = data;
        operations_1.Delete(parent, newIds, parent.path, 'delete');
    }
    exports.doDeleteFiles = doDeleteFiles;
    /* istanbul ignore next */
    /**
     * Download files handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {Object[]} data - specifies the data.
     * @param {string[]} newIds - specifies the new Ids.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    function doDownloadFiles(parent, data, newIds) {
        for (var i = 0; i < data.length; i++) {
            if (!hasDownloadAccess(data[i])) {
                createDeniedDialog(parent, data[i], events.permissionDownload);
                return;
            }
        }
        parent.itemData = data;
        if (newIds.length > 0) {
            operations_1.Download(parent, parent.path, newIds);
        }
    }
    exports.doDownloadFiles = doDownloadFiles;
    /**
     * Download files handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @param {Object} data - specifies the data.
     * @param {string} action - specifies the actions.
     * @returns {void}
     * @private
     */
    // eslint-disable-next-line
    function createDeniedDialog(parent, data, action) {
        var message = ej2_base_1.getValue('message', ej2_base_1.getValue('permission', data));
        if (message === '') {
            message = getLocaleText(parent, 'Access-Message').replace('{0}', ej2_base_1.getValue('name', data)).replace('{1}', action);
        }
        var response = {
            error: {
                code: '401',
                fileExists: null,
                message: message
            }
        };
        dialog_1.createDialog(parent, 'Error', response);
    }
    exports.createDeniedDialog = createDeniedDialog;
    /**
     * Get Access Classes
     *
     * @param {Object} data - specifies the data.
     * @returns {string} - returns accesses classes.
     * @private
     */
    // eslint-disable-next-line
    function getAccessClass(data) {
        return !hasReadAccess(data) ? 'e-fe-locked e-fe-hidden' : 'e-fe-locked';
    }
    exports.getAccessClass = getAccessClass;
    /**
     * Check read access handler
     *
     * @param {Object} data - specifies the data.
     * @returns {boolean} - returns read access.
     * @private
     */
    // eslint-disable-next-line
    function hasReadAccess(data) {
        // eslint-disable-next-line
        var permission = ej2_base_1.getValue('permission', data);
        return (permission && !ej2_base_1.getValue('read', permission)) ? false : true;
    }
    exports.hasReadAccess = hasReadAccess;
    /**
     * Check edit access handler
     *
     * @param {Object} data - specifies the data.
     * @returns {boolean} - returns edit access.
     * @private
     */
    // eslint-disable-next-line
    function hasEditAccess(data) {
        // eslint-disable-next-line
        var permission = ej2_base_1.getValue('permission', data);
        return permission ? ((ej2_base_1.getValue('read', permission) && ej2_base_1.getValue('write', permission))) : true;
    }
    exports.hasEditAccess = hasEditAccess;
    /**
     * Check content access handler
     *
     * @param {Object} data - specifies the data.
     * @returns {boolean} - returns content access.
     * @private
     */
    // eslint-disable-next-line
    function hasContentAccess(data) {
        // eslint-disable-next-line
        var permission = ej2_base_1.getValue('permission', data);
        return permission ? ((ej2_base_1.getValue('read', permission) && ej2_base_1.getValue('writeContents', permission))) : true;
    }
    exports.hasContentAccess = hasContentAccess;
    /**
     * Check upload access handler
     *
     * @param {Object} data - specifies the data.
     * @returns {boolean} - returns upload access.
     * @private
     */
    // eslint-disable-next-line
    function hasUploadAccess(data) {
        // eslint-disable-next-line
        var permission = ej2_base_1.getValue('permission', data);
        return permission ? ((ej2_base_1.getValue('read', permission) && ej2_base_1.getValue('upload', permission))) : true;
    }
    exports.hasUploadAccess = hasUploadAccess;
    /**
     * Check download access handler
     *
     * @param {Object} data - specifies the data.
     * @returns {boolean} - returns download access.
     * @private
     */
    // eslint-disable-next-line
    function hasDownloadAccess(data) {
        // eslint-disable-next-line
        var permission = ej2_base_1.getValue('permission', data);
        return permission ? ((ej2_base_1.getValue('read', permission) && ej2_base_1.getValue('download', permission))) : true;
    }
    exports.hasDownloadAccess = hasDownloadAccess;
    /**
     * Create new folder handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function createNewFolder(parent) {
        // eslint-disable-next-line
        var details = parent.itemData[0];
        if (!hasContentAccess(details)) {
            createDeniedDialog(parent, details, events.permissionEditContents);
        }
        else {
            dialog_1.createDialog(parent, 'NewFolder');
        }
    }
    exports.createNewFolder = createNewFolder;
    /**
     * Upload item handler
     *
     * @param {IFileManager} parent - specifies the parent.
     * @returns {void}
     * @private
     */
    function uploadItem(parent) {
        // eslint-disable-next-line
        var details = parent.itemData[0];
        if (!hasUploadAccess(details)) {
            createDeniedDialog(parent, details, events.permissionUpload);
        }
        else {
            var eleId = '#' + parent.element.id + CLS.UPLOAD_ID;
            var uploadEle = document.querySelector(eleId);
            uploadEle.click();
        }
    }
    exports.uploadItem = uploadItem;
});
