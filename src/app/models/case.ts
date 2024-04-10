export interface CaseItem {
  caseno?: string;
  casename: string;
  create_date: Date;
  cases: [];
}

export interface CaseDetail {
  amount: number;
  user?: Object
}



