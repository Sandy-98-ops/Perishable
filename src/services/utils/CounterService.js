import BaseService from "../../base/BaseService.js";
import Counter from "../../utils/Counter.js";

class CounterService extends BaseService {

    constructor() {
        super(Counter, 'counter_id')
    }
}

export default new CounterService();