import {Model} from 'vue-mc'
import {Server} from './Server'

/**
 * DataServe model
 */
export default class DataServe extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            servers: [Server],
            servers_changed: Boolean,
            ssl_grade: String,
            previous_ssl_grade: String,
            logo: String,
            title: String,
            is_down: Boolean,
        }
    }
}