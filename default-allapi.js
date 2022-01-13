define(["require", "exports", "./src/file-manager/base/file-manager", "./src/file-manager/layout/index", "./src/file-manager/actions/toolbar"], function (require, exports, file_manager_1, index_1, toolbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    file_manager_1.FileManager.Inject(index_1.NavigationPane, index_1.DetailsView, toolbar_1.Toolbar);
    var hostUrl = 'https://ej2-aspcore-service.azurewebsites.net/';
    var feObj = new file_manager_1.FileManager({
        ajaxSettings: {
            url: hostUrl + 'api/FileManager/FileOperations',
            uploadUrl: hostUrl + 'api/FileManager/Upload',
            downloadUrl: hostUrl + 'api/FileManager/Download',
            getImageUrl: hostUrl + 'api/FileManager/GetImage'
        }
    });
    feObj.appendTo('#file');
});
