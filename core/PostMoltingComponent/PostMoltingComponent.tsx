import React, { useMemo } from "react";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { PostMoltingMsg } from "./PostMolting.constants";
import { useSpidersStore } from "@/store/spidersStore";
import { convertToISODate } from "@/utils/dateUtils";

//This component is to change when there is data from AI about molting predictions
const PostMoltingListComponent = () => {
  const spiders = useSpidersStore((state) => state.spiders);

  const postMoltingSpiders = useMemo(() => {
    return spiders
      .filter(
        (spider) => spider.lastMolt && new Date(spider.lastMolt) < new Date()
      )
      .sort((a, b) => {
        const dateA = new Date(convertToISODate(a.lastMolt)).getTime();
        const dateB = new Date(convertToISODate(b.lastMolt)).getTime();
        return dateB - dateA;
      })
      .map((spider) => ({
        id: spider.id,
        name: spider.name,
        date: spider.lastMolt,
        imageUri: spider.imageUri,
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
