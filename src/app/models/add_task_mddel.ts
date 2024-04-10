import { CaseDetail } from "./case";

export interface AddTaskModel {
    caseno?: string;
    taskName: string;
    createDate: Date;
    cases: CaseDetail[]
}

export interface UserOption {
    id: number;
    label: string;
}