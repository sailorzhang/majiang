import { Injectable } from '@angular/core';
import { DialogService } from 'ng-devui';
import { ConfirmDialogParams } from '../models/confirm_dialog_params';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private dialogService: DialogService) { }

  private config = {
    id: 'dialog-service',
    width: '250px',
    maxHeight: '150px',
    zIndex: 1050,
    draggable: false,
    backdropCloseable: true,
    dialogtype: 'warning',
    content: "确定要删除吗？",
  }

  show(params: ConfirmDialogParams) {
    const dialog = this.dialogService.open({
      ...{...this.config, ...params.config},
      html: true,
      buttons: [
        {
          cssClass: 'primary',
          text: '确定',
          handler: async ($event: Event) => {
            let isClose = true;
            if (params.onOKClick) {
              const result = await params.onOKClick();
              if( result === undefined || result === true) {
                isClose = true
              } else {
                isClose = false
              }
            }
            isClose && dialog.modalInstance.hide();
          },
        },
        {
          cssClass: 'common',
          text: '取消',
          handler: ($event: Event) => {
            dialog.modalInstance.hide();
          },
        },
      ],
    });
  }
}
