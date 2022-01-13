define(["require", "exports", "@syncfusion/ej2-navigations", "@syncfusion/ej2-base", "@syncfusion/ej2-base", "@syncfusion/ej2-data", "../base/constant", "../base/classes", "../common/operations", "../pop-up/dialog", "../common/utility", "../common/index", "../common/index", "../common/index"], function (require, exports, ej2_navigations_1, ej2_base_1, ej2_base_2, ej2_data_1, events, CLS, operations_1, dialog_1, utility_1, index_1, index_2, index_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * NavigationPane module
     */
    var NavigationPane = /** @class */ (function () {
        /**
         * Constructor for the TreeView module
         *
         * @param {IFileManager} parent - specifies the parent element.
         * @hidden
         */
        function NavigationPane(parent) {
            this.removeNodes = [];
            this.moveNames = [];
            this.expandTree = false;
            this.isDrag = false;
            this.isPathDragged = false;
            this.isRenameParent = false;
            this.isRightClick = false;
            this.renameParent = null;
            this.parent = parent;
            this.addEventListener();
            this.keyConfigs = {
                altEnter: 'alt+enter',
                esc: 'escape',
                del: 'delete',
                ctrlX: 'ctrl+x',
                ctrlC: 'ctrl+c',
                ctrlV: 'ctrl+v',
                ctrlShiftN: 'ctrl+shift+n',
                shiftF10: 'shift+F10',
                f2: 'f2'
            };
        }
        NavigationPane.prototype.onInit = function () {
            if (!ej2_base_1.isNullOrUndefined(this.treeObj)) {
                return;
            }
            // eslint-disable-next-line
            var rootData = ej2_base_1.getValue(this.parent.pathId[0], this.parent.feParent);
            ej2_base_1.setValue('_fm_icon', 'e-fe-folder', rootData);
            // eslint-disable-next-line
            var attr = {};
            var id = ej2_base_1.getValue('id', rootData);
            if (!ej2_base_1.isNullOrUndefined(id)) {
                ej2_base_1.setValue('data-id', id, attr);
            }
            if (!index_3.hasEditAccess(rootData)) {
                ej2_base_1.setValue('class', index_3.getAccessClass(rootData), attr);
            }
            if (!ej2_base_1.isNullOrUndefined(attr)) {
                ej2_base_1.setValue('_fm_htmlAttr', attr, rootData);
            }
            this.treeObj = new ej2_navigations_1.TreeView({
                fields: {
                    dataSource: [rootData], id: '_fm_id', parentID: '_fm_pId', expanded: '_fm_expanded', selected: '_fm_selected', text: 'name',
                    hasChildren: 'hasChild', iconCss: '_fm_icon', htmlAttributes: '_fm_htmlAttr', tooltip: 'name'
                },
                enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
                nodeSelected: this.onNodeSelected.bind(this),
                nodeExpanding: this.onNodeExpand.bind(this),
                nodeClicked: this.onNodeClicked.bind(this),
                allowEditing: true,
                nodeEditing: this.onNodeEditing.bind(this),
                drawNode: this.onDrowNode.bind(this),
                enableRtl: this.parent.enableRtl,
                dataBound: this.addDragDrop.bind(this)
            });
            this.treeObj.isStringTemplate = true;
            this.treeObj.appendTo('#' + this.parent.element.id + CLS.TREE_ID);
            this.wireEvents();
        };
        NavigationPane.prototype.addDragDrop = function () {
            var _this = this;
            if (!this.parent.isMobile && this.treeObj) {
                if (this.parent.allowDragAndDrop) {
                    if (this.dragObj) {
                        this.dragObj.destroy();
                    }
                    this.dragObj = new ej2_base_1.Draggable(this.treeObj.element, {
                        cursorAt: this.parent.dragCursorPosition,
                        dragTarget: '.' + CLS.FULLROW,
                        distance: 5,
                        dragArea: this.parent.element,
                        drag: index_1.draggingHandler.bind(this, this.parent),
                        dragStart: function (args) {
                            index_1.dragStartHandler(_this.parent, args, _this.dragObj);
                        },
                        dragStop: index_1.dragStopHandler.bind(this, this.parent),
                        enableTailMode: true,
                        enableAutoScroll: true,
                        helper: this.dragHelper.bind(this)
                    });
                }
                else if (!this.parent.allowDragAndDrop && this.dragObj) {
                    this.dragObj.destroy();
                }
            }
        };
        NavigationPane.prototype.dragHelper = function (args) {
            var dragTarget = args.sender.target;
            if (!dragTarget.classList.contains(CLS.FULLROW)) {
                return null;
            }
            var dragLi = ej2_base_2.closest(dragTarget, 'li');
            this.parent.dragPath = '';
            this.parent.dragData = [];
            this.parent.activeElements = [];
            this.parent.activeElements = [dragLi];
            this.parent.dragNodes = [];
            index_1.getModule(this.parent, dragLi);
            // eslint-disable-next-line
            this.parent.dragData = this.getTreeData(dragLi);
            this.parent.dragPath = this.getDragPath(dragLi, this.parent.dragData[0].name);
            this.parent.dragNodes.push(this.parent.dragData[0].name);
            index_1.createVirtualDragElement(this.parent);
            return this.parent.virtualDragElement;
        };
        NavigationPane.prototype.getDragPath = function (dragLi, text) {
            var path = this.getDropPath(dragLi, text);
            return index_2.getParentPath(path);
        };
        NavigationPane.prototype.getDropPath = function (node, text) {
            var id = node.getAttribute('data-id');
            var newText = this.parent.hasId ? id : text;
            return utility_1.getPath(node, newText, this.parent.hasId);
        };
        NavigationPane.prototype.onDrowNode = function (args) {
            var eventArgs = {
                element: args.node,
                fileDetails: args.nodeData,
                module: 'NavigationPane'
            };
            this.parent.trigger('fileLoad', eventArgs);
        };
        // eslint-disable-next-line
        NavigationPane.prototype.addChild = function (files, target, prevent) {
            // eslint-disable-next-line
            var directories = utility_1.getDirectories(files);
            if (directories.length > 0) {
                var length_1 = 0;
                // eslint-disable-next-line
                var folders = directories;
                while (length_1 < directories.length) {
                    // eslint-disable-next-line
                    folders[length_1]._fm_icon = 'e-fe-folder';
                    // eslint-disable-next-line
                    var attr = {};
                    var id = ej2_base_1.getValue('id', folders[length_1]);
                    if (!ej2_base_1.isNullOrUndefined(id)) {
                        ej2_base_1.setValue('data-id', id, attr);
                    }
                    if (!index_3.hasEditAccess(folders[length_1])) {
                        ej2_base_1.setValue('class', index_3.getAccessClass(folders[length_1]), attr);
                    }
                    if (!ej2_base_1.isNullOrUndefined(attr)) {
                        ej2_base_1.setValue('_fm_htmlAttr', attr, folders[length_1]);
                    }
                    length_1++;
                }
                // eslint-disable-next-line
                this.treeObj.addNodes(directories, target, null, prevent);
            }
        };
        NavigationPane.prototype.onNodeSelected = function (args) {
            if (this.parent.breadcrumbbarModule && this.parent.breadcrumbbarModule.searchObj && !this.renameParent) {
                this.parent.breadcrumbbarModule.searchObj.element.value = '';
                this.parent.isFiltered = false;
            }
            this.parent.searchedItems = [];
            if (!args.isInteracted && !this.isRightClick && !this.isPathDragged && !this.isRenameParent) {
                return;
            }
            this.activeNode = args.node;
            this.parent.activeModule = 'navigationpane';
            // eslint-disable-next-line
            var nodeData = this.getTreeData(ej2_base_1.getValue('id', args.nodeData));
            if (!this.renameParent) {
                var eventArgs = { cancel: false, fileDetails: nodeData[0], module: 'NavigationPane' };
                delete eventArgs.cancel;
                this.parent.trigger('fileOpen', eventArgs);
            }
            this.parent.selectedItems = [];
            this.parent.itemData = nodeData;
            utility_1.updatePath(args.node, this.parent.itemData[0], this.parent);
            this.expandNodeTarget = null;
            if (args.node.querySelector('.' + CLS.ICONS) && args.node.querySelector('.' + CLS.LIST_ITEM) === null) {
                this.expandNodeTarget = 'add';
            }
            operations_1.read(this.parent, this.isPathDragged ? events.pasteEnd : events.pathChanged, this.parent.path);
            this.parent.visitedItem = args.node;
            this.isPathDragged = this.isRenameParent = this.isRightClick = false;
        };
        /* istanbul ignore next */
        // eslint-disable-next-line
        NavigationPane.prototype.onPathDrag = function (args) {
            this.isPathDragged = true;
            this.selectResultNode(args[0]);
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onNodeExpand = function (args) {
            if (!args.isInteracted && !this.isDrag) {
                return;
            }
            if (args.node.querySelector('.' + CLS.LIST_ITEM) === null) {
                var text = ej2_base_1.getValue('text', args.nodeData);
                var id = args.node.getAttribute('data-id');
                var isId = ej2_base_1.isNullOrUndefined(id) ? false : true;
                var newText = ej2_base_1.isNullOrUndefined(id) ? text : id;
                var path = utility_1.getPath(args.node, newText, isId);
                this.expandNodeTarget = args.node.getAttribute('data-uid');
                this.parent.expandedId = this.expandNodeTarget;
                this.parent.itemData = this.getTreeData(ej2_base_1.getValue('id', args.nodeData));
                operations_1.read(this.parent, events.nodeExpand, path);
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onNodeExpanded = function (args) {
            this.addChild(args.files, this.expandNodeTarget, false);
            this.parent.expandedId = null;
        };
        NavigationPane.prototype.onNodeClicked = function (args) {
            this.parent.activeModule = 'navigationpane';
            this.activeNode = args.node;
            if ((args.event.which === 3) && (args.node.getAttribute('data-uid') !== this.treeObj.selectedNodes[0])) {
                this.isRightClick = true;
                this.treeObj.selectedNodes = [args.node.getAttribute('data-uid')];
            }
            else if (args.node.getAttribute('data-uid') === this.treeObj.selectedNodes[0] && this.parent.selectedItems.length !== 0) {
                this.parent.setProperties({ selectedItems: [] }, true);
                var layout = (this.parent.view === 'LargeIcons') ? 'largeiconsview' : 'detailsview';
                this.parent.notify(events.modelChanged, { module: layout, newProp: { selectedItems: [] } });
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onNodeEditing = function (args) {
            if (!ej2_base_1.isNullOrUndefined(args.innerHtml)) {
                args.cancel = true;
            }
        };
        NavigationPane.prototype.onPathChanged = function (args) {
            this.parent.isCut = false;
            // eslint-disable-next-line
            var currFiles = ej2_base_1.getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feFiles);
            if (this.expandNodeTarget === 'add') {
                var sNode = ej2_base_1.select('[data-uid="' + this.treeObj.selectedNodes[0] + '"]', this.treeObj.element);
                var ul = ej2_base_1.select('.' + CLS.LIST_PARENT, sNode);
                if (ej2_base_1.isNullOrUndefined(ul)) {
                    this.addChild(args.files, this.treeObj.selectedNodes[0], !this.expandTree);
                }
                this.expandNodeTarget = '';
            }
            this.expandTree = false;
            if (ej2_base_1.isNullOrUndefined(currFiles)) {
                ej2_base_1.setValue(this.parent.pathId[this.parent.pathId.length - 1], args.files, this.parent.feFiles);
            }
        };
        NavigationPane.prototype.updateTree = function (args) {
            if (this.treeObj) {
                var id = this.treeObj.selectedNodes[0];
                this.updateTreeNode(args, id);
            }
        };
        NavigationPane.prototype.updateTreeNode = function (args, id) {
            var toExpand = this.treeObj.expandedNodes.indexOf(id) === -1 ? false : true;
            this.removeChildNodes(id);
            this.addChild(args.files, id, !toExpand);
        };
        NavigationPane.prototype.removeChildNodes = function (id) {
            var sNode = ej2_base_1.select('[data-uid="' + id + '"]', this.treeObj.element);
            var parent = ej2_base_1.select('.' + CLS.LIST_PARENT, sNode);
            var childs = parent ? Array.prototype.slice.call(parent.children) : null;
            if (childs) {
                this.treeObj.removeNodes(childs);
            }
        };
        NavigationPane.prototype.onOpenEnd = function (args) {
            var sleId = this.parent.pathId[this.parent.pathId.length - 1];
            this.treeObj.expandAll(this.treeObj.selectedNodes);
            this.treeObj.selectedNodes = [sleId];
            this.expandNodeTarget = 'add';
            this.onPathChanged(args);
        };
        NavigationPane.prototype.onOpenInit = function (args) {
            if (this.parent.activeModule === 'navigationpane') {
                if (args.target.querySelector('.' + CLS.ICONS)) {
                    this.treeObj.expandAll(this.treeObj.selectedNodes);
                }
            }
        };
        NavigationPane.prototype.onInitialEnd = function (args) {
            this.onInit();
            this.addChild(args.files, ej2_base_1.getValue('_fm_id', args.cwd), false);
        };
        NavigationPane.prototype.onFinalizeEnd = function (args) {
            this.onInit();
            var id = ej2_base_1.getValue('_fm_id', args.cwd);
            this.removeChildNodes(id);
            this.addChild(args.files, id, false);
            this.treeObj.selectedNodes = [this.parent.pathId[this.parent.pathId.length - 1]];
        };
        NavigationPane.prototype.onCreateEnd = function (args) {
            this.updateTree(args);
        };
        NavigationPane.prototype.onSelectedData = function () {
            if (this.parent.activeModule === 'navigationpane') {
                this.updateItemData();
            }
        };
        NavigationPane.prototype.onDeleteInit = function () {
            if (this.parent.activeModule === 'navigationpane') {
                this.updateActionData();
                var name_1 = ej2_base_1.getValue('name', this.parent.itemData[0]);
                operations_1.Delete(this.parent, [name_1], this.parent.path, 'delete');
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onDeleteEnd = function (args) {
            if (this.parent.activeModule === 'navigationpane') {
                var selectedNode = this.treeObj.selectedNodes[0];
                var selcetedEle = ej2_base_1.select('[data-uid="' + selectedNode + '"]', this.treeObj.element);
                var selectedNodeEle = ej2_base_2.closest(selcetedEle, '.' + CLS.LIST_PARENT).parentElement;
                this.treeObj.selectedNodes = [selectedNodeEle.getAttribute('data-uid')];
                this.treeObj.dataBind();
            }
            this.updateTree(args);
        };
        NavigationPane.prototype.onRefreshEnd = function (args) {
            this.updateTree(args);
        };
        NavigationPane.prototype.onRenameInit = function () {
            if (this.parent.activeModule === 'navigationpane') {
                this.updateRenameData();
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onRenameEndParent = function (args) {
            var id = this.renameParent ? this.renameParent : this.parent.pathId[this.parent.pathId.length - 1];
            this.expandTree = this.treeObj.expandedNodes.indexOf(this.treeObj.selectedNodes[0]) !== -1;
            this.updateTreeNode(args, id);
            this.parent.expandedId = null;
            if (this.renameParent) {
                this.renameParent = null;
            }
            else {
                // eslint-disable-next-line
                var resultData = [];
                if (this.parent.hasId) {
                    resultData = new ej2_data_1.DataManager(this.treeObj.getTreeData()).
                        executeLocal(new ej2_data_1.Query().where('id', 'equal', this.parent.renamedId, false));
                }
                else {
                    // eslint-disable-next-line
                    var nData = new ej2_data_1.DataManager(this.treeObj.getTreeData()).
                        executeLocal(new ej2_data_1.Query().where(this.treeObj.fields.text, 'equal', this.parent.renameText, false));
                    if (nData.length > 0) {
                        resultData = new ej2_data_1.DataManager(nData).
                            executeLocal(new ej2_data_1.Query().where('_fm_pId', 'equal', id, false));
                    }
                }
                if (resultData.length > 0) {
                    this.isRenameParent = true;
                    var id_1 = ej2_base_1.getValue(this.treeObj.fields.id, resultData[0]);
                    this.treeObj.selectedNodes = [id_1];
                    this.treeObj.dataBind();
                }
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onRenameEnd = function (args) {
            if (this.parent.breadcrumbbarModule.searchObj.element.value === '' && !this.parent.isFiltered) {
                this.updateTree(args);
            }
            else {
                // eslint-disable-next-line
                var data = this.treeObj.getTreeData();
                // eslint-disable-next-line
                var resultData = [];
                if (this.parent.hasId) {
                    resultData = new ej2_data_1.DataManager(data).
                        executeLocal(new ej2_data_1.Query().where('id', 'equal', this.parent.renamedId, false));
                }
                else {
                    // eslint-disable-next-line
                    var nData = new ej2_data_1.DataManager(data).
                        executeLocal(new ej2_data_1.Query().where(this.treeObj.fields.text, 'equal', this.parent.currentItemText, false));
                    if (nData.length > 0) {
                        resultData = new ej2_data_1.DataManager(nData).
                            executeLocal(new ej2_data_1.Query().where('filterPath', 'equal', this.parent.filterPath, false));
                    }
                }
                if (resultData.length > 0) {
                    this.renameParent = ej2_base_1.getValue(this.treeObj.fields.parentID, resultData[0]);
                    this.parent.expandedId = this.renameParent;
                    this.parent.itemData = this.getTreeData(this.renameParent);
                    operations_1.read(this.parent, events.renameEndParent, this.parent.filterPath.replace(/\\/g, '/'));
                }
            }
        };
        NavigationPane.prototype.onPropertyChanged = function (e) {
            if (e.module !== this.getModuleName() && e.module !== 'common') {
                /* istanbul ignore next */
                return;
            }
            for (var _i = 0, _a = Object.keys(e.newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'allowDragAndDrop':
                        this.addDragDrop();
                        break;
                    case 'navigationPaneSettings':
                        operations_1.read(this.parent, events.finalizeEnd, '/');
                        break;
                }
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onDownLoadInit = function () {
            this.doDownload();
        };
        NavigationPane.prototype.onSelectionChanged = function (e) {
            this.treeObj.selectedNodes = [e.selectedNode];
        };
        NavigationPane.prototype.onClearPathInit = function (e) {
            this.removeChildNodes(e.selectedNode);
        };
        NavigationPane.prototype.onDragEnd = function (args) {
            var moveNames = [];
            if (this.parent.isPasteError || this.parent.isSearchDrag) {
                moveNames = this.getMoveNames(args.files, this.parent.isSearchDrag, this.parent.dragPath);
            }
            else {
                moveNames = this.moveNames;
            }
            this.treeObj.removeNodes(moveNames);
        };
        // eslint-disable-next-line
        NavigationPane.prototype.getMoveNames = function (files, flag, path) {
            var moveNames = [];
            for (var i = 0; i < files.length; i++) {
                if (!files[i].isFile) {
                    if (!this.parent.hasId) {
                        var name_2 = (files[i].previousName);
                        if (flag) {
                            path = path + files[i].previousName;
                            var index = path.lastIndexOf('/');
                            name_2 = path.substring(index + 1);
                            path = path.substring(0, index + 1);
                        }
                        // eslint-disable-next-line
                        var resultData = new ej2_data_1.DataManager(this.treeObj.getTreeData()).
                            executeLocal(new ej2_data_1.Query().where(this.treeObj.fields.text, 'equal', name_2, false));
                        for (var j = 0; j < resultData.length; j++) {
                            var fPath = ej2_base_1.getValue('filterPath', resultData[j]);
                            fPath = fPath.replace(/\\/g, '/');
                            if (fPath === path) {
                                moveNames.push(ej2_base_1.getValue(this.treeObj.fields.id, resultData[j]));
                                break;
                            }
                        }
                    }
                }
            }
            return moveNames;
        };
        NavigationPane.prototype.onCutEnd = function (args) {
            var moveNames = [];
            if (this.parent.isPasteError || this.parent.isSearchCut) {
                this.moveNames = this.getMoveNames(args.files, this.parent.isSearchCut, this.parent.targetPath);
            }
            else {
                moveNames = this.moveNames;
            }
            this.treeObj.removeNodes(moveNames);
        };
        /* istanbul ignore next */
        // eslint-disable-next-line
        NavigationPane.prototype.selectResultNode = function (resultObj) {
            if (!this.parent.hasId) {
                var path = ej2_base_1.getValue('filterPath', resultObj);
                var itemname = ej2_base_1.getValue('name', resultObj);
                // eslint-disable-next-line
                var data = new ej2_data_1.DataManager(this.treeObj.getTreeData()).
                    executeLocal(new ej2_data_1.Query().where(this.treeObj.fields.text, 'equal', itemname, false));
                if (data.length > 0) {
                    // eslint-disable-next-line
                    var resultData = new ej2_data_1.DataManager(data).
                        executeLocal(new ej2_data_1.Query().where('filterPath', 'equal', path, false));
                    if (resultData.length > 0) {
                        var id = ej2_base_1.getValue(this.treeObj.fields.id, resultData[0]);
                        this.treeObj.selectedNodes = [id];
                        this.treeObj.dataBind();
                    }
                }
            }
            else {
                this.treeObj.selectedNodes = [ej2_base_1.getValue('_fm_id', resultObj)];
                this.treeObj.dataBind();
            }
        };
        NavigationPane.prototype.onDropPath = function (args) {
            this.onpasteEnd(args);
            this.selectResultNode(this.parent.dropData);
            this.parent.isDropEnd = !this.parent.isPasteError;
        };
        NavigationPane.prototype.onpasteEnd = function (args) {
            // eslint-disable-next-line
            var resultData = [];
            if (this.parent.hasId) {
                resultData = new ej2_data_1.DataManager(this.treeObj.getTreeData()).
                    executeLocal(new ej2_data_1.Query().where('id', 'equal', ej2_base_1.getValue('id', args.cwd), false));
            }
            else {
                // eslint-disable-next-line
                var nData = new ej2_data_1.DataManager(this.treeObj.getTreeData()).
                    executeLocal(new ej2_data_1.Query().where(this.treeObj.fields.text, 'equal', ej2_base_1.getValue('name', args.cwd), false));
                if (nData.length > 0) {
                    resultData = new ej2_data_1.DataManager(nData).
                        executeLocal(new ej2_data_1.Query().where('filterPath', 'equal', ej2_base_1.getValue('filterPath', args.cwd), false));
                }
            }
            if (resultData.length > 0) {
                var id = ej2_base_1.getValue(this.treeObj.fields.id, resultData[0]);
                var toExpand = this.treeObj.expandedNodes.indexOf(id) === -1;
                this.removeChildNodes(id);
                this.addChild(args.files, id, toExpand);
            }
            this.parent.expandedId = null;
            this.onPathChanged(args);
            if (this.parent.isDragDrop) {
                this.checkDropPath(args);
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.checkDropPath = function (args) {
            if (this.parent.hasId) {
                this.parent.isDropEnd = !this.parent.isPasteError;
                index_2.readDropPath(this.parent);
                return;
            }
            if ((this.parent.dropPath.indexOf(index_1.getDirectoryPath(this.parent, args)) === -1)) {
                this.parent.isDropEnd = false;
                index_2.readDropPath(this.parent);
            }
            else {
                this.parent.isDropEnd = !this.parent.isPasteError;
            }
        };
        NavigationPane.prototype.onpasteInit = function () {
            if (this.parent.activeModule === this.getModuleName()) {
                this.updateItemData();
            }
            this.moveNames = [];
            // eslint-disable-next-line
            var obj = this.parent.isDragDrop ? this.parent.dragData : this.parent.actionRecords;
            for (var i = 0; i < obj.length; i++) {
                if (ej2_base_1.getValue('isFile', obj[i]) === false) {
                    this.moveNames.push(ej2_base_1.getValue('_fm_id', obj[i]));
                }
            }
        };
        NavigationPane.prototype.oncutCopyInit = function () {
            if (this.parent.activeModule === this.getModuleName()) {
                this.parent.activeRecords = this.getTreeData(this.treeObj.selectedNodes[0]);
                this.parent.activeElements = [this.activeNode];
            }
        };
        NavigationPane.prototype.addEventListener = function () {
            this.parent.on(events.modelChanged, this.onPropertyChanged, this);
            this.parent.on(events.downloadInit, this.onDownLoadInit, this);
            this.parent.on(events.initialEnd, this.onInitialEnd, this);
            this.parent.on(events.finalizeEnd, this.onFinalizeEnd, this);
            this.parent.on(events.pathChanged, this.onPathChanged, this);
            this.parent.on(events.pasteEnd, this.onpasteEnd, this);
            this.parent.on(events.cutEnd, this.onCutEnd, this);
            this.parent.on(events.pasteInit, this.onpasteInit, this);
            this.parent.on(events.nodeExpand, this.onNodeExpanded, this);
            this.parent.on(events.createEnd, this.onCreateEnd, this);
            this.parent.on(events.selectedData, this.onSelectedData, this);
            this.parent.on(events.deleteInit, this.onDeleteInit, this);
            this.parent.on(events.deleteEnd, this.onDeleteEnd, this);
            this.parent.on(events.refreshEnd, this.onRefreshEnd, this);
            this.parent.on(events.updateTreeSelection, this.onSelectionChanged, this);
            this.parent.on(events.openInit, this.onOpenInit, this);
            this.parent.on(events.openEnd, this.onOpenEnd, this);
            this.parent.on(events.destroy, this.destroy, this);
            this.parent.on(events.renameInit, this.onRenameInit, this);
            this.parent.on(events.renameEnd, this.onRenameEnd, this);
            this.parent.on(events.renameEndParent, this.onRenameEndParent, this);
            this.parent.on(events.clearPathInit, this.onClearPathInit, this);
            this.parent.on(events.cutCopyInit, this.oncutCopyInit, this);
            this.parent.on(events.dropInit, this.onDropInit, this);
            this.parent.on(events.menuItemData, this.onMenuItemData, this);
            this.parent.on(events.dragEnd, this.onDragEnd, this);
            this.parent.on(events.dragging, this.onDragging, this);
            this.parent.on(events.dropPath, this.onDropPath, this);
            this.parent.on(events.detailsInit, this.onDetailsInit, this);
            this.parent.on(events.pathDrag, this.onPathDrag, this);
        };
        NavigationPane.prototype.removeEventListener = function () {
            this.parent.off(events.initialEnd, this.onInitialEnd);
            this.parent.off(events.downloadInit, this.onDownLoadInit);
            this.parent.off(events.finalizeEnd, this.onFinalizeEnd);
            this.parent.off(events.selectedData, this.onSelectedData);
            this.parent.off(events.modelChanged, this.onPropertyChanged);
            this.parent.off(events.pathChanged, this.onPathChanged);
            this.parent.off(events.pasteEnd, this.onpasteEnd);
            this.parent.off(events.cutEnd, this.onCutEnd);
            this.parent.off(events.pasteInit, this.onpasteInit);
            this.parent.off(events.updateTreeSelection, this.onSelectionChanged);
            this.parent.off(events.nodeExpand, this.onNodeExpanded);
            this.parent.off(events.createEnd, this.onCreateEnd);
            this.parent.off(events.refreshEnd, this.onRefreshEnd);
            this.parent.off(events.openInit, this.onOpenInit);
            this.parent.off(events.openEnd, this.onOpenEnd);
            this.parent.off(events.destroy, this.destroy);
            this.parent.off(events.renameInit, this.onRenameInit);
            this.parent.off(events.renameEnd, this.onRenameEnd);
            this.parent.off(events.renameEndParent, this.onRenameEndParent);
            this.parent.off(events.clearPathInit, this.onClearPathInit);
            this.parent.off(events.deleteInit, this.onDeleteInit);
            this.parent.off(events.deleteEnd, this.onDeleteEnd);
            this.parent.off(events.cutCopyInit, this.oncutCopyInit);
            this.parent.off(events.dropInit, this.onDropInit);
            this.parent.off(events.dragEnd, this.onDragEnd);
            this.parent.off(events.dragging, this.onDragging);
            this.parent.off(events.dropPath, this.onDropPath);
            this.parent.off(events.detailsInit, this.onDetailsInit);
            this.parent.off(events.menuItemData, this.onMenuItemData);
            this.parent.off(events.pathDrag, this.onPathDrag);
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onDetailsInit = function () {
            if (this.parent.activeModule === this.getModuleName()) {
                // eslint-disable-next-line
                var dataobj = this.getTreeData(this.treeObj.selectedNodes[0]);
                this.parent.itemData = dataobj;
            }
        };
        // eslint-disable-next-line
        NavigationPane.prototype.onMenuItemData = function (args) {
            if (this.parent.activeModule === this.getModuleName()) {
                var liEle = ej2_base_2.closest(args.target, 'li');
                this.parent.itemData = this.getTreeData(liEle.getAttribute('data-uid'));
            }
        };
        /* istanbul ignore next */
        NavigationPane.prototype.onDragging = function (args) {
            var ele = ej2_base_2.closest(args.target, 'li');
            if (ele.classList.contains('e-node-collapsed')) {
                this.isDrag = true;
                var level = parseInt(ele.getAttribute('aria-level'), 10);
                this.treeObj.expandAll([ele.getAttribute('data-uid')], level + 1);
                this.isDrag = false;
            }
        };
        NavigationPane.prototype.onDropInit = function (args) {
            if (this.parent.targetModule === this.getModuleName()) {
                var dropLi = ej2_base_2.closest(args.target, 'li');
                this.parent.dropData = this.getTreeData(dropLi)[0];
                this.parent.dropPath = this.getDropPath(dropLi, ej2_base_1.getValue('name', this.parent.dropData));
            }
        };
        /**
         * For internal use only - Get the module name.
         *
         * @returns {string} - returns the module name.
         * @private
         */
        NavigationPane.prototype.getModuleName = function () {
            return 'navigationpane';
        };
        NavigationPane.prototype.destroy = function () {
            if (this.parent.isDestroyed) {
                return;
            }
            this.removeEventListener();
            if (this.treeObj) {
                this.unWireEvents();
                this.treeObj.destroy();
            }
        };
        NavigationPane.prototype.wireEvents = function () {
            this.keyboardModule = new ej2_base_2.KeyboardEvents(this.treeObj.element, {
                keyAction: this.keyDown.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        };
        NavigationPane.prototype.unWireEvents = function () {
            this.keyboardModule.destroy();
        };
        /* istanbul ignore next */
        NavigationPane.prototype.keyDown = function (e) {
            var action = e.action;
            switch (action) {
                case 'altEnter':
                    this.parent.notify(events.detailsInit, {});
                    operations_1.GetDetails(this.parent, [], this.parent.path, 'details');
                    break;
                case 'esc':
                    index_2.removeActive(this.parent);
                    break;
                case 'del':
                    this.updateItemData();
                    if (!index_3.hasEditAccess(this.parent.itemData[0])) {
                        index_3.createDeniedDialog(this.parent, this.parent.itemData[0], events.permissionEdit);
                    }
                    else {
                        this.removeNodes = [];
                        dialog_1.createDialog(this.parent, 'Delete');
                    }
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
                case 'shiftF10':
                    this.updateItemData();
                    if (!index_3.hasDownloadAccess(this.parent.itemData[0])) {
                        index_3.createDeniedDialog(this.parent, this.parent.itemData[0], events.permissionDownload);
                        return;
                    }
                    if (this.parent.selectedItems.length !== 0) {
                        this.doDownload();
                    }
                    break;
                case 'f2':
                    if (this.parent.selectedItems.length === 0) {
                        // eslint-disable-next-line
                        var data = this.getTreeData(this.treeObj.selectedNodes[0])[0];
                        if (!index_3.hasEditAccess(data)) {
                            index_3.createDeniedDialog(this.parent, data, events.permissionEdit);
                        }
                        else {
                            this.updateRenameData();
                            dialog_1.createDialog(this.parent, 'Rename');
                        }
                    }
                    break;
            }
        };
        // eslint-disable-next-line
        NavigationPane.prototype.getTreeData = function (args) {
            // eslint-disable-next-line
            var data = this.treeObj.getTreeData(args);
            for (var i = 0; i < data.length; i++) {
                if (ej2_base_1.isNullOrUndefined(ej2_base_1.getValue('hasChild', data[i]))) {
                    ej2_base_1.setValue('hasChild', false, data[i]);
                }
            }
            return data;
        };
        NavigationPane.prototype.updateRenameData = function () {
            this.updateItemData();
            this.parent.currentItemText = ej2_base_1.getValue('name', this.parent.itemData[0]);
        };
        NavigationPane.prototype.updateItemData = function () {
            // eslint-disable-next-line
            var data = this.getTreeData(this.treeObj.selectedNodes[0])[0];
            this.parent.itemData = [data];
            this.parent.isFile = false;
        };
        NavigationPane.prototype.updateActionData = function () {
            this.updateItemData();
            var newPath = index_2.getParentPath(this.parent.path);
            this.parent.setProperties({ path: newPath }, true);
            this.parent.pathId.pop();
            this.parent.pathNames.pop();
        };
        /* istanbul ignore next */
        NavigationPane.prototype.doDownload = function () {
            var newPath = index_2.getParentPath(this.parent.path);
            var itemId = this.treeObj.selectedNodes[0];
            var name = (itemId === this.parent.pathId[0]) ? '' : ej2_base_1.getValue('name', this.parent.itemData[0]);
            operations_1.Download(this.parent, newPath, [name]);
        };
        return NavigationPane;
    }());
    exports.NavigationPane = NavigationPane;
});
