import axios from "axios";
import authHeader from './AuthHeader'
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
    changePostStatus(id) {
        return axios.put(POST_API_URL + "ChangePostStatus?id=" + id, { headers: authHeader })
    }
    getPostByType(type) {
        return axios.get(POST_API_URL + "GetAllPostsByType?postType=" + type, { headers: authHeader })
    }
}

export default new PostService();