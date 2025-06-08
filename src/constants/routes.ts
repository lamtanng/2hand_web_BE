export const V1_ROUTE = '/v1';
export const AUTH_ROUTE = '/au';
export const LOGIN_ROUTE = '/login';
export const SIGNUP_ROUTE = '/signup';
export const LOGOUT_ROUTE = '/logout';
export const REFRESH_TOKEN_ROUTE = '/refresh';
export const VERIFY_OTP_ROUTE = '/verify';
export const SEND_OTP_ROUTE = '/sendotp';
// admin routes
export const ADMIN_ROUTE = '/ad';
export const DASHBOARD_ROUTE = '/dashboard';
//seller routes
export const SELLER_ROUTE = '/se';
// customer routes
export const PRODUCT_ROUTE = '/products';
export const CATEGORY_ROUTE = '/categories';
export const CATEGORY_BY_ID_ROUTE = '/id/:_id';
export const CATEGORY_BY_SLUG_ROUTE = '/:slug';
export const ROLE_ROUTE = '/roles';

//user routes
export const USER_ROUTE = '/users';
export const USER_BY_ID_ROUTE = '/:userID';
export const USER_BY_SLUG_ROUTE = '/:slug';
export const USER_RESET_PASSWORD_ROUTE = '/reset-password';
export const USER_ADDRESS_ROUTE = '/address';

//store routes
export const STORE_ROUTE = '/stores';
export const STORE_BY_USER_ROUTE = '/u/:userID';
export const STORE_BY_ID_ROUTE = '/:storeID';
export const STORE_STATISTIC_ROUTE = '/statistics';

// order stage status
export const ORDER_STAGE_STATUS_ROUTE = '/order-stage-status';

//order routes
export const ORDER_ROUTE = '/orders';
export const ORDER_TRACKING_ROUTE = '/tracking/:orderID';
export const ORDER_DELIVERY_TIME_ROUTE = '/delivery-time';
export const ORDER_PICKUP_ROUTE = '/pickup-date';
export const ORDER_AVAILABLE_SERVICE_ROUTE = '/available_service';
export const ORDER_SHIPPING_FEE_ROUTE = '/calc_shipping_fee';
export const ORDER_PLACE_ROUTE = '/place_order';

export const REVIEW_ROUTE = '/reviews';
export const ORDERSTAGE_ROUTE = '/orderstages';
export const PAYMENTMETHOD_ROUTE = '/paymentmethods';
export const CART_ROUTE = '/cart';
export const CART_ITEM_ROUTE = '/:productID';
export const REASON_ROUTE = '/reasons';
export const ORDERDETAIL_ROUTE = '/orderdetails';
export const ORDERREQUEST_ROUTE = '/orderrequests';
export const REPORT_ROUTE = '/reports';
export const NOTIFICATION_ROUTE = '/notifications';
export const OPENAI_ROUTE = '/prompt_ai';
export const SEARCH_HISTORY_ROUTE = '/search-history';
