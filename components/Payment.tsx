import CustomButton from "@/components/CustomButton";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Alert } from "react-native";

const Payment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // const initializePaymentSheet = async () => {
  //   const { paymentIntent, ephemeralKey, customer_account } =
  //     await fetchPaymentSheetParams();
  //
  //   const { error } = await initPaymentSheet({
  //     merchantDisplayName: "Ride App",
  //     // customerAccountId: customer_account,
  //     // customerEphemeralKeySecret: ephemeralKey,
  //     // paymentIntentClientSecret: paymentIntent,
  //     // Set `allowsDelayedPaymentMethods` to true if your business accepts payment
  //     // methods that complete payment after a delay, like SEPA Debit and Sofort.
  //     allowsDelayedPaymentMethods: true,
  //     defaultBillingDetails: {
  //       name: "Jane Doe",
  //     },
  //   });
  //   if (!error) {
  //     setLoading(true);
  //   }
  // };

  const openPaymentSheet = async () => {
    // await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === PaymentSheetError.Canceled) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <>
      <CustomButton
        title="Confirm Ride"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default Payment;
