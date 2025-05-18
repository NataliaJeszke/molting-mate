import { IndividualType } from "@/constants/IndividualType.enums";
import { useTranslation } from "./useTranslation";

export const useIndividualTypeOptions = (): {
  label: string;
  value: IndividualType;
}[] => {
  const { t } = useTranslation();

  return [
    {
      label: t("individual-type-options.male"),
      value: IndividualType.Male,
    },
    {
      label: t("individual-type-options.female"),
      value: IndividualType.Female,
    },
    {
      label: t("individual-type-options.unknown"),
      value: IndividualType.Unknown,
    },
  ];
};
