import React from "react";
import SpiderList from "@/components/commons/SpiderList/SpiderList";
import { PostMoltingMsg } from "./PostMolting.constants";

const PostMoltingListComponent = () => {
  const postMoltingSpiders = [
    { id: "1", name: "Pająk 1", date: "2024-03-30", status: "Po linieniu" },
    { id: "2", name: "Pająk 2", date: "2024-03-28", status: "Po linieniu" },
  ];

  return (
    <SpiderList
      title="Pająki po linieniu"
      data={postMoltingSpiders}
      info={PostMoltingMsg.INFORMATION}
    />
  );
};

export default PostMoltingListComponent;
