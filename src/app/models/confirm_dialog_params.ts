import { IDialogOptions } from "ng-devui";

export interface ConfirmDialogParams {
    config?: Pick<IDialogOptions, "id" | "width"| "maxHeight"|"zIndex"| "draggable"| "backdropCloseable"| "dialogtype"| "content">, 
    onOKClick?: () => boolean | Promise<boolean> | void, 
}
