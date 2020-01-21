import {Model, Collection} from 'vue-mc'

/**
 * DataServe model
 */
class DataServe extends Model {

    // Default attributes that define the "empty" state.
    defaults() {
        return {
            servers: [this.server],
            servers_changed: Boolean,
            ssl_grade: String,
            previous_ssl_grade: String,
            logo: String,
            title: String,
            is_down: Boolean,
        }
    }
    // Route configuration
    routes() {
        return {
            fetch: '/task/{id}',
            save:  '/task',
        }
    }
}