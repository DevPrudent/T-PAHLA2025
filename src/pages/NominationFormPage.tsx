
import { useParams } from "react-router-dom";
import NominationFormArea from "@/components/nominations/NominationFormArea";
import { NominationProvider } from "@/contexts/NominationContext";

const NominationFormPage = () => {
  const { nominationId: editNominationId } = useParams<{ nominationId?: string }>();

  return (
    <NominationProvider editNominationId={editNominationId}>
      <div className="bg-background dark:bg-gray-900 py-12">
        <section className="container mx-auto px-4">
          <NominationFormArea />
        </section>
      </div>
    </NominationProvider>
  );
};

export default NominationFormPage;
