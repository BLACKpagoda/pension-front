import {
    HTTP
} from '../utils/http.js'

class MyModel extends HTTP{
    //我的 得到收藏的文章
    getMyArtCourse(){
        return this.request({
            url:'/user/collection/getArticle'
        });
    }
    //我的 得到收藏的视频
    getMyVideoCourse(){
        return this.request({
            url:'/user/collection/getVideo'
        });
    }
}

export {
    MyModel
}