import { load } from "dotenv";
import { stringify } from "querystring";

export class rx_batch_file_by_device_id {
    public patient_id = "";
    public device_id = "";
    public loads = [];

    inflate(data) {
        this.patient_id = data[0].patient_id;
        this.device_id = data[0].device_id;
        data.forEach(element => {
            let index_object = this.new_batch_object();
            index_object.load_id = element.load_id;
            index_object.batch_number = element.batch_number;
            index_object.bag_numbers = JSON.parse(element.bag_numbers);
            index_object.ever_loaded_before = element.ever_been_loaded;
            index_object.has_remainders = element.has_remainders;
            index_object.remainder_count = element.remainder_count;
            index_object.uploaded_at = element.uploaded_at;
            this.loads.push(index_object);
        });
    }

    new_batch_object() {
        return {
            load_id: Number,
            batch_number: String,
            bag_numbers: Array,
            ever_loaded_before: Boolean,
            has_remainders: Boolean,
            remainder_count: Number,
            uploaded_at: Date,
        };
    }
}