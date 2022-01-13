import { EventHandler, closest, isNullOrUndefined, KeyboardEvents, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { getValue, addClass, removeClass, remove, createElement, DragEventArgs } from '@syncfusion/ej2-base';
import { TextBox, ChangedEventArgs } from '@syncfusion/ej2-inputs';
import { IFileManager, NotifyArgs, ReadArgs, FileOpenEventArgs } from '../base/interface';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { read } from '../common/operations';
import { getLocaleText, searchWordHandler } from '../common/utility';
import * as events from '../base/constant';
import * as CLS from '../base/classes';
import { SearchSettingsModel } from '../models';

/**
 * BreadCrumbBar module
 */
export class BreadCrumbBar {

    /* Internal variables */
    private parent: IFileManager;
    public addressPath: string = '';
    public addressBarLink: string = '';
    public searchObj: TextBox;
    private subMenuObj: DropDownButton;
    private keyboardModule: KeyboardEvents;
    private searchTimer: number = null;
    private keyConfigs: { [key: string]: string };
    private searchWrapWidth: number = null;
    /**
     * constructor for addressbar module
     *
     * @hidden
     * @param {IFileManager} parent - specifies parent element.
     * @private
     *
     */
    constructor(parent?: IFileManager) {
        this.parent = parent;
        this.keyConfigs = {
            enter: 'enter'
        };
        this.render();
    }
    private onPropertyChanged(e: NotifyArgs): void {
        if (e.module !== this.getModuleName() && e.module !== 'common') {
            return;
        }
        for (const prop of Object.keys(e.newProp)) {
            const value: SearchSettingsModel = e.newProp.searchSettings;
            switch (prop) {
            case 'searchSettings':
                if (!isNullOrUndefined(value.allowSearchOnTyping)) {
                    this.searchEventBind(value.allowSearchOnTyping);
                }
                if (this.parent.breadcrumbbarModule.searchObj.value && this.parent.breadcrumbbarModule.searchObj.value !== '' &&
                        !(!isNullOrUndefined(value.allowSearchOnTyping) && isNullOrUndefined(value.filterType) &&
                            isNullOrUndefined(value.ignoreCase))) {
                    searchWordHandler(this.parent, this.parent.breadcrumbbarModule.searchObj.value, false);
                }
                break;
            }
        }
    }
    private render(): void {
        this.addEventListener();
    }
    public onPathChange(): void {
        const pathNames: string[] = this.parent.pathNames;
        const paths: string[] = this.parent.path.split('/');
        const addressbarUL: HTMLElement = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
        let addressbarLI: HTMLElement = null;
        const pathNamesLen: number = pathNames.length;
        if (pathNames.length > 0) {
            let id: string = '';
            for (let i: number = 0; i < pathNamesLen; i++) {
                let addressATag: HTMLElement = null;
                addressbarLI = this.parent.createElement('li', { className: 'e-address-list-item' });
                for (let j: number = 0; j <= i; j++) {
                    id = id + paths[j] + '/';
                }
                addressbarLI.setAttribute('data-utext', id);
                if (i !== 0) {
                    const icon: HTMLElement = createElement('span', { className: CLS.ICONS });
                    addressbarLI.appendChild(icon);
                }
                if (pathNamesLen - i !== 1) {
                    addressATag = createElement('a', { className: CLS.LIST_TEXT });
                    addressbarLI.setAttribute('tabindex', '0');
                } else {
                    addressATag = createElement('span', { className: CLS.LIST_TEXT });
                }
                id = '';
                addressATag.innerText = pathNames[i];
                addressbarLI.appendChild(addressATag);
                addressbarUL.appendChild(addressbarLI);
            }
            const ulElement: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
            if (!isNullOrUndefined(ulElement)) {
                if (!isNullOrUndefined(this.subMenuObj)) {
                    this.subMenuObj.destroy();
                }
                remove(ulElement);
            }
            const searchWrap: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
            if (!searchWrap) {
                this.parent.breadCrumbBarNavigation.insertBefore(addressbarUL, searchWrap);
            } else {
                this.parent.breadCrumbBarNavigation.appendChild(addressbarUL);
            }
            this.updateBreadCrumbBar(addressbarUL);
        }
    }
    /* istanbul ignore next */
    private updateBreadCrumbBar(addresBarUL: HTMLElement): void {
        const liElements: NodeListOf<Element> = addresBarUL.querySelectorAll('li');
        const ulElement: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-addressbar-ul');
        const style: CSSStyleDeclaration = window.getComputedStyle(ulElement, null);
        const pRight: number = parseFloat(style.getPropertyValue('padding-right'));
        const pLeft: number = parseFloat(style.getPropertyValue('padding-left'));
        let breadCrumbBarWidth: number = (<HTMLElement>ulElement).offsetWidth - pRight - pLeft;
        const addressbarUL: HTMLElement = this.parent.createElement('ul', { className: 'e-addressbar-ul' });
        let liElementsWidth: number = 0;
        const liElementsWidths: number[] = [];
        for (let i: number = 0; i < liElements.length; i++) {
            const width: number = liElements[i].clientWidth;
            liElementsWidths.push(width);
            liElementsWidth = liElementsWidth + width;
        }
        if (!isNullOrUndefined(ulElement)) {
            remove(ulElement);
        }
        const searchContainer: HTMLElement = this.parent.createElement('div');
        searchContainer.setAttribute('class', 'e-search-wrap');
        const id: string = this.parent.element.id + CLS.SEARCH_ID;
        const searchInput: HTMLElement = createElement('input', { id: id,
            attrs: { autocomplete: 'off', 'aria-label': getLocaleText(this.parent, 'Search') } });
        searchContainer.appendChild(searchInput);
        const searchEle: Element = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap .e-input');
        if (isNullOrUndefined(searchEle)) {
            this.parent.breadCrumbBarNavigation.appendChild(searchContainer);
            const span: Element = createElement('span', { className: 'e-icons e-fe-search' });
            EventHandler.add(span, 'click', this.onShowInput, this);
            searchInput.parentElement.insertBefore(span, searchInput);
            this.searchObj = new TextBox({
                value: '',
                showClearButton: true,
                placeholder: getLocaleText(this.parent, 'Search'),
                focus: this.onFocus.bind(this),
                blur: this.onBlur.bind(this)
            });
            this.searchObj.appendTo('#' + this.parent.element.id + CLS.SEARCH_ID);
            this.searchEventBind(this.parent.searchSettings.allowSearchOnTyping);
            const search: Element = this.searchObj.element.nextElementSibling;
            EventHandler.add(search, 'mousedown', this.searchChangeHandler.bind(this), this);
            EventHandler.add(this.searchObj.element, 'keyup', this.onKeyUp.bind(this), this);
        }
        const searchWrap: HTMLElement = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
        breadCrumbBarWidth = breadCrumbBarWidth - (this.searchWrapWidth ? this.searchWrapWidth : searchWrap.offsetWidth);
        if (liElementsWidth > breadCrumbBarWidth) {
            let i: number = liElements.length;
            while (i--) {
                const diff: number = breadCrumbBarWidth - liElementsWidths[i];
                if (diff > 40) {
                    addressbarUL.insertBefore(liElements[i], addressbarUL.querySelector('li'));
                    breadCrumbBarWidth = diff;
                } else {
                    // eslint-disable-next-line
                    const items: Object[] = [];
                    for (let j: number = 0; j <= i; j++) {
                        const liElement: Element = liElements[j];
                        items.push({
                            text: (<HTMLElement>liElement).innerText,
                            utext: liElement.getAttribute('data-utext')
                        });
                    }
                    const subMenuLi: HTMLElement = this.parent.createElement('li', { className: 'e-breadcrumb-menu' });
                    // eslint-disable-next-line
                    const attributes: Object = { className: 'e-breadcrumb-submenu' };
                    const subMenuSpan: HTMLElement = this.parent.createElement('button', attributes);
                    subMenuLi.appendChild(subMenuSpan);
                    addressbarUL.insertBefore(subMenuLi, addressbarUL.querySelector('li'));
                    this.subMenuObj = new DropDownButton({
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
        } else {
            this.parent.breadCrumbBarNavigation.insertBefore(addresBarUL, searchWrap);
        }
    }
    /* istanbul ignore next */
    private onFocus(): void {
        const wrap: Element = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.add('e-focus');
    }
    /* istanbul ignore next */
    private onKeyUp(): void {
        this.parent.notify(events.pathColumn, { args: this.parent });
    }
    /* istanbul ignore next */
    private onBlur(): void {
        const wrap: Element = closest(this.searchObj.element, '.e-search-wrap');
        wrap.classList.remove('e-focus');
    }
    /* istanbul ignore next */
    private subMenuSelectOperations(event: MenuEventArgs): void {
        // eslint-disable-next-line
        const args: Object = { target: event.element };
        this.addressPathClickHandler(<Event>args);
    }
    /* istanbul ignore next */
    private addSubMenuAttributes(args: MenuEventArgs): void {
        args.element.setAttribute('data-utext', getValue('utext', args.item));
        const anchor: HTMLElement = this.parent.createElement('a', { className: 'e-list-text' });
        args.element.appendChild(anchor);
    }
    private searchEventBind(allow: boolean): void {
        if (allow) {
            this.searchObj.input = this.searchChangeHandler.bind(this);
            this.searchObj.change = null;
        } else {
            this.searchObj.change = this.searchChangeHandler.bind(this);
            this.searchObj.input = null;
        }
    }
    private searchChangeHandler(args?: ChangedEventArgs): void {
        if (!isNullOrUndefined(args.value)) {
            this.parent.isFiltered = false;
            if (this.parent.searchSettings.allowSearchOnTyping) {
                window.clearTimeout(this.searchTimer);
                this.searchTimer = window.setTimeout(() => { searchWordHandler(this.parent, args.value, false); }, 300);
            } else {
                searchWordHandler(this.parent, args.value, false);
            }
        }
    }
    private addressPathClickHandler(e: Event): void {
        const li: HTMLElement = (<HTMLElement>e.target);
        if (li.nodeName === 'LI' || li.nodeName === 'A') {
            const node: Element = li.nodeName === 'LI' ? li.children[0] : li;
            if (!isNullOrUndefined(node)) {
                this.parent.isFiltered = false;
                const currentPath: string = this.updatePath((<HTMLElement>node));
                this.parent.itemData = [getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent)];
                this.triggerFileOpen(this.parent.itemData[0]);
                read(this.parent, events.pathChanged, currentPath);
                const treeNodeId: string = this.parent.pathId[this.parent.pathId.length - 1];
                this.parent.notify(events.updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
            }
        }
    }

    // eslint-disable-next-line
    private triggerFileOpen(data: Object): void {
        const eventArgs: FileOpenEventArgs = { cancel: false, fileDetails: data, module: 'BreadCrumbBar' };
        delete eventArgs.cancel;
        this.parent.trigger('fileOpen', eventArgs);
    }

    /* istanbul ignore next */
    private onShowInput(): void {
        if (this.parent.isMobile) {
            if (this.parent.element.classList.contains(CLS.FILTER)) {
                removeClass([this.parent.element], CLS.FILTER);
                this.searchWrapWidth = null;
            } else {
                const searchWrap: HTMLElement = this.parent.breadCrumbBarNavigation.querySelector('.e-search-wrap');
                this.searchWrapWidth = searchWrap.offsetWidth;
                addClass([this.parent.element], CLS.FILTER);
                this.searchObj.element.focus();
            }
        }
    }

    private updatePath(list: HTMLElement): string {
        const li: Element = closest(list, 'li');
        const liElementId: string = li.getAttribute('data-utext');
        this.addressBarLink = liElementId;
        const link: string[] = this.addressBarLink.split('/');
        const ids: string[] = this.parent.pathId;
        const names: string[] = this.parent.pathNames;
        this.parent.pathId = [];
        this.parent.pathNames = [];
        let newpath: string = '';
        for (let i: number = 0, len: number = link.length - 1; i < len; i++) {
            this.parent.pathId.push(ids[i]);
            this.parent.pathNames.push(names[i]);
            newpath += link[i] + '/';
        }
        this.parent.setProperties({ path: newpath }, true);
        return newpath;
    }

    private onUpdatePath(): void {
        this.onPathChange();
        this.removeSearchValue();
    }

    private onCreateEnd(): void {
        this.onPathChange();
    }

    private onRenameEnd(): void {
        this.onPathChange();
    }

    /* istanbul ignore next */
    private onDeleteEnd(): void {
        this.onUpdatePath();
    }

    /* istanbul ignore next */
    private removeSearchValue(): void {
        this.parent.isFiltered = false;
        if (this.searchObj && (this.searchObj.value !== '' || this.searchObj.element.value !== '')) {
            this.searchObj.value = '';
            this.searchObj.element.value = '';
            this.searchObj.dataBind();
        }
    }

    private onResize(): void {
        this.onPathChange();
    }
    private onPasteEnd(): void {
        this.onPathChange();
    }

    private addEventListener(): void {
        this.keyboardModule = new KeyboardEvents(
            this.parent.breadCrumbBarNavigation,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            }
        );
        this.parent.on(events.modelChanged, this.onPropertyChanged, this);
        EventHandler.add(this.parent.breadCrumbBarNavigation, 'click', this.addressPathClickHandler, this);
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
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        switch (e.action) {
        case 'enter':
            this.addressPathClickHandler(e);
            break;
        }
    }
    private removeEventListener(): void {
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
    }

    /* istanbul ignore next */
    private onDropInit(args: DragEventArgs): void {
        if (this.parent.targetModule === this.getModuleName()) {
            const liEle: Element = args.target.closest('li');
            this.parent.dropPath = this.updatePath(<HTMLElement>(liEle.children[0]));
            this.parent.dropData = getValue(this.parent.pathId[this.parent.pathId.length - 1], this.parent.feParent);
            this.triggerFileOpen(this.parent.dropData);
            const treeNodeId: string = this.parent.pathId[this.parent.pathId.length - 1];
            this.parent.notify(events.updateTreeSelection, { module: 'treeview', selectedNode: treeNodeId });
        }
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} - returns the module name
     * @private
     */
    private getModuleName(): string {
        return 'breadcrumbbar';
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
        /* istanbul ignore next */
        if (!isNullOrUndefined(this.subMenuObj)) {
            this.subMenuObj.destroy();
        }
        if (!isNullOrUndefined(this.searchObj)) {
            this.searchObj.destroy();
        }
    }

    private onSearchTextChange(args: ReadArgs): void {
        this.searchObj.element.placeholder = (this.parent.searchSettings.placeholder != null) ? this.parent.searchSettings.placeholder : getLocaleText(this.parent, 'Search') + ' ' + args.cwd.name;
    }
}
