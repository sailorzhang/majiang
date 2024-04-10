import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { environment } from '../../environments/environment';
import { ReportCaseDetail, ReportCaseItem } from '../models/reports_model';
import _ from 'underscore';
import { getCurrentTime } from '../utils/datetime-helper';
import { CardModule } from 'ng-devui';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [NgxEchartsDirective, CommonModule, CardModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  providers: [provideEcharts()]
})
export class ReportsComponent implements OnInit {

  constructor(private http: HttpClient) { }
  options: EChartsOption = this.getOptions();
  updateOptions: EChartsOption = {}

  top?: Omit<ReportCaseDetail, "caseno">;
  bottom?: Omit<ReportCaseDetail, "caseno">;

  labelOption: Object = {
    show: true,
    position: 'insideBottom',
    distance: 15,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {}
    }
  };

  ngOnInit(): void {

    this.http.get<ReportCaseItem>(environment.restApi.get_reports).subscribe((reports) => {
      this.top = reports.top;
      this.bottom = reports.bottom;
      const list = _.groupBy(reports.detail, "create_date");
      const usernames = _.pluck(list[_.keys(list)[0]], "username");
      const amountList = _.unzip(_.map(list, (key, item) => {
        return _.pluck(key, "amount")
      }));

      const series = _.map(usernames, (username, index) => {
        return {
          name: username,
          type: 'bar',
          label: this.labelOption,
          barGap: 0,
          data: amountList[index],
          emphasis: {
            focus: 'series'
          }
        }
      }) as [];

      const xData = _.map(_.keys(list), (date) => {
        return getCurrentTime(date);
      }) as [];

      this.updateOptions = {
        legend: {
          data: usernames
        },
        xAxis: [
          {
            data: xData
          }
        ],
        series: series
      }
    });
  }

  getOptions(): EChartsOption {

    return {
      dataZoom: [{
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        left: '9%',
        bottom: -5,
        start: 0,
        end: 100 //初始化滚动条
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          magicType: {
            show: true,
            type: ['line', 'bar', 'stack'],
            option: {
              line: {
                labelLayout: {
                  align: 'center',
                  rotate: 0,
                  fontSize: 14
                }
              },
              bar: {
                labelLayout: {
                  align: 'left',
                  rotate: 90,
                  fontSize: 14
                }
              },
              stack: {
                labelLayout: {
                  align: 'center',
                  rotate: 0,
                  fontSize: 14
                }
              }
            }
          },
          saveAsImage: { show: true }
        }
      },
      legend: {
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: []
    }
  }
}
