import CustomButton from "@/components/CustomButton";
import {
    PaymentSheetError,
    useStripe
} from "@stripe/stripe-react-native";
import {useState} from "react";
import {Alert} from "react-native";

const Payment = () => {
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
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

    const initializePaymentSheet = async () => {
        try {
            const response = await fetch("/(api)/payment-sheet", {
                method: "POST", headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                throw new Error("Failed to fetch payment sheet params");
            }

            const {paymentIntent} = await response.json();
            const {error} = await initPaymentSheet({
                merchantDisplayName: "Ride Booking",
                paymentIntentClientSecret: paymentIntent
            })

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error(error)
            Alert.alert("Error", error?.message);
        }
    }

    const openPaymentSheet = async () => {
        try {
            await initializePaymentSheet();

            const {error} = await presentPaymentSheet();

            if (error) {
                if (error.code === PaymentSheetError.Canceled) {
                    Alert.alert(`Error code: ${error.code}`, error.message);
                } else Alert.alert(`Error code: ${error.code}`, error.message);
            } else {
                setSuccess(true);

                Alert.alert(
                    "Success",
                    "Your ride has been booked!"
                );
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong";

            Alert.alert("Error", message);
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
