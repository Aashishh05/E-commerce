import { useLocation } from "react-router-dom";
import cryptoJs from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

const Payment = () => {
  const { state } = useLocation();

  const amount = Number(state?.amount || 0);
  const taxAmount = 10;
  const serviceCharge = 0;
  const deliveryCharge = 0;

  const totalPayable = amount + taxAmount + serviceCharge + deliveryCharge;
  const transaction_uuid = uuidv4();
  const product_code = "EPAYTEST";
  const message = `total_amount=${totalPayable},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = cryptoJs.HmacSHA256(message, "8gBm/:&EnhH.1/q");
  const signature = cryptoJs.enc.Base64.stringify(hash);

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-green-50 p-4">
      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        className="w-full max-w-5xl bg-white/98 border border-emerald-100 shadow-2xl rounded-2xl overflow-hidden"
      >
        <motion.div
          custom={0}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-r from-emerald-50 to-amber-50 border-b border-emerald-100 px-8 md:px-12 py-6"
        >
          <h1 className="font-cormorant text-3xl md:text-4xl font-light text-emerald-900 tracking-wide">
            Checkout
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-0">
          <motion.div
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="border-r border-emerald-100 p-8 md:p-12"
          >
            <h2 className="font-cormorant text-2xl font-light text-emerald-900 mb-8 tracking-wide">
              Payment Method
            </h2>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-xl p-6 md:p-8 text-center">
              <motion.div
                custom={2}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                  <svg
                    className="w-10 h-10 text-emerald-700"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <path d="M50 10 L70 30 L70 70 Q70 85 55 90 L45 90 Q30 85 30 70 L30 30 Z M50 35 L40 50 L60 50 Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-cormorant text-emerald-900 font-light mb-2">
                  eSewa
                </h3>
              </motion.div>

              <motion.div
                custom={3}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Secure Digital Wallet
                </p>
                <p className="text-xs text-emerald-600 mt-3">
                  Fast, safe & reliable payment gateway
                </p>
              </motion.div>

              <motion.div
                custom={4}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 pt-6 border-t border-emerald-200 flex items-center justify-center gap-2 text-sm text-emerald-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">100% Secure Payment</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            custom={5}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="p-8 md:p-12 flex flex-col"
          >
            <h2 className="font-cormorant text-2xl font-light text-emerald-900 mb-8 tracking-wide">
              Order Summary
            </h2>

            <div className="space-y-4 flex-1">
              <motion.div
                custom={6}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-between pb-3 border-b border-emerald-100"
              >
                <span className="text-gray-700">Product</span>
                <span className="font-cormorant text-lg text-gray-900 font-light">
                  Rs. {amount.toLocaleString()}
                </span>
              </motion.div>

              <motion.div
                custom={7}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-between pb-3 border-b border-emerald-100"
              >
                <span className="text-gray-600 text-sm">Tax</span>
                <span className="font-cormorant text-gray-800 font-light">
                  Rs. {taxAmount}
                </span>
              </motion.div>

              <motion.div
                custom={8}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-between pb-3 border-b border-emerald-100"
              >
                <span className="text-gray-600 text-sm">Delivery</span>
                <span className="font-cormorant text-gray-800 font-light">
                  {deliveryCharge === 0 ? "Free" : `Rs. ${deliveryCharge}`}
                </span>
              </motion.div>

              {serviceCharge > 0 && (
                <motion.div
                  custom={9}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-between pb-3 border-b border-emerald-100"
                >
                  <span className="text-gray-600 text-sm">Service Charge</span>
                  <span className="font-cormorant text-gray-800 font-light">
                    Rs. {serviceCharge}
                  </span>
                </motion.div>
              )}
            </div>

            <motion.div
              custom={10}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="border-t-2 border-emerald-200 my-6"
            />

            <motion.div
              custom={11}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-between items-center mb-8"
            >
              <span className="font-cormorant text-2xl font-light text-emerald-900">
                Total
              </span>
              <span className="font-cormorant text-4xl font-light text-emerald-700">
                Rs. {totalPayable.toLocaleString()}
              </span>
            </motion.div>

            <motion.button
              custom={12}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white py-4 rounded-xl font-cormorant text-lg tracking-wide font-light transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Pay with eSewa
            </motion.button>
          </motion.div>
        </div>

        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="tax_amount" value={taxAmount} />
        <input type="hidden" name="total_amount" value={totalPayable} />
        <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
        <input type="hidden" name="product_code" value={product_code} />
        <input
          type="hidden"
          name="product_service_charge"
          value={serviceCharge}
        />
        <input
          type="hidden"
          name="product_delivery_charge"
          value={deliveryCharge}
        />
        <input
          type="hidden"
          name="success_url"
          value="http://localhost:5173/success"
        />
        <input
          type="hidden"
          name="failure_url"
          value="http://localhost:5173/failure"
        />
        <input
          type="hidden"
          name="signed_field_names"
          value="total_amount,transaction_uuid,product_code"
        />
        <input type="hidden" name="signature" value={signature} />
      </form>
    </div>
  );
};

export default Payment;
