import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule, DatepickerModule, FormLayout, FormModule, IconModule, LoadingModule, LoadingService, RadioModule, SelectModule, TagsInputModule } from 'ng-devui';
import { CaseDetail, CaseItem } from '../models/case';
import { AddTaskModel, UserOption } from '../models/add_task_mddel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import _ from 'underscore';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, FormModule, SelectModule, CommonModule, TagsInputModule, RadioModule, DatepickerModule, LoadingModule, ButtonModule, IconModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {

  constructor(private http: HttpClient) { }

  @Input() data?: any;

  caseItem?: CaseItem;

  userList: Array<UserOption> = [];

  formData: AddTaskModel = {
    taskName: '',
    createDate: new Date(),
    cases: [],
  }

  layoutDirection: FormLayout = FormLayout.Vertical;

  ngOnInit() {
    this.caseItem = this.data.caseItem ? JSON.parse(JSON.stringify(this.data.caseItem)) : this.data.CaseItem;
    this.http.get<UserOption[]>(environment.restApi.user_list).subscribe(list => {
      this.userList = list;
      if (this.caseItem) {
        this.formData.cases = this.caseItem!.cases;
        this.formData.taskName = this.caseItem!.casename;
        this.formData.createDate = this.caseItem.create_date;
        this.formData.caseno = this.caseItem.caseno;
      } else {
        this.formData.cases = [
          { user: this.userList[0], amount: 0 },
          { user: this.userList[1], amount: 0 },
          { user: this.userList[2], amount: 0 },
          { user: this.userList[3], amount: 0 }
        ];
      }
    });
  }

  calc(index: number) {
    const sum = _.reduce(_.without(this.formData.cases, this.formData.cases[index]), (memo, num) => {
      return memo + num.amount;
    }, 0);
    this.formData.cases[index].amount = 0 - sum;
  }
}
