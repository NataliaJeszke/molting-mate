import { FeedingFrequency } from "@/constants/FeedingFrequency.enums";
import { useTranslation } from "@/hooks/useTranslation";

export const useFeedingFrequencyOptions = (): {
  label: string;
  value: FeedingFrequency;
}[] => {
  const { t } = useTranslation();

  return [
    {
      label: t("feeding-frequency.few_times_week"),
      value: FeedingFrequency.FewTimesWeek,
    },
    {
      label: t("feeding-frequency.once_week"),
      value: FeedingFrequency.OnceWeek,
    },
    {
      label: t("feeding-frequency.once_two_weeks"),
      value: FeedingFrequency.OnceTwoWeeks,
    },
    {
      label: t("feeding-frequency.once_month"),
      value: FeedingFrequency.OnceMonth,
    },
    {
      label: t("feeding-frequency.rarely"),
      value: FeedingFrequency.Rarely,
    },
  ];
};
