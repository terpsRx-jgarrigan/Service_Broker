export const DEFAULT = {
  routes: (config) => {
    return {
      get: [
        { path: "/status", action: "status" },
        { path: "/swagger", action: "swagger" },
        { path: "/createChatRoom", action: "createChatRoom" },
        { path: "/register", action: "Register" },
        { path: "/authenticate", action: "Authenticate" },
        { path: "/machine-loading-portal/get-medherentId-load-details/:medherent_id", action: "Get_Medherent_ID_Load_Details" },
        { path: "/emar-exchange/directory", action: "Emar_Exchange_Directory" },
        { path: "/applications/read", action: "ReadApp" },
        { path: "/applications/read/:app_id", action: "ReadApp" },
        { path: "/applications/delete/:app_id", action: "DeleteApp" },
        { path: "/jobs/read", action: "ReadJob" },
        { path: "/jobs/read/:job_id", action: "ReadJob" },
        { path: "/jobs/delete/:job_id", action: "DeleteJon" },
        { path: "/users/read", action: "ReadUser" },
        { path: "/users/read/:user_id", action: "ReadUser" },
        { path: "/users/delete/:user_id", action: "DeleteUser" },
        { path: "/fakemar/fmars/read", action: "ReadFmar" },
        { path: "/fakemar/fmars/read/:fmar_id", action: "ReadFmar" },
        { path: "/fakemar/fmars/delete/:fmar_id", action: "DeleteFmar" },

      ],
      post: [
        { path: "/machine-loading-portal/mark-load-as-loaded", action: "Mark_Load_As_Loaded" },
        { path: "/emar-exchange/execute", action: "Emar_Exchange_Execute" },
        { path: "/applications/create", action: "CreateApp" },
        { path: "/applications/update", action: "UpdateApp" },
        { path: "/jobs/create", action: "CreateJob" },
        { path: "/jobs/update", action: "UpdateJob" },
        { path: "/users/update", action: "UpdateUser" },
        { path: "/fakemar/fmars/create", action: "CreateFmar" },
        { path: "/fakemar/fmars/update", action: "UpdateFmar" },
      ]
      /* ---------------------
      For web clients (http and https) you can define an optional RESTful mapping to help route requests to actions.
      If the client doesn't specify and action in a param, and the base route isn't a named action, the action will attempt to be discerned from this routes.js file.

      Learn more here: https://www.actionherojs.com/tutorials/web-server#Routes

      examples:

      get: [
        { path: '/users', action: 'usersList' }, // (GET) /api/users
        { path: '/search/:term/limit/:limit/offset/:offset', action: 'search' }, // (GET) /api/search/car/limit/10/offset/100
      ],

      post: [
        { path: '/login/:userID(^\\d{3}$)', action: 'login' } // (POST) /api/login/123
      ],

      all: [
        { path: '/user/:userID', action: 'user', matchTrailingPathParts: true } // (*) /api/user/123, api/user/123/stuff
      ]

      ---------------------- */
    };
  },
};
