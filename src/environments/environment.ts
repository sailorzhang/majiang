export const environment = {
    auth: {
        clientId: 'f9852593-c5df-4e79-8410-8f083ca79c39',
        authority: 'https://login.microsoftonline.com/8031b119-c3b2-41dc-8929-9017023ea4d9/',
        redirectUri: 'http://localhost:3000/',
    },
    protectedUrl: [{
        url: 'http://localhost:8080/api/admin/*',
        resources: ['62d787e7-5604-4126-b97f-47cfc5773de5/Write.All']
    }],
    restApi: {
        total_amount: 'http://localhost:8080/api/user/total',
        case_list: 'http://localhost:8080/api/user/list',
        user_list: 'http://localhost:8080/api/user/userlist',
        add_case: 'http://localhost:8080/api/admin/addcase',
        update_case: 'http://localhost:8080/api/admin/updatecase',
        delete_case: 'http://localhost:8080/api/admin/deletecase',
        get_reports: 'http://localhost:8080/api/user/reports',
    }
};