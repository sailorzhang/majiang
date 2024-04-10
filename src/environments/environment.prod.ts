export const environment = {
    auth: {
        clientId: "f9852593-c5df-4e79-8410-8f083ca79c39",
        authority: "https://login.microsoftonline.com/8031b119-c3b2-41dc-8929-9017023ea4d9/",
        redirectUri: "https://www.zhangxiangnan.cn/",
    },
    protectedUrl: [{
        url: 'https://www.zhangxiangnan.cn/api/admin/*',
        resources: ['62d787e7-5604-4126-b97f-47cfc5773de5/Write.All']
    }],
    restApi: {
        total_amount: 'https://www.zhangxiangnan.cn/api/user/total',
        case_list: 'https://www.zhangxiangnan.cn/api/user/list',
        user_list: 'https://www.zhangxiangnan.cn/api/user/userlist',
        add_case: 'https://www.zhangxiangnan.cn/api/admin/addcase',
        update_case: 'https://www.zhangxiangnan.cn/api/admin/updatecase',
        delete_case: 'https://www.zhangxiangnan.cn/api/admin/deletecase',
        get_reports: 'https://www.zhangxiangnan.cn/api/user/reports',
    }
};