import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    // Payment ID
    payment_id: {
        type: String,
        unique: true,
        required: true
    },

    // References
    beneficiary_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
        required: true
    },

    application_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },

    scheme_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scheme',
        required: true
    },

    // Payment Details
    amount: {
        type: Number,
        required: true
    },

    // Bank Details
    bank_account_number: {
        type: String,
        required: true
    },

    bank_ifsc_code: {
        type: String,
        required: true
    },

    bank_name: {
        type: String,
        required: true
    },

    account_holder_name: {
        type: String,
        required: true
    },

    // Payment Status
    status: {
        type: String,
        default: 'PENDING_APPROVAL'
    },

    // DBT Transaction
    transaction_ref: {
        type: String
    },

    transaction_date: {
        type: Date
    },

    // Approval Details
    approved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CentralAdmin'
    },

    approved_at: {
        type: Date
    },

    // Failure Details (if any)
    failure_reason: {
        type: String
    },

    retry_count: {
        type: Number,
        default: 0
    },

    // Metadata
    initiated_date: {
        type: Date,
        default: Date.now
    },

    remarks: {
        type: String
    }

}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;