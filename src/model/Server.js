import {Model} from 'vue-mc'

/**
 * DataServe model
 */
export default class Server extends Model{

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            address: String,
            ssl_grade: String,
            country: String,
            owner: String,
        }
    }
}