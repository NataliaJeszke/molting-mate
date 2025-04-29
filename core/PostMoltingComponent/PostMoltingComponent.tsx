import React, { useMemo } from "react";
import { parse } from "date-fns";
import { useSpidersStore } from "@/store/spidersStore";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { PostMoltingMsg } from "./PostMolting.constants";

//This component is to change when there is data from AI about molting predictions
const PostMoltingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);

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
      .map((spider) => ({
        id: spider.id,
        name: spider.name,
        date: spider.lastMolt,
        imageUri: spider.imageUri ?? undefined,
      }));
  }, [spiders]);

  return (
    <SpiderList
      title="Linienie"
      data={postMoltingSpiders}
      info={PostMoltingMsg.INFORMATION}
    />
  );
};

export default PostMoltingListComponent;
