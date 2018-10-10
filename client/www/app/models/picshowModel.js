import fp from "lodash/fp";
import { fetchCollectionCreatebucket , getAllBucketInfo , fetchSendSaveInfo ,fetchGetALlData} from "./utils/fetchUtil.js";
export default {
    "namespace":"bucket",
    "state":{
        // 当前创建的存储对象的信息
        currentreatebucket:{},
        // 一共有几个存储对象
        collectionCreatebucket:[],
        // 现在要存储的对象和路劲
        choosebuckets:{},
        chooseurl:"",
        // 是否显示 上传控件
        isShow:false,
        // 当前上传的文件
        currentFile:[],
        //所有存在数据库内的数据
        allData:[]

    },
    "reducers":{
        // 同步更改当前的存储对象
        syncChangeCollectionCreatebucket(state,{values}){
            return {
                ...state,
                currentreatebucket:{
                    ...state.currentreatebucket,
                    ...values
                }
            }
        },
        // 同步更改 所有的 存储对象
        syncChangeAllcollectionCreatebucket(state,{result}){
            return {
                ...state,
                collectionCreatebucket:[
                    ...state.collectionCreatebucket,
                    ...result
                ]
            }
        },
        // 同步更改 现在 要存储的 对象和路径
        syncSaveUpdataInfo(state,{choosebuckets,chooseurl}){
            return {
                ...state,
                choosebuckets,
                chooseurl
            }
        },
        // 改变 显示上传属性值
        syncChangeIshow(state,{result}){
            return {
                ...state,
                isShow:result
            }
        },
        // 改变当前上传的文件
        syncAddFile(state,{fileinfo}){
            return {
                ...state,
                currentFile:[
                    ...state.currentFile,
                    fileinfo
                ]
            }
        },
        // 改变总数据
        syncChangeAllData(state,{results}){
            return {
                ...state,
                allData:results
            }
        }
    },
    "effects":{
        //初始化
        *init({nowid},{put,call,select}){

            yield call(getAllBucketInfo,select,put);
        },
        // 创建储存对象
        *changeCollectionCreatebucket({values},{put,call,select}){

            yield put({"type":"syncChangeCollectionCreatebucket",values})

            const carinfo = yield call(fetchCollectionCreatebucket,select,put);
        },
        // 发出 要存储的 对象和地址
        *sendSaveInfo({choosebuckets,chooseurl},{put,call,select}){
            yield put({"type":"syncSaveUpdataInfo",choosebuckets,chooseurl})

             const carinfo = yield call(fetchSendSaveInfo,select,put);
        },
        // 获取上传的所有数据
        *getALlData(action,{put,select,call}){

            const carinfo = yield call(fetchGetALlData,select,put);
        }
    }
}