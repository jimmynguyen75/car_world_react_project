import axios from "axios";
import authHeader from './AuthHeader'
import moment from 'moment';
import 'moment/locale/vi';
const POST_API_URL = "https://carworld.cosplane.asia/api/post/"

class PostService {
    createNewPost(post) {
        return axios.post(POST_API_URL + "CreateNewPost", post, { headers: authHeader() })
    }
    updatePost(id, post) {
        return axios.put(POST_API_URL + "UpdatePost?id=" + id, post, { headers: authHeader() })
    }
    getPostById(id) {
        return axios.get(POST_API_URL + "GetPostById?id=" + id, { headers: authHeader })
    }
    changePostStatus(id, status) {
        return axios.put(POST_API_URL + "ChangePostStatus?id=" + id + "&postStatus=" + status, { headers: authHeader })
    }
    getPostByType(type) {
        return axios.get(POST_API_URL + "GetAllPostsByType?postType=" + type)
    }
    getPosts() {
        return axios.get(POST_API_URL + "GetAllPosts", { headers: authHeader() })
    }
    getPostByMonth() {
        return axios.get(POST_API_URL + "CountPostsByMonth?date=" + moment().format('yyyy-MM-DDTHH:mm:ss'), { headers: authHeader() })
    }
}

export default new PostService();