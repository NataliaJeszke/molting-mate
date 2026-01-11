import React, { useMemo } from "react";
import { parse } from "date-fns";
import { SpiderDetailType } from "@/db/database";

import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { PostMoltingMsg } from "./PostMolting.constants";
import { useTranslation } from "@/hooks/useTranslation";

interface PostMoltingListComponentProps {
  spiders: SpiderDetailType[];
}

const PostMoltingListComponent = ({
  spiders,
}: PostMoltingListComponentProps) => {
  const { t } = useTranslation();
  const postMoltingSpiders = useMemo(() => {
    return spiders
      .filter(
        (spider) => spider.lastMolt && new Date(spider.lastMolt) < new Date(),
      )
      .sort((a, b) => {
        const dateA = parse(a.lastMolt, "yyyy-MM-dd", new Date()).getTime();
        const dateB = parse(b.lastMolt, "yyyy-MM-dd", new Date()).getTime();
        return dateB - dateA;
      })
      .slice(0, 20)
      .map((spider) => ({
        id: spider.id,
        name: spider.name,
        date: spider.lastMolt,
        imageUri: spider.imageUri,
      }));
  }, [spiders]);

  return (
    <SpiderList
      title={t("molting-list.title")}
      data={postMoltingSpiders}
      info={t(PostMoltingMsg.INFORMATION)}
    />
  );
};

export default PostMoltingListComponent;
