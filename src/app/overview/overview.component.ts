import { GlobalLoadingService } from './../service/global-loading.service';
import { ConfirmDialogService } from './../service/confirm-dialog.service';
import { CaseItem } from './../models/case';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'ng-devui/data-table';
import _ from 'underscore';
import {
  TableWidthConfig
} from 'ng-devui/data-table';
import { ButtonModule, DialogService,  PaginationModule, ToastModule } from 'ng-devui';
import { AddTaskComponent } from '../add-task/add-task.component';

interface TotalAmount {
  username: string;
  amount: number;
}

interface Pager {
  total: number;
  pageSize: number;
  pageIndex: number;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule, DataTableModule, ButtonModule, ToastModule, PaginationModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
  providers: [provideEcharts()]
})
export class OverviewComponent implements OnInit {

  options: EChartsOption = this.getOptions();
  updateOptions: EChartsOption = {}
  cases: CaseItem[] = []
  casesShow: CaseItem[] = []
  msgs: Array<Object> = [];
  // loading?: LoadingType;
  pager: Pager = {total: 0, pageIndex: 0, pageSize: 0};


  tableWidthConfig: TableWidthConfig[] = [
    {
      field: 'casename',
      width: '120px'
    },
    {
      field: 'create_date',
      width: '120px'
    },
    {
      field: 'cases',
      width: '200px'
    }
  ];

  get isAdmin() {
    return this.authService.isAdmin();
  }

  constructor(private http: HttpClient,
    private authService: AuthService,
    private dialogService: DialogService,
    private confirmDialogService: ConfirmDialogService,
    private globalLoadingService: GlobalLoadingService
    ) {

  }
  ngOnInit(): void {
    // this.loading = undefined;
    this.init();
  }

  init() {

    this.http.get<TotalAmount[]>(environment.restApi.total_amount, {}).subscribe((result) => {
      const users = result.map((item) => {
        return item.username;
      });

      const amount = result.map((item) => {
        return item.amount || 0;
      });

      this.updateOptions = {
        yAxis: {
          data: users
        },
        series: [{
          data: amount
        }]
      }
    });

    this.http.get<CaseItem[]>(environment.restApi.case_list).subscribe(result => {
      this.cases = result;
      this.pager = {
        total: this.cases.length,
        pageSize: 5,
        pageIndex: 1
      }

      this.casesShow = this.cases.slice(this.pager.pageSize  * (this.pager.pageIndex - 1) , this.pager.pageSize  * this.pager.pageIndex);
    });
  }

  onIndexChange(index: number) {
    this.casesShow = this.cases.slice(this.pager.pageSize  * (index -1) , this.pager.pageSize  * index);

    // console.log(index);
  }

  EditTask(caseItem: CaseItem) {
    this.openDialog(caseItem);
  }

  AddTask() {
    this.openDialog();
  }

  private openDialog(caseItem?: CaseItem) {
    const deleteAction = caseItem ? [{
      id: 'btn-delete',
      cssClass: 'danger',
      text: '删除',
      handler: ($event: Event) => {
        this.deleteConfirmDialog(results, caseItem.caseno!);
      },
    }] : []
    const results = this.dialogService.open({
      id: 'dialog-service',
      width: '450px',
      draggable: false,
      maxHeight: '600px',
      title: caseItem ? '编辑场次' : '增加场次',
      content: AddTaskComponent,
      backdropCloseable: true,
      data: {
        caseItem: caseItem,
      },
      dialogtype: 'standard',
      showAnimation: true,
      buttons: [
        {
          cssClass: 'primary',
          text: caseItem ? "修改" : "新增",
          disabled: false,
          handler: ($event: Event) => {
            if (!results.modalContentInstance.formData.taskName.trim()) {
              this.msgs = [{ severity: 'error', summary: '错误', content: '给个代号！' }];
              return;
            }

            if (_.uniq(_.pluck(_.pluck(results.modalContentInstance.formData.cases, 'user'), 'id')).length !== 4) {
              this.msgs = [{ severity: 'error', summary: '错误', content: '闹呢？几个人玩啊？' }];
              return;
            }

            const url = caseItem ? environment.restApi.update_case : environment.restApi.add_case;
            this.http.post(url, results.modalContentInstance.formData).subscribe({
              next: () => {
                this.msgs = [{ severity: 'success', summary: '成功', content: caseItem ? "修改成功" : '添加成功' }];
                results.modalInstance.hide();
                setTimeout(() => {
                  this.init();
                }, 1);
              },
              error: () => {
                this.msgs = [{ severity: 'error', summary: '失败', content: caseItem ? '修改失败' : '添加失败' }];
              }
            });
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: '取消',
          handler: ($event: Event) => {
            results.modalInstance.hide();
          },
        },
        ...deleteAction
      ],
    });
  }

  private deleteConfirmDialog(parentDialog: any, caseno: string) {

    this.confirmDialogService.show({
      onOKClick: () => {
        this.http.post(environment.restApi.delete_case, { caseno }).subscribe({
          next: () => {
            this.msgs = [{ severity: 'success', content: "删除成功" }];
            parentDialog.modalInstance.hide();
            this.init();
          },
          error: () => {
            this.msgs = [{ severity: 'error', content: "删除失败" }];
          }
        });
      }
    })
  }

  private getOptions(): EChartsOption {
    return {
      title: {
        text: '八一路麻将局统计'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 80,
        bottom: 30
      },
      xAxis: {
        type: 'value',
        position: 'top',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        data: []
      },
      series: [
        {
          name: '人民币',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            formatter: '{b}: {c}'
          },
          data: [],
          itemStyle: {
            color: (params: any) => {
              const value = params.value;
              if (value >= 0) {
                return 'red';
              } else {
                return 'green';
              }
            }
          }
        }
      ]
    };
  }
}
