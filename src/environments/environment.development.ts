export const environment = {
    auth: {
        clientId: "f9852593-c5df-4e79-8410-8f083ca79c39",
        authority: "https://login.microsoftonline.com/8031b119-c3b2-41dc-8929-9017023ea4d9/",
        redirectUri: "http://localhost:3000/",
    },
    protectedUrl: [{
        url: 'http://localhost:4200',
        resources: ['62d787e7-5604-4126-b97f-47cfc5773de5/Write.All']
    }]
};