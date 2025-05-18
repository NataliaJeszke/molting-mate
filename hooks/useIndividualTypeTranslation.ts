import { IndividualType } from "@/constants/IndividualType.enums";
import { useTranslation } from "./useTranslation";

export const useIndividualTypeLabel = () => {
  const { t } = useTranslation();

  return (type: IndividualType | null | undefined): string => {
    switch (type) {
      case IndividualType.Male:
        return t("spider-detail.individual_type_status.male");
      case IndividualType.Female:
        return t("spider-detail.individual_type_status.female");
      case IndividualType.Unknown:
      default:
        return t("spider-detail.individual_type_status.unknown");
    }
  };
};
