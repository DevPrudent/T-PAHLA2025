import MultiStepRegistration from "@/components/registration/MultiStepRegistration";

const NewRegistrationPage = () => {
  return (
    <>
      {/* Add Paystack script to the page */}
      <script src="https://js.paystack.co/v1/inline.js"></script>
      <MultiStepRegistration />
    </>
  );
};

export default NewRegistrationPage;