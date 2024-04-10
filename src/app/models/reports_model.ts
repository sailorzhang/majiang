export interface ReportCaseItem {
    detail: ReportCaseDetail,
    top: Omit<ReportCaseDetail, 'caseno'>,
    bottom: Omit<ReportCaseDetail, 'caseno'>
}

export interface ReportCaseDetail {
    username: string,
    caseno: string,
    amount: number,
    create_date: Date
}