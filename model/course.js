import {
    HTTP
} from '../utils/http.js'

class CourseModel extends HTTP {
    //首页推荐文章课程
    getArtCourse(page, tag = 0, limit = 6) {
        return this.request({
            url: `/article`,
            data: {
                page,
                limit,
                tag
            }
        });
    }
    //首页推荐文章课程
    getVideoCourse(page, tag = 0, limit = 2 ) {
        return this.request({
            url: `/video`,
            data: {
                page,
                limit,
                tag
            }
        });
    }

    getArticleDetail(id) {
        return this.request({
            url: '/article/detail',
            data: {
                id
            },
            method: 'POST'
        })
    }
    //获取收藏的状态
    getCollectStatus(id,tag){
        return this.request({
            url:'/likeStatus',
            data:{
                id,
                tag
            }
        })
    }
    //收藏
    doCollect(id,tag){
        return this.request({
            url:'/user/collection/add',
            data:{
                id,
                tag
            }
        })
    }
    //取消收藏
    deleteCollect(id,tag){
        return this.request({
            url:'/user/collection/delete',
            data:{
                id,
                tag
            }
        })
    }
    
    getTag() {
        return this.request({
            url: '/tag'
        })
    }

    getTypeArticleCourse(page, tag) {
        return this.request({
            url: `/video?page=${page}&limit=20&tag=${tag}`
        })
    }
    getTypeVideoCourse(page, tag) {
        return this.request({
            url: `/video?page=${page}&limit=2&tag=${tag}`
        })
    }
}

export {
    CourseModel
}