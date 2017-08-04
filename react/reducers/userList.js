//user list reducer
import {message} from "antd";
import {
    ACTION_CHANGE_SEARCH_INPUT,
    ACTION_CHANGE_SEARCH_INPUT_VISIBLE,
    ACTION_DELETE_USER_FULFILLED,
    ACTION_FETCH_USER_LIST_FULFILLED,
    ACTION_PAGE_LOADING
} from "../constants/actionType";
import {RES_SUCCEED} from "../../util/status";


/**
 * 获取用户列表
 * @param state
 * @param action
 */
function fetchUserList(state, action) {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ... state,
            pageLoading: false
        };
    }

    const userList = action.data.userList.map(function (item, index) {
        return {
            key: index,
            account: {
                editable: false,
                value: item.account,
            },
            nickname: {
                editable: false,
                value: item.nickName,
            },
            auth: {
                editable: false,
                value: item.isAdmin ? '管理员' : '普通用户',
            },
            projects: {
                editable: false,
                value: 'xxx',
            }
        };
    });

    return {
        ...state,
        userList: userList,
        userCount: action.data.userCount,
        pageNum: action.data.pageNum,
        pageLoading: false,
        needRefreshData: false
    };
}

/**
 * 删除用户, 成功的话则刷新table数据
 * @param state
 * @param action
 * @returns {*}
 */
function deleteUser(state, action) {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ...state
        };
    }
    return {
        ...state,
        needRefreshData: true
    };
}

const initialUserListState = {
    userCount: 0,
    userList: [],
    pageNum: 1,
    pageSize: 10,
    pageLoading: false,
    accountSearch: null,
    searchInputVisible: false,
    needRefreshData: false,
};

/**
 * user reducer模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function userList(state = initialUserListState, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_FETCH_USER_LIST_FULFILLED:
            newState = fetchUserList(state, action.data);
            break;
        case ACTION_PAGE_LOADING:
            newState = {
                ... state,
                pageLoading: action.data.pageLoading
            };
            break;
        case ACTION_CHANGE_SEARCH_INPUT:
            newState = {
                ... state,
                accountSearch: action.data.accountSearch
            };
            break;
        case ACTION_CHANGE_SEARCH_INPUT_VISIBLE:
            newState = {
                ... state,
                searchInputVisible: action.data.searchInputVisible
            };
            break;
        case ACTION_DELETE_USER_FULFILLED:
            newState = deleteUser(state, action.data);
            break;
        default:
    }
    return newState;
}