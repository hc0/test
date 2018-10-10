function* CollectionCreatebucketFun (select,put){

    const {currentreatebucket:{title, description, modifier}} = yield select((state)=>state.bucket);
    // 发送fetch请求
    var {result} = yield fetch("http://127.0.0.1:3000/createbucket",{
        "method":"POST",
        "headers":{'Content-Type':'application/json'},
        "body":JSON.stringify({
            description,
            modifier,
            title
        })
    }).then(data=>data.json());
    yield put({"type":"syncChangeAllcollectionCreatebucket",result});

}
function* bucketInfoFun (select,put){

    var {results} = yield fetch("http://127.0.0.1:3000/getAllBucketInfo").then(data=>data.json());

    yield put({"type":"syncChangeAllcollectionCreatebucket",result:results});
}

function* sendSaveInfoFun(select,put){
    const {choosebuckets,chooseurl} = yield select((state)=>state.bucket);

    // 发送fetch请求
    var {result} = yield fetch("http://127.0.0.1:3000/sendSaveInfo",{
        "method":"POST",
        "headers":{'Content-Type':'application/json'},
        "body":JSON.stringify({
            choosebuckets,
            chooseurl
        })
    }).then(data=>data.json());
    result == 1 ? true : false;
    yield put({"type":"syncChangeIshow",result});
}

function* getALlDataFun(select,put){

    var {results} = yield fetch("http://127.0.0.1:3000/getALldata").then(data=>data.json());

    yield put({"type":"syncChangeAllData",results});

}
export const fetchCollectionCreatebucket = CollectionCreatebucketFun;
export const getAllBucketInfo = bucketInfoFun;
export const fetchSendSaveInfo = sendSaveInfoFun;
export const fetchGetALlData = getALlDataFun;